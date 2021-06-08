// 树操作区
<template>
  <div class="h100 w100 treeoper">
    <div class="w100 title" v-cloak v-if="title !== ''">{{ title }}</div>
    <div class="w100 bar" v-if="$slots.bar">
      <slot name="bar"></slot>
    </div>
    <div class="w100 search" v-if="$slots.search">
      <slot name="search"></slot>
    </div>
    <div class="w100 content" :style="contentStyle">
      <div class="w100 loading" v-show="loading">
        <a-spin :spinning="loading" />
      </div>
      <div class="w100 no-data" v-show="noData">暂无数据</div>
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "treeoper",
  props: {
    // 标题
    title: {
      type: String,
      default: ""
    },
    // 是否加载数据
    loading: {
      type: Boolean,
      default: false
    },
    // 是否暂无数据
    noData: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // 内容样式
    contentStyle: function() {
      return {
        height: "100%",
        paddingTop: `${
          !this.$slots.bar && !this.$slots.search ? "14px" : "0px"
        }`
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.treeoper {
  @include flex;
  @include flex-column;
  flex-shrink: 1;
  overflow: hidden;

  .title {
    color: $color-font2;
    flex-shrink: 0;
    font-size: 14px;
    height: 34px;
    line-height: 14px;
    padding: 20px 20px 0 20px;
  }
  .bar {
    @include flex;
    @include flex-primary-axis-center;
    flex-shrink: 0;
    padding-top: 20px;
  }
  .search {
    flex-shrink: 0;
    height: 66px;
    padding: 20px 20px 14px 20px;
  }
  .content {
    flex-shrink: 1;
    overflow: auto;
    padding: 0 10px 4px 4px;
    position: relative;

    .loading {
      @include flex;
      @include flex-primary-axis-center;
      background-color: $color-white;
      left: 0;
      margin-top: -11px;
      position: absolute;
      top: 50%;
      z-index: 1;
    }
    .no-data {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      padding: 16px 0;
      text-align: center;
    }
  }
}
</style>
