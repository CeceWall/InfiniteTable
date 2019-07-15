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
    forceUpdate() {
      this.handleScroll(true);
    },
    onScroll() {
      // 滚动时
      if (!this.handling) {
        this.handling = true;
        window.requestAnimationFrame(this.handleScroll);
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
      if (scrollTop === 0) {
        this.anchorItem = {
          offset: 0,
          index: 0,
        };
      } else {
        const delta = scrollTop - this.lastScrollTop;
        this.anchorItem = calculateAnchorItem(this.anchorItem, delta, rowHeight, total);
      }
      const lastAnchorItem = calculateAnchorItem(this.anchorItem, viewportHeight, rowHeight, total);
      const startIndex = Math.max(0, this.anchorItem.index - 1);
      const endIndex = Math.min(total - 1, lastAnchorItem.index + 1);
      this.attachContentByAnchor(startIndex, endIndex);
      this.lastScrollTop = scrollTop;
      this.handling = false;
    },
    // TODO 保证DOM的顺序
    attachContentByAnchor(startIndex, endIndex) {
      this.items.forEach((item, key) => {
        if (item.index < startIndex || item.index > endIndex) {
          if (item.vm) {
            this.vmCache.push(item.vm);
            // eslint-disable-next-line no-param-reassign
            item.vm = null;
          }
          this.items.delete(key);
        }
      });

      for (let i = startIndex; i <= endIndex; i += 1) {
        let item = this.items.get(i);
        if (!item) {
          let vm = this.vmCache.shift();
          if (!vm) {
            const node = this.renderTombstone();
            vm = this.renderRow(node, i);
            this.$el.appendChild(vm.$el);
          } else {
            vm.setIndex(i);
            // vm.$el.classList.remove('invisible');
          }
          item = {
            index: i,
            vm,
          };
          this.items.set(i, item);
        }
      }
      for (let i = startIndex; i <= endIndex; i += 1) {
        const item = this.items.get(i);
        item.vm.$el.style.transform = `translate3d(0, ${i * this.rowHeight}px, 0)`;
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
