<template>
  <recycle-render
    :render="tableRow"
    :data="data"
    :scroll-element="getScrollElement"
    :viewport-height="layoutSize.viewportHeight"
    :row-height="layoutSize.rowHeight"
  >
    <div class="infinite-table__body" :style="tableBodyStyle" v-on="tableBodyListeners">
    </div>
  </recycle-render>
</template>

<script>
import { num2px } from './utils/layout';
import TableRow from './table-row';
import RecycleRender from './render/recycle-render';

export default {
  name: 'table-body',
  components: {
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
