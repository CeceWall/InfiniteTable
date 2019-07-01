import Vue from 'vue';

function getContentSize(el) {
  if (el instanceof HTMLElement) {
    const height = el.clientHeight;
    const width = el.clientWidth;
    return {
      height,
      width,
    };
  }
  return null;
}

export default class TableLayout {
  constructor(options) {
    const defaultOptions = {
      table: null,
      store: null,
    };
    this.layoutSize = {
      width: 0,
      height: 0,
    };
    this.tableSize = {
      width: 0,
      height: 0,
    };
    this.options = Object.assign({}, defaultOptions, options);
    if (!this.options.table) {
      console.error('缺少必要的table字段');
    }
    if (!this.options.store) {
      console.error('缺少必要的store参数');
    }
  }

  // 计算table的宽度
  doColumnWidthLayout() {
    const { store } = this.options;
    const columns = store.getColumns();
    const { tableWidth } = store.getLayoutOptions();
    let defaultWidthColumnCount = 0;
    const totalColumnWidth = columns.reduce((totalWidth, column) => {
      // TODO 修改column默认width的获取方式
      let columnWidth = column.width;
      if (!columnWidth) {
        defaultWidthColumnCount += 1;
        columnWidth = 80;
      }
      return totalWidth + columnWidth;
    }, 0);

    let defaultColumnWidth = 0;
    // 如果table宽度小于等于容器宽度，则将剩余宽度平均分配给没设置宽度的列
    // 并将table的宽度设置成容器的宽度
    // 否则将table的宽度设置成tableColumnWidth计算出来的宽度
    if (totalColumnWidth <= tableWidth) {
      defaultColumnWidth = (tableWidth - (totalColumnWidth - 80 * defaultWidthColumnCount)) / defaultWidthColumnCount;
      Vue.set(this, 'tableSize', { width: tableWidth });
    } else {
      defaultColumnWidth = 80;
      Vue.set(this, 'tableSize', { width: totalColumnWidth });
    }
    columns.forEach((column, index) => {
      if (!column.width) {
        store.updateColumn(index, 'tableWidth', defaultColumnWidth);
      }
    });
  }

  update() {
    const { table, store } = this.options;
    const { $el } = table;
    const { header, body } = table.$refs;
    if ($el && $el instanceof HTMLElement) {
      Vue.nextTick(() => {
        const tableSize = getContentSize($el);
        const tableHeaderSize = getContentSize(header);
        const tableBodySize = getContentSize(body);
        store.updateLayoutOptions({
          tableHeaderHeight: tableHeaderSize.height,
          tableHeaderWidth: tableHeaderSize.width,
          tableWidth: tableSize.width,
          tableHeight: tableSize.height,
          tableBodyWidth: tableBodySize.width,
          tableBodyHeight: tableBodySize.height,
        });
        this.doColumnWidthLayout();
      });
    }
  }
}
