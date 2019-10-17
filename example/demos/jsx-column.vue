<template>
  <div>
    <infinite-table
      row-key="id"
      :data="tableData"
      height="500px"
      :table-columns="tableColumns"
    />
  </div>
</template>

<script lang="jsx">
import _ from 'lodash';
import tableColumns from './columns.jsx'

export default {
  name: 'JSXColumn',
  data() {
    return {
      tableColumns,
      visible: true,
      tableData: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
      }],
    };
  },
};
</script>
