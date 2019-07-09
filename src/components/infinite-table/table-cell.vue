<template>
  <div
    class="infinite-table__cell"
    :class="cellClass"
    :style="cellStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div ref="content" class="cell-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { num2px, px2num } from './utils/layout';

export default {
  name: 'TableCell',
  props: {
    height: {
      type: [String, Number],
      default: '48px',
    },
    width: {
      type: [String, Number],
      required: true,
    },
    ellipsis: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    cellClass() {
      return {
        'infinite-table__cell--ellipsis': this.ellipsis,
      };
    },
    cellStyle() {
      return {
        width: num2px(this.width),
        height: num2px(this.height),
      };
    },
  },
  methods: {
    handleMouseEnter(e) {
      this.$emit('mouseenter', e);
      const contentWidth = this.$refs.content.offsetWidth;
      if (contentWidth > px2num(this.width)) {
        this.$emit('cell-display-ellipsis', e);
      }
    },
    handleMouseLeave(e) {
      this.$emit('mouseleave', e);
      this.$emit('cell-hide-ellipsis', e);
    },
  },
};
</script>
