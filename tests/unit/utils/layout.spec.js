import { expect } from 'chai';
import { num2px, px2num, getClientSize } from '@/utils/layout';

describe('测试layout utils', () => {
  it('测试num2px', () => {
    const testCases = [
      { input: 16, output: '16px' },
      { input: 16.8, output: '16.8px' },
      { input: '17px', output: '17px' },
      { input: NaN, output: NaN },
      { input: null, output: null },
    ];
    for (let i = 0; i < testCases; i += 1) {
      const { input, output } = testCases[i];
      expect(num2px(input)).to.equal(output);
    }
  });
  it('测试px2num', () => {
    const testCases = [
      { input: '16px', output: 16 },
      { input: '15.2px', output: 15.2 },
      { input: 16.2, output: 16.2 },
      { input: 16, output: 16 },
      { input: 'notanumber', output: 0 },
    ];
    for (let i = 0; i < testCases; i += 1) {
      const { input, output } = testCases[i];
      expect(px2num(input)).to.equal(output);
    }
  });
  it('测试getClientSize', () => {
    expect(() => { getClientSize('abc'); }).to.throw();
  });
});
