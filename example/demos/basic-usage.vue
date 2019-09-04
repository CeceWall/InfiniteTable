<template>
  <div>
    <infinite-table
      row-key="id"
      :data="tableData"
      height="500px"
    >
      <infinite-table-column
        v-if="visible"
        prop="date"
        label="日期"
      />
      <infinite-table-column
        label="姓名"
        prop="name"
      />
      <infinite-table-column
        prop="address"
        label="住址"
      />
    </infinite-table>
  </div>
</template>

<script>

export default {
  name: 'BasicUsage',
  data() {
    return {
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
