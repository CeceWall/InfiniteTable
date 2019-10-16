import defaults from 'defaults';
import { px2num } from '@/utils/layout';
import { get } from '@/utils/object';

/**
 * 默认的列渲染方法
 * 返回row中[prop]字段中的数据
 * prop可以使用a.b.c等复杂方式表示
 *
 * @param {{options: Object, row: Object}} props 渲染列时的对象
 * @return {string}
 */
export const defaultColumnRender = function defaultColumnRender(props) {
  if (!props || !props.options || !props.row) {
    return '';
  }
  const { options, row } = props;
  const { prop } = options;
  if (prop) {
    return get(row, prop);
  }
  return '';
};

const getColumnRenderFunc = function getColumnRenderFunc(render) {
  return (props) => render(props);
};

/**
 * 创建TableColumnItem的选项
 *
 * @typedef {Object} TableColumnItemOptions
 * @property {string} label
 * @property {string} width
 * @property {boolean} sortable
 * @property {string} prop
 * @property {boolean} fixed
 * @property {function} render
 * @property {function} comparator
 *
 */
export default class TableColumnItem {
  /**
   * @param {TableColumnItemOptions} options
   */
  constructor(options) {
    const defaultOptions = {
      width: null,
      label: '',
      sortable: false,
      comparator: null,
      prop: '',
      sortBy: '',
      fixed: false,
    };
    const o = defaults(options, defaultOptions);
    if (!o.label) {
      throw new Error('[TableColumnItem]: Column中必须包含唯一的label字段');
    }
    if (o.render) {
      if (o.sortable && !o.sortBy) {
        console.error('[TableColumnItem]: 使用render函数时排序需要设置sortBy字段');
      }
      this.sortBy = o.sortBy;
      this.columnRender = getColumnRenderFunc(o.render);
    } else {
      this.sortBy = o.sortBy || o.prop;
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
