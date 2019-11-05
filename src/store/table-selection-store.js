import { get } from '@/utils/object';

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
    // 当次不是multiple那么只可能存有一条数据
    if (!multiple) {
      this.clearSelectedRows();
    }
    // 如果当前是multiple模式，而且该项之前存在过就删除当前条目
    if (multiple && index !== -1) {
      this.selectedRows.splice(index, 1);
    } else if (multiple || (!multiple && index === -1)) {
      // 如果当前是multiple模式或者当前项目之前不存在就添加选择项
      this.selectedRows.push(row);
    }
  }

  findSelectionIndex(row) {
    const { rowKey } = this;
    if (this.selectedRows.length === 0) {
      return -1;
    }
    const rowIdentifier = get(row, this.rowKey);
    if (!rowIdentifier) {
      return -1;
    }
    return this.selectedRows.findIndex((item) => get(item, rowKey) === rowIdentifier);
  }

  hasSelected(row) {
    return this.findSelectionIndex(row) >= 0;
  }
}
