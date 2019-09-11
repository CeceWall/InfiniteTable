<template>
  <div
    ref="scroll"
    class="infinite-table__body"
    :style="{height: `${layoutSize.viewportHeight}px`}"
    v-on="tableBodyListeners"
  >
    <range-render
      v-slot:default="{data, index}"
      :data="data"
      direction="vertical"
      :size="tableOptions.rowHeight"
      :data-key="tableOptions.rowKey"
      :viewport-size="layoutSize.viewportHeight"
      :offset="grid.offsetY"
      :trail-size="2"
      :leading-size="2"
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
    />
  </div>
</template>

<script>
import TableRow from './table-row.jsx';
import RangeRender from './render/range-render.vue';

export default {
  name: 'TableBody',
  inject: ['tableStore', 'tableOptions'],
  components: {
    RangeRender,
    TableRow,
  },
  data() {
    return {
      grid: {
        offsetX: 0,
        offsetY: 0,
      },
    };
  },
  computed: {
    data() {
      return this.tableStore.data;
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
  watch: {
    data() {
      this.handleScroll();
    },
  },
  beforeCreate() {
    this.handing = false;
  },
  mounted() {
    this.scroll = this.getScrollElement();
    this.scroll.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  },
  methods: {
    getExtraRowAttrs(rowItem, index) {
      const { striped, rowExtraAttrs } = this.tableOptions;
      const { tableSelection } = this.tableStore;
      let extraAttrs = rowExtraAttrs;
      if (typeof rowExtraAttrs === 'function') {
        extraAttrs = rowExtraAttrs(rowItem, index);
      }
      return {
        style: {
          ...extraAttrs.style,
        },
        class: {
          ...extraAttrs.class,
          'infinite-table__row--striped': striped && index % 2 === 1,
          'infinite-table__row--selected': tableSelection.hasSelected(rowItem),
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
