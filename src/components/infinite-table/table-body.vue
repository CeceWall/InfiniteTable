<template>
  <recycle-render
    :render="tableRow"
    :data="data"
    :scroll-element="getScrollElement"
    :render-props="{tableColumns,layoutSize}"
    :viewport-height="layoutSize.viewportHeight"
    :row-height="layoutSize.rowHeight"
  >
    <div class="infinite-table__body" :style="tableBodyStyle" v-on="tableBodyListeners">
<!--      <table-ellipsis-cell :layout-size="layoutSize" />-->
    </div>
  </recycle-render>
</template>

<script>
import { num2px } from './utils/layout';
import TableRow from './table-row';
import RecycleRender from './render/recycle-render';
import TableEllipsisCell from './table-ellipsis-cell.vue';

export default {
  name: 'table-body',
  components: {
    TableEllipsisCell,
    RecycleRender,
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
    tableColumns: {
      type: Array,
      required: true,
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
  },
};
</script>
