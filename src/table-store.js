/* eslint-disable no-underscore-dangle */

function defaultComparator(a, b) {
  if (a > b) {
    return 1;
  }
  if (a === b) {
    return 0;
  }
  return -1;
}

export default class TableStore {
  constructor(options = {}) {
    if (!options.tableId) {
      console.error('TableStore: 缺少必要的tableId参数');
    }
    this.tableId = options.tableId;
    this.eventEmitter = options.eventEmitter;
    this.rowHeight = options.rowHeight;
    this.__layoutSize = options.layoutSize;
    this.__selectedRow = options.selectedRow;
    this.__selectedColumn = options.selectedColumn;
    this.__tableColumns = options.tableColumns;
    this.__tableOptions = options.tableOptions;
    this.__data = options.data;
    this.__sortedOption = {
      column: null,
      order: 'asc',
    };
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

  set data(data) {
    this.__data__nature = data.slice();
    this.updateDataOrder();
  }

  get data() {
    return this.__data;
  }

  get layoutSize() {
    return this.__layoutSize;
  }

  set layoutSize(value) {
    this.__layoutSize = value;
  }

  get sortedOption() {
    return this.__sortedOption;
  }

  set sortedOption(option) {
    const { order: oldOrder, column: oldColumn } = this.__sortedOption;
    const { column } = option;
    let { order } = option;
    if (!order && column !== oldColumn) {
      order = 'asc';
    } else if (!order) {
      switch (oldOrder) {
        case 'asc':
          order = 'desc';
          break;
        case 'desc':
          order = 'nature';
          break;
        default:
          order = 'asc';
      }
    }
    this.__sortedOption = {
      column,
      order,
    };
    // 使用sortedOption更新data
    this.updateDataOrder();
  }

  updateDataOrder() {
    if (!this.__sortedOption || !this.__sortedOption.column) {
      this.__data = this.__data__nature.slice();
      return;
    }
    const { column, order } = this.__sortedOption;
    switch (order) {
      case 'nature':
        this.__data = this.__data__nature.slice();
        break;
      default:
        this.__data = this.__data__nature.slice().sort((row1, row2) => {
          const { prop } = column;
          const comparator = column.comparator || defaultComparator;
          const descFlag = order === 'desc' ? -1 : 1;
          return comparator(row1[prop], row2[prop]) * descFlag;
        });
    }
  }
}