export default class TableSelectionStore {
  constructor(options) {
    const { rowKey } = options;
    if (!rowKey) {
      throw new Error('[TableSelectionStore]: rowKey必须存在');
    }
    this.rowKey = rowKey;
    this.selectedRows = [];
    this.focusedRow = {};
    this.selectedColumn = {};
    this.selectedCell = {
      row: {},
      column: {},
    };
  }

  clearSelectedRows() {
    this.selectedRows = [];
  }

  addSelectedRows(row, multiple) {
    const index = this.findSelectionIndex(row);
    const { length } = this.selectedRows;
    if (!multiple) {
      this.clearSelectedRows();
    }
    if ((multiple && index !== -1) || (!multiple && length > 1)) {
      this.selectedRows.splice(index, 1);
    } else {
      this.selectedRows.push(row);
    }
  }

  findSelectionIndex(row) {
    return this.selectedRows.findIndex((item) => item[this.rowKey] === row[this.rowKey]);
  }

  hasSelected(row) {
    return this.findSelectionIndex(row) >= 0;
  }
}
