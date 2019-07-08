import { expect } from 'chai';
import { calculateAnchorItem } from '@/components/infinite-table/render/recycle-render/transform';

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
    ];

    for (let i = 0; i < testCases.length; i += 1) {
      const testCase = testCases[i];
      const testResult = testResults[i];
      const anchor = calculateAnchorItem(testCase, testCase.delta, rowHeight, totalLength);
      expect(anchor).to.deep.equal(testResult);
    }
  });
});
