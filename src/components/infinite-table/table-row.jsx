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
    tableColumns: {
      required: true,
    },
    layoutSize: {
      required: true,
    },
  },
  data() {
    return {
      highlightRow: false, // 避免selectedRow改变导致不必要的updateComponent调用
    };
  },
  computed: {
    selectedRow() {
      return this.tableStore.selectedRow;
    },
    tableRowClass() {
      return {
        'infinite-table__row': true,
        'infinite-table__row--selected': this.highlightRow,
      };
    },
  },
  watch: {
    selectedRow() {
      this.highlightRow = this.selectedRow === this.data;
    },
  },
  render() {
    const { data, tableColumns } = this;
    return (
      <div class={this.tableRowClass}>
        {
          tableColumns.map((columnOption) => {
            const { columnRender } = columnOption;
            return (
              <table-cell
                ref="cell"
                refInFor
                key={columnOption.label}
                width={columnOption.width}
                {
                  ...{
                    on: {
                      'cell-display-ellipsis': e => this.handleCellMouseEnter(e, columnOption, data),
                      'cell-hide-ellipsis': e => this.handleCellMouseLeave(e, columnOption, data),
                    },
                    nativeOn: {
                      click: () => { console.log('table row click'); this.handleRowEvent('click', columnOption); },
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
    handleContextMenu(e) {
      e.preventDefault();
      console.log(e);
    },
    handleCellMouseEnter(e, columnOption, data) {
      const eventPayload = {
        event: e,
        columnOption,
        data,
      };
      // emitter.$emit('cell-display-ellipsis', eventPayload);
    },
    handleSelectRow() {
      this.tableStore.selectedRow = this.data;
    },
    handleCellMouseLeave(e, columnOption, data) {
      const eventPayload = {
        event: e,
        columnOption,
        data,
      };
      // emitter.$emit('cell-hide-ellipsis', eventPayload);
    },
    handleRowEvent(type, column) {
      this.tableStore.selectedColumn = column;
      this.tableStore.selectedRow = this.data;
    },
  },
};
