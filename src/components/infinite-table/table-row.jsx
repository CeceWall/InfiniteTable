import TableCell from './table-cell.vue';

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
  render() {
    const { data, tableColumns } = this;
    return (
      <div>
        {
          tableColumns.map((columnOption) => {
            const { columnRender } = columnOption;
            return (
              <table-cell ellipsisHover={true} width={columnOption.width}>
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
};
