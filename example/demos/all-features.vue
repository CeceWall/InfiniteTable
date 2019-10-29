<template>
  <div style="height: 100%">
    <div style="height: 50px">
      <button @click="addData">
        添加10行
      </button>
      <button @click="removeData">
        减少10行
      </button>
      <button @click="addColumn">
        添加一列
      </button>
      <button @click="removeColumn">
        减少一列
      </button>

      <input
        v-model="fixedIndex"
        placeholder="请输入要固定的列序号"
      >
      <select v-model="fixed">
        <option value="left">
          左固定
        </option>
        <option value="right">
          右固定
        </option>
        <option value="false">
          取消固定
        </option>
      </select>
      <button @click="handleFixedColumn">
        固定
      </button>
    </div>
    <div style="width: 100%; height: calc(100% - 50px);">
      <infinite-table
        ref="table"
        :data="data"
        height="100%"
        highlight-current-cell
        row-key="key"
        header-height="60px"
        row-height="40px"
        header-resizable
        header-order-draggable
        multiple-selection
        :top-fixed-keys="['0 - 0', '100 - 0']"
        :table-columns="tableColumns"
        @column-resize="handleColumnResize"
      >
      </infinite-table>
    </div>
  </div>
</template>

<script lang="jsx">
import _ from 'lodash';

const tableColumns = [
  {
    label: '0',
    width: 80,
    sortable: true,
    fixed: 'left',
    render: (h, { rowIndex }) => `${rowIndex}-0`,
  },
  {
    label: '1',
    width: 80,
    sortable: true,
    fixed: 'left',
    render: (h, { rowIndex }) => `${rowIndex}-1`,
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    render: (h, { rowIndex }) => `${rowIndex}-2`,
  },
  {
    label: '3',
    width: 80,
    sortable: true,
    fixed: 'left',
    render: (h, { rowIndex }) => `${rowIndex}-3`,
  },
  {
    label: '4',
    width: 80,
    sortable: true,
    fixed: 'left',
    render: (h, { rowIndex }) => `${rowIndex}-4`,
  },
];

export default {
  name: 'AllFeatures',
  data() {
    return {
      data: [],
      tableColumns,
      fixedIndex: '',
      fixed: '',
    };
  },
  methods: {
    addColumn() {
      const columnIndex = this.tableColumns.length;
      this.tableColumns.push({
        label: this.tableColumns.length,
        width: 80,
        sortable: true,
        fixed: false,
        render: (h, { rowIndex }) => `${rowIndex}-${columnIndex}`,
      });
    },
    removeColumn() {
      this.tableColumns = this.tableColumns.slice(0, this.tableColumns.length - 1);
    },
    addData() {
      const data = _.times(10).map((i) => {
        const dataLength = this.data.length;
        return { key: i + dataLength };
      });
      this.data.push(...data);
    },
    removeData() {
      this.data = this.data.slice(0, this.data.length - 10);
    },
    handleFixedColumn() {
      const fixedIndex = parseInt(this.fixedIndex, 10);
      const fixed = this.fixed === 'false' ? false : this.fixed;
      if (fixedIndex < this.tableColumns.length) {
        this.tableColumns[fixedIndex].fixed = fixed;
      }
    },
    handleColumnResize(columnIndex, column, size) {
      console.log(columnIndex, column, size);
      this.tableColumns[columnIndex].width += size;
      console.log(this.tableColumns);
    },
  },
};
</script>

<style lang="scss">

</style>
