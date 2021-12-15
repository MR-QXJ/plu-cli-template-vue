// 功能内容包装左边树
<template>
  <section class="h100 w100 wrapper">
    <header class="w100 header">
      <a-row :gutter="24">
        <a-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" :xxl="8">
          <section class="left">
            <breadcrumb-menu
              :loading="menuLoading"
              :menus="menuSelectedMenus"
            />
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
      <section
        class="h100 left"
        :style="{
          width: leftCollapsed ? '0' : '236px'
        }"
      >
        <header class="w100 header">
          <slot name="leftHeader" v-if="$slots.leftHeader"></slot>
          <span class="title" v-cloak v-else>{{ title }}</span>
        </header>
        <section class="h100 w100 left-content">
          <slot name="leftContent"></slot>
        </section>
        <a-tooltip
          placement="top"
          :title="
            $t(leftCollapsed ? 'leftTrigger.expand' : 'leftTrigger.collapse')
          "
        >
          <a
            class="trigger"
            :style="{ right: leftCollapsed ? '-22px' : '-18px' }"
            @click="handleTriggeLeft"
          >
            <a-icon
              :type="leftCollapsed ? 'menu-unfold' : 'menu-fold'"
              :style="{ color: '#999999', fontSize: '18px' }"
            />
          </a>
        </a-tooltip>
      </section>
      <section class="h100 w100 right-content">
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
    // 标题
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // 左栏是否折叠
      leftCollapsed: false
    };
  },
  computed: {
    ...mapGetters("navMenu", ["menuLoading", "menuSelectedMenus"])
  },
  methods: {
    // 左栏切换折叠
    handleTriggeLeft() {
      this.leftCollapsed = !this.leftCollapsed;
    },
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
    @include flex;
    position: relative;
    overflow: hidden;

    .left {
      @include flex;
      @include flex-column;
      @include transition-width(0.3s);
      position: relative;
      flex-shrink: 0;
      margin-right: 22px;
      border-radius: 4px;
      box-shadow: 2px 0px 4px rgba(84, 84, 84, 0.1);
      background-color: $color-white;

      .header {
        @include flex;
        @include flex-secondary-axis-center;
        flex-shrink: 0;
        overflow: hidden;
        height: 56px;
        border-bottom: 1px solid #e8e8e8;

        .title {
          margin-left: 19px;
          color: $color-font-medium;
          font-size: 18px;
        }
      }
      .left-content {
        flex-shrink: 1;
        overflow: auto;
      }
      .trigger {
        position: absolute;
        top: 0;
      }
    }
    .right-content {
      @include flex;
      @include flex-column;
      flex-shrink: 1;
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
