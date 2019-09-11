/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import TableColumnStore from './store/table-column-store';
import TableSelectionStore from './store/table-selection-store';

export default class TableStore {
  constructor(options = {}) {
    this.context = options.context;
    this.eventEmitter = options.eventEmitter;
    this.rowHeight = options.rowHeight;
    this.__layoutSize = options.layoutSize;
    this.__tableColumns = new TableColumnStore();
    this.tableSelection = new TableSelectionStore({
      rowKey: this.context.rowKey,
    });
    this.__tableOptions = options.tableOptions;
    this.__data = options.data;
    this.__sortedOption = {
      column: null,
      order: 'asc',
    };
  }

  get tableColumns() {
    return this.__tableColumns.getTableColumns();
  }

  get leftFixedTableColumns() {
    return this.__tableColumns.leftFixedColumns;
  }

  get mainTableColumns() {
    return this.__tableColumns.tableColumns;
  }

  get rightFixedTableColumns() {
    return this.__tableColumns.rightFixedColumns;
  }

  set tableColumns(columns) {
    this.__tableColumns.clear();
    columns.forEach((column) => {
      this.__tableColumns.addTableColumn(column);
    });
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
        this.__data = this.__data__nature.slice()
          .sort((row1, row2) => {
            const { prop } = column;
            const { comparator } = column;
            const descFlag = order === 'desc' ? -1 : 1;
            return comparator(row1[prop], row2[prop]) * descFlag;
          });
    }
  }

  isSameRow(rowItem1, rowItem2) {
    const { rowKey } = this.context;
    return _.get(rowItem1, rowKey) === _.get(rowItem2, rowKey);
  }

  isSameColumn(column1, column2) {
    return column1.label === column2.label;
  }
}
