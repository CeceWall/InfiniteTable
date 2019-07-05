<template>
  <div class="infinite-table">
    <div class="infinite-table__columns-define">
      <slot></slot>
    </div>
    <div ref="header" class="infinite-table__header__wrapper" :style="{width: layoutSize.containerWidth}">
      <table-header />
    </div>
    <table-body :data="data" v-if="layoutFinished" :style="{width: layoutSize.containerWidth,height: tableViewportHeight}" />
  </div>
</template>

<script>
import TableHeader from './table-header';
import TableBody from './table-body.vue';
import { getContentSize, getTableBodyHeight, doColumnWidthLayout } from './table-layout';
import { getScrollWidth } from './utils';

export default {
  name: 'InfiniteTable',
  components: {
    TableBody,
    TableHeader,
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    rowHeight: {
      type: [Number, String],
      default: 48,
    },
    rowKey: {
      type: String,
    },
  },
  computed: {
    tableViewportHeight() {
      return `calc(100% - ${this.layoutSize.tableHeaderHeight}px)`;
    },
  },
  // TODO 不使用inject传递
  provide() {
    return {
      layoutSize: this.layoutSize,
      tableColumns: this.tableColumns,
    };
  },
  data() {
    return {
      layoutFinished: false,
      tableColumns: [],
      layoutSize: {
        // 每行的行高
        rowHeight: this.rowHeight,
        // 最外层容器宽度
        containerWidth: 0,
        // 最外层容器高度
        containerHeight: 0,
        // 内层table的宽度, 应当减去横向滚动条
        tableWidth: 0,
        // 内层table header高度
        // FIXME 更换获取header高度的方式
        tableHeaderHeight: 48,
        // table可视区域的高度
        tableViewportHeight: 0,
      },
    };
  },
  mounted() {
    this.doLayout();
  },
  watch: {
    data: {
      handler() {
        this.doLayout();
      },
    },
  },
  methods: {
    doLayout() {
      const containerSize = getContentSize(this.$el);
      // TODO 解决动态获取header height的问题
      const { tableHeaderHeight } = this.layoutSize;
      // TODO 不使用inject传递
      let tableWidth = containerSize.width;
      // 如果有纵向滚动条，那么内部table的宽度应该减去纵向滚动条的宽度
      const hasVerticalScroller = containerSize.height - tableHeaderHeight < getTableBodyHeight(this.rowHeight, this.data.length);
      if (hasVerticalScroller) {
        tableWidth -= getScrollWidth();
      }
      const calculatedColumns = doColumnWidthLayout(tableWidth, this.tableColumns);
      const totalColumnWidth = calculatedColumns.reduce((sum, column) => sum + column.width, 0);
      const hasHorizontalScroller = totalColumnWidth > containerSize.width;
      this.updateInject(this.tableColumns, calculatedColumns);
      this.updateInject(this.layoutSize, {
        ...this.layoutSize,
        containerWidth: containerSize.width,
        containerHeight: containerSize.height,
        tableWidth,
        tableViewportHeight: containerSize.height - tableHeaderHeight - (hasHorizontalScroller ? getScrollWidth() : 0),
      });
      this.layoutFinished = true;
    },
    getColumnIndex(column) {
      return this.$children.indexOf(column);
    },
    // TODO 不使用inject传递
    updateInject(val, newVal) {
      if (!val) return;
      if (Array.isArray(val)) {
        val.splice(0, val.length);
        val.push(...newVal);
      } else {
        Object.keys(val)
          .forEach((key) => {
            this.$set(val, key, newVal[key]);
          });
      }
    },
  },
};
</script>
