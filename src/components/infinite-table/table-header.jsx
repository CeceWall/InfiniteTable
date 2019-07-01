import TableCell from './table-cell';

export default {
  name: 'table-header',
  components: {
    'table-cell': TableCell,
  },
  inject: ['store'],
  computed: {
    parent() {
      return this.$parent;
    },
  },
  render() {
    const columns = this.store.getColumns();
    return (
      <table class="infinite-table__table-header">
        <colgroup>
          {columns.map(column => <col width={column.width} />)}
        </colgroup>
        <thead>
        <tr>
          {columns.map(column => <table-cell>{column.label}</table-cell>)}
        </tr>
        </thead>
      </table>
    );
  },
};
