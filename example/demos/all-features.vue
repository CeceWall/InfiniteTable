<template>
  <infinite-table
    :data="data"
    :row-height="40"
    :header-height="60"
    height="100%"
    :table-columns="tableColumns"
    striped
    multiple-selection
    header-order-draggable
    header-resizable
    row-draggable
  />
</template>

<script lang="jsx">
import data from './data.json';

const tableColumns = [
  {
    label: '0',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '0',
  },
  {
    label: '1',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '1',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '3',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '3',
  },
  {
    label: '4',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '4',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
  {
    label: '2',
    width: 80,
    sortable: true,
    fixed: 'left',
    prop: '2',
  },
];

export default {
  name: 'AllFeatures',
  data() {
    return {
      data,
      tableColumns,
    };
  },
};
</script>

<style lang="scss">

</style>
