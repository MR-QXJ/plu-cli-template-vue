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
import { antModal } from "utils/tools/feedback";

export default {
  name: "app",
  data() {
    return {
      // 本地化语言
      locale: zhCN,
      // 初始显示最小浏览尺寸提示
      showDisplayMinSizeNote: false,
      // 最小浏览尺寸提示框实例
      displayMsg: null
    };
  },
  methods: {
    // 隐藏页面初始化loading
    hideLoading: function() {
      document.getElementsByClassName("enter")[0].style.display = "none";
    },
    // 显示最小浏览尺寸提示
    displayMinSize: function() {
      this.showDisplayMinSizeNote =
        document.body.clientWidth < 1024 || document.body.clientHeight < 600;
      if (this.showDisplayMinSizeNote) {
        if (!this.displayMsg) {
          this.displayMsg = antModal(
            "warning",
            "提醒",
            "为了您更好的体验，建议使用分辨率1024×600及以上浏览",
            () => {
              this.displayMsg.destroy();
              this.displayMsg = null;
            }
          );
        }
      } else {
        if (this.displayMsg) {
          this.displayMsg.destroy();
          this.displayMsg = null;
        }
      }
    }
  },
  mounted() {
    this.displayMinSize();
    window.onresize = this.displayMinSize;

    this.hideLoading();
  }
};
</script>

<style lang="scss">
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
.ant-input-group-pass .ant-input::-ms-input-placeholder {
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
    display: flex;
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
</style>
