<template>
  <recycle-render
    :render="tableRow"
    :total="data.length"
    :scroll-element="getScrollElement"
    :viewport-height="layoutSize.viewportHeight"
    :row-height="layoutSize.rowHeight"
    :render-function="renderRow"
  >
    <div class="infinite-table__body" :style="tableBodyStyle" v-on="tableBodyListeners">
    </div>
  </recycle-render>
</template>

<script lang="jsx">
import { num2px } from './utils/layout';
import TableRow from './table-row';
import RecycleRender from './render/recycle-render';

export default {
  name: 'table-body',
  inject: ['tableStore'],
  components: {
    RecycleRender,
    TableRow,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    layoutSize: {
      type: Object,
      require: true,
    },
  },
  computed: {
    tableBodyListeners() {
      return {
        ...this.$listeners,
      };
    },
    tableBodyStyle() {
      return {
        height: num2px(this.layoutSize.rowHeight * this.data.length),
      };
    },
  },
  data() {
    return {
      viewportHeight: 0,
      tableRow: TableRow,
    };
  },
  methods: {
    getScrollElement() {
      return this.$parent.$el;
    },
    renderRow(index) {
      const rowData = this.data[index];
      const {
        rowExtraAttrs,
        highlightRow: highlightRowEnabled,
        striped,
      } = this.tableStore.tableOptions;
      const { selectedRow } = this.tableStore;
      const extraAttrs = typeof rowExtraAttrs === 'function' ? rowExtraAttrs(rowData, index) : rowExtraAttrs;
      const componentOptions = {
        ...extraAttrs,
        class: {
          ...extraAttrs.class,
          'infinite-table__row--striped': striped && (index % 2 === 1),
          'infinite-table__row--selected': highlightRowEnabled && selectedRow === rowData,
        },
        style: {
          ...extraAttrs.style,
        },
        attrs: extraAttrs.attrs,
      };
      return (
        <table-row
          data={rowData}
          {
            ...componentOptions
          }
        />
      );
    },
  },
};
</script>
