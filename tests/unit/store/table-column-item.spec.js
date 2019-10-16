import { expect } from 'chai';
import sinon from 'sinon';
import * as TableColumnItemObject from '@/store/table-column-item';

const TableColumnItem = TableColumnItemObject.default;

describe('测试TableColumnItem', () => {
  it('测试没有label时抛出异常', () => {
    expect(() => {
      new TableColumnItem({});
    }).to.throw();
  });
  it('测试TableColumnItem对象', () => {
    sinon.spy(TableColumnItemObject, 'defaultColumnRender');

    const render = sinon.spy();
    const comparator = sinon.spy();
    const options = {
      label: '123',
      width: 456,
      render,
      sortable: true,
      fixed: true,
      prop: 'abc',
      sortBy: 'abc',
      comparator,
    };
    let item = new TableColumnItem(options);
    expect(item.prop).to.be.equal(options.prop);
    expect(item.label).to.be.equal(options.label);
    expect(item.width).to.be.equal(options.width);
    expect(item.sortable).to.be.equal(options.sortable);
    expect(item.fixed).to.be.equal('left');
    expect(item.sortBy).to.be.equal(item.prop);
    expect(item.comparator).to.be.equal(comparator);
    item.columnRender();
    expect(render.called).to.be.true;

    item = new TableColumnItem({ label: '123', prop: '123' });
    expect(item.sortBy).to.be.equal(item.prop);
    expect(item.width).to.be.equal(0);
    expect(item.sortable).to.be.false;
    expect(item.fixed).to.be.false;
    // item.comparator();
    // item.columnRender();
    // expect(defaultColumnRender.called).to.be.true;
    // expect(defaultComparator.called).to.be.true;
  });
});
