<template>
  <div class="example-page">
    <div class="example-links">
      <router-link to="/">基础用法</router-link>
      <router-link to="/fixed-column">固定列</router-link>
      <router-link to="/custom-column">自定义列展示</router-link>
      <router-link to="/custom-row-attrs">自定义行属性</router-link>
      <router-link to="/fixed-header">固定表头</router-link>
      <router-link to="/highlight-current-row">高亮选中行</router-link>
      <router-link to="/large-table">大数据量渲染</router-link>
      <router-link to="/header-column-resize">表头改变大小</router-link>
      <router-link to="/row-draggable">行拖动</router-link>
      <router-link to="/drag-header-order">拖动表头排序</router-link>
    </div>
    <div class="table-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Example'
};
</script>

<style lang="scss">
  html, body, #app {
    margin: 0;
    height: 100%;
  }
  .example-page {
    height: 100%;
    display: flex;
    flex-direction: column;

    .example-links {
      height: 50px;
      flex: 0 0 auto;
    }

    .table-container {
      min-height: 0;
      flex: 1 1 auto;
    }
  }
</style>
