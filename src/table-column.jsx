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
    draggable: {
      type: Boolean,
      default: false,
    },
    resizeable: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [Number, String],
    },
    label: {
      type: String,
      require: true,
    },
    prop: {
      type: String,
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
  mounted() {
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
    this.column = {
      width: widthValue,
      hasWidth: !!widthValue,
      label,
      sortable,
      comparator,
      columnRender,
      prop,
      fixed: fixed === true ? 'left' : fixed,
    };

    this.tableColumnIndex = this.getColumnIndex();
    this.tableStore.__tableColumns.addTableColumn(this.column, this.tableColumnIndex);
    this.mayUpdateLayout();
  },
  beforeDestroy() {
    this.tableStore.__tableColumns.removeTableColumn(this.column);
    this.mayUpdateLayout();
  },
  methods: {
    getColumnIndex() {
      return [].indexOf.call(this.$parent.$refs.columnsDef.children, this.$el);
    },
    mayUpdateLayout() {
      if (!this.$parent.initial) {
        this.$parent.doLayout();
      }
    },
  },
  render(h) {
    return h('div');
  },
};
