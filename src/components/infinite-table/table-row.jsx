import TableCell from './table-cell.jsx';

export default {
  name: 'table-row',
  components: {
    TableCell,
  },
  inject: ['store'],
  props: {
    data: {
      require: true,
    },
    columnOptions: {
      require: true,
    },
  },
  render() {
    const { data, columnOptions, store } = this;
    const { rowHeight } = store.getTableOptions();
    return (
      <tr style={{ height: `${rowHeight}px` }}>
        {
          columnOptions.map((columnOption) => {
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
