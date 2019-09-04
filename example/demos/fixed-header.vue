<template>
  <div>
    <infinite-table
      row-key="id"
      height="300px"
      :data="tableData"
    >
      <infinite-table-column
        prop="date"
        label="日期"
        fixed="left"
        width="200px"
      />
      <infinite-table-column
        label="姓名"
        prop="name"
      >
      </infinite-table-column>
      <infinite-table-column
        prop="address"
        label="住址"
        width="500px"
      />
    </infinite-table>
  </div>
</template>

<script>
export default {
  name: 'FixedHeader',
  data() {
    return {
      tableData: [{
        id: 1,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        id: 2,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        id: 3,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        id: 4,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        id: 5,
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        id: 6,
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        id: 7,
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }],
    };
  },
};
</script>
