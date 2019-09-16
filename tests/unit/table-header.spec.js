import { shallowMount } from '@vue/test-utils';
import sinon from 'sinon';
import TableHeader from '@/table-header.vue';

describe('测试TableHeader', () => {
  it('测试加载组件', () => {
    shallowMount(TableHeader, {
      propsData: {
        headerHeight: 60,
      },
      provide: {
        tableStore: {
          tableColumns: [],
        },
        tableOptions: {},
        emitter: {
          dispatch: sinon.spy(),
        },
      },
    });
  });
});
