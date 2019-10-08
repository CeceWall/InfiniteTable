/* eslint-disable no-underscore-dangle */
import TableColumnStore from './store/table-column-store';
import TableSelectionStore from './store/table-selection-store';
import TableDataStore from '@/store/table-data-store';
import { get } from '@/utils/object';

export default class TableStore {
  constructor(options = {}) {
    this.context = options.context;
    const { rowKey } = this.context;
    this.eventEmitter = options.eventEmitter;
    this.rowHeight = options.rowHeight;
    this.__layoutSize = options.layoutSize;
    this.tableSelection = new TableSelectionStore({
      rowKey: this.context.rowKey,
    });
    this.tableColumns = new TableColumnStore();
    this.dataStore = new TableDataStore({ dataKey: rowKey });
    this.dataStore.updateData(options.data);
    this.dataStore.updateFixedKeys(options.fixedKeys);
  }

  get layoutSize() {
    return this.__layoutSize;
  }

  set layoutSize(value) {
    this.__layoutSize = value;
  }

  isSameRow(rowItem1, rowItem2) {
    const { rowKey } = this.context;
    return get(rowItem1, rowKey) === get(rowItem2, rowKey);
  }

  isSameColumn(column1, column2) {
    return column1.label === column2.label;
  }
}
