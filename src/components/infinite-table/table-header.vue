<template>
  <div class="infinite-table__table-header">
    <table-cell
      v-for="column of tableColumns" :height="headerHeight" :width="column.width"
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
  props: {
    headerHeight: {
      type: String,
      required: true,
    },
    tableColumns: {
      type: Array,
      required: true,
    },
  },
  components: {
    TableCell,
  },
};
</script>
