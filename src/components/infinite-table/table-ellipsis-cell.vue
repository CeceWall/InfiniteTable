<script lang="jsx">
import emitter from './event-emitter';

export default {
  name: 'table-ellipsis-cell',
  props: {
    layoutSize: {
      required: true,
    },
  },
  data() {
    return {
      isEllipsisVisible: false,
      columnOption: {},
      data: {},
      top: 0,
      left: 0,
    };
  },
  mounted() {
    emitter.$on('cell-display-ellipsis', this.handleDisplayCellEllipsis);
    emitter.$on('cell-hide-ellipsis', this.handleHideCellEllipsis);
  },
  methods: {
    handleDisplayCellEllipsis(evt) {
      const { data, columnOption, event } = evt;
      this.isEllipsisVisible = true;
      this.data = data;
      this.columnOption = columnOption;
      const parentRect = this.$parent.$el.getBoundingClientRect();
      const rect = event.target.getBoundingClientRect();
      this.$el.style.top = `${rect.top - parentRect.top}px`;
      this.$el.style.left = `${rect.left - parentRect.left}px`;
      // console.log(this.$el)
      // console.log('clientX', event.clientX, 'target ', event.target.getBoundingClientRect());
    },
    handleHideCellEllipsis() {
      this.isEllipsisVisible = false;
    },
  },
  render() {
    const {
      data, columnOption, isEllipsisVisible, layoutSize,
    } = this;
    const { columnRender } = columnOption;
    return (
      <div class="infinite-table__ellipsis-cell" style={{ height: `${layoutSize.rowHeight}px` }}>
        {isEllipsisVisible && columnRender({
          row: data,
          options: columnOption,
        })}
      </div>
    );
  },
};
</script>
