import { px2num } from '@/utils/layout';

function defaultComparator(a, b) {
  if (a > b) {
    return 1;
  }
  if (a === b) {
    return 0;
  }
  return -1;
}

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

export default class TableColumnItem {
  constructor(options) {
    const defaultOptions = {
      width: null,
      label: '',
      sortable: false,
      comparator: defaultComparator,
      prop: '',
      fixed: false,
    };
    const o = { ...defaultOptions, ...options };
    if (o.renderFunction) {
      this.columnRender = getColumnRenderFunc(o.renderFunction);
    } else {
      this.columnRender = getColumnRenderFunc(defaultColumnRender);
    }
    this.width = px2num(o.width);
    this.hasWidth = !!this.width;
    this.label = o.label;
    this.sortable = o.sortable;
    this.comparator = o.comparator;
    this.prop = o.prop;
    this.fixed = o.fixed === true ? 'left' : o.fixed;
  }
}
