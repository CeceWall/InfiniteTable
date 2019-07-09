export default class TableStore {
  constructor(options = {}) {
    if (!options.tableId) {
      console.error('TableStore: 缺少必要的tableId参数');
    }
    this.tableId = options.tableId;
    this.eventEmitter = options.eventEmitter;
    this.rowHeight = options.rowHeight;
    this.__selectedRow = options.selectedRow;
    this.__selectedColumn = options.selectedColumn;
  }

  set selectedRow(row) {
    this.__selectedRow = row;
  }

  get selectedRow() {
    return this.__selectedRow;
  }

  set selectedColumn(column) {
    this.__selectedColumn = column;
  }

  get selectedColumn() {
    return this.__selectedColumn;
  }
}
