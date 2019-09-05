<template>
  <div
    class="infinite-table__table-header"
    :style="{height: headerHeight}"
  >
    <div
      v-for="(column,columnIndex) of tableStore.tableColumns"
      :key="column.label"
      class="infinite-table__cell"
      :class="{
        'infinite-table__cell--pointer': column.sortable,
        'infinite-table__cell--fixed': column.fixed,
        'hover': !resizeIndicator.visible && (mouseEnterIndex === columnIndex || mouseEnterIndex - 1 ===columnIndex)
      }"
      :style="{
        width: `${column.width}px`,
        ...getFixedStyle(column),
      }"
      @click="handleColumnSort(column)"
      @mouseenter="handleMouseEnter(columnIndex, $event)"
      @mouseleave="handleMouseLeave(columnIndex, $event)"
      @mousemove="handleMouseMove"
      @mousedown="handleMouseDown(columnIndex, $event)"
    >
      <div class="cell-content">
        {{ column.label }}
      </div>
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
    <div
      v-if="resizeIndicator.visible"
      ref="resizeIndicator"
      class="infinite-table__resize-indicator"
      :style="{left: `${resizeIndicator.left}px`}"
    />
  </div>
</template>
<script>
export default {
  name: 'TableHeader',
  inject: ['tableStore', 'tableOptions', 'emitter'],
  props: {
    headerHeight: {
      type: String,
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
    sortedColumn() {
      const { column, order } = this.tableStore.sortedOption;
      return { column, order };
    },
  },
  methods: {
    handleMouseEnter(columnIndex) {
      this.mouseEnterIndex = columnIndex;
    },
    handleMouseLeave() {
      this.mouseEnterIndex = -1;
    },
    handleMouseDown(columnIndex, event) {
      const { headerResizable } = this.tableOptions;
      if (headerResizable) {
        if (this.resizeIndicator.hover) {
          this.resizeIndicator.visible = true;
          this.resizeIndicator.left = event.pageX;
          this.resizeIndicator.startX = event.pageX;
          document.body.addEventListener('mousemove', this.handleResizeIndicatorMove);
          document.body.addEventListener('mouseup', this.handleResizeIndicatorMouseUp);
        }
      }
    },
    handleResizeIndicatorMouseUp(event) {
      if (this.tableOptions.headerResizable) {
        if (this.resizeIndicator.visible) {
          const { activeIndex, startX } = this.resizeIndicator;
          const { pageX } = event;
          const activeColumn = this.tableStore.tableColumns[activeIndex];
          this.emitter.dispatch('column-resize', activeIndex, activeColumn, pageX - startX);
        }
        this.resizeIndicator.visible = false;
        document.body.removeEventListener('mousemove', this.handleResizeIndicatorMove);
        document.body.removeEventListener('mousemove', this.handleResizeIndicatorMouseUp);
      }
    },
    handleMouseMove(event) {
      const { currentTarget, pageX } = event;
      const cellRect = currentTarget.getBoundingClientRect();
      if (this.tableOptions.headerResizable) {
        if (cellRect.right - pageX < 8 || pageX - cellRect.left < 8) {
          document.body.style.cursor = 'col-resize';
          this.resizeIndicator.hover = true;
          const activeIndex = cellRect.right - pageX < 8 ? this.mouseEnterIndex : this.mouseEnterIndex - 1;
          this.resizeIndicator.activeIndex = activeIndex;
        } else {
          document.body.style.cursor = 'initial';
          this.resizeIndicator.hover = false;
        }
      }
    },
    handleResizeIndicatorMove(event) {
      this.resizeIndicator.left = event.pageX;
    },
    getFixedStyle(column) {
      // FIXME: 不直接调用__tableColumns中的方法
      return this.tableStore.__tableColumns.getFixedColumnStyle(column);
    },
    getActiveClass(column, order) {
      if (!this.sortedColumn.column) {
        return false;
      }
      return this.sortedColumn.column.label === column.label && this.sortedColumn.order === order;
    },
    handleColumnSort(column, order) {
      if (column.sortable) {
        // 排序的逻辑在tableStore中
        this.tableStore.sortedOption = {
          column,
          order,
        };
      }
    },
  },
};
</script>

<style lang="scss">
  .infinite-table__table-header__sortable {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    height: 34px;
    width: 24px;
    vertical-align: middle;
    cursor: pointer;
    overflow: initial;
    position: relative;
  }
</style>
