<template>
  <div class="w100 panelpart" :style="{ height: height }">
    <!-- 角 -->
    <div class="panel-angle">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <!-- 边线 -->
    <div class="panel-line">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <!-- 标题 -->
    <div class="panelpart-head" v-if="title">
      <span class="w100 ">{{ title }}</span>
    </div>

    <div
      class="w100 panelpart-content"
      :style="{
        height: title ? 'calc(100% - 0.9rem)' : '100%',
        top: title ? '0.9rem' : '0rem'
      }"
    >
      <div class="w100 h100 loading-container" v-if="loading">
        <van-loading type="spinner" />
      </div>
      <div class="w100 h100 empty-container" v-if="isEmpty">
        <div class="emptyData">暂无数据</div>
      </div>
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "panelpart",
  data() {
    return {};
  },
  props: {
    //高度
    height: {
      type: String,
      default: "auto"
    },
    //头部标题
    title: {
      type: String,
      default: ""
    },
    //是否loading
    loading: {
      type: Boolean,
      default: false
    },
    //数据是否为空
    isEmpty: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  methods: {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.panelpart {
  position: relative;
  .panel-angle div {
    width: px2rem(48px);
    height: px2rem(48px);
    background: url("../../assets/img/fireresuce/panel-angel.png") 0 0 no-repeat;
    background-size: 100%;
    position: absolute;
    left: 0;
    &:nth-child(2) {
      background: url("../../assets/img/fireresuce/panel-angel.png") 0 0
        no-repeat;
      background-size: 100%;
      left: calc(100% - 0.9rem);
      transform: rotate(90deg);
      -webkit-transform: rotate(90deg);
      -ms-transform: rotate(90deg);
      -o-transform: rotate(90deg);
      -moz-transform: rotate(90deg);
    }
    &:nth-child(3) {
      background: url("../../assets/img/fireresuce/panel-angel.png") 0 0
        no-repeat;
      background-size: 100%;
      top: calc(100% - 0.87rem);
      transform: rotate(270deg);
      -webkit-transform: rotate(270deg);
      -ms-transform: rotate(270deg);
      -o-transform: rotate(270deg);
      -moz-transform: rotate(270deg);
    }
    &:nth-child(4) {
      background: url("../../assets/img/fireresuce/panel-angel.png") 0 0
        no-repeat;
      background-size: 100%;
      left: calc(100% - 0.9rem);
      top: calc(100% - 0.87rem);
      transform: rotate(180deg);
      -webkit-transform: rotate(180deg);
      -ms-transform: rotate(180deg);
      -o-transform: rotate(180deg);
      -moz-transform: rotate(180deg);
    }
  }
  .panel-line div {
    position: absolute;
    top: 0;
    width: calc(100% - 1.78rem);
    height: px2rem(2px);
    background: #00faff;
    left: px2rem(48px);

    &:nth-child(2) {
      top: calc(100% - 0.037rem);
    }
    &:nth-child(3) {
      height: calc(100% - 1.76rem);
      width: px2rem(2px);
      background: #00faff;
      left: px2rem(0px);
      top: px2rem(48px);
    }
    &:nth-child(4) {
      height: calc(100% - 1.76rem);
      width: px2rem(2px);
      background: #00faff;
      left: calc(100% - 0.037rem);
      top: px2rem(48px);
    }
  }
  .panelpart-head {
    height: px2rem(50px);
    padding: 0 px2rem(45px);
    font-size: px2rem(25px);
    color: #00faff;
    line-height: px2rem(50px);
    border-bottom: px2rem(2px) solid #00faff;
    position: relative;
    span {
      display: inline-block;
    }
  }
  .panelpart-content {
    position: absolute;
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
    .emptyData {
      position: absolute;
      transform: translate(-50%, -50%);
      top: 50%;
      left: 50%;
      z-index: 10;
      color: #00faff;
      font-size: px2rem(25px);
    }
  }
}
</style>
