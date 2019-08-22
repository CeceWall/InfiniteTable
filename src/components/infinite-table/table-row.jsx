export default {
  name: 'table-row',
  inject: ['tableStore'],
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
              <div
                key={columnOption.label}
                className="infinite-table__cell"
                style={{ width: `${columnOption.width}px`, height: `${tableOptions.rowHeight}px` }}
                {
                  ...{
                    nativeOn: {
                      click: () => {
                        this.handleRowEvent('click', columnOption);
                      },
                      dblclick: () => {
                        this.handleRowEvent('dblclick', columnOption);
                      },
                      contextmenu: () => {
                        this.handleRowEvent('contextmenu', columnOption);
                      },
                    },
                  }
                }
              >
                <div className="cell-content">
                  {columnRender({ row: data, options: columnOption })}
                </div>
              </div>
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
