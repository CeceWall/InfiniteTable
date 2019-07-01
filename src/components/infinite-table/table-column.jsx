const defaultColumnRender = function defaultColumnRender(props) {
  const { options, row } = props;
  const { label } = options;
  return row[label];
};
const getColumnRenderFunc = function (render) {
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
    const { store } = this.parent;
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

    const options = {
      width: parseFloat(width),
      label,
      sortable,
      comparator,
      columnRender,
    };
    store.addColumn(index, options);
  },
  render() {
    return null;
  },
};
