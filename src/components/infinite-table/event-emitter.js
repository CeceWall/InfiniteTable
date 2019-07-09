import Vue from 'vue';

const eventBus = new Vue({
  data: {
    selectedRowIndex: -1,
  },
  methods: {
    selectRow(data) {
      this.selectedRowIndex = data;
    },
  },
});

export default eventBus;
