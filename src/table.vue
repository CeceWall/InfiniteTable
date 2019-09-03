<template>
  <div
    class="infinite-table"
    :style="{height: tableHeight}"
    :class="tableClass"
  >
    <div class="infinite-table__columns-define">
      <slot />
    </div>
    <div class="infinite-table--scrollable">
      <table-header
        :header-height="tableHeaderHeight"
        :style="{width: `${tableStore.layoutSize.allColumnsWidth}px`}"
        :class="tableHeaderClass"
      />
      <table-body />
    </div>
  </div>
</template>

<script>
import TableHeader from './table-header.vue';
import TableBody from './table-body.vue';
import TableStore from './table-store';
import { getTableBodyHeight, doColumnWidthLayout } from './table-layout';
import {
  getScrollWidth, num2px, getClientSize, px2num,
} from './utils/layout';
import EventEmitter from './event-emitter';
import { getTableId } from './utils/table';
import './styles/main.scss';

export default {
  name: 'InfiniteTable',
  components: {
    TableBody,
    TableHeader,
  },
  props: {
    /**
     * 列表的数据内容
     */
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    /**
     * table的高度，可以使用任意合法的css
     */
    height: {
      type: [Number, String],
    },
    /**
     * 表头的高度
     */
    headerHeight: {
      type: [Number, String],
      default: 48,
    },
    /**
     * 每行数据的高度
     */
    rowHeight: {
      type: [Number, String],
      default: 48,
    },
    rowKey: {
      type: String,
      required: true,
    },
    /**
     * 是否采用明暗间隔的行
     */
    striped: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否高亮选中的行
     */
    highlightCurrentRow: {
      type: Boolean,
      default: true,
    },
    /**
     * 渲染行时，额外添加的class名
     */
    rowExtraAttrs: {
      type: [Object, Function],
      default() {
        return {};
      },
    },
  },
  data() {
    const tableId = getTableId();
    const tableOptions = {
      highlightRow: this.highlightRow,
      height: this.height,
      rowExtraAttrs: this.rowExtraAttrs,
      headerHeight: this.headerHeight,
      striped: this.striped,
      rowKey: this.rowKey,
      rowHeight: px2num(this.rowHeight),
    };
    const tableStore = new TableStore({
      data: this.data,
      tableId,
      tableOptions,
      layoutSize: {
        rowHeight: tableOptions.rowHeight,
        viewportWidth: 0,
        viewportHeight: 0,
        allColumnsWidth: 0,
      },
    });
    const rowHeight = px2num(this.rowHeight);
    return {
      tableId,
      tableStore,
      layoutSize: {
        // 每行的行高
        rowHeight,
        viewportWidth: 0,
        viewportHeight: 0,
        allColumnsWidth: 0,
      },
    };
  },
  computed: {
    tableHeight() {
      return num2px(this.height);
    },
    tableHeaderHeight() {
      return num2px(this.headerHeight);
    },
    tableClass() {
      return {
        'infinite-table--scrollable': this.tableHeight,
      };
    },
    tableHeaderClass() {
      return {
        'infinite-table__table-header--sticky': this.tableHeight,
      };
    },
  },
  provide() {
    return {
      tableStore: this.tableStore,
      emitter: new EventEmitter(this),
    };
  },
  watch: {
    // TODO 仅在resize或数据量变化导致滚动条出现变化时才计算layout
    // FIXME 数据项更新后自动更新render
    data: {
      handler(newData) {
        this.tableStore.data = newData;
        this.doLayout();
      },
    },
    highlightRow(newVal) {
      this.tableStore.tableOptions.highlightRow = newVal;
    },
  },
  created() {
    this.$on('row-click', (row) => {
      if (!this.tableStore.selectedRow || this.tableStore.selectedRow[this.rowKey] !== row[this.rowKey]) {
        this.$emit('current-change', row, this.tableStore.selectedRow);
        this.tableStore.selectedRow = row;
      }
    });
  },
  mounted() {
    this.doLayout();
  },
  methods: {
    doLayout() {
      // FIXME 修复列不如容器宽时，出现横向滚动条的问题
      // 获取容器的clientHeight和clientWidth
      const containerSize = getClientSize(this.$el);
      const tableHeaderHeight = parseFloat(this.headerHeight);
      let viewportWidth = containerSize.width;
      const tableBodyHeight = getTableBodyHeight(this.rowHeight, this.data.length);
      // 如果container的高度不为0（为0代表未使用css设置高度）而且container的高度小于TableBody的高度,说明需要有纵向滚动条
      // 如果有纵向滚动条，那么内部table的宽度应该减去纵向滚动条的宽度
      const hasVerticalScroller = containerSize.height > 0 && (containerSize.height - tableHeaderHeight < tableBodyHeight);
      if (hasVerticalScroller) {
        viewportWidth -= getScrollWidth();
      }
      // 使用viewportWidth，计算columns的宽度
      // 如果所有column都设置了宽度，那么总宽度是每个column宽度的累加
      // 如果存在没设置宽度的column，那么先用默认的column宽度计算column的总宽度
      // 若总宽度小于viewport的宽度，将总宽度减去已设置的宽度，未设置宽度的column均分剩余的宽度。
      // 否则，未设置宽度的column设置为默认宽度
      const calculatedColumns = doColumnWidthLayout(viewportWidth, this.tableStore.tableColumns);
      const allColumnsWidth = calculatedColumns.reduce((sum, column) => sum + column.width, 0);
      const hasHorizontalScroller = allColumnsWidth > viewportWidth;
      let viewportHeight = containerSize.height - tableHeaderHeight;
      if (hasHorizontalScroller) {
        viewportHeight -= getScrollWidth();
      }
      this.tableStore.tableColumns = calculatedColumns;

      this.tableStore.layoutSize = {
        rowHeight: px2num(this.rowHeight),
        viewportWidth,
        viewportHeight,
        allColumnsWidth,
      };
    },
    getColumnIndex(column) {
      return this.$children.indexOf(column);
    },
    addTableColumn(index, column) {
      this.tableStore.__tableColumns.addTableColumn(column);
    },
    removeTableColumn(index, column) {
      this.tableStore.__tableColumns.removeTableColumn(column);
    },
    selectRow(row) {
      this.tableStore.selectedRow = row;
    },
    handleDispatchEvent(component, type, e) {
      this.$emit(`${component}-row-${type}`, {
        event: e,
        column: this.tableStore.selectedColumn,
        row: this.tableStore.selectedRow,
      });
    },
  },
};
</script>
