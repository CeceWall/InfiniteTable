import Vue from 'vue';
import 'raf/polyfill';
import { calculateAnchorItem } from './transform';

/**
 * 该组件循环利用vue对象实现大数据量的滚动
 *
 */
export default {
  name: 'recycle-render',
  render() {
    return this.$slots.default;
  },
  mounted() {
    this.items = new Map();
    this.vmCache = [];
    this.scroll = typeof this.scrollElement === 'function' ? this.scrollElement() : this.scrollElement;
    if (!this.scroll) {
      throw new Error('RecycleRender: 没有可用的可滚动DOM');
    }
    this.scroll.scrollTop = 0;
    this.scroll.addEventListener('scroll', this.onScroll);

    // 添加占位元素
    this.appendTransformEnd();
    this.onScroll();
  },
  beforeDestroy() {
    if (this.scroll) {
      this.scroll.removeEventListener('scroll', this.onScroll);
      this.scroll = null;
      this.vmCache = null;
    }
    this.items.clear();
    this.vmCache = null;
  },
  props: {
    total: {
      type: Number,
      required: true,
    },
    scrollElement: {
      type: [HTMLElement, Function],
      required: true,
    },
    viewportHeight: {
      type: Number,
      required: true,
    },
    rowHeight: {
      type: Number,
      required: true,
    },
    renderFunction: {
      type: Function,
      required: true,
    },
  },
  watch: {
    rowHeight() {
      this.forceUpdate();
    },
    viewportHeight() {
      this.forceUpdate();
    },
    total() {
      this.forceUpdate();
    },
  },
  methods: {
    appendTransformEnd() {
      const div = document.createElement('div');
      div.textContent = ' ';
      div.style.position = 'absolute';
      div.style.height = '1px';
      div.style.width = '1px';
      this.$el.appendChild(div);
      this.transformEnd = div;
    },
    forceUpdate() {
      this.handleScroll(true);
    },
    onScroll() {
      // 滚动时
      if (!this.handling) {
        this.handling = true;
        window.requestAnimationFrame(() => this.handleScroll(false));
      }
    },
    /**
     * 滚动条变化后，根据滚动条渲染列表的方法
     * 默认只有在纵向滚动条变化时，才渲染列表，可以通过force参数强制刷新
     * @param {Boolean} force 是否强制更新，当total变化或data变化时，应当强制更新当前渲染的项目
     */
    handleScroll(force = false) {
      const { scrollTop } = this.scroll;
      if (!force && (scrollTop === this.lastScrollTop)) {
        this.handling = false;
        return;
      }
      const { rowHeight, total, viewportHeight } = this;
      const anchorItem = {
        index: Math.floor(scrollTop / rowHeight),
        offset: scrollTop % rowHeight,
      };
      const lastAnchorItem = calculateAnchorItem(anchorItem, viewportHeight, rowHeight, total);
      let startIndex = Math.max(0, anchorItem.index - 1);
      const endIndex = Math.min(total, lastAnchorItem.index + 2);

      // startIndex >= endIndex 说明数据项目有变化，数据无法从startIndex开始
      // 这种情况下，使用endIndex推算出startIndex
      if (startIndex >= endIndex) {
        startIndex = calculateAnchorItem(lastAnchorItem, viewportHeight, rowHeight, total);
      }
      this.lastScrollTop = scrollTop;
      this.attachContentByAnchor(startIndex, endIndex);
      this.transformEnd.style.transform = `translateY(${total * rowHeight}px)`;
      this.handling = false;
    },
    /**
     * 根据startIndex和endIndex添加节点，左闭右开
     * 当
     *
     * @param startIndex
     * @param endIndex
     */
    attachContentByAnchor(startIndex, endIndex) {
      this.items.forEach((item, key) => {
        if (item.index < startIndex || item.index >= endIndex) {
          if (item.vm) {
            this.vmCache.push(item.vm);
            // eslint-disable-next-line no-param-reassign
            item.vm.lastIndex = item.index;
            // eslint-disable-next-line no-param-reassign
            item.vm = null;
          }
          this.items.delete(key);
        }
      });

      for (let i = startIndex; i < endIndex; i += 1) {
        let item = this.items.get(i);
        if (!item) {
          let vm = this.vmCache.shift();
          if (!vm) {
            const node = this.renderTombstone();
            vm = this.renderRow(node, i);
            this.$el.appendChild(vm.$el);
          } else {
            vm.setIndex(i);
          }
          item = {
            index: i,
            vm,
          };
          this.items.set(i, item);
        }
        item.vm.$el.style.transform = `translateY(${i * this.rowHeight}px)`;
      }
    },
    renderTombstone() {
      const t = document.createElement('div');
      t.style.height = `${this.rowHeight}px`;
      return t;
    },
    renderRow(element, index) {
      const parent = this;
      return new Vue({
        name: 'recycle-render-component',
        el: element,
        parent,
        data: {
          index,
        },
        methods: {
          setIndex(newIndex) {
            this.index = newIndex;
          },
        },
        render() {
          const vnode = parent.renderFunction(this.index);
          // 添加额外的recycle需要的class
          if (!vnode.data) {
            vnode.data = {};
          }
          if (!vnode.data.class) {
            vnode.data.class = {};
          }
          vnode.data.class['infinite-table__row--recycle'] = true;
          return vnode;
        },
      });
    },
  },
};
