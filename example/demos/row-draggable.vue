<template>
  <div>
    <infinite-table
      row-key="id"
      :data="tableData"
      height="500px"
      row-draggable
      @row-dragstart="handleRowDragStart"
      @row-dragover="handleRowDragOver"
      @row-drop="handleRowDrop"
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
  name: 'RowDraggable',
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
    handleRowDragStart(rowItem, column, event) {
      this.dragStartItem = rowItem;
      event.dataTransfer.setData('row-item', rowItem.id);
    },
    handleRowDragOver(rowItem, column, event) {
      if ([].indexOf.call(event.dataTransfer.types, 'row-item') !== -1) {
        event.preventDefault();
      }
    },
    handleRowDrop(rowItem, column, event) {
      const dropIndex = this.tableData.indexOf(rowItem);
      const dragIndex = this.tableData.indexOf(this.dragStartItem);
      this.tableData.splice(dragIndex, 1);
      this.tableData.splice(dropIndex, 0, this.dragStartItem);
    },
  },
};
</script>
