import Vue from 'vue';
import InfiniteTableColumn from './table-column.jsx';
import InfiniteTable from './table.vue';

export default {
  InfiniteTable,
  InfiniteTableColumn,
  install() {
    Vue.component('infinite-table-column', InfiniteTableColumn);
    Vue.component('infinite-table', InfiniteTable);
  },
};
