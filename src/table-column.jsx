import TableColumnItem from '@/store/table-column-item';

export default {
  name: 'InfiniteTableColumn',
  inject: ['tableStore'],
  props: {
    sortable: {
      type: Boolean,
      default: false,
    },
    comparator: {
      type: Function,
      default: undefined,
    },
    width: {
      type: [Number, String],
      default: 0,
    },
    label: {
      type: String,
      required: true,
    },
    prop: {
      type: String,
      default: '',
    },
    fixed: {
      type: [String, Boolean],
      default: false,
    },
    sortBy: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      columnWidth: this.width,
    };
  },
  watch: {
    width() {
      const column = this.generateColumnOption();
      this.tableStore.tableColumns.replaceTableColumn(this.column, column);
      this.column = column;
    },
  },
  mounted() {
    this.column = this.generateColumnOption();
    this.tableColumnIndex = this.getColumnIndex();
    this.tableStore.tableColumns.addTableColumn(this.column, this.tableColumnIndex);
  },
  beforeDestroy() {
    this.tableStore.tableColumns.removeTableColumn(this.column);
  },
  methods: {
    getColumnIndex() {
      return [].indexOf.call(this.$parent.$refs.columnsDef.children, this.$el);
    },
    generateColumnOption() {
      const {
        width, label, sortable, comparator,
        prop, fixed, sortBy,
      } = this;

      const scopedSlot = this.$scopedSlots.default;
      if (!scopedSlot && !prop) {
        throw new Error('[table-column]: prop和slot-scope必须存在一个');
      }
      return new TableColumnItem({
        width,
        label,
        sortBy,
        sortable,
        comparator,
        prop,
        render: scopedSlot,
        fixed,
      });
    },
  },
  render(h) {
    return h('div');
  },
};
