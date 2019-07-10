<template>
  <div class="infinite-table__table-header" :style="{height: headerHeight}">
    <table-cell
      v-for="column of tableStore.tableColumns"
      :width="column.width"
      :height="headerHeight"
      :key="column.label"
    >
      {{column.label}}
    </table-cell>
  </div>

</template>
<script>
import TableCell from './table-cell.vue';

export default {
  name: 'table-header',
  inject: ['tableStore'],
  props: {
    headerHeight: {
      type: String,
      required: true,
    },
  },
  components: {
    TableCell,
  },
};
</script>
