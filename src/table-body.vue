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
      v-slot:default="{data, index}"
    >
      <table-row
        v-bind="getExtraRowAttrs(data, index)"
        :offset-x="grid.offsetX"
        :data="data"
      />
    </range-render>
    <div
      :style="{
        transform:`translateY(${data.length * tableOptions.rowHeight}px)`,
        width: `${layoutSize.allColumnsWidth}px`
      }"
      style="position: absolute; height: 1px;"
    ></div>
  </div>
</template>

<script>
import TableRow from './table-row.jsx';
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
    getExtraRowAttrs(rowItem, index) {
      const { striped, rowExtraAttrs, rowKey } = this.tableOptions;
      const { selectedRow } = this.tableStore;
      let extraAttrs = rowExtraAttrs;
      if (typeof rowExtraAttrs === 'function') {
        extraAttrs = rowExtraAttrs(rowItem, index);
      }
      return {
        class: {
          ...extraAttrs.class,
          'infinite-table__row--striped': striped && index % 2 === 1,
          'infinite-table__row--selected': selectedRow && rowItem[rowKey] === selectedRow[rowKey],
        },
        ...extraAttrs.attrs,
      };
    },
    handleScroll() {
      if (!this.handing) {
        this.handing = true;
        requestAnimationFrame(() => {
          this.changeOffsetIndex();
          this.handing = false;
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