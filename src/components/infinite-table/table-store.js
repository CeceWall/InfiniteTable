import Vue from 'vue';

class TableStore {
  constructor() {
    this.store = Vue.observable({
      layoutSize: {},
      tableColumns: {},
    });
  }

  get layoutSize() {
    return this.store.layoutSize;
  }

  set layoutSize(value) {
    this.store.layoutSize = value;
  }

  get tableColumns() {
    return this.store.tableColumns;
  }

  set tableColumns(value) {
    this.store.tableColumns = value;
  }
}

export default new TableStore();
