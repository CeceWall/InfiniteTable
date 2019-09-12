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

export default {
  name: 'JSXColumn',
  data() {
    return {
      tableColumns: [
        {
          label: '日期',
          render: ({ row, options }) => <div>{row.date}</div>,
        },
        {
          label: '名称',
          render: ({ row, options }) => <div>{row.name}</div>,
        },
        {
          label: '地址',
          prop: 'address',
        },
      ],
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
