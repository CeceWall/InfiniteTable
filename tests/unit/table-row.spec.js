import { expect } from 'chai';
import sinon from 'sinon';
import { shallowMount, mount } from '@vue/test-utils';
import Vue from 'vue';
import TableRow from '@/table-row.jsx';
import TableColumnItem from '@/store/table-column-item';
import RangeRender from '@/render/range-render.vue';

const data = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
};

const leftFixedColumns = [
  new TableColumnItem({
    label: 'a', prop: 'a', width: 123, fixed: 'left',
  }),
];
const mainTableColumns = [
  new TableColumnItem({ label: 'b', width: 123, render: sinon.stub().returns('1234') }),
  new TableColumnItem({ label: 'c', prop: 'c', width: 123 }),
  new TableColumnItem({ label: 'd', prop: 'd', width: 123 }),
  new TableColumnItem({ label: 'e', prop: 'e', width: 123 }),
];
const rightFixedColumns = [
  new TableColumnItem({
    label: 'f', prop: 'f', width: 123, fixed: 'right',
  }),
];
describe('测试table-row组件', () => {
  let wrapper;
  let provide;
  beforeEach(() => {
    provide = Vue.observable({
      emitter: {
        dispatch: sinon.spy(),
      },
      tableStore: {
        isSameColumn: sinon.stub().onSecondCall().returns(true).returns(false),
        isSameRow: sinon.stub().returns(true),
        layoutSize: {
          viewportWidth: 1120,
          viewportHeight: 520,
          allColumnsWidth: 3840,
        },
        tableColumns: {
          leftFixedColumns: [...leftFixedColumns],
          leftFixedColumnWidth: 123,
          mainColumns: [...mainTableColumns],
          rightFixedColumns: [...rightFixedColumns],
          rightFixedColumnWidth: 123,
          getFixedColumnStyle: sinon.stub().returns({ left: '123px' }),
        },
        tableSelection: {
          focusedRow: {},
          selectedColumn: {},
        },
      },
      tableOptions: {
        rowHeight: 48,
        rowDraggable: false,
        highlightCurrentCell: true,
      },
    });

    wrapper = mount(TableRow, {
      attachToDocument: true,
      sync: false,
      propsData: {
        index: 0,
        data: { ...data },
        offsetX: 0,
      },
      provide,
    });
  });
  it('测试事件', (done) => {
    // 测试事件
    const element = wrapper.find('.fixed-left');
    element.trigger('click');
    const event = sinon.match.instanceOf(Event);
    const { dispatch } = provide.emitter;
    expect(dispatch.getCall(0)
      .calledWith('cell-click', data, leftFixedColumns[0], event)).to.be.true;
    expect(dispatch.getCall(1)
      .calledWith('row-click', data, leftFixedColumns[0], event)).to.be.true;
    const events = ['contextmenu', 'dblclick', 'dragstart', 'dragend', 'dragover', 'drop'];
    for (let i = 0; i < events; i += 1) {
      dispatch.resetHistory();
      const eventName = events[i];
      element.trigger(eventName);
      expect(dispatch.firstCall.calledWith(`row-${eventName}`, data, leftFixedColumns[0], event));
    }
    done();
  });
  it('测试渲染函数columnRender被正确调用', () => {
    const props = sinon.match({
      row: data,
      options: mainTableColumns[0],
      rowIndex: 0,
    });
    expect(mainTableColumns[0].columnRender.calledWithExactly(wrapper.vm.$createElement, props)).to.be.true;
  });
  it('测试fixed列渲染和main渲染', (done) => {
    const props = wrapper.find(RangeRender).props();
    // 测试传递给RangeRender的Props是否正确
    expect(props.direction).to.equal('horizontal');
    expect(props.sizeField).to.equal('width');
    expect(props.dataKey).to.equal('label');
    const { layoutSize, tableColumns } = provide.tableStore;
    const viewportSize = layoutSize.viewportWidth - tableColumns.leftFixedColumnWidth - tableColumns.rightFixedColumnWidth;
    expect(props.viewportSize).to.equal(viewportSize);
    expect(props.size).to.be.null;
    // 测试fixed列是否按照数据进行渲染
    expect(wrapper.findAll('.fixed-left').length).to.equal(leftFixedColumns.length);
    expect(wrapper.findAll('.fixed-right').length).to.equal(rightFixedColumns.length);
    expect(wrapper.find('.fixed-left').element.style.left).to.equal('123px');

    // 测试单元格选中是否生效
    expect(provide.tableStore.isSameColumn.called).to.be.true;
    expect(provide.tableStore.isSameRow.called).to.be.true;
    expect(wrapper.find('.infinite-table__cell--selected.fixed-right').isEmpty()).not.to.be.true;

    done();
  });
});
