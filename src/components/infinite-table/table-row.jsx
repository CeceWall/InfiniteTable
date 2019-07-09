import TableCell from './table-cell.vue';
import emitter from './event-emitter';

export default {
  name: 'table-row',
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
  computed: {
    selectedRowIndex() {
      return emitter.selectedRowIndex;
    },
  },
  render() {
    const { data, tableColumns } = this;
    return (
      <div
        class={{
          'infinite-table__row': true,
          'infinite-table__row--selected': this.selectedRowIndex === data,
        }}
        onContextmenu={this.handleContextMenu}
        onClick={this.handleSelectRow}
      >
        {
          tableColumns.map((columnOption) => {
            const { columnRender } = columnOption;
            return (
              <table-cell
                ref="cell"
                refInFor
                width={columnOption.width}
                {
                  ...{
                    on: {
                      'cell-display-ellipsis': e => this.handleCellMouseEnter(e, columnOption, data),
                      'cell-hide-ellipsis': e => this.handleCellMouseLeave(e, columnOption, data),
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
      emitter.$emit('cell-display-ellipsis', eventPayload);
    },
    handleSelectRow() {
      emitter.selectRow(this.data);
    },
    handleCellMouseLeave(e, columnOption, data) {
      const eventPayload = {
        event: e,
        columnOption,
        data,
      };
      emitter.$emit('cell-hide-ellipsis', eventPayload);
    },
  },
};
