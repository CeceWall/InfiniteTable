import { expect } from 'chai';
import Vue from 'vue';
import { mount } from '@vue/test-utils';
import RecycleRender from '@/components/infinite-table/render/recycle-render/index';
import { calculateAnchorItem } from '@/components/infinite-table/render/recycle-render/transform';


function createScrollElement(height) {
  const div = document.createElement('div');
  div.style.height = `${height}px`;
  div.style.overflow = 'auto';
  return div;
}

const MockComponent = {
  data() {
    return {
      data: [],
    };
  },
  methods: {
    forceUpdate() {
      this.$refs.recycleRender.forceUpdate();
    },
    renderChild(index) {
      return this.$createElement(
        'div',
        {
          style: {
            width: '100%',
            height: '48px',
          },
        },
        `${index}`,
      );
    },
  },
  render(h) {
    return h(RecycleRender,
      {
        ref: 'recycleRender',
        props: {
          total: this.data.length,
          scrollElement: createScrollElement(480),
          viewportHeight: 479,
          rowHeight: 48,
          renderFunction: this.renderChild,
        },
      },
      [
        h('div', {
          class: {
            'mock-scroll': true,
          },
          slot: 'default',
        }),
      ]);
  },
};

const wrapper = mount(MockComponent);
const rowSelector = '.infinite-table__row--recycle';
const visibleRowSelector = `${rowSelector}:not(.invisible)`;

describe('recycle-render', () => {
  it('计算锚点', () => {
    const rowHeight = 48;
    const totalLength = 10;
    const testCases = [
      { index: 0, offset: 8, delta: -10 }, // 向上滚动，当前元素，无法继续向上滚动
      { index: 4, offset: 20, delta: -2000 }, // 向上滚动，从其他元素开始，无法继续向上滚动
      { index: 1, offset: 8, delta: -10 }, // 向上滚动，能滚动到上一个index
      { index: 1, offset: 20, delta: -10 }, // 向上滚动，不足以滚动到上一个index
      { index: 5, offset: 20, delta: -20 }, // 向上滚动，恰好滚动到当前元素最上面

      { index: 0, offset: 0, delta: 20 }, // 向下滚动，滚动后在当前元素
      { index: 1, offset: 20, delta: 30 }, // 向下滚动，滚动后在下一个元素
      { index: 1, offset: 20, delta: 28 }, // 向下滚动，滚动后恰好在下一个元素的起始点
      { index: 8, offset: 40, delta: 100 }, // 向下滚动，滚动后超出最大元素限制

      { index: 0, offset: 0, delta: 0 }, // 无滚动
      {
        index: 0, offset: 0, delta: 48, total: 0, // 无数据时滚动
      },
    ];
    const testResults = [
      { index: 0, offset: 0 },
      { index: 0, offset: 0 },
      { index: 0, offset: 46 },
      { index: 1, offset: 10 },
      { index: 5, offset: 0 },


      { index: 0, offset: 20 },
      { index: 2, offset: 2 },
      { index: 2, offset: 0 },
      { index: 9, offset: 0 },

      { index: 0, offset: 0 },

      { index: 0, offset: 0 },
    ];

    for (let i = 0; i < testCases.length; i += 1) {
      const testCase = testCases[i];
      const testResult = testResults[i];
      const total = typeof testCase.total === 'number' ? testCase.total : totalLength;
      const anchor = calculateAnchorItem(testCase, testCase.delta, rowHeight, total);
      expect(anchor).to.include(testResult);
    }
  });
  it('初始无数据', (done) => {
    setTimeout(() => {
      const recycleElements = wrapper.element.querySelectorAll(rowSelector);
      expect(recycleElements.length).to.equal(0);
      done();
    }, 32);
  });
  it('添加元素', () => {
    const testCases = [
      [0, 10],
      [40, 50],
      [20, 35],
      [15, 25],
      [20, 40],
      [0, 1],
      [0, 0],
    ];
    for (const testCase of testCases) {
      const [startIndex, endIndex] = testCase;
      console.log(`startIndex ${startIndex} endIndex ${endIndex}`);
      wrapper.vm.$refs.recycleRender.attachContentByAnchor(startIndex, endIndex);
      const rowElements = wrapper.element.querySelectorAll(visibleRowSelector);
      expect(rowElements.length).to.equal(endIndex - startIndex);
    }
  });
  it('数据更新', (done) => {
    const data = new Array(20).fill(0);
    wrapper.setData({
      data,
    });
    Vue.nextTick(() => {
      const element = wrapper.element.querySelector(visibleRowSelector);
      expect(element.textContent).to.equal(`${data[0]}`);
      done();
    });
  });
  it('数据清空', (done) => {
    wrapper.setData({
      data: [],
    });
    Vue.nextTick(() => {
      const rowElements = wrapper.element.querySelectorAll(visibleRowSelector);
      expect(rowElements.length).to.equal(0);
      done();
    });
  });
});
