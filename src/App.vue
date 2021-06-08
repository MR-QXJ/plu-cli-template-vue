// 入口页
<template>
  <a-config-provider :locale="locale">
    <div class="h100 w100" id="app">
      <router-view ref="child" />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";

export default {
  name: "app",
  data() {
    return {
      // 本地化语言
      locale: zhCN
      // 是否显示最小浏览尺寸提示
      // showDisplayMinSizeNote: false,
      // 最小浏览尺寸提示框
      // displayMsg: null,
    };
  },
  computed: {},
  methods: {
    // 隐藏页面初始化loading
    hideLoading: function() {
      document.getElementsByClassName("enter")[0].style.display = "none";
    }
    // 显示最小浏览尺寸提示
    // displayMinSize: function() {
    //   this.showDisplayMinSizeNote =
    //     document.body.clientWidth < 1024 || document.body.clientHeight < 600;
    //   if (this.showDisplayMinSizeNote) {
    //     if (!this.displayMsg) {
    //       this.displayMsg = this.$root.showMessageModal(
    //         "warning",
    //         "提醒",
    //         "为了您更好的体验，建议使用分辨率1024×600及以上浏览",
    //         () => {
    //           this.displayMsg.destroy();
    //           this.displayMsg = null;
    //         }
    //       );
    //     }
    //   } else {
    //     if (this.displayMsg) {
    //       this.displayMsg.destroy();
    //       this.displayMsg = null;
    //     }
    //   }
    // }
  },
  mounted() {
    this.hideLoading();
  }
};
</script>

<style lang="scss">
@import "../src/assets/font/iconfont.css";
@include html-font-size();
@include common;
@include a-common;
@include input-common;
@include ul-common;
$color-scrollbar-thumb-bg: rgba(193, 193, 193, 0.6);
.h100 {
  height: 100%;
  &.ant-row {
    height: 100% !important;
  }
}
.w100 {
  width: 100%;
}
.spin-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
//暂无数据通用
.no-data-occupy {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #979797;
  z-index: 5;
}
[v-cloak] {
  display: none;
}
html,
body {
  color: $color-black;
  font-size: 12px;
  font-family: "SourceHanSansCN-Regular", "Helvetica Neue", Helvetica,
    "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
  height: 100%;
  overflow: hidden;
  width: 100%;
}
// 滚动条
div::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
div::-webkit-scrollbar-track {
  background-color: $color-white;
}
.nav::-webkit-scrollbar-track {
  background-color: $color-background;
}
div::-webkit-scrollbar-thumb {
  background-color: $color-scrollbar-thumb-bg;
  border-radius: 50px;
}
ul {
  margin-bottom: 0;
}
ul::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
ul::-webkit-scrollbar-track {
  background-color: $color-white;
}
ul::-webkit-scrollbar-thumb {
  background-color: $color-scrollbar-thumb-bg;
  border-radius: 50px;
}
// 滚动条
form::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
form::-webkit-scrollbar-track {
  background-color: $color-white;
}
form::-webkit-scrollbar-thumb {
  background-color: $color-scrollbar-thumb-bg;
  border-radius: 50px;
}
textarea::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
textarea::-webkit-scrollbar-track {
  background-color: $color-white;
}
textarea::-webkit-scrollbar-thumb {
  background-color: $color-scrollbar-thumb-bg;
  border-radius: 50px;
}
iframe::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
iframe::-webkit-scrollbar-track {
  background-color: $color-white;
}
iframe::-webkit-scrollbar-thumb {
  background-color: $color-scrollbar-thumb-bg;
  border-radius: 50px;
}
.ant-popover {
  .anticon.anticon-exclamation-circle {
    font-size: 18px;
    top: 6px;
  }
}
.ant-select-dropdown-menu {
  max-height: 260px;
}
//antd导航菜单hover
// .ant-menu-item.ant-menu-item-active {
//   color: white;
// }
// .ant-menu-inline-collapsed > .ant-menu-item,
// .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
//   padding: 0 20px !important;
// }

// antd导航菜单
// .ant-menu-inline,
// .ant-menu-vertical,
// .ant-menu-vertical-left {
//   border-right-width: 0;

//   // 未收缩当前菜单（没有子菜单）
//   .ant-menu-item-selected {
//     color: $color-white;
//   }
// }
// // 当前菜单箭头
// .ant-menu-vertical .ant-menu-item:after,
// .ant-menu-vertical-left .ant-menu-item:after,
// .ant-menu-vertical-right .ant-menu-item:after,
// .ant-menu-inline .ant-menu-item:after {
//   bottom: 50%;
//   display: block;
//   border: solid 13px $color-background;
//   border-top-width: 10px;
//   border-bottom-width: 10px;
//   border-top-color: transparent;
//   border-bottom-color: transparent;
//   border-left-color: transparent;
//   height: 0;
//   margin-top: -10px;
//   top: 50%;
//   width: 0;
// }
// // 收缩当前菜单父菜单背景色
// .ant-menu-inline-collapsed {
//   .ant-menu-submenu-selected {
//     .ant-menu-submenu-title {
//       background-color: #318db3;
//     }
//   }
// }
// antd输入框
.ant-input-group-addon {
  border-width: 0;
}
// 验证错误时
.has-error .ant-input-group-addon {
  background-color: #e8e8e8;

  .icon {
    color: rgba(0, 0, 0, 0.65);
  }
}
.ant-input-group-addon-blue {
  .ant-input-group-addon {
    background-color: #37a7c9;
  }
  .has-error .ant-input-group-addon {
    background-color: #37a7c9;
  }
}
// antd按钮loading图标
.anticon-loading-button {
  color: $color-white;
  font-size: 20px;
  left: 50%;
  margin-left: -10px;
  margin-top: -10px;
  position: absolute;
  top: 50%;
}
// antd表格树loading图标
.anticon-loading-tabletree {
  color: $color-primary;
  margin-right: 10px;
}
// antd输入框密码
.ant-input-pass,
.ant-input-group-pass .ant-input {
  font-family: PasswordEntry;
  ime-mode: disabled;
  // -webkit-text-security: disc;
}
.ant-input-pass::-webkit-input-placeholder,
.ant-input-group-pass .ant-input::-webkit-input-placeholder {
  font-family: "Microsoft YaHei", "微软雅黑", "Helvetica Neue", Helvetica,
    "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
}
.ant-input-pass::-moz-input-placeholder,
.ant-input-group-pass .ant-input::-moz-input-placeholder {
  font-family: "Microsoft YaHei", "微软雅黑", "Helvetica Neue", Helvetica,
    "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
}
.ant-input-pass:-ms-input-placeholder,
.ant-input-group-pass .ant-input:-ms-input-placeholder {
  font-family: "Microsoft YaHei", "微软雅黑", "Helvetica Neue", Helvetica,
    "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
}
// antd输入框密码可见
.ant-input-group-pass-text .ant-input {
  ime-mode: disabled;
}
// antd表单查询无验证
.ant-form-search-noverification {
  .ant-form-item {
    @include flex;
    margin-bottom: 13px;
  }
  .ant-form-item-control-wrapper {
    flex: 1;
  }
}
//antd弹窗
.ant-modal {
  transition: width 0.3s, height 0.25s;
}

// 思极地图隐藏logo
.epgis-logo,
.epgis-attribution {
  visibility: hidden;
}
// 思极地图隐藏logo比例尺位置
.epgis-ctrl-scale2 {
  left: 5px;
}

//超图撒点弹窗
.smPopupContent {
  padding: 0 !important;
  .supermap-infowindow-content {
    background-color: $color-white;
    border-radius: 5px;
    cursor: default;
    height: 100%;
    width: 100%;
    .row {
      @include flex;
      line-height: 25px;
      max-width: 200px;
      padding: 0 10px;
      &.head {
        @include flex;
        @include flex-primary-axis-center;
        @include flex-secondary-axis-center;
        background: #5b6996;
        line-height: 30px;
        padding: 0 20px;
        span {
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: white;
        }
        .icon-more {
          width: 15px;
          height: 15px;
          background: url("./assets/imgs/pub/bars.png") 0 0 no-repeat;
          background-size: 100%;
          position: absolute;
          right: 2px;
          &:hover {
            cursor: pointer;
          }
        }
      }
      &.bottom {
        line-height: normal;
        padding: 10px 0;
        @include flex;
        @include flex-primary-axis-center;
        color: #43cdd3;
        &:hover {
          cursor: pointer;
        }
      }

      span {
        @include text-ellipsis;
        color: $color-font2;
        display: block;
        flex-shrink: 1;
        font-size: 12px;
        width: 100%;

        &.title {
          color: $color-font1;
          flex-shrink: 0;
          text-align: right;
          width: auto;
        }
      }
    }
    .close {
      display: block;
      position: absolute;
      right: 6px;
      top: 6px;
      z-index: 1;

      .icon {
        color: #72a9e4;
        font-weight: bold;
      }
    }
  }
}
// 超图文字编辑框
.supermap-textedit-content {
  background-color: $color-white;
  cursor: default;
  padding: 8px 16px 8px 8px;
  position: relative;

  input {
    border: solid 1px #bdc4ca;
    border-radius: 3px;
    height: 30px;
    padding: 0 4px;
    width: 200px;
  }
  .close {
    display: block;
    position: absolute;
    right: 6px;
    top: 6px;
    z-index: 1;

    .icon {
      color: #666;
      font-size: 16px;
      font-weight: bold;
    }
  }
}
// 超图截图预览
.supermap-screenshot-preview {
  .preview-tool {
    @include flex;
    background-color: $color-white;
    border: solid 1px $color-font3;
    border-radius: 3px;
    height: 30px;
    overflow: hidden;
    position: absolute;
    right: 15px;
    top: 15px;
    z-index: 1;

    .button {
      background-color: $color-white;
      border-right: dashed 1px $color-font3;
      color: $color-font2;
      display: block;
      flex-shrink: 0;
      font-size: 14px;
      height: 30px;
      line-height: 30px;
      margin: 0;
      padding: 0;
      text-align: center;
      width: 50px;

      input {
        background-color: rgba(0, 0, 0, 0);
        border: none;
      }
    }
    .button:last-child {
      border-right-width: 0;
    }
    .button:hover {
      background-color: #eaeaea;
    }
  }
}
</style>
