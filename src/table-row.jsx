import classNames from 'classnames';
import RangeRender from './render/range-render.vue';
import { NotifyMixin } from '@/event-emitter';

export default {
  name: 'TableRow',
  inject: ['tableStore', 'emitter', 'tableOptions'],
  components: { RangeRender },
  mixins: [NotifyMixin],
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
    handleMouseLeaveCell() {
      this.notify('TableBody', 'hide-tooltip');
    },
    handleMouseEnterCell(data, column, event) {
      const { currentTarget } = event;
      if (currentTarget) {
        const contentElement = currentTarget.querySelector('.cell-content');
        if (contentElement) {
          const cellWidth = currentTarget.clientWidth;
          const contentWidth = contentElement.scrollWidth;
          if (contentWidth > cellWidth) {
            this.notify('TableBody', 'show-tooltip', currentTarget, contentElement.textContent);
          }
        }
      }
    },
    getFixedStyle(column) {
      return this.tableStore.tableColumns.getFixedColumnStyle(column);
    },
    dispatchRowEvent(eventName, data, column, e) {
      this.emitter.dispatch(eventName, data, column, e);
    },
    renderTableCell(props) {
      const { data, tableStore, index } = this;
      const { focusedRow, selectedColumn } = tableStore.tableSelection;
      const { highlightCurrentCell, rowDraggable, rowHeight } = this.tableOptions;
      const { data: columnOption } = props;
      const { columnRender } = columnOption;
      const cellSelected = highlightCurrentCell && (
        tableStore.isSameColumn(selectedColumn, columnOption)
        && tableStore.isSameRow(data, focusedRow)
      );
      const cellClassNames = classNames(
        'infinite-table__cell', 'infinite-table__cell--ellipsis',
        {
          'infinite-table__cell--selected': cellSelected,
          'infinite-table__cell--fixed': !!columnOption.fixed,
          'fixed-left': columnOption.fixed === 'left',
          'fixed-right': columnOption.fixed === 'right',
        },
      );
      return (
        <div
          class={cellClassNames}
          draggable={rowDraggable}
          style={{
            width: `${columnOption.width}px`,
            height: `${rowHeight}px`,
            ...this.getFixedStyle(columnOption),
          }}
          {
            ...{
              on: {
                click: (e) => {
                  this.dispatchRowEvent('cell-click', data, columnOption, e);
                  this.dispatchRowEvent('row-click', data, columnOption, e);
                },
                contextmenu: (e) => this.dispatchRowEvent('row-contextmenu', data, columnOption, e),
                dblclick: (e) => this.dispatchRowEvent('row-dblclick', data, columnOption, e),
                dragstart: (e) => this.dispatchRowEvent('row-dragstart', data, columnOption, e),
                dragend: (e) => this.dispatchRowEvent('row-dragend', data, columnOption, e),
                dragover: (e) => this.dispatchRowEvent('row-dragover', data, columnOption, e),
                drop: (e) => this.dispatchRowEvent('row-drop', data, columnOption, e),
                mouseenter: (e) => this.handleMouseEnterCell(data, columnOption, e),
                mouseleave: (e) => this.handleMouseLeaveCell(data, columnOption, e),
              },
            }
          }
        >
          <div class="cell-content">
            {columnRender(this.$createElement, {
              row: data, options: columnOption, rowIndex: index,
            })}
          </div>
        </div>
      );
    },
  },
  render(h) {
    const { layoutSize } = this.tableStore;
    const {
      leftFixedColumns, rightFixedColumns, mainColumns,
      leftFixedColumnWidth, rightFixedColumnWidth,
    } = this.tableStore.tableColumns;

    const { offsetX, tableOptions } = this;
    return (
      h('div', {
        class: 'infinite-table__row',
        style: {
          width: `${layoutSize.allColumnsWidth}px`,
          height: `${tableOptions.rowHeight}px`,
        },
      }, [
        leftFixedColumns.map((column) => this.renderTableCell({ data: column })),
        h('range-render', {
          style: {
            width: `${layoutSize.allColumnsWidth}px`,
          },
          props: {
            dataKey: 'label',
            data: mainColumns,
            direction: 'horizontal',
            sizeField: 'width',
            offset: offsetX,
            viewportSize: layoutSize.viewportWidth - leftFixedColumnWidth - rightFixedColumnWidth,
          },
          scopedSlots: {
            default: this.renderTableCell,
          },
        }),
        rightFixedColumns.map((column) => this.renderTableCell({ data: column })),
      ])
    );
  },
};
