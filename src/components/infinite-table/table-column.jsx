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
  inject: ['tableColumns'],
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
    this.tableColumns[index] = {
      width: widthValue,
      label,
      sortable,
      comparator,
      columnRender,
    };
  },
  render() {
    return null;
  },
};
