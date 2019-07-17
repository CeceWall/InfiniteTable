<template>
  <div class="hello" style="height: 100%;">
    <div style="width: 100%; height: 100%">
      <infinite-table
        ref="table"
        :data="data"
        height="100%"
        :highlight-row="highlightRow"
        :row-extra-attrs="rowClassName"
        header-height="60px"
        row-height="40px"
      >
        <infinite-table-column
          v-for="label of getColumns()"
          :label="label"
          :prop="label"
          width="100"
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
import InfiniteTable from './infinite-table/table.vue';
import InfiniteTableColumn from './infinite-table/table-column';

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
    console.log(this.getColumns());

    const data = _.flow([
      _.times,
      fp.map(rowIndex => columns.reduce((obj, column, columnIndex) => ({
        ...obj,
        [column]: `${columnIndex} -${rowIndex} - ${column}`,
      }), {})),
    ])(200);
    setTimeout(() => {
      this.data = data;
    }, 1000);
    setTimeout(() => {
      // this.data = [];
    }, 2000);
  },
  props: {
    msg: String,
  },
  methods: {
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
          draggable: false,
        },
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
