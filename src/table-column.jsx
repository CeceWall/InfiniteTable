const defaultColumnRender = function defaultColumnRender(props) {
  const { options, row } = props;
  const { prop } = options;
  if (prop) {
    return row[prop];
  }
  return '';
};

const getColumnRenderFunc = function getColumnRenderFunc(render) {
  return (props) => render(props);
};

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
      default: null,
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
  },
  data() {
    return {
      columnWidth: this.width,
    };
  },
  computed: {
    parent() {
      return this.$parent;
    },
  },
  watch: {
    width() {
      const column = this.generateColumnOption();
      this.tableStore.__tableColumns.replaceTableColumn(this.column, column);
      this.column = column;
    },
  },
  mounted() {
    this.column = this.generateColumnOption();
    this.tableColumnIndex = this.getColumnIndex();
    this.tableStore.__tableColumns.addTableColumn(this.column, this.tableColumnIndex);
  },
  beforeDestroy() {
    this.tableStore.__tableColumns.removeTableColumn(this.column);
  },
  methods: {
    getColumnIndex() {
      return [].indexOf.call(this.$parent.$refs.columnsDef.children, this.$el);
    },
    generateColumnOption() {
      const {
        width, label, sortable, comparator,
        prop, fixed,
      } = this;

      const scopedSlot = this.$scopedSlots.default;
      if (!scopedSlot && !prop) {
        console.error('table-column: prop和slot-scope必须存在一个');
      }
      let columnRender;
      if (scopedSlot) {
        columnRender = getColumnRenderFunc(scopedSlot);
      } else {
        columnRender = getColumnRenderFunc(defaultColumnRender);
      }

      const widthValue = Number.isNaN(parseFloat(width)) ? null : parseFloat(width);
      return {
        width: widthValue,
        hasWidth: !!widthValue,
        label,
        sortable,
        comparator,
        columnRender,
        prop,
        fixed: fixed === true ? 'left' : fixed,
      };
    },
  },
  render(h) {
    return h('div');
  },
};
