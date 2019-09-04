<template>
  <div>
    <infinite-table
      row-key="id"
      :data="tableData"
      height="500px"
      header-resizable
      @column-resize="handleColumnResize"
    >
      <infinite-table-column
        prop="date"
        label="日期"
        :width="columnSize[0]"
      />
      <infinite-table-column
        label="姓名"
        prop="name"
        :width="columnSize[1]"
      />
      <infinite-table-column
        prop="address"
        label="住址"
        :width="columnSize[2]"
      />
    </infinite-table>
  </div>
</template>

<script>

export default {
  name: 'HeaderColumnResize',
  data() {
    return {
      columnSize: [
        500, 500, 500,
      ],
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
  methods: {
    handleColumnResize(columnIndex, column, changeSize) {
      this.$set(this.columnSize, columnIndex, this.columnSize[columnIndex] + changeSize)
    },
  },
};
</script>
