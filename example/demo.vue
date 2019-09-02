<template>
  <div class="hello" style="height: 100%;">
    <div style="width: 100%; height: 100%">
      <infinite-table
        ref="table"
        :data="data"
        height="100%"
        :highlight-row="highlightRow"
        row-key="0"
        :row-extra-attrs="rowClassName"
        header-height="60px"
        row-height="40px"
      >
        <infinite-table-column
          v-for="label of getColumns()"
          :label="label"
          :prop="label"
          :width="getColumnWidth()"
          :key="label"
          sortable
        />
      </infinite-table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import fp from 'lodash/fp';
import InfiniteTable from '../src/table.vue';
import InfiniteTableColumn from '../src/table-column.jsx';

export default {
  name: 'HelloWorld',
  components: {
    InfiniteTable,
    InfiniteTableColumn,
  },
  data() {
    return {
      data: [],
      highlightRow: true,
    };
  },
  mounted() {
    const columns = this.getColumns();

    let data = _.flow([
      _.times,
      fp.map(rowIndex => columns.reduce((obj, column, columnIndex) => ({
        ...obj,
        [column]: `${rowIndex} - ${columnIndex}`,
      }), {})),
    ])(1500);
    this.data = data;
    setInterval(() => {
      data = _.flow([
        _.times,
        fp.map(rowIndex => columns.reduce((obj, column, columnIndex) => ({
          ...obj,
          [column]: `${rowIndex} - ${columnIndex}`,
        }), {})),
      ])(500);
      this.data = data;
    }, 5000);
  },
  props: {
    msg: String,
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
        fp.map(i => i.toString(10)),
      )(n);
    },
    handleDrop(e) {
      e.preventDefault();
      console.log(e);
    },
    rowClassName(rowData, rowIndex) {
      return {
        class: {
          a1: true,
        },
        attrs: {
          draggable: true,
        },
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  html, body, #app {
    height: 100%;
    margin: 0;
  }
</style>
