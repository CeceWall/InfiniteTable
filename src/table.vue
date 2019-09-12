<template>
  <div
    ref="table"
    class="infinite-table"
    :style="{height: tableHeight}"
    tabindex="0"
    @keydown="handleKeyEvent($event, 'DOWN')"
    @keyup="handleKeyEvent($event, 'UP')"
    @click.capture="focus"
  >
    <div
      v-if="tableColumns.length === 0"
      ref="columnsDef"
      class="infinite-table__columns-define"
    >
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
import ResizeObserver from 'resize-observer-polyfill';
import debounce from 'lodash/debounce';
import TableHeader from './table-header.vue';
import TableBody from './table-body.vue';
import TableStore from './table-store';
import { getTableBodyHeight, doColumnWidthLayout } from './table-layout';
import {
  getScrollWidth, num2px, getClientSize, px2num,
} from './utils/layout';
import EventEmitter from './event-emitter';
import './styles/main.scss';
import TableColumnItem from '@/store/table-column-item';

const KeyStatus = {
  UP: 'UP',
  DOWN: 'DOWN',
};

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
      default: '100%',
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
    multipleSelection: {
      type: Boolean,
      default: false,
    },
    highlightCurrentCell: {
      type: Boolean,
      default: false,
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
    headerResizable: {
      type: Boolean,
      default: false,
    },
    /**
     * 标明表头的顺序是否可以通过拖拽改变
     */
    headerOrderDraggable: {
      type: Boolean,
      default: false,
    },
    /**
     * 标明行是否可以拖拽
     */
    rowDraggable: {
      type: Boolean,
      default: false,
    },
    tableColumns: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    const tableStore = new TableStore({
      context: this,
      data: this.data,
      layoutSize: {
        viewportWidth: 0,
        viewportHeight: 0,
        allColumnsWidth: 0,
      },
    });
    return {
      composeKey: {
        shift: false,
        control: false,
      },
      tableStore,
    };
  },
  computed: {
    tableOptions() {
      return {
        rowExtraAttrs: this.rowExtraAttrs,
        headerHeight: this.headerHeight,
        striped: this.striped,
        rowKey: this.rowKey,
        rowHeight: px2num(this.rowHeight),
        headerResizable: this.headerResizable,
        rowDraggable: this.rowDraggable,
        headerOrderDraggable: this.headerOrderDraggable,
        highlightCurrentCell: this.highlightCurrentCell,
        multipleSelection: this.multipleSelection,
      };
    },
    tableHeight() {
      // FIXME: 默认高度分配目前有问题，当有横向滚动条时，长度计算错误
      let height;
      if (this.height) {
        height = this.height;
      } else if (this.data.length > 0) {
        height = (this.tableOptions.rowHeight * this.data.length) + this.headerHeight;
      } else {
        height = 250;
      }
      return num2px(height);
    },
    tableHeaderHeight() {
      return num2px(this.headerHeight);
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
      tableOptions: this.tableOptions,
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
    tableColumns: {
      immediate: true,
      handler() {
        this.tableStore.__tableColumns.clear();
        this.tableColumns.map((column) => new TableColumnItem({ ...column }))
          .forEach((columnOption) => {
            this.tableStore.__tableColumns.addTableColumn(columnOption);
          });
      },
    },
    tableOptions: {
      deep: true,
      handler() {
        this.doLayout();
      },
    },
    'tableStore.__tableColumns.allTableColumns': {
      handler() {
        this.$nextTick(() => {
          this.doLayout();
        });
      },
    },
  },
  created() {
    this.doLayout = debounce(this.doLayout, 100);
    this.$on('row-click', (row) => {
      this.selectRow(row);
    });
    this.$on('cell-click', (rowItem, columnOption) => {
      this.tableStore.tableSelection.selectedColumn = columnOption;
    });
  },
  mounted() {
    this.resizeObserver = new ResizeObserver(() => {
      this.doLayout();
    });
    this.resizeObserver.observe(this.$refs.table);
    this.doLayout();
  },
  beforeDestroy() {
    this.resizeObserver.disconnect();
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


      // 避免doLayout时又改变了tableColumns导致循环调用
      if (this.tableColumns.length || allColumnsWidth !== this.lastAllColumnsWidth) {
        this.tableStore.tableColumns = calculatedColumns;
      }
      this.lastAllColumnsWidth = allColumnsWidth;

      this.tableStore.layoutSize = {
        rowHeight: px2num(this.rowHeight),
        viewportWidth,
        viewportHeight,
        allColumnsWidth,
      };
    },
    selectRow(row) {
      const { tableSelection } = this.tableStore;
      tableSelection.focusedRow = row;
      const multiple = this.composeKey.control && this.tableOptions.multipleSelection;
      tableSelection.addSelectedRows(row, multiple);
      this.$emit('current-change', tableSelection.selectedRows);
    },
    handleChangeSelect(event, keyStatus = KeyStatus.UP) {
      if (keyStatus === KeyStatus.DOWN) {
        const match = /Arrow(Up|Down|Left|Right)/i.exec(event.key);
        if (match) {
          const direction = match[1].toLowerCase();
          this.move(direction);
        }
      }
    },
    handleComposeKeyEvent(event, keyStatus) {
      this.$set(this.composeKey, event.key.toLowerCase(), keyStatus === KeyStatus.DOWN);
    },
    handleDispatchKeyEvent(event, keyStatus) {
      const { focusedRow, selectedColumn } = this.tableStore.tableSelection;
      this.$emit(`key-${keyStatus.toLowerCase()}`, focusedRow, selectedColumn, event);
    },
    handleKeyEvent(event, keyStatus) {
      const { key } = event;
      const eventDispatcher = [
        {
          rule: /^Arrow(Down|Up|Left|Right)/i,
          method: this.handleChangeSelect,
        },
        {
          rule: /(Control|Shift)/i,
          method: this.handleComposeKeyEvent,
        },
        {
          rule: /(.*)/i,
          method: this.handleDispatchKeyEvent,
        },
      ];
      for (let i = 0; i < eventDispatcher.length; i += 1) {
        const dispatchItem = eventDispatcher[i];
        if (dispatchItem.rule.test(key)) {
          dispatchItem.method.call(this, event, keyStatus);
          break;
        }
      }
    },
    move(direction) {
      // TODO: 元素不可见时，自动滚动列表
      const { tableColumns } = this.tableStore;
      const { focusedRow, selectedColumn } = this.tableStore.tableSelection;
      const { data } = this.tableStore;
      let index = data.indexOf(focusedRow);
      let columnIndex = tableColumns.findIndex((item) => item.label === selectedColumn.label);
      if (index === -1) {
        index = 0;
      }
      if (columnIndex === -1) {
        columnIndex = 0;
      }
      let row;
      switch (direction) {
        case 'up':
          index = index === 0 ? 0 : index - 1;
          row = this.tableStore.data[index];
          this.selectRow(row);
          break;
        case 'down':
          index = index === data.length - 1 ? data.length : index + 1;
          row = this.tableStore.data[index];
          this.selectRow(row);
          break;
        case 'left':
          columnIndex = columnIndex === 0 ? 0 : columnIndex - 1;
          this.tableStore.tableSelection.selectedColumn = this.tableStore.tableColumns[columnIndex];
          break;
        case 'right':
          if (columnIndex === tableColumns.length - 1) {
            columnIndex = tableColumns.length - 1;
          } else {
            columnIndex += 1;
          }
          this.tableStore.tableSelection.selectedColumn = this.tableStore.tableColumns[columnIndex];
          break;
        default:
          break;
      }
    },
    focus() {
      this.$refs.table.focus();
    },
  },
};
</script>
