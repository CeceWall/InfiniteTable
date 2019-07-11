import Vue from 'vue';
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
    render: {
      type: Object,
      required: true,
    },
    renderProps: {
      type: Object,
      required: false,
    },
    total: {
      type: Number,
      required: true,
    },
    scrollElement: {
      type: [Object, Function],
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
  methods: {
    onScroll() {
      if (!this.handling) {
        this.handling = true;
        requestAnimationFrame(this.handleScroll);
      }
    },
    handleScroll() {
      const { scrollTop } = this.scroll;
      if (scrollTop === this.lastScrollTop) {
        this.handling = false;
        return;
      }
      const { rowHeight, total, viewportHeight } = this;
      // fixme: 修复firefox和热更新时，初始scrollTop为不为0 但是anchorItem不存在的问题
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
    attachContentByAnchor(startIndex, endIndex) {
      this.items.forEach((item, key) => {
        if (item.index < startIndex || item.index > endIndex) {
          if (item.vm) {
            this.vmCache.push(item.vm);
            // item.vm.$el.classList.add('invisible');
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
          vnode.data.class['infinite-table__row--recycle'] = true;
          return vnode;
        },
      });
    },
  },
};
