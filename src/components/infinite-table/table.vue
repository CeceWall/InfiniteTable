<template>
  <div class="infinite-table">
    <div class="infinite-table__columns-define">
      <slot></slot>
    </div>
    <div ref="header" class="infinite-table__header__wrapper" :style="{width: tableWidth}">
      <table-header />
    </div>
    <div
      ref="body"
      class="infinite-table__body__wrapper"
      :style="{width: tableWidth,height: tableBodyHeight}"
    >
      <table-body :data="data" />
    </div>
  </div>
</template>

<script>
import TableHeader from './table-header';
import TableBody from './table-body.vue';
import TableLayout from './table-layout';
import TableStore from './table-store';

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
    rowHeight: {
      type: [Number, String],
      default: 48,
    },
    rowKey: {
      type: String,
    },
  },
  computed: {
    layoutOptions() {
      return this.store.getLayoutOptions();
    },
    tableWidth() {
      return `${this.layoutOptions.tableWidth}px`;
    },
    tableBodyHeight() {
      return `calc(100% - ${this.layoutOptions.tableHeaderHeight}px)`;
    },
  },
  provide() {
    return {
      store: this.store,
    };
  },
  data() {
    const store = new TableStore({
      data: this.data,
      tableOptions: {
        rowKey: this.rowKey,
        rowHeight: this.rowHeight,
      },
    });
    return {
      store,
    };
  },
  created() {
    this.layout = new TableLayout({
      table: this,
      store: this.store,
    });
  },
  mounted() {
    this.layout.update();
  },
  methods: {
    getColumnIndex(column) {
      return this.$children.indexOf(column);
    },
  },
};
</script>
