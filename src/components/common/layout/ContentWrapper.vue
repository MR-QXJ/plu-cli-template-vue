// 功能内容包装
<template>
  <section class="h100 w100 wrapper" :style="wrapperStyle">
    <header class="w100 header" v-if="showHeader">
      <a-row :gutter="24">
        <a-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" :xxl="8">
          <section class="left">
            <breadcrumb-menu
              :loading="menuLoading"
              :menus="menuSelectedMenus"
              v-if="showBreadcrumbMenu"
            />
            <slot name="header-left-content"></slot>
          </section>
        </a-col>
        <a-col
          :xs="24"
          :sm="16"
          :md="16"
          :lg="16"
          :xl="16"
          :xxl="16"
          :style="{ textAlign: 'right' }"
        >
          <a-space size="middle">
            <slot name="header-right-content"></slot>
          </a-space>
        </a-col>
      </a-row>
    </header>
    <section ref="content" class="h100 w100 content">
      <section class="h100 w100 content-content" :style="contentStyle">
        <slot name="content"></slot>
      </section>
      <slot name="drawer"></slot>
    </section>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import BreadcrumbMenu from "components/common/menu/BreadcrumbMenu.vue";

export default {
  components: {
    BreadcrumbMenu
  },
  props: {
    // 包装样式
    wrapperStyle: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 内容样式
    contentStyle: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 是否显示头部
    showHeader: {
      type: Boolean,
      default: true
    },
    // 是否显示面包屑菜单
    showBreadcrumbMenu: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters("navMenu", ["menuLoading", "menuSelectedMenus"])
  },
  methods: {
    // 获取功能内容组件对象（外部调用）
    getContentComponent() {
      return this.$refs["content"];
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  @include flex;
  @include flex-column;
  overflow: hidden;
  padding: 0 24px 24px 24px;
  background-color: $color-background;

  .header {
    flex-shrink: 0;
    padding: 17px 0 25px 0;

    .left {
      @include flex;
      @include flex-secondary-axis-center;
    }
  }
  .content {
    position: relative;
    flex-shrink: 1;
    overflow: hidden;

    .content-content {
      @include flex;
      @include flex-column;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 0 20px;
      border-radius: 4px;
      box-shadow: 2px 0px 4px rgba(84, 84, 84, 0.1);
      background-color: $color-white;
    }
  }
}
</style>
