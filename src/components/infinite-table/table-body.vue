<template>
  <div ref="body" class="infinite-table__body__wrapper">
    <table class="infinite-table__body">
      <colgroup>
        <col
          v-for="(column, columnIndex) of tableColumns"
          :key="columnIndex"
          :width="column.width"
        />
      </colgroup>
      <recycle-render
        :instance="this"
        :render="tableRow"
        :data="data"
        :scroll-element="() => this.$refs.body"
        :render-props="{
          tableColumns,
          layoutSize,
         }"
      >
        <tbody></tbody>
      </recycle-render>
    </table>
  </div>
</template>

<script>
import TableRow from './table-row';
import RecycleRender from './render/recycle-render.vue';

export default {
  name: 'table-body',
  components: {
    RecycleRender,
  },
  inject: ['tableColumns', 'layoutSize'],
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      viewportHeight: 0,
      tableRow: TableRow,
    };
  },
};
</script>
