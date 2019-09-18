import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import sinon from 'sinon';
import Vue from 'vue';
import TableHeader from '@/table-header.vue';
import '@/styles/main.scss';

const columns = [
  {
    label: 0, width: 80, fixed: 'left', sortable: true,
  },
  { label: 1, width: 80, sortable: true },
  { label: 2, width: 80, sortable: true },
  { label: 3, width: 80, sortable: true },
  {
    label: 4, width: 80, fixed: 'right', sortable: true,
  },
];

const getFixedColumnStyle = sinon.stub()
  .onFirstCall().returns({ left: '0px' })
  .onSecondCall()
  .returns({ right: '0px' });

function isSameColumn(column1, column2) {
  return column1.label === column2.label;
}

describe('测试TableHeader', () => {
  let wrapper;
  beforeEach(() => {
    getFixedColumnStyle.resetHistory();
    wrapper = mount(TableHeader, {
      attachToDocument: true,
      sync: true,
      propsData: {
        headerHeight: 60,
      },
      provide: {
        emitter: {
          dispatch: sinon.spy(),
        },
        tableOptions: {
          headerOrderDraggable: true,
          headerResizable: true,
        },
        tableStore: Vue.observable({
          isSameColumn,
          tableColumns: {
            columns: [...columns],
            getFixedColumnStyle,
          },
          dataStore: {
            sortedOption: {
              column: columns[1],
              order: 'asc',
            },
          },
        }),
      },
    });
  });
  it('测试表头排序', () => {
    let sortElement = wrapper.find('.infinite-table__sortable.ascending.active');
    const labelText = sortElement.element.closest('.infinite-table__cell').textContent;
    expect(labelText.match(new RegExp(`${columns[1].label}`))).to.be.ok;

    sortElement = wrapper.find('.infinite-table__cell:nth-of-type(4) .infinite-table__sortable.descending');
    sortElement.trigger('click');
    const { sortedOption } = wrapper.vm.tableStore.dataStore;
    expect(sortedOption.column.label).to.equal(columns[3].label);
    expect(sortedOption.order).to.equal('desc');
  });

  it('测试表头可以resize', () => {
    const cell = wrapper.find('.infinite-table__cell:nth-of-type(3)');
    const cellLeft = cell.element.getBoundingClientRect().left;
    // 期待初始化时表头的cursor是sortable的pointer
    expect(getComputedStyle(cell.element).cursor).to.equal('pointer');
    const mouseEnterEvent = new MouseEvent('mouseenter');
    cell.element.dispatchEvent(mouseEnterEvent);
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: cellLeft + 7,
    });
    cell.element.dispatchEvent(mouseMoveEvent);
    // 期待鼠标靠近边缘时改变指针
    expect(getComputedStyle(cell.element).cursor).to.equal('col-resize');
    // 期待靠近时当前单元格不可以拖动
    expect(cell.element.draggable).to.be.false;

    const mouseDownEvent = new MouseEvent('mousedown', {
      clientX: cellLeft + 7,
    });
    cell.element.dispatchEvent(mouseDownEvent);
    // 期待鼠标点击后出现resize的指示器
    expect(wrapper.vm.resizeIndicator.visible).to.be.true;

    const indicatorMoveEvent = new MouseEvent('mousemove', {
      clientX: cellLeft + 100,
    });
    document.body.dispatchEvent(indicatorMoveEvent);

    const mouseUpEvent = new MouseEvent('mouseup', {
      clientX: cellLeft + 100,
    });
    document.body.dispatchEvent(mouseUpEvent);
    // 期待鼠标松开时触发事件
    expect(wrapper.vm.emitter.dispatch.calledWith('column-resize', 1, columns[1], 93)).to.be.true;
    wrapper.vm.resizeIndicator.hover = false;
    const firstCell = wrapper.find('.infinite-table__cell:nth-of-type(1)');
    const firstCellRect = firstCell.element.getBoundingClientRect();
    const firstMouseMoveEvent = new MouseEvent('mousemove', {
      clientX: firstCellRect.left + 7,
    });
    firstCell.element.dispatchEvent(firstMouseMoveEvent);
    // 期待第一个元素无法触发左边的resize
    expect(wrapper.vm.resizeIndicator.hover).to.be.false;
  });

  it('测试表头可以拖动', () => {
    const dataTransfer = new DataTransfer();
    const dragStartEvent = new DragEvent('dragstart', {
      dataTransfer,
    });
    wrapper.setMethods({
      handleHeaderDragStart: sinon.spy(wrapper.vm, 'handleHeaderDragStart'),
    });
    const cell = wrapper.find('.infinite-table__cell:nth-of-type(3)');
    cell.element.dispatchEvent(dragStartEvent);
    expect(wrapper.vm.handleHeaderDragStart.calledWith(2, sinon.match.instanceOf(MouseEvent))).to.be.true;

    const dropCell = wrapper.find('.infinite-table__cell:nth-of-type(4)');
    const dragOverEvent = new DragEvent('dragover', {
      dataTransfer,
    });
    dropCell.element.dispatchEvent(dragOverEvent);

    const dropEvent = new DragEvent('drop', {
      dataTransfer,
    });
    dropCell.element.dispatchEvent(dropEvent);
    expect(wrapper.vm.emitter.dispatch.calledWith('header-drop', 2, columns[2], 3, columns[3])).to.be.true;
  });
});
