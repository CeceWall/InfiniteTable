const defaultColumnRender = function defaultColumnRender(props) {
  const { options, row } = props;
  const { label } = options;
  return row[label];
};
const getColumnRenderFunc = function getColumnRenderFunc(render) {
  return props => render(props);
};

export default {
  name: 'infinite-table-column',
  props: {
    sortable: {
      type: Boolean,
      default: false,
    },
    comparator: {
      type: Function,
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
    const index = this.parent.getColumnIndex(this);

    const {
      width, label, sortable, comparator,
    } = this;

    const scopedSlot = this.$scopedSlots.default;
    let columnRender;
    if (scopedSlot) {
      columnRender = getColumnRenderFunc(scopedSlot);
    } else {
      columnRender = getColumnRenderFunc(defaultColumnRender);
    }

    const widthValue = Number.isNaN(parseFloat(width)) ? null : parseFloat(width);
    const column = {
      width: widthValue,
      label,
      sortable,
      comparator,
      columnRender,
    };
    this.tableColumnIndex = index;
    this.parent.addTableColumn(index, column);
  },
  beforeDestroy() {
    this.parent.removeTableColumn(this.tableColumnIndex);
  },
  render() {
    return null;
  },
};
