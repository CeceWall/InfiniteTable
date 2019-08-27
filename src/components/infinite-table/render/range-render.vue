<template>
  <div class="range-render">
    <div
      class="range-render__item"
      v-for="item of pool"
      :key="item.props.id"
      :style="{'transform': `translate${direction ==='vertical' ? 'Y' : 'X'}(${item.position}px)`}"
    >
      <slot :data="item.data" :index="item.props.index" />
    </div>
  </div>
</template>

<script>
import { calculateAnchorItem } from './recycle-render/transform';

export default {
  name: 'RangeRender',
  props: {
    data: {
      type: [Array, Object],
    },
    direction: {
      type: String,
      default: 'vertical',
    },
    offset: {
      type: Number,
      required: true,
    },
    viewportSize: {
      type: Number,
      required: true,
    },
    dataKey: {
      type: String,
    },
    size: {
      type: Number,
    },
    sizeField: {
      type: String,
    },
  },
  beforeCreate() {
    this.viewId = 0;
    this.cacheViewList = [];
    this.activeViewMap = new Map();
  },
  data() {
    return {
      pool: [],
    };
  },
  updated() {
    console.log('range-render updated');
  },
  watch: {
    offset() {
      console.log('offset change');
      this.handleIndexChange();
    },
    viewportSize() {
      console.log('viewportSize change');
      this.handleIndexChange();
    },
    data: {
      immediate: true,
      handler() {
        console.log('data change');
        this.handleIndexChange();
      },
    },
  },
  methods: {
    addToPool(view, index, key) {
      const viewProps = {
        id: this.viewId,
        active: true,
        index,
        key,
      };

      this.viewId += 1;

      Object.defineProperty(view, 'props', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: viewProps,
      });
      this.pool.push(view);
    },
    invalidViewItem(viewItem) {
      this.activeViewMap.delete(viewItem.props.key);
      this.cacheViewList.push(viewItem);
      // eslint-disable-next-line
      viewItem.position = -99999;
      // eslint-disable-next-line
      viewItem.props.active = false;
    },
    handleIndexChange() {
      const {
        offset, viewportSize, dataKey,
        data, size, sizeField,
      } = this;

      let startIndex;
      let endIndex;
      let accumulateOffset = 0;
      if (size) {
        const anchorItem = {
          index: Math.floor(offset / size),
          offset: offset % size,
        };
        const lastAnchorItem = calculateAnchorItem(anchorItem, viewportSize, size, data.length);
        startIndex = Math.max(0, anchorItem.index - 1);
        endIndex = Math.min(data.length, lastAnchorItem.index + 2);
      } else {
        let sum = 0;
        startIndex = -1;
        for (let i = 0; i < this.data.length; i += 1) {
          const item = this.data[i];
          const itemSize = item[sizeField];
          sum += itemSize;
          if (sum >= offset && startIndex === -1) {
            startIndex = i;
            accumulateOffset = sum - itemSize;
          }
          if ((sum >= offset + viewportSize) || i === this.data.length - 1) {
            // 计算出来的endIndex是需要渲染的，这里采取+1的方式
            endIndex = i + 1;
            break;
          }
        }
      }
      for (let i = 0; i < this.pool.length; i += 1) {
        const viewItem = this.pool[i];
        const currentData = this.data[viewItem.props.index];
        // 判断元素是否在显示范围内
        // 或者元素本身已经不在原来的位置(data发生变化)
        // 需要额外判断元素是否已经失效，避免同一个viewItem多次执行invalid操作
        if (
          (
            (viewItem.props.index < startIndex || viewItem.props.index >= endIndex)
            || viewItem.data !== currentData// 当data本身发生变化时，单独使用index判断元素是否生效是不够的，需要对比元素本身是否变化
          )
          && viewItem.props.active
        ) {
          this.invalidViewItem(viewItem);
        }
      }
      for (let i = startIndex; i < endIndex; i += 1) {
        const item = this.data[i];
        const key = item[dataKey];
        let viewItem = this.activeViewMap.get(key);

        if (!viewItem) {
          viewItem = this.cacheViewList.pop();
          if (viewItem) {
            viewItem.data = item;
            viewItem.props.key = key;
            viewItem.props.index = i;
            viewItem.props.active = true;
          } else {
            viewItem = { data: item, position: 0 };
            this.addToPool(viewItem, i, key);
          }
          this.activeViewMap.set(viewItem.props.key, viewItem);
        }
        if (size) {
          viewItem.position = this.size * i;
        } else {
          viewItem.position = accumulateOffset;
          accumulateOffset += item[sizeField];
        }
      }
    },
  },
};
</script>

<style lang="scss">
  .range-render {
    position: relative;

    .range-render__item {
      position: absolute;
      will-change: transform;
    }
  }
</style>
