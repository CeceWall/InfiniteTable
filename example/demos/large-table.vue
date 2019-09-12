<template>
  <div style="height: 100%">
    <div style="height: 50px">
      <input
        v-model="searchValue"
        @keypress.enter="onSearch"
      >
    </div>
    <div style="width: 100%; height: calc(100% - 50px);">
      <infinite-table
        ref="table"
        :data="data"
        height="100%"
        :highlight-row="highlightRow"
        highlight-current-cell
        row-key="0"
        :row-extra-attrs="rowClassName"
        header-height="60px"
        row-height="40px"
        multiple-selection
      >
        <infinite-table-column
          v-for="(label, index) of columns"
          :key="label"
          :label="label"
          :prop="label"
          :width="getColumnWidth()"
          :comparator="cellComparator"
          sortable
        />
      </infinite-table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import fp from 'lodash/fp';

export default {
  name: 'LargeTable',
  data() {
    return {
      data: [],
      columns: [],
      highlightRow: true,
      searchValue: '',
    };
  },
  mounted() {
    this.columns = this.getColumns();
    const data = _.flow([
      _.times,
      fp.map((rowIndex) => this.columns.reduce((obj, column, columnIndex) => ({
        ...obj,
        [column]: `${rowIndex} - ${columnIndex}`,
      }), {})),
    ])(1000);
    this.data = data.map((item) => Object.freeze(item));
  },
  methods: {
    getColumnWidth() {
      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; // 不含最大值，含最小值
      }

      return getRandomInt(0, 100) + 100;
    },
    getColumns(n = 50) {
      return _.flow(
        _.times,
        fp.map((i) => i.toString(10)),
      )(n);
    },
    handleDrop(e) {
      e.preventDefault();
      console.log(e);
    },
    cellComparator(a, b) {
      if (a > b) {
        return 1;
      } if (a < b) {
        return -1;
      }
      return 0;
    },
    onSearch(event) {
      const rowItem = this.data.find((item) => item[0] === this.searchValue);
      if (rowItem) {
        this.$refs.table.scrollToRow(rowItem, 'bottom');
      }
    },
    rowClassName() {
      return {
        class: {
          a1: true,
        },
        attrs: {
          draggable: false,
        },
      };
    },
  },
};
</script>

<style scoped>

</style>
