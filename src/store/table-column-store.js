export default class TableColumnStore {
  constructor() {
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

  addTableColumn(column) {
    const columnStore = this.getTableColumnStore(column.fixed);
    columnStore.push(column);
    if (column.fixed) {
      this.setFixedPosition(column);
    }
  }

  removeTableColumn(column) {
    const columnStore = this.getTableColumnStore(column.fixed);
    const index = columnStore.indexOf(column);
    if (index !== -1) {
      columnStore.splice(index, 1);
    }
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
    this.tableColumns = [];
    this.leftFixedColumns = [];
    this.rightFixedColumns = [];
  }
}
