import TableCell from './table-cell.vue';

export default {
  name: 'table-row',
  inject: ['tableStore'],
  components: {
    TableCell,
  },
  props: {
    data: {
      require: true,
    },
  },
  render() {
    const { data } = this;
    const { tableColumns, tableOptions } = this.tableStore;
    // TODO 将table-cell的渲染放到table-body中，目的是columnRender能拿到更多的数据
    return (
      <div class="infinite-table__row">
        {
          tableColumns.map((columnOption) => {
            const { columnRender } = columnOption;
            return (
              <table-cell
                key={columnOption.label}
                width={columnOption.width}
                height={tableOptions.rowHeight}
                {
                  ...{
                    nativeOn: {
                      click: () => { this.handleRowEvent('click', columnOption); },
                      dblclick: () => { this.handleRowEvent('dblclick', columnOption); },
                      contextmenu: () => { this.handleRowEvent('contextmenu', columnOption); },
                    },
                  }
                }
              >
                {
                  columnRender({
                    row: data,
                    options: columnOption,
                  })
                }
              </table-cell>
            );
          })
        }
      </div>
    );
  },
  methods: {
    handleRowEvent(type, column) {
      this.tableStore.selectedColumn = column;
      this.tableStore.selectedRow = this.data;
    },
  },
};
