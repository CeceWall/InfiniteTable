<template>
  <div class="infinite-table" :style="{height: tableHeight}" :class="tableClass">
    <div class="infinite-table__columns-define">
      <slot></slot>
    </div>
    <table-header
      :table-columns="tableColumns" :header-height="tableHeaderHeight"
      :style="{width: `${layoutSize.allColumnsWidth}px`}"
      :class="tableHeaderClass"
    />
    <table-body
      :data="data"
      :style="{width: `${layoutSize.allColumnsWidth}px`}"
      :table-columns="tableColumns"
      :layout-size="layoutSize"
    />
  </div>
</template>

<script>
import TableHeader from './table-header.vue';
import TableBody from './table-body.vue';
import { getTableBodyHeight, doColumnWidthLayout } from './table-layout';
import { getScrollWidth, num2px, getClientSize } from './utils/layout';

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
    height: {
      type: [Number, String],
    },
    headerHeight: {
      type: [Number, String],
      default: 48,
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
        viewportWidth: 0,
        viewportHeight: 0,
        allColumnsWidth: 0,
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
      // 获取容器的clientHeight和clientWidth
      const containerSize = getClientSize(this.$el);
      const tableHeaderHeight = parseFloat(this.headerHeight);

      // TODO 不使用inject传递
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
      const calculatedColumns = doColumnWidthLayout(viewportWidth, this.tableColumns);
      const allColumnsWidth = calculatedColumns.reduce((sum, column) => sum + column.width, 0);
      const hasHorizontalScroller = allColumnsWidth > viewportWidth;
      let viewportHeight = containerSize.height - tableHeaderHeight;
      if (hasHorizontalScroller) {
        viewportHeight -= getScrollWidth();
      }
      this.tableColumns = calculatedColumns;
      this.layoutSize = {
        rowHeight: this.rowHeight,
        viewportWidth,
        viewportHeight,
        allColumnsWidth,
      };
      // this.updateInject(this.tableColumns, calculatedColumns);
      // this.updateInject(this.layoutSize, {
      //   ...this.layoutSize,
      //   containerWidth: containerSize.width,
      //   containerHeight: containerSize.height,
      //   tableWidth: viewportWidth,
      //   tableViewportHeight: containerSize.height - tableHeaderHeight - (hasHorizontalScroller ? getScrollWidth() : 0),
      // });
      // this.layoutFinished = true;
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
