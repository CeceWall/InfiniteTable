import Vue from 'vue';
import { get } from '@/utils/object';
import { isSameColumn } from './utils';

function createDataStore(options) {
  return new Vue({
    data: {
      dataKey: options.dataKey,
      freeze: options.freeze || false,
      data: [],
      fixedKeys: [],
      sortedOption: {},
    },
    computed: {
      fixedData() {
        const set = new Set(this.fixedKeys);
        return this.data.filter((dataItem) => set.has(get(dataItem, this.dataKey)));
      },
      normalData() {
        const set = new Set(this.fixedKeys);
        const data = this.data.filter((dataItem) => !set.has(get(dataItem, this.dataKey)));
        return this.compareDataItem(data);
      },
      allData() {
        return [...this.fixedData, ...this.normalData];
      },
    },
    methods: {
      compareDataItem(data) {
        const { column, order } = this.sortedOption;
        if (!order || !column || order === 'nature') {
          return data;
        }
        const { comparator, prop } = column;
        return data.sort((row1, row2) => {
          const descFlag = order === 'desc' ? -1 : 1;
          return comparator.call(null, get(row1, prop), get(row2, prop)) * descFlag;
        });
      },
      setData(nextData) {
        if (this.freeze) {
          this.data = nextData.map((dataItem) => Object.freeze(dataItem));
        } else {
          this.data = nextData;
        }
      },
      setSortedOption(sortedOption) {
        const { column: prevColumn, order: prevOrder } = this.sortedOption;
        const { column } = sortedOption;
        let { order } = sortedOption;
        if (!order && !isSameColumn(column, prevColumn)) {
          order = 'asc';
        } else if (!order) {
          switch (prevOrder) {
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
        this.sortedOption = { order, column };
      },
    },
  });
}

export default class TableDataStore {
  constructor(options) {
    Object.defineProperty(this, '_vm', {
      value: createDataStore(options),
      enumerable: false,
      writable: false,
      configurable: false,
    });
  }

  get data() {
    return this._vm.normalData;
  }

  get fixedData() {
    return this._vm.fixedData;
  }

  get allData() {
    return this._vm.allData;
  }

  updateData(nextData) {
    this._vm.setData(nextData);
  }

  updateFixedKeys(fixedKeys) {
    this._vm.fixedKeys = fixedKeys;
  }

  set sortedOption(sortedOption) {
    this._vm.setSortedOption(sortedOption);
  }

  get sortedOption() {
    return this._vm.sortedOption;
  }
}
