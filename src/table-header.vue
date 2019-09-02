<template>
  <div class="infinite-table__table-header" :style="{height: headerHeight}">
    <div
      v-for="column of tableStore.tableColumns"
      :key="column.label"
      class="infinite-table__cell"
      :class="{ 'infinite-table__cell--pointer': column.sortable }"
      :style="{ width: `${column.width}px` }"
      @click="handleColumnSort(column)"
    >
      {{column.label}}
      <div
        v-if="column.sortable"
        class="infinite-table__table-header__sortable"
      >
        <div
          class="infinite-table__sortable ascending"
          :class="{active: sortedColumn.column === column && sortedColumn.order ==='asc'}"
          @click.stop="handleColumnSort(column, 'asc')"
        ></div>
        <div
          class="infinite-table__sortable descending"
          :class="{active: sortedColumn.column === column && sortedColumn.order ==='desc'}"
          @click.stop="handleColumnSort(column, 'desc')"
        ></div>
      </div>
    </div>
  </div>

</template>
<script>
export default {
  name: 'table-header',
  inject: ['tableStore'],
  props: {
    headerHeight: {
      type: String,
      required: true,
    },
  },
  computed: {
    sortedColumn() {
      const { column, order } = this.tableStore.sortedOption;
      return { column, order };
    },
  },
  methods: {
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
