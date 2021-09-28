<template>
  <div class="full-screen" id="app">
    <router-view ref="child"></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
  methods: {}
};
</script>

<style lang="scss">
@include common;
@include a-common;
@include input-common;
@include ul-common;

* {
  -webkit-overflow-scrolling: touch;
}
.h100 {
  height: 100%;
}
.w100 {
  width: 100%;
}
[v-cloak] {
  display: none;
}
html,
body {
  overflow: hidden;
  height: 100%;
  /* 兼容ios >=11.2 ,meta上需加上 viewport-fit 才生效 */
  padding-bottom: env(safe-area-inset-bottom);
  width: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
[class*="van-hairline"]::after {
  border-top: 1px solid #aaa !important;
  border-bottom: 1px solid #aaa !important;
}
input,
button {
  outline: none;
  border: 0;
}

.full-screen {
  height: 100%;
  left: 0;
  margin: 0 auto;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  overflow: hidden;
}
.page {
  padding-bottom: 50px;
  width: 100%;
  height: 100%;
  background: #efeff4;
  @include page-none-data;
  .van-nav-bar {
    background: #0e41a6;
    /deep/.van-nav-bar__title {
      color: #fff;
    }
  }
}
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.title-text {
  color: #2a57b7;
}
// 滚动条
*::-webkit-scrollbar {
  height: px2rem(5px) !important;
  width: px2rem(6px) !important;
}
// 槽
*::-webkit-scrollbar-track {
  background-color: transparent !important;
}
//滑动块
*::-webkit-scrollbar-thumb {
  background-color: #d1d1d1 !important;
  border-radius: px2rem(5px) !important;
}

//vant样式
//输入框
.van-cell.van-field {
  padding: 0;
  background: transparent;
  &:after {
    content: "";
    display: none;
  }
}
//顶部导航
.van-nav-bar {
  .van-nav-bar__left {
    .van-icon-arrow-left {
      color: #fff;
    }
  }
  .van-nav-bar__title {
    color: #fff;
  }
}

//蒙层背景
.van-picker {
  // .van-picker__toolbar {
  //   height: px2rem(80px);
  //   button {
  //     font-size: px2rem(35px);
  //   }
  // }
  // .van-picker__columns {
  //   height: 440px !important;
  //   .van-picker-column__wrapper {
  //     line-height: 88px !important;
  //     .van-picker-column__item {
  //       font-size: px2rem(30px);
  //       height: 88px !important;
  //     }
  //   }
  //   .van-picker__frame {
  //     height: 88px !important;
  //   }
  // }

  .van-picker__mask {
    background: white;
  }
  //picker
  .van-picker-column {
    z-index: 3;
  }
}
//分页
.van-pagination {
  display: block !important;
  height: 100%;
  margin: 0 auto;
  border: px2rem(2px) solid #00f3f9;
  li {
    float: left;
    display: block;
  }
}
//分页
.van-pagination__item {
  width: px2rem(130px) !important;
  height: px2rem(87px) !important;
  background: #1c273e !important;
  text-align: center;
  line-height: px2rem(87px);
  font-size: px2rem(25px);
  color: #00c3de !important;
  &.van-pagination__prev,
  &.van-pagination__next {
    padding: 0;
    max-width: px2rem(150px);
    background: #1c273e !important;
    color: #00c3de !important;
    width: px2rem(150px) !important;
    height: px2rem(87px) !important;
    line-height: px2rem(87px);
  }
  &.van-pagination__item--active {
    background: #1c273e !important;
    color: #00c3de73 !important;
  }
  &::after {
    border: px2rem(2px) solid #00c3de !important;
  }
}
//loading
// .van-loading {
//   position: absolute !important;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   span {
//     width: px2rem(75px);
//     height: px2rem(50px);
//   }
//   .van-loading__text {
//     font-size: 12px;
//   }
// }

//photo-preview
.pswp__button {
  // transform: scale(2);
}
.van-overlay {
  // z-index: 5 !important;
  // 覆盖echart的tooltip
  // z-index: 99999999 !important;
}
.van-popup {
  z-index: 99999999 !important;
}
// .BMap_bubble_title {
//   a {
//     display: none;
//   }
// }

// .BMap_cpyCtrl {
//   display: none;
// }

// .anchorBL {
//   display: none;
// }
</style>
