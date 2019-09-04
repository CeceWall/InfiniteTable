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
  inject: ['tableStore'],
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
