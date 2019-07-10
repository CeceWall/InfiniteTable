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
    this.__tableColumns = options.tableColumns;
    this.__tableOptions = options.tableOptions;
  }

  get selectedRow() {
    return this.__selectedRow;
  }

  set selectedRow(row) {
    this.__selectedRow = row;
  }

  get selectedColumn() {
    return this.__selectedColumn;
  }

  set selectedColumn(column) {
    this.__selectedColumn = column;
  }

  get tableColumns() {
    return this.__tableColumns;
  }

  set tableColumns(columns) {
    this.__tableColumns = columns;
  }

  get tableOptions() {
    return this.__tableOptions;
  }

  set tableOptions(options) {
    this.__tableOptions = options;
  }
}
