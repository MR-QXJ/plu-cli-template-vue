// 入口页
<template>
  <div class="h100 w100" id="app">
    <router-view />
  </div>
</template>

<script>
import { alert } from "utils/feedback";

export default {
  name: "app",
  data() {
    return {
      // 初始显示最小浏览尺寸提示
      showDisplayMinSizeNote: false,
      // 最小浏览尺寸提示框实例
      displayMsg: null,
      // 首屏加载动画关闭延时器
      firstScreenLoadingCloseT: null
    };
  },
  mounted() {
    this.displayMinSize();
    window.onresize = this.displayMinSize;

    this.firstScreenLoadingClose();
  },
  beforeDestroy() {
    this.firstScreenLoadingCloseStop();
  },
  methods: {
    // 显示最小浏览尺寸提示
    displayMinSize() {
      this.showDisplayMinSizeNote =
        document.body.clientWidth < 1024 || document.body.clientHeight < 600;
      if (this.showDisplayMinSizeNote) {
        if (!this.displayMsg) {
          this.displayMsg = alert(
            "为了您更好的体验，建议使用分辨率1024×600及以上浏览"
          ).then(() => {
            this.displayMsg = null;
          });
        }
      }
    },
    // 延时关闭首屏加载动画
    firstScreenLoadingClose() {
      this.firstScreenLoadingCloseT = setTimeout(() => {
        let firstScreenLoading = document.getElementById("firstScreenLoading");
        if (firstScreenLoading) {
          document.body.removeChild(firstScreenLoading);
          this.firstScreenLoadingCloseStop();
        }
        firstScreenLoading = null;
      }, 1000);
    },
    // 延时关闭首屏加载动画停止
    firstScreenLoadingCloseStop() {
      if (this.firstScreenLoadingCloseT) {
        clearTimeout(this.firstScreenLoadingCloseT);
        this.firstScreenLoadingCloseT = null;
      }
    }
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
</style>
