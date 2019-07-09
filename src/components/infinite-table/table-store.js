import Vue from 'vue';

export default class TableStore {
  constructor(options = {}) {
    if (!options.tableId) {
      console.error('TableStore: 缺少必要的tableId参数');
    }
    this.tableId = options.tableId;
    this.eventEmitter = options.eventEmitter;
    this.rowHeight = options.rowHeight;
    this.__selectedRow = options.selectedRow;
  }

  set selectedRow(row) {
    this.__selectedRow = row;
    this.eventEmitter.dispatch('selected-change', this.__selectedRow);
  }

  get selectedRow() {
    return this.__selectedRow;
  }
}
