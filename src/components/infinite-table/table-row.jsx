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
    highlighted: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    highlightRow() {
      return this.tableStore.selectedRow === this.data;
    },
    tableRowClass() {
      const { highlightRow, rowClassName } = this.tableStore.tableOptions;
      const extraClassName = typeof rowClassName === 'function' ? rowClassName(this.data) : rowClassName;
      return {
        'infinite-table__row': true,
        'infinite-table__row--selected': highlightRow && this.highlightRow,
        [extraClassName]: true,
      };
    },
  },
  render() {
    const { data } = this;
    const { tableColumns } = this.tableStore;
    return (
      <div class={this.tableRowClass}>
        {
          tableColumns.map((columnOption) => {
            const { columnRender } = columnOption;
            return (
              <table-cell
                key={columnOption.label}
                width={columnOption.width}
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
