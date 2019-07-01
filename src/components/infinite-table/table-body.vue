<template>
  <table class="infinite-table__body">
    <colgroup>
      <col
        v-for="(column, columnIndex) of columns"
        :key="columnIndex" :width="column.width"
      />
    </colgroup>
    <tbody>
    <table-row
      :data="rowData"
      v-for="(rowData,rowIndex) of data"
      :key="rowIndex"
      :column-options="columns"
    ></table-row>
    </tbody>
  </table>
</template>

<script>
import TableRow from './table-row';

export default {
  name: 'table-body',
  components: {
    TableRow,
  },
  inject: ['store'],
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      viewportHeight: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.store.getLayoutOptions())
      const tableOptions = this.store.getTableOptions();
      const { tableHeight, tableHeaderHeight } = this.store.getLayoutOptions();
      console.log(tableHeight, tableHeaderHeight);
      this.viewportHeight = tableHeight - tableHeaderHeight;
    });
  },
  computed: {
    columns() {
      return this.store.getColumns();
    },
  },
};
</script>
