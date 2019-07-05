<script>
import Vue from 'vue';

export default {
  name: 'recycle-render',
  inject: ['layoutSize', 'tableColumns'],
  data() {
    return {
      viewportRows: 0,
      lastScrollTop: 0,
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
  created() {
    this.RenderComponent = Vue.extend(this);
    this.lastStart = 0;
    this.lastEnd = 0;
  },
  mounted() {
    this.initial();
  },
  props: {
    instance: {
      required: true,
    },
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
  },
  beforeDestroy() {
    if (this.scroll) {
      this.scroll.removeEventListener('scroll', this.onScroll);
      this.scroll = null;
    }
  },
  methods: {
    initial() {
      const { rowHeight } = this.layoutSize;
      const viewportHeight = this.layoutSize.tableViewportHeight;
      this.viewportRows = Math.ceil(viewportHeight / rowHeight);
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
      if (this.scrollTop === this.lastScrollTop) {
        return;
      }
      const { start, end } = this.calculateRenderIndex(scrollTop);
      this.paddingScroll(start, end);
      this.attachContent(start, end);
      this.lastScrollTop = scrollTop;
      this.handling = false;
    },
    attachContent(start, end) {
      if (this.start === this.lastStart && end === this.lastEnd) {
        return;
      }
      this.items.forEach((item) => {
        if ((item.index < start || item.index > end)) {
          if (item.vm) {
            this.vmCache.push(item.vm);
            item.vm.$el.remove();
            item.vm = null;
          }
          this.items.delete(item.index);
        }
      });
      const patchedNodes = [];
      for (let i = start; i <= end; i += 1) {
        let item = this.items.get(i);
        // 如果vm不存在说明这块需要重新渲染
        if (!item) {
          let vm = this.vmCache.shift();
          if (!vm) {
            const node = this.renderTombstone();
            vm = this.renderRow(this.data[i], node);
          } else {
            vm.setData(this.data[i]);
          }
          item = {
            index: i,
            vm,
          };
          this.items.set(i, item);
          patchedNodes.push(item);
        }
      }
      // 当reuse存在时，如果lastStart > start说明是向上滚动，要更新的元素要反向插入到第一个元素
      if (this.lastStart && this.lastStart > start) {
        patchedNodes.reverse()
          .forEach((item) => {
            this.$el.insertBefore(item.vm.$el, this.paddingTopElem.nextSibling);
          });
      } else {
        patchedNodes
          .forEach((item) => {
            this.$el.insertBefore(item.vm.$el, this.paddingBottomElem);
          });
      }

      this.lastStart = start;
      this.lastEnd = end;
    },
    /**
     * 使用scrollTop计算出渲染的第一块和最后一块
     */
    calculateRenderIndex(scrollTop) {
      const { rowHeight, tableViewportHeight } = this.layoutSize;
      const startIndex = Math.floor(scrollTop / rowHeight);
      const endIndex = Math.ceil((scrollTop + tableViewportHeight) / rowHeight);
      return {
        start: startIndex,
        end: endIndex < this.data.length ? endIndex : this.data.length - 1,
      };
    },
    /**
     * 填充滚动条高度
     * @param start
     * @param end
     */
    paddingScroll(start, end) {
      const { rowHeight } = this.layoutSize;
      const paddingTop = start * rowHeight;
      const paddingBottom = (this.data.length - 1 - end) * rowHeight;
      if (!this.paddingTopElem) {
        const paddingTopElem = this.renderTombstone();
        const paddingBottomElem = this.renderTombstone();
        this.$el.prepend(paddingTopElem);
        this.$el.appendChild(paddingBottomElem);
        this.paddingTopElem = paddingTopElem;
        this.paddingBottomElem = paddingBottomElem;
      }
      this.paddingTopElem.style.height = `${paddingTop}px`;
      this.paddingBottomElem.style.height = `${paddingBottom}px`;
    },
    renderTombstone() {
      const t = document.createElement('tr');
      t.style.height = `${this.layoutSize.rowHeight}px`;
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
          });
        },
      });
    },
  },
};
</script>
