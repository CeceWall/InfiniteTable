import { expect } from 'chai';
import { getTableBodyHeight, calcDefaultColumnWidth, doColumnWidthLayout } from '@/table-layout';

describe('测试TableLayout', () => {
  it('测试calcDefaultColumnWidth', () => {
    const testCases = [
      {
        totalWidth: 101, totalColumn: 3, index: 0, result: 34,
      },
      {
        totalWidth: 101, totalColumn: 3, index: 1, result: 34,
      },
      {
        totalWidth: 101, totalColumn: 3, index: 2, result: 33,
      },
    ];
    testCases.forEach((testCase) => {
      const {
        totalWidth, totalColumn, index, result,
      } = testCase;
      expect(calcDefaultColumnWidth(totalWidth, totalColumn, index)).to.equal(result);
    });
  });
});
