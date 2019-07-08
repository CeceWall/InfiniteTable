import Vue from 'vue';
import { calculateAnchorItem } from './transform';

export default {
  name: 'recycle-render',
  data() {
    return {
      viewportRows: 0,
      anchor: {
        index: 0,
        offset: 0,
      },
      items: new Map(),
      vmCache: [],
    };
  },
  render() {
    return this.$slots.default;
  },
  mounted() {
    this.initial();
  },
  beforeDestroy() {
    if (this.scroll) {
      this.scroll.removeEventListener('scroll', this.onScroll);
      this.scroll = null;
      this.vmCache = null;
    }
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
    data: {
      type: Array,
      required: true,
    },
    scrollElement: {
      type: [Object, Function],
      required: true,
    },
    railWayItems: {
      type: Number,
      default: 30,
    },
    viewportHeight: {
      type: Number,
      required: true,
    },
    rowHeight: {
      type: Number,
      required: true,
    },
  },
  methods: {
    initial() {
      this.scroll = typeof this.scrollElement === 'function' ? this.scrollElement() : this.scrollElement;
      this.scroll.addEventListener('scroll', this.onScroll);
      this.onScroll();
    },
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
      const { rowHeight, data, viewportHeight } = this;
      if (scrollTop === 0) {
        this.anchorItem = {
          offset: 0,
          index: 0,
        };
      } else {
        const delta = scrollTop - this.lastScrollTop;
        this.anchorItem = calculateAnchorItem(this.anchorItem, delta, rowHeight, data.length);
      }
      const lastAnchorItem = calculateAnchorItem(this.anchorItem, viewportHeight, rowHeight, data.length);
      this.attachContentByAnchor(this.anchorItem.index, lastAnchorItem.index);
      this.lastScrollTop = scrollTop;
      this.handling = false;
    },
    attachContentByAnchor(startIndex, endIndex) {
      this.items.forEach((item, key) => {
        if (item.index < startIndex || item.index > endIndex) {
          if (item.vm) {
            this.vmCache.push(item.vm);
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
            vm = this.renderRow(this.data[i], node);
            this.$el.appendChild(vm.$el);
          } else {
            vm.setData(this.data[i]);
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
    renderRow(data, element) {
      const { render, renderProps } = this;
      const parent = this;
      return new Vue({
        name: 'recycle-render-component',
        el: element,
        parent,
        data: {
          data,
        },
        methods: {
          setData(newVal) {
            this.data = newVal;
          },
        },
        render(h) {
          return h(render, {
            props: {
              ...renderProps,
              data: this.data,
            },
            class: {
              'infinite-table__row--recycle': true,
            },
          });
        },
      });
    },
  },
};
