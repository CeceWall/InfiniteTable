import RangeRender from './render/range-render.vue';

export default {
  name: 'table-row',
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
    handleRowClick() {
      this.emitter.dispatch('row-click', this.data);
    },
  },
  render(h) {
    const { data } = this;
    const { tableColumns, tableOptions, layoutSize } = this.tableStore;
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
        h('range-render', {
          props: {
            dataKey: 'label',
            data: tableColumns,
            direction: 'horizontal',
            sizeField: 'width',
            offset: offsetX,
            viewportSize: layoutSize.viewportWidth,
            startIndex: this.startIndex,
            endIndex: this.endIndex,
          },
          scopedSlots: {
            default: (props) => {
              const { data: columnOption } = props;
              const { columnRender } = columnOption;
              return (
                <div
                  class="infinite-table__cell infinite-table__cell--ellipsis"
                  style={{
                    width: `${columnOption.width}px`,
                    height: `${tableOptions.rowHeight}px`,
                  }}
                >
                  <div class="cell-content">
                    {columnRender({ row: data, options: columnOption })}
                  </div>
                </div>
              );
            },
          },
        }),
      ])
    );
  },
};
