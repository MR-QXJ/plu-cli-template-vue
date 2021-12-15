// 面包屑菜单（函数式组件/无状态组件）
<template functional>
  <section class="w100 menu-path">
    <section class="h100 w100 loading" v-show="props.loading">
      <a-spin :spinning="props.loading" />
    </section>
    <a-breadcrumb v-show="!props.loading">
      <a-breadcrumb-item :key="index" v-for="(menu, index) in props.menus">
        <a href="javascript:;" v-if="menu.url && menu.url.indexOf('/') !== -1">
          <my-icon
            :style="{ marginRight: '6px' }"
            :type="menu.icon"
            v-if="menu.icon && menu.icon !== ''"
          />
          <span :title="menu.title" v-cloak>{{ menu.title }}</span>
        </a>
        <span v-else>
          <my-icon
            :style="{ marginRight: '6px' }"
            :type="menu.icon"
            v-if="menu.icon && menu.icon !== ''"
          />
          <span :title="menu.title" v-cloak>{{ menu.title }}</span>
        </span>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </section>
</template>

<script>
export default {
  props: ["loading", "menus"]
};
</script>

<style lang="scss" scoped>
.menu-path {
  @include flex;
  @include flex-secondary-axis-center;
  flex-shrink: 0;

  .loading {
    @include flex;
    @include flex-secondary-axis-center;
    overflow: hidden;
  }
}
</style>
