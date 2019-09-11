import { mount, createLocalVue } from '@vue/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';
import Vue from 'vue';
import _ from 'lodash';
import RangeRender from '@/render/range-render.vue';
import * as transform from '../../../src/render/transform';

function renderChild(h, props) {
  const { data, index } = props;
  return (
    <div>
      <span>{index}</span>
      <span>{data.a}</span>
      <span>{data.b}</span>
      <span>{data.c}</span>
    </div>
  );
}

describe('测试range-render', () => {
  let wrapper;
  let data = [
    { a: 1, b: 2, c: 3 },
    { a: 2, b: 4, c: 6 },
    { a: 3, b: 6, c: 9 },
    { a: 4, b: 8, c: 12 },
    { a: 5, b: 10, c: 15 },
    { a: 6, b: 12, c: 18 },
    { a: 7, b: 14, c: 21 },
    { a: 8, b: 16, c: 24 },
    { a: 9, b: 18, c: 27 },
    { a: 10, b: 20, c: 30 },
  ];
  const defaultMountOptions = {
    attachToDocument: true,
    sync: false,
    propsData: {
      data,
      offset: 0,
      viewportSize: 100,
      dataKey: 'a',
      size: 20,
    },
    scopedSlots: {
      default(props) {
        return renderChild(this.$createElement, props);
      },
    },
  };
  before(() => {
    sinon.spy(transform, 'calcFixedIndex');
    sinon.spy(transform, 'calcAccumulationIndex');
  });

  it('测试数据变化', async () => {
    data = _.shuffle(data);
    wrapper = mount(RangeRender, {
      ...defaultMountOptions,
      localVue: createLocalVue(),
      scopedSlots: {
        default: '<p>{{props.index}},{{props.data.a}}</p>',
      },
    });
    await Vue.nextTick();
    wrapper.setProps({
      data,
    });
    await Vue.nextTick();
    const pooledList = wrapper.vm.pool.filter((item) => item.props.active)
      .sort((a, b) => a.props.index - b.props.index)
      .map((item) => item.data);
    expect(pooledList).to.deep.equal(data.slice(0, pooledList.length));
  });

  it('测试按需渲染', async () => {
    data = data.map((item, index) => ({
      ...item,
      size: 20 + index * 10,
    }));
    wrapper = mount(RangeRender, {
      ...defaultMountOptions,
      localVue: createLocalVue(),
      propsData: {
        ...defaultMountOptions.propsData,
        data,
        size: null,
        sizeField: 'size',
      },
    });
    // TODO: 修改测试用例以满足同时修改viewportSize和offset的测试需求
    const testCases = [
      { offset: 10, viewportSize: 100 },
      { offset: 20, viewportSize: 100 },
      { offset: 25, viewportSize: 100 },
      { offset: 50, viewportSize: 100 },
      { offset: 100, viewportSize: 100 },
      { offset: 100, viewportSize: 200 },
      { offset: 149, viewportSize: 200 },
    ];

    const testFunctions = [transform.calcAccumulationIndex, transform.calcFixedIndex];
    for (let funcIndex = 0; funcIndex < testFunctions.length; funcIndex += 1) {
      const spyFunction = testFunctions[funcIndex];
      for (let i = 0; i < testCases.length; i += 1) {
        spyFunction.resetHistory();
        const { offset, viewportSize } = testCases[i];
        wrapper.setProps({
          offset,
          viewportSize,
        });
        await Vue.nextTick();
        const { startIndex, endIndex } = spyFunction.returnValues[0];
        expect(wrapper.vm.pool.filter((item) => item.props.active).length)
          .to
          .equal(endIndex - startIndex + 1);
      }
      wrapper.setProps({
        offset: 0,
        viewportSize: testCases[0].viewportSize,
        size: 20,
        sizeField: null,
      });
    }
  });
});
