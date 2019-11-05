<template>
  <div
    ref="tableBody"
    class="infinite-table__body"
    :style="{
      height: `${layoutSize.viewportHeight}px`,
      'transform-style': `${fixedData.length >= 0 ? 'preserve-3d' : 'initial'}`
    }"
    v-on="tableBodyListeners"
  >
    <!-- FIXME: 修复使用index作为key -->
    <div
      style="position: relative;"
      :style="{
        height: `${fixedData.length * tableOptions.rowHeight}px`,
        transform: `translate3d(0px, ${grid.offsetY}px, 1px)`
      }"
    >
      <table-row
        v-for="(rowData, index) of fixedData"
        :key="index"
        v-bind="getExtraRowAttrs(rowData, index)"
        :index="index"
        :offset-x="grid.offsetX"
        :data="rowData"
        :style="{
          position: 'relative',
        }"
      />
    </div>
    <range-render
      v-slot:default="{data: rowData, index}"
      :data="data"
      direction="vertical"
      :size="tableOptions.rowHeight"
      :data-key="tableOptions.rowKey"
      :viewport-size="layoutSize.viewportHeight - fixedData.length * tableOptions.rowHeight"
      :offset="grid.offsetY"
      :trail-size="1"
      :leading-size="1"
    >
      <table-row
        v-bind="getExtraRowAttrs(rowData, index + fixedData.length)"
        :index="index + fixedData.length"
        :offset-x="grid.offsetX"
        :data="rowData"
        @show-tooltip="handleShowTooltip($event)"
      />
    </range-render>
    <div
      :style="{
        transform:`translateY(${(data.length) * tableOptions.rowHeight}px)`,
        width: `${layoutSize.allColumnsWidth}px`
      }"
      style="position: absolute; height: 1px;"
    />
    <div
      ref="tooltip"
      class="tooltip-reference"
      :style="{height: `${tableOptions.rowHeight}px`}"
    />
  </div>
</template>

<script>
import Tooltip from 'tooltip.js';
import TableRow from './table-row.jsx';
import RangeRender from './render/range-render.vue';
import { getElementOffset } from '@/utils/layout';

export default {
  name: 'TableBody',
  inject: ['tableStore', 'tableOptions'],
  components: {
    RangeRender,
    TableRow,
  },
  data() {
    return {
      grid: {
        offsetX: 0,
        offsetY: 0,
      },
    };
  },
  computed: {
    data() {
      return this.tableStore.dataStore.data;
    },
    fixedData() {
      return this.tableStore.dataStore.fixedData;
    },
    layoutSize() {
      return this.tableStore.layoutSize;
    },
    tableBodyListeners() {
      return {
        ...this.$listeners,
      };
    },
  },
  watch: {
    data() {
      this.handleScroll();
    },
  },
  beforeCreate() {
    this.handing = false;
  },
  mounted() {
    this.tooltip = new Tooltip(this.$refs.tooltip, {
      placement: 'top',
      container: document.body,
      boundariesElement: document.body,
      template: '<div class="infinite-table__tooltip tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    });
    this.$on('show-tooltip', this.handleShowTooltip);
    this.$on('hide-tooltip', () => this.tooltip.hide());
    this.scroll = this.getScrollElement();
    this.scroll.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  },
  beforeDestroy() {
    this.tooltip.dispose();
  },
  methods: {
    getExtraRowAttrs(rowItem, index) {
      const { striped, rowExtraAttrs } = this.tableOptions;
      const { tableSelection } = this.tableStore;
      let extraAttrs = rowExtraAttrs;
      if (typeof rowExtraAttrs === 'function') {
        extraAttrs = rowExtraAttrs(rowItem, index);
      }
      return {
        style: {
          ...extraAttrs.style,
        },
        class: {
          ...extraAttrs.class,
          'infinite-table__row--striped': striped && index % 2 === 1,
          'infinite-table__row--selected': tableSelection.hasSelected(rowItem),
        },
        ...extraAttrs.attrs,
      };
    },
    handleScroll() {
      if (!this.handing) {
        this.handing = true;
        requestAnimationFrame(() => {
          this.changeOffsetIndex();
          this.handing = false;
        });
      }
    },
    changeOffsetIndex() {
      const { scrollTop, scrollLeft } = this.scroll;
      this.grid.offsetX = scrollLeft;
      this.grid.offsetY = scrollTop;
    },
    getScrollElement() {
      return this.$el.closest('.infinite-table--scrollable');
    },
    handleShowTooltip(element, textContent) {
      if (element instanceof HTMLElement) {
        const { top: bodyTop, left: bodyLeft } = getElementOffset(this.$refs.tableBody);
        const { top, left } = getElementOffset(element);
        const { tooltip } = this.$refs;
        tooltip.style.top = `${top - bodyTop}px`;
        tooltip.style.left = `${left - bodyLeft}px`;
        tooltip.style.width = `${element.offsetWidth}px`;
        tooltip.style.height = `${element.offsetHeight}px`;
        this.tooltip.updateTitleContent(textContent);
        this.tooltip.show();
      }
    },
  },
};
</script>
