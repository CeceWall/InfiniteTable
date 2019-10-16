<template>
  <div class="range-render">
    <div
      v-for="item of pool"
      :key="item.props.id"
      class="range-render__item"
      :style="{'transform': `translate${direction ==='vertical' ? 'Y' : 'X'}(${item.position}px)`}"
    >
      <slot
        :data="item.data"
        :index="item.props.index"
      />
    </div>
  </div>
</template>

<script>
import { calcAccumulationIndex, calcFixedIndex } from './transform';
import { get } from '@/utils/object';

/**
 * RangeRender 按需渲染列表的组件
 *
 */

export default {
  name: 'RangeRender',
  props: {
    /**
     * 要渲染的数组，必填
     * */
    data: {
      type: [Array, Object],
      required: true,
    },
    /**
     * 列表的方向，可选值 vertical horizontal
     * 默认为vertical
     */
    direction: {
      type: String,
      default: 'vertical',
    },
    /**
     * 默认offset
     */
    offset: {
      type: Number,
      required: true,
    },
    /**
     * 可视区域的尺寸
     */
    viewportSize: {
      type: Number,
      required: true,
    },
    /**
     * 唯一识别数据的key
     */
    dataKey: {
      type: String,
      required: true,
    },
    /**
     * 单个元素的尺寸，适用于每个元素尺寸都相同的模式
     */
    size: {
      type: Number,
      default: null,
    },
    /**
     * 获取元素大小的字段，适用于每个元素尺寸不同的模式
     */
    sizeField: {
      type: String,
      default: null,
    },
    leadingSize: {
      type: Number,
      default: 0,
    },
    trailSize: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      pool: [],
    };
  },
  computed: {
    accumulationOffset() {
      if (this.sizeField) {
        let sum = 0;
        return this.data.map((item, index, data) => {
          if (index === 0) {
            return 0;
          }
          const lastItem = data[index - 1];
          const size = get(lastItem, this.sizeField);
          const offset = sum + size;
          sum += size;
          return offset;
        });
      }
      return [];
    },
    componentProps() {
      return {
        data: this.data,
        offset: this.offset,
        viewportSize: this.viewportSize,
        size: this.size,
        sizeField: this.sizeField,
        leadingSize: this.leadingSize,
        trailSize: this.trailSize,
        direction: this.direction,
      };
    },
  },
  watch: {
    componentProps: {
      immediate: true,
      handler() {
        // TODO: 验证handleIndexChange的调用次数为1
        this.handleIndexChange();
      },
    },
  },
  beforeCreate() {
    // 标识pool中对象的唯一id
    this.viewId = 0;
    this.cacheViewList = [];
    this.activeViewMap = new Map();
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
    /**
     * 当offset变化或数据发生变化的时候调用此方法
     */
    handleIndexChange() {
      const {
        offset, viewportSize, dataKey,
        data, size, sizeField,
      } = this;

      let startIndex; // 开始的index，包含
      let endIndex; // 结束的index，不包含
      /**
       * 如果是固定大小的模式
       * 直接计算startIndex和endIndex
       * 如果是动态大小的模式，则使用累加的方式
       */
      if (!sizeField) {
        const fixedIndex = calcFixedIndex(offset, size, viewportSize, data.length);
        startIndex = fixedIndex.startIndex;
        endIndex = fixedIndex.endIndex + 1;
      } else {
        const accumulation = calcAccumulationIndex(this.accumulationOffset, offset, viewportSize);
        startIndex = accumulation.startIndex;
        endIndex = accumulation.endIndex + 1;
      }

      startIndex = Math.max(0, startIndex - this.leadingSize);
      endIndex = Math.min(data.length, endIndex + this.trailSize);

      // 清理现有的pool，将没有在展示的viewItem无效化
      for (let i = 0; i < this.pool.length; i += 1) {
        const viewItem = this.pool[i];
        const currentData = this.data[viewItem.props.index];
        /**
         * 判断元素是否在显示范围内
         * 或者元素本身已经不在原来的位置(data发生变化)
         * 需要额外判断元素是否已经失效，避免同一个viewItem多次执行invalid操作
         */
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
      /**
       * 循环设置startIndex到endIndex的viewItem
       * 此方法会优先尝试从activeViewMap中获取，获取到了证明该节点已存在且位置正确无需更新
       * 如果不存在，那么会再尝试从cacheViewList中获取已经失效的viewItem，存在的话会使用该节点更新位置和数据
       * 如果上面两种都没有执行，那么会创建一个新的viewItem并添加到pool当中，随后会更新该viewItem的位置和数据
       */
      for (let i = startIndex; i < endIndex; i += 1) {
        const item = this.data[i];
        const key = get(item, dataKey);
        let viewItem = this.activeViewMap.get(key);

        if (!viewItem) {
          viewItem = this.cacheViewList.pop();
          if (viewItem) {
            viewItem.data = item;
            viewItem.props.key = key;
            viewItem.props.index = i;
            viewItem.props.active = true;
          } else {
            viewItem = {
              data: item,
              position: 0,
            };
            this.addToPool(viewItem, i, key);
          }
          this.activeViewMap.set(viewItem.props.key, viewItem);
        }
        if (size) {
          viewItem.position = this.size * i;
        } else {
          viewItem.position = this.accumulationOffset[i];
        }
      }
    },
  },
};
</script>
