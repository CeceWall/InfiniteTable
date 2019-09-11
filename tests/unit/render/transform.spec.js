import { expect } from 'chai';
import { calculateAnchorItem, calcAccumulationIndex } from '@/render/transform';

describe('测试transform方法', () => {
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
  it('测试非固定尺寸的index计算', () => {
    const data = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180];
    const testCases = [
      { offset: 0, delta: 100, result: [0, 5] },
      { offset: 1, delta: 100, result: [0, 5] },
      { offset: 20, delta: 100, result: [1, 6] },
      { offset: 20, delta: 10, result: [1, 1] },
      { offset: 169, delta: 100, result: [8, 9] },
      { offset: 180, delta: 100, result: [9, 9] },
      { offset: 181, delta: 100, result: [9, 9] },
    ];
    for (let i = 0; i < testCases.length; i += 1) {
      const { offset, delta, result } = testCases[i];
      const { startIndex, endIndex } = calcAccumulationIndex(data, offset, delta);
      expect(startIndex).to.equal(result[0]);
      expect(endIndex).to.equal(result[1]);
    }
  });
});
