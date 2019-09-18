import Vue from 'vue';
import Example from './example.vue';
import InfiniteTable from '../src/table.vue';
import InfiniteTableColumn from '../src/table-column.jsx';
import BasicUsageDemo from './demos/basic-usage.vue';
import FixedColumnDemo from './demos/fixed-column.vue';
import CustomColumnDemo from './demos/custom-column.vue';
import CustomRowAttrsDemo from './demos/custom-row-attrs.vue';
import FixedHeaderDemo from './demos/fixed-header.vue';
import HighlightCurrentRowDemo from './demos/highlight-current-row.vue';
import LargeTableDemo from './demos/large-table.vue';
import HeaderColumnResizeDemo from './demos/header-column-resize.vue';
import RowDraggableDemo from './demos/row-draggable.vue';
import DragHeaderOrderDemo from './demos/drag-header-order.vue';
import JSXColumnDemo from './demos/jsx-column.vue';
import AllFeaturesDemo from './demos/all-features.vue';

Vue.component('infinite-table', InfiniteTable);
Vue.component('infinite-table-column', InfiniteTableColumn);

// eslint-disable-next-line no-undef
const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: BasicUsageDemo,
    },
    {
      path: '/fixed-column',
      component: FixedColumnDemo,
    },
    {
      path: '/custom-column',
      component: CustomColumnDemo,
    },
    {
      path: '/custom-row-attrs',
      component: CustomRowAttrsDemo,
    },
    {
      path: '/fixed-header',
      component: FixedHeaderDemo,
    },
    {
      path: '/highlight-current-row',
      component: HighlightCurrentRowDemo,
    },
    {
      path: '/large-table',
      component: LargeTableDemo,
    },
    {
      path: '/header-column-resize',
      component: HeaderColumnResizeDemo,
    },
    {
      path: '/row-draggable',
      component: RowDraggableDemo,
    },
    {
      path: '/drag-header-order',
      component: DragHeaderOrderDemo,
    },
    {
      path: '/jsx-column',
      component: JSXColumnDemo,
    },
    {
      path: '/all-features',
      component: AllFeaturesDemo,
    },
  ],
});

// eslint-disable-next-line no-undef
Vue.use(VueRouter);

new Vue({
  router,
  render: (h) => h(Example),
}).$mount('#app');
