// 导航递归子菜单（函数式组件/无状态组件）
<template functional>
  <a-sub-menu :key="props.menuInfo.key">
    <span slot="title">
      <my-icon
        :type="props.menuInfo.icon"
        v-if="props.menuInfo.icon && props.menuInfo.icon !== ''"
      />
      <span :title="props.menuInfo.title" v-cloak>{{
        props.menuInfo.title
      }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item
        :key="item.key"
        v-if="
          !item.children ||
            item.children.length === 0 ||
            item.url !== '' ||
            item.url !== '/'
        "
      >
        <my-icon :type="item.icon" v-if="item.icon && item.icon !== ''" />
        <span :title="item.title" v-cloak>{{ item.title }}</span>
      </a-menu-item>
      <sub-menu :key="item.key" :menu-info="item" v-else />
    </template>
  </a-sub-menu>
</template>

<script>
export default {
  props: ["menuInfo"]
};
</script>
