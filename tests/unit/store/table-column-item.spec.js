import { expect } from 'chai';
import sinon from 'sinon';
import * as TableColumnItemObject from '@/store/table-column-item';

const TableColumnItem = TableColumnItemObject.default;

describe('测试TableColumnItem', () => {
  it('测试defaultColumnRender', () => {
    const { defaultColumnRender } = TableColumnItemObject;
    const row = { a: 1, b: { c: 2 } };
    const options = { prop: 'a' };
    const optionsComplexProp = { prop: 'b.c' };
    const props = { row, options };

    expect(defaultColumnRender({})).to.be.equal('');
    expect(defaultColumnRender(props)).to.be.equal(row.a);
    expect(defaultColumnRender({ ...props, options: optionsComplexProp })).to.be.equal(row.b.c);
  });

  it('测试TableColumnItem对象', () => {
    sinon.spy(TableColumnItemObject, 'defaultColumnRender');
    sinon.spy(TableColumnItemObject, 'defaultComparator');
    const { defaultColumnRender, defaultComparator } = TableColumnItemObject;
    expect(() => {
      new TableColumnItem({});
    }).to.throw();
    const render = sinon.spy();
    const comparator = sinon.spy();
    const options = {
      label: '123',
      width: 456,
      render,
      sortable: true,
      fixed: true,
      prop: 'abc',
      comparator,
    };
    let item = new TableColumnItem(options);
    expect(item.prop).to.be.equal(options.prop);
    expect(item.label).to.be.equal(options.label);
    expect(item.width).to.be.equal(options.width);
    expect(item.sortable).to.be.equal(options.sortable);
    expect(item.fixed).to.be.equal('left');
    expect(item.comparator).to.be.equal(comparator);
    item.columnRender();
    expect(render.called).to.be.true;

    item = new TableColumnItem({ label: '123', comparator: undefined });
    expect(item.prop).to.be.empty;
    expect(item.width).to.be.equal(0);
    expect(item.sortable).to.be.false;
    expect(item.fixed).to.be.false;
    expect(item.comparator).to.not.be.undefined;
    // item.comparator();
    // item.columnRender();
    // expect(defaultColumnRender.called).to.be.true;
    // expect(defaultComparator.called).to.be.true;
  });
});
