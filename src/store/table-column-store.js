/* eslint-disable no-underscore-dangle */
import Vue from 'vue';
import { sumBy } from '@/utils/collection';

export default class TableColumnStore {
  constructor() {
    const _vm = new Vue({
      data: {
        allTableColumns: [],
      },
      computed: {
        leftFixedColumns() {
          return this.allTableColumns.filter((column) => column.fixed === 'left');
        },
        rightFixedColumns() {
          return this.allTableColumns.filter((column) => column.fixed === 'right');
        },
        leftFixedColumnWidth() {
          return sumBy(this.leftFixedColumns, (item) => item.width);
        },
        rightFixedColumnWidth() {
          return sumBy(this.rightFixedColumns, (item) => item.width);
        },
        mainColumns() {
          return this.allTableColumns.filter((column) => !column.fixed);
        },
        columns() {
          return [...this.leftFixedColumns, ...this.mainColumns, ...this.rightFixedColumns];
        },
        columnOffset() {
          let sum = 0;
          return this.columns.map((item, index) => {
            if (index === 0) {
              return 0;
            }
            sum += (this.columns[index - 1].width || 0);
            return sum;
          });
        },
        fixedPositionMap() {
          const map = {
            left: new Map(),
            right: new Map(),
          };
          for (let i = 0; i < this.leftFixedColumns.length; i += 1) {
            if (i === 0) {
              map.left.set(i, 0);
            } else {
              const prevValue = map.left.get(i - 1);
              const prevColumn = this.leftFixedColumns[i - 1];
              map.left.set(i, prevValue + prevColumn.width);
            }
          }

          for (let i = this.rightFixedColumns.length - 1; i >= 0; i -= 1) {
            if (i === this.rightFixedColumns.length - 1) {
              map.right.set(i, 0);
            } else {
              const previousValue = map.right.get(i + 1);
              const previousColumn = this.rightFixedColumns[i + 1];
              map.right.set(i, previousValue + previousColumn.width);
            }
          }
          return map;
        },
      },
      methods: {
        getColumnsByFixed(fixed) {
          switch (fixed) {
            case 'left':
              return this.leftFixedColumns;
            case 'right':
              return this.rightFixedColumns;
            default:
              return this.mainColumns;
          }
        },
        findColumnIndex(column, originIndex = false) {
          if (originIndex) {
            return this.allTableColumns.findIndex((item) => column.label === item.label);
          }
          return this.columns.findIndex((item) => column.label === item.label);
        },
      },
    });

    this._vm = _vm;
  }

  getColumnOffset(column) {
    const columnIndex = this._vm.findColumnIndex(column);
    return this._vm.columnOffset[columnIndex];
  }

  /**
   * 获取column的fixed style
   * @param column
   * @return {Object} style对象, 包含left或right属性
   */
  getFixedColumnStyle(column) {
    if (column.fixed) {
      const fixedColumns = this._vm.getColumnsByFixed(column.fixed);
      const index = fixedColumns.findIndex((item) => item.label === column.label);
      const positionMap = this._vm.fixedPositionMap;
      return {
        [column.fixed]: `${positionMap[column.fixed].get(index)}px`,
      };
    }
    return {};
  }

  addTableColumn(column, index) {
    const columnStore = this._vm.allTableColumns;
    if (typeof index === 'number') {
      columnStore.splice(index, 0, column);
    } else {
      columnStore.push(column);
    }
  }

  removeTableColumn(column) {
    const index = this._vm.findColumnIndex(column, true);
    if (index !== -1) {
      this._vm.allTableColumns.splice(index, 1);
    }
  }

  replaceTableColumn(prevColumn, nextColumn) {
    const prevIndex = this._vm.findColumnIndex(prevColumn, true);
    if (prevIndex !== -1) {
      this._vm.allTableColumns.splice(prevIndex, 1, nextColumn);
    }
  }

  get columns() {
    return this._vm.columns;
  }

  get leftFixedColumns() {
    return this._vm.leftFixedColumns;
  }

  get rightFixedColumns() {
    return this._vm.rightFixedColumns;
  }

  get leftFixedColumnWidth() {
    return this._vm.leftFixedColumnWidth;
  }

  get rightFixedColumnWidth() {
    return this._vm.rightFixedColumnWidth;
  }

  get mainColumns() {
    return this._vm.mainColumns;
  }

  clear() {
    this._vm.allTableColumns = [];
  }
}
