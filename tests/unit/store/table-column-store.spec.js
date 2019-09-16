import { expect } from 'chai';
import TableColumnStore from '@/store/table-column-store';
import TableColumnItem from '@/store/table-column-item';

describe('测试TableColumnStore', () => {
  it('测试不使用index添加column', () => {
    const tableColumns = [
      new TableColumnItem({ label: 1, width: 200, fixed: 'right' }),
      new TableColumnItem({ label: 2, width: 100 }),
      new TableColumnItem({ label: 3, width: 200 }),
      new TableColumnItem({ label: 4, width: 200, fixed: 'left' }),
      new TableColumnItem({ label: 5, width: 300 }),
      new TableColumnItem({ label: 6, width: 200, fixed: 'right' }),
      new TableColumnItem({ label: 7, width: 200, fixed: 'left' }),
      new TableColumnItem({ label: 8, width: 200, fixed: 'right' }),
      new TableColumnItem({ label: 9, width: 400 }),
      new TableColumnItem({ label: 10, width: 200, fixed: 'left' }),
    ];
    const columnStore = new TableColumnStore();
    tableColumns.forEach((column) => {
      columnStore.addTableColumn(column);
    });

    const labels = columnStore.getTableColumns().map((column) => column.label);
    expect(labels).to.deep.equal([4, 7, 10, 2, 3, 5, 9, 1, 6, 8]);
    expect(columnStore.leftFixedColumns.map((column) => column.label)).to.deep.equal([4, 7, 10]);
    expect(columnStore.rightFixedColumns.map((column) => column.label)).to.deep.equal([1, 6, 8]);
    expect(columnStore.tableColumns.map((column) => column.label)).to.deep.equal([2, 3, 5, 9]);
    // 测试获取fixedPosition
    const fixedPosition = [
      { label: 4, fixed: 'left' },
      { label: 7, fixed: 'left' },
      { label: 10, fixed: 'left' },
      { label: 1, fixed: 'right' },
      { label: 6, fixed: 'right' },
      { label: 8, fixed: 'right' },
    ]
      .map((column) => {
        const fixedStyle = columnStore.getFixedColumnStyle(column);
        return fixedStyle.left || fixedStyle.right;
      });
    expect(fixedPosition).to.deep.equal(['0px', '200px', '400px', '400px', '200px', '0px']);
    // 测试替换column
    const nextColumn = new TableColumnItem({ label: 14, fixed: 'left' });
    columnStore.replaceTableColumn({ label: 4 }, nextColumn);
    expect(columnStore.leftFixedColumns[0].label).to.equal(nextColumn.label);
    // 测试使用index添加
    const additionalColumn = new TableColumnItem({ label: 20, fixed: 'right' });
    columnStore.addTableColumn(additionalColumn, 0);
    expect(columnStore.rightFixedColumns[0].label).to.equal(20);
    // 测试获取column的offset
    expect(columnStore.getColumnOffset({ label: 10 })).to.equal(2000);
    // 测试删除column
    columnStore.removeTableColumn({ label: 20 });
    expect(columnStore.rightFixedColumns[0].label).to.equal(1);
    // 测试清除
    columnStore.clear();
    expect(columnStore.getTableColumns().length).to.equal(0);
  });
});
