import TableCell from './table-cell';

export default {
  name: 'table-header',
  components: {
    'table-cell': TableCell,
  },
  inject: ['tableColumns'],
  render() {
    const { tableColumns } = this;
    return (
      <table class="infinite-table__table-header">
        <colgroup>
          {tableColumns.map(column => <col width={column.width} />)}
        </colgroup>
        <thead>
        <tr>
          {tableColumns.map(column => <table-cell>{column.label}</table-cell>)}
        </tr>
        </thead>
      </table>
    );
  },
};
