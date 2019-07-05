import TableCell from './table-cell';

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
      <tr>
        {
          tableColumns.map((columnOption) => {
            const { columnRender } = columnOption;
            return (
              <table-cell ellipsisHover={true}>
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
      </tr>
    );
  },
};
