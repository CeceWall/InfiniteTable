export default class TableColumnStore {
  constructor() {
    this.allTableColumns = [];
    this.tableColumns = [];
    this.leftFixedColumns = [];
    this.rightFixedColumns = [];
    this.leftFixedPositionMap = new Map();
    this.rightFixedPositionMap = new Map();
  }

  getTableColumnStore(fixed) {
    let columnStore = this.tableColumns;
    if (fixed === 'left') {
      columnStore = this.leftFixedColumns;
    } else if (fixed === 'right') {
      columnStore = this.rightFixedColumns;
    }
    return columnStore;
  }

  getPositionMap(fixed) {
    if (fixed === 'right') {
      return this.rightFixedPositionMap;
    }
    return this.leftFixedPositionMap;
  }

  setFixedPosition(column) {
    const columnStore = this.getTableColumnStore(column.fixed);
    const positionMap = this.getPositionMap(column.fixed);

    if (column.fixed === 'left') {
      const index = columnStore.length - 1;
      if (index === 0) {
        positionMap.set(index, 0);
      } else {
        const previousValue = positionMap.get(index - 1);
        const previousColumn = columnStore[index - 1];
        positionMap.set(index, previousValue + previousColumn.width);
      }
    } else {
      for (let i = columnStore.length - 1; i >= 0; i -= 1) {
        if (i === columnStore.length - 1) {
          positionMap.set(i, 0);
        } else {
          const previousValue = positionMap.get(i + 1);
          const previousColumn = columnStore[i + 1];
          positionMap.set(i, previousValue + previousColumn.width);
        }
      }
    }
  }

  getFixedPosition(column) {
    const columnStore = this.getTableColumnStore(column.fixed);
    const index = columnStore.indexOf(column);
    const positionMap = this.getPositionMap(column.fixed);
    return positionMap.get(index);
  }

  /**
   * 获取column的fixed style
   * @param column
   * @return {Object} style对象, 包含left或right属性
   */
  getFixedColumnStyle(column) {
    if (column.fixed) {
      return {
        [column.fixed]: `${this.getFixedPosition(column)}px`,
      };
    }
    return {};
  }

  updateTableColumns() {
    this.tableColumns = this.allTableColumns.filter((item) => !item.fixed);
    this.leftFixedColumns = this.allTableColumns.filter((item) => item.fixed === 'left' || item.fixed === true);
    this.rightFixedColumns = this.allTableColumns.filter((item) => item.fixed === 'right');

    // TODO: 修改setFixedPosition方法的实现，目前会导致O(n2)的问题
    this.leftFixedColumns.forEach((column) => this.setFixedPosition(column));
    this.rightFixedColumns.forEach((column) => this.setFixedPosition(column));
  }

  addTableColumn(column, index) {
    const columnStore = this.allTableColumns; // this.getTableColumnStore(column.fixed);
    if (typeof index === 'number') {
      columnStore.splice(index, 0, column);
    } else {
      columnStore.push(column);
    }
    this.updateTableColumns();
  }

  removeTableColumn(column) {
    const columnStore = this.allTableColumns;
    const index = columnStore.findIndex((item) => item.label === column.label);
    if (index !== -1) {
      columnStore.splice(index, 1);
    }
    this.updateTableColumns();
  }

  replaceTableColumn(prevColumn, nextColumn) {
    const prevIndex = this.allTableColumns.findIndex((item) => item.label === prevColumn.label);
    if (prevIndex !== -1) {
      this.allTableColumns.splice(prevIndex, 1, nextColumn);
    }
    this.updateTableColumns();
  }

  getTableColumns() {
    return [
      ...this.leftFixedColumns,
      ...this.tableColumns,
      ...this.rightFixedColumns,
    ];
  }

  getLeftFixedColumns() {
    return this.leftFixedColumns;
  }

  getRightFixedColumns() {
    return this.rightFixedColumns;
  }

  clear() {
    this.allTableColumns = [];
    this.updateTableColumns();
  }
}
