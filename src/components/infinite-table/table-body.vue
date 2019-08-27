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
      :size="tableOptions.rowHeight"
      :data-key="tableOptions.rowKey"
      :viewport-size="layoutSize.viewportHeight"
      :offset="grid.offsetY"
      v-slot:default="{data}"
    >
      <table-row :offset-x="grid.offsetX" :data="data" />
    </range-render>
    <div
      :style="{transform:`translateY(${data.length * tableOptions.rowHeight}px)`, width: `${layoutSize.allColumnsWidth}px`}"
      style="position: absolute; height: 1px;"
    ></div>
  </div>
</template>

<script>
import TableRow from './table-row';
import RangeRender from './render/range-render.vue';

export default {
  name: 'table-body',
  inject: ['tableStore'],
  components: {
    RangeRender,
    TableRow,
  },
  computed: {
    data() {
      return this.tableStore.data;
    },
    tableOptions() {
      return this.tableStore.tableOptions;
    },
    layoutSize() {
      return this.tableStore.layoutSize;
    },
    tableBodyListeners() {
      return {
        ...this.$listeners,
      };
    },
  },
  beforeCreate() {
    this.handing = false;
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
    handleScroll() {
      if (!this.handing) {
        this.handing = true;
        window.requestAnimationFrame(() => {
          this.handing = false;
          this.changeOffsetIndex();
        });
      }
    },
    changeOffsetIndex() {
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
