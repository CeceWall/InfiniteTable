<template>
  <div
    class="infinite-table__table-header"
    :style="{height: `${headerHeight}px`}"
  >
    <div
      v-for="(column,columnIndex) of tableColumns.columns"
      :key="column.label"
      class="infinite-table__cell"
      :class="{
        ...getTableCellClass(column, columnIndex),
      }"
      :style="{
        width: `${column.width}px`,
        ...getFixedStyle(column),
      }"
      :draggable="tableOptions.headerOrderDraggable"
      @click="handleColumnSort(column)"
      @mouseenter="handleMouseEnter(columnIndex, $event)"
      @mouseleave="handleMouseLeave(columnIndex, $event)"
      @mousemove="handleMouseMove(columnIndex, $event)"
      @mousedown.capture="handleMouseDown(columnIndex, $event)"
      @dragstart="handleHeaderDragStart(columnIndex, $event)"
      @dragover="handleHeaderDragOver(columnIndex, $event)"
      @dragend="handleHeaderDragEnd(columnIndex, $event)"
      @drop="handleHeaderDrop(columnIndex, $event)"
    >
      <div class="cell-content">
        {{ column.label }}
        <div
          v-if="column.sortable"
          class="infinite-table__table-header__sortable"
        >
          <div
            class="infinite-table__sortable ascending"
            :class="{active: getActiveClass(column, 'asc')}"
            @click.stop="handleColumnSort(column, 'asc')"
          />
          <div
            class="infinite-table__sortable descending"
            :class="{active: getActiveClass(column, 'desc')}"
            @click.stop="handleColumnSort(column, 'desc')"
          />
        </div>
      </div>
    </div>
    <div
      v-if="resizeIndicator.visible"
      ref="resizeIndicator"
      class="infinite-table__resize-indicator"
      :style="{left: `${resizeIndicator.left}px`}"
    />
  </div>
</template>
<script>
import { getElementOffset } from '@/utils/layout';

const HEADER_DRAG_DATA_TYPE = 'headerColumnIndex'.toLowerCase();

export default {
  name: 'TableHeader',
  inject: ['tableStore', 'tableOptions', 'emitter'],
  props: {
    // 表头的高度，数字
    headerHeight: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      mouseEnterIndex: -1,
      resizeIndicator: {
        activeIndex: -1,
        startX: 0,
        hover: false,
        visible: false,
        left: -9999,
      },
    };
  },
  computed: {
    tableColumns() {
      return this.tableStore.tableColumns;
    },
    sortedColumn() {
      return this.tableStore.dataStore.sortedOption;
    },
  },
  beforeDestroy() {
    document.body.style.cursor = 'initial';
  },
  methods: {
    getTableCellClass(column, columnIndex) {
      const { resizeIndicator, mouseEnterIndex } = this;
      const isCurrentIndex = mouseEnterIndex === columnIndex || mouseEnterIndex - 1 === columnIndex;
      return {
        'infinite-table__cell--fixed': column.fixed,
        'infinite-table__cell--pointer': column.sortable && !resizeIndicator.hover,
        'infinite-table__cell--resizeable': resizeIndicator.hover && isCurrentIndex,
        hover: !resizeIndicator.visible && isCurrentIndex,
      };
    },
    handleMouseEnter(columnIndex) {
      this.mouseEnterIndex = columnIndex;
    },
    handleMouseLeave() {
      this.mouseEnterIndex = -1;
    },
    /**
     * 鼠标在单元格上按下时触发这个方法
     * @param columnIndex
     * @param event
     */
    handleMouseDown(columnIndex, event) {
      const { headerResizable } = this.tableOptions;
      // 如果鼠标按下时，鼠标在可以resize的区域内
      if (headerResizable && this.resizeIndicator.hover) {
        this.resizeIndicator.visible = true;
        this.setResizeIndicatorPosition(event);
        this.resizeIndicator.startX = event.pageX;
        document.body.addEventListener('mousemove', this.handleResizeIndicatorMove);
        document.body.addEventListener('mouseup', this.handleResizeIndicatorMouseUp);
        // 处于resize状态时，禁用单击事件
        document.body.addEventListener('click', this.stopPropagationClickEvent, true);
      }
    },
    stopPropagationClickEvent(event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
    },
    handleResizeIndicatorMouseUp(event) {
      if (this.tableOptions.headerResizable) {
        if (this.resizeIndicator.visible) {
          const { activeIndex, startX } = this.resizeIndicator;
          const { pageX } = event;
          const activeColumn = this.tableStore.tableColumns.columns[activeIndex];
          let delta = pageX - startX;
          if (activeColumn.width + delta < 80) {
            delta = 80 - activeColumn.width;
          }
          this.emitter.dispatch('column-resize', activeIndex, activeColumn, delta);
        }
        this.resizeIndicator.visible = false;
        document.body.removeEventListener('mousemove', this.handleResizeIndicatorMove);
        document.body.removeEventListener('mousemove', this.handleResizeIndicatorMouseUp);
        setTimeout(() => {
          document.body.removeEventListener('click', this.stopPropagationClickEvent, true);
        });
      }
    },
    getParentScrollLeft() {
      const { scrollElement } = this.$parent.$refs;
      if (scrollElement) {
        return scrollElement.scrollLeft;
      }
      return 0;
    },
    handleMouseMove(columnIndex, event) {
      if (this.tableOptions.headerResizable && !this.resizeIndicator.visible) {
        const { currentTarget, pageX } = event;
        const { left } = getElementOffset(event.currentTarget);
        const right = left + event.currentTarget.offsetWidth;
        // 判断是否靠近右侧边缘或者 靠近左侧边缘且不是第一个
        if (right - pageX < 8 || (pageX - left < 8 && columnIndex > 0)) {
          currentTarget.draggable = false;
          this.resizeIndicator.hover = true;
          const activeIndex = right - pageX < 8 ? this.mouseEnterIndex : this.mouseEnterIndex - 1;
          this.resizeIndicator.activeIndex = activeIndex;
        } else {
          currentTarget.draggable = true;
          this.resizeIndicator.hover = false;
        }
      }
    },
    setResizeIndicatorPosition(event) {
      const { left } = getElementOffset(this.$parent.$el);
      this.resizeIndicator.left = this.getParentScrollLeft() + event.pageX - left;
    },
    handleResizeIndicatorMove(event) {
      this.setResizeIndicatorPosition(event);
    },
    handleHeaderDragStart(columnIndex, event) {
      event.dataTransfer.setData(HEADER_DRAG_DATA_TYPE, columnIndex);
    },
    handleHeaderDragOver(columnIndex, event) {
      const index = [].indexOf.call(event.dataTransfer.types, HEADER_DRAG_DATA_TYPE);
      if (index !== -1) {
        event.preventDefault();
      }
    },
    handleHeaderDragEnd() {
    },
    handleHeaderDrop(dropIndex, event) {
      const dragIndex = parseInt(event.dataTransfer.getData(HEADER_DRAG_DATA_TYPE), 10);
      if (typeof dragIndex === 'number' && dragIndex >= 0) {
        const dragItem = this.tableColumns.columns[dragIndex];
        const dropItem = this.tableColumns.columns[dropIndex];
        this.emitter.dispatch('header-drop', dragIndex, dragItem, dropIndex, dropItem);
      }
    },
    getFixedStyle(column) {
      return this.tableStore.tableColumns.getFixedColumnStyle(column);
    },
    getActiveClass(column, order) {
      if (!this.sortedColumn.column) {
        return false;
      }
      return this.tableStore.isSameColumn(column, this.sortedColumn.column)
        && this.sortedColumn.order === order;
    },
    handleColumnSort(column, order) {
      // 如果column可以排序，并且TableHeader不处于resize模式中，就设置sortOption
      if (column.sortable) {
        // 排序的逻辑在tableStore中
        this.tableStore.dataStore.sortedOption = {
          column, order,
        };
      }
    },
  },
};
</script>
