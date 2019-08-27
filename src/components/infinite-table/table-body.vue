<template>
  <div
    ref="scroll"
    class="infinite-table__body"
    v-on="tableBodyListeners"
    :style="{height: `${layoutSize.viewportHeight}px`}"
  >
    <range-render
      :data="data"
      direction="vertical"
      :size="tableStore.tableOptions.rowHeight"
      :data-key="tableStore.tableOptions.rowKey"
      :viewport-size="layoutSize.viewportHeight"
      :offset="grid.offsetY"
      v-slot:default="{data}"
    >
      <table-row :offset-x="grid.offsetX" :data="data" />
    </range-render>
    <div
      :style="{transform:`translateY(${data.length * tableStore.tableOptions.rowHeight}px)`, width: `${layoutSize.allColumnsWidth}px`}"
      style="position: absolute; height: 1px;"
    ></div>
  </div>
</template>

<script>
import TableRow from './table-row';
import { calculateAnchorItem } from './render/recycle-render/transform';
import RangeRender from './render/range-render.vue';

export default {
  name: 'table-body',
  inject: ['tableStore'],
  components: {
    RangeRender,
    TableRow,
  },
  props: {
    layoutSize: {
      type: Object,
      require: true,
    },
  },
  computed: {
    data() {
      return this.tableStore.data;
    },
    tableBodyListeners() {
      return {
        ...this.$listeners,
      };
    },
  },
  created(){
   console.log(this.layoutSize.viewportHeight)
  },
  data() {
    return {
      grid: {
        offsetX: 0,
        offsetY: 0,
      },
    };
  },
  mounted() {
    this.scroll = this.getScrollElement();
    this.scroll.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  },
  watch: {
    data() {
      this.handleScroll();
    },
  },
  methods: {
    handleScrollVertical(scrollTop) {
      const { data } = this;
      const { rowHeight } = this.tableStore.tableOptions;
      const total = data.length;
      const { viewportHeight } = this.layoutSize;
      const anchorItem = {
        index: Math.floor(scrollTop / rowHeight),
        offset: scrollTop % rowHeight,
      };
      const lastAnchorItem = calculateAnchorItem(anchorItem, viewportHeight, rowHeight, total);
      const startIndex = Math.max(0, anchorItem.index - 1);
      const endIndex = Math.min(total, lastAnchorItem.index + 2);
      this.grid.startY = startIndex;
      this.grid.endY = endIndex;
    },
    handleScrollHorizontal(scrollLeft) {
      let sum = 0;
      let startX = -1;
      let endX = -1;
      for (let i = 0; i < this.tableStore.tableColumns.length; i += 1) {
        const column = this.tableStore.tableColumns[i];
        if (sum >= scrollLeft && startX === -1) {
          this.grid.offsetX = sum - column.width;
          startX = i;
        }
        if (sum >= scrollLeft + this.layoutSize.viewportWidth) {
          endX = i;
          break;
        }
        sum += column.width;
      }
      this.grid.startX = startX;
      this.grid.endX = endX;
    },
    handleScroll() {
      const { scrollTop, scrollLeft } = this.scroll;
      this.grid.offsetX = scrollLeft;
      this.grid.offsetY = scrollTop;
    },
    getScrollElement() {
      return this.$el.closest('.infinite-table--scrollable');
    },
  },
};
</script>
