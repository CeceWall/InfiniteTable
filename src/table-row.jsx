import classNames from 'classnames';
import RangeRender from './render/range-render.vue';

export default {
  name: 'TableRow',
  inject: ['tableStore', 'emitter'],
  components: { RangeRender },
  props: {
    data: {
      require: true,
    },
    offsetX: {
      type: Number,
    },
  },
  methods: {
    getFixedStyle(column) {
      // FIXME: 不直接使用__tableColumns的方法
      return this.tableStore.__tableColumns.getFixedColumnStyle(column);
    },
    handleRowClick() {
      this.emitter.dispatch('row-click', this.data);
    },
    renderTableCell(props) {
      const { data } = this;
      const { tableOptions } = this.tableStore;
      const { data: columnOption } = props;
      const { columnRender } = columnOption;
      const cellClassNames = classNames(
        'infinite-table__cell', 'infinite-table__cell--ellipsis',
        {
          'infinite-table__cell--fixed': !!columnOption.fixed,
        },
      );
      return (
        <div
          class={cellClassNames}
          style={{
            width: `${columnOption.width}px`,
            height: `${tableOptions.rowHeight}px`,
            // FIXME: 修复直接引用__tableColumns的问题
            ...this.getFixedStyle(columnOption),
          }}
        >
          <div class="cell-content">
            {columnRender({ row: data, options: columnOption })}
          </div>
        </div>
      );
    },
  },
  render(h) {
    const {
      tableOptions, layoutSize, leftFixTableColumns,
      mainTableColumns, rightFixedTableColumns,
    } = this.tableStore;
    const { offsetX } = this;
    return (
      h('div', {
        class: 'infinite-table__row',
        style: {
          width: `${layoutSize.allColumnsWidth}px`,
          height: `${tableOptions.rowHeight}px`,
        },
        on: {
          click: this.handleRowClick,
        },
      }, [
        leftFixTableColumns.map((column) => this.renderTableCell({ data: column })),
        h('range-render', {
          style: {
            width: `${layoutSize.allColumnsWidth}px`,
          },
          props: {
            dataKey: 'label',
            data: mainTableColumns,
            direction: 'horizontal',
            sizeField: 'width',
            offset: offsetX,
            viewportSize: layoutSize.viewportWidth,
            startIndex: this.startIndex,
            endIndex: this.endIndex,
          },
          scopedSlots: {
            default: (props) => this.renderTableCell(props),
          },
        }),
        rightFixedTableColumns.map((column) => this.renderTableCell({ data: column })),
      ])
    );
  },
};
