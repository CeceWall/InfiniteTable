import Vue from 'vue';

export default class TableStore {
  constructor(options) {
    this.columns = [];
    this.layoutOptions = {};
    this.tableOptions = options.tableOptions;
    this.data = options.data;
  }

  getColumnByIndex(index) {
    const { columns } = this.options;
    if (index < columns.length) {
      return columns[index];
    }
    return null;
  }

  setTableData(data) {
    Vue.set(this, 'data', data);
  }

  getTableData() {
    return this.data;
  }

  getColumns() {
    return this.columns;
  }

  addColumn(index, column) {
    Vue.set(this.columns, index, column);
  }

  updateColumn(index, key, value) {
    if (index < this.columns.length) {
      Vue.set(this.columns, index, {
        ...this.columns[index],
        [key]: value,
      });
    }
  }

  getTableOptions() {
    return this.tableOptions;
  }

  updateTableOptions(key, value) {
    Vue.set(this.tableOptions, key, value);
  }

  getLayoutOptions() {
    return this.layoutOptions;
  }

  updateLayoutOptions(options) {
    Vue.set(this, 'layoutOptions', options);
  }
}
