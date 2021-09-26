<template>
  <div :class="['panel', className]" :style="`height:${height}px`">
    <div
      :class="['panel-title', bottomline ? 'bottom-line' : '']"
      v-if="title !== ''"
    >
      {{ title }}
    </div>
    <div class="panel-content">
      <div class="w100 h100 loading-container" v-if="loading">
        <van-loading type="spinner" />
      </div>
      <div class="w100 h100 empty-container" v-if="isEmpty">
        <div class="emptyData">暂无数据</div>
      </div>
      <slot> </slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    height: {
      type: String,
      default: "auto"
    },
    title: {
      type: String,
      default: ""
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    bottomline: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="scss" scoped>
.panel {
  position: relative;
  margin: 15px;
  width: 345px;
  border-radius: 5px;
  box-shadow: 0 5px 10px #efefef;
  background: #fff;
  overflow: auto;
  .panel-title {
    font-size: 15px;
    line-height: 44px;
    padding-left: 18px;
    font-weight: 600;
    &.bottom-line {
      border-bottom: 1px solid #eee;
      margin-bottom: 20px;
    }
  }
  .panel-content {
    height: calc(100% - 44px);
    .loading-container,
    .empty-container {
      z-index: 2;
      position: absolute;
      top: 0;
      left: 0;
    }
    .van-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
      width: px2rem(50px);
      height: px2rem(50px);
    }
  }
}
</style>
