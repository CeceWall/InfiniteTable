import classNames from 'classnames';
import RangeRender from './render/range-render.vue';

export default {
  name: 'TableRow',
  inject: ['tableStore', 'emitter', 'tableOptions'],
  components: { RangeRender },
  props: {
    index: {
      type: Number,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    offsetX: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    getFixedStyle(column) {
      // FIXME: 不直接使用__tableColumns的方法
      return this.tableStore.__tableColumns.getFixedColumnStyle(column);
    },
    dispatchRowEvent(eventName, data, column, e) {
      this.emitter.dispatch(eventName, data, column, e);
    },
    renderTableCell(props) {
      const { data } = this;
      const { tableOptions } = this;
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
          draggable={tableOptions.rowDraggable}
          style={{
            width: `${columnOption.width}px`,
            height: `${tableOptions.rowHeight}px`,
            // FIXME: 修复直接引用__tableColumns的问题
            ...this.getFixedStyle(columnOption),
          }}
          {
            ...{
              on: {
                click: (e) => this.dispatchRowEvent('row-click', data, columnOption, e),
                contextmenu: (e) => this.dispatchRowEvent('row-contextmenu', data, columnOption, e),
                dblclick: (e) => this.dispatchRowEvent('row-dblclick', data, columnOption, e),
                dragstart: (e) => this.dispatchRowEvent('row-dragstart', data, columnOption, e),
                dragend: (e) => this.dispatchRowEvent('row-dragend', data, columnOption, e),
                dragover: (e) => this.dispatchRowEvent('row-dragover', data, columnOption, e),
                drop: (e) => this.dispatchRowEvent('row-drop', data, columnOption, e),
              },
            }
          }
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
      layoutSize, leftFixTableColumns,
      mainTableColumns, rightFixedTableColumns,
    } = this.tableStore;

    const { offsetX, tableOptions } = this;
    return (
      h('div', {
        class: 'infinite-table__row',
        style: {
          width: `${layoutSize.allColumnsWidth}px`,
          height: `${tableOptions.rowHeight}px`,
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
