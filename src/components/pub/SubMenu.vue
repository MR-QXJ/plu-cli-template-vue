// 导航递归子菜单（函数式组件/无状态组件）
<template functional>
  <a-sub-menu :key="props.menuInfo.key">
    <span slot="title">
      <i
        class="nav-menu-icon"
        :style="{
          background: `url(${
            props.navIcons[props.menuInfo.key]
          }) center center no-repeat`,
          backgroundSize: 'contain'
        }"
        v-if="props.navIcons && props.navIcons[props.menuInfo.key]"
      />
      <span class="nav-menu-title" :title="props.menuInfo.title" v-cloak>{{
        props.menuInfo.title
      }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item
        :key="item.key"
        v-if="!item.children || item.children.length === 0"
      >
        <i
          class="nav-menu-icon"
          :style="{
            background: `url(${
              props.navIcons[item.key]
            }) center center no-repeat`,
            backgroundSize: 'contain'
          }"
          v-if="props.navIcons && props.navIcons[item.key]"
        />
        <span class="nav-menu-title" :title="item.title" v-cloak>
          {{ item.title }}
        </span>
      </a-menu-item>
      <sub-menu
        :key="item.key"
        :menu-info="item"
        :nav-icons="props.navIcons"
        v-else
      />
    </template>
  </a-sub-menu>
</template>

<script>
export default {
  name: "subMenu",
  props: ["menuInfo", "navIcons"]
};
</script>
