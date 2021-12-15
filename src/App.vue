// 入口页
<template>
  <a-config-provider :locale="locale">
    <!-- 全局配置空状态 -->
    <template #renderEmpty>
      <empty-simple-image desc="暂无数据" />
    </template>
    <div class="h100 w100" id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import EmptySimpleImage from "@/components/common/state/EmptySimpleImage.vue";
import { antModal } from "utils/feedback";

export default {
  name: "app",
  components: { EmptySimpleImage },
  data() {
    return {
      // 本地化语言
      locale: zhCN,
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
    },
    // 显示最小浏览尺寸提示
    displayMinSize: function() {
      this.showDisplayMinSizeNote =
        document.body.clientWidth < 1024 || document.body.clientHeight < 600;
      if (this.showDisplayMinSizeNote) {
        if (!this.displayMsg) {
          this.displayMsg = antModal(
            "warning",
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
  }
};
</script>

<style lang="scss">
@include common;
@include common-scroll;
@include h100;
@include w100;
@include ant-collapse-header-background("#e9e9e9");
@include ant-collapse-header-padding-top-bottom(5);

[v-cloak] {
  display: none;
}

body {
  overflow: hidden;
}

// 设置antdv ui组件额外的主题（antdv ui不支持自定义的样式的组件）
.ant-layout-header {
  height: 60px;
  line-height: 60px;
  padding: 0 24px;
}

.ant-collapse-item-no-bordered {
  border-bottom-width: 0 !important;
}

.ant-collapse-item-no-padding-both-sides {
  .ant-collapse-content > .ant-collapse-content-box {
    padding: 0 !important;
  }
}

.ant-collapse-item-disabled-same {
  .ant-collapse-header,
  .ant-collapse-header > .arrow {
    color: rgba(0, 0, 0, 0.85) !important;
  }
}

.ant-menu-inline,
.ant-menu-vertical,
.ant-menu-vertical-left {
  border-right: 0 solid #e8e8e8 !important;
}

.ant-menu-vertical-right {
  border-left: 0 solid #e8e8e8 !important;
}

.ant-menu-item-selected {
  color: $color-white !important;
}

.ant-menu-inline .ant-menu-item-selected::before {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  z-index: 1;
  display: block;
  height: 0;
  width: 0;
  margin-top: -10px;
  border: 10px solid $color-background;
  border-left-width: 12px;
  border-right-width: 12px;
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-top-color: transparent;
}

.ant-dropdown-menu-no-padding,
.ant-dropdown-menu-submenu-no-padding {
  .ant-dropdown-menu-item {
    padding: 0 !important;
  }
}

.ant-btn-link {
  height: auto;
  padding: 0;
}

.ant-list-item-nopadding {
  padding: 4px 0;

  .ant-list-item {
    padding-bottom: 0 !important;
    padding-top: 0 !important;
  }
}

.ant-table-fixed-left,
.ant-table-fixed-right {
  // 遮蔽input前后缀icon、table loading
  z-index: 4;
}

.ant-table-td-edit-content {
  .ant-form-item-required {
    .star {
      display: inline-block;
      margin-right: 8px;
      color: $color-error;
    }
    .has-error .ant-form-explain {
      padding-left: 16px;
    }
  }
}

.ant-pagination-item {
  line-height: 30px;
}

.ant-pagination-prev,
.ant-pagination-next,
.ant-pagination-jump-prev,
.ant-pagination-jump-next {
  line-height: 28px;
}

.ant-pagination-total-text,
.ant-pagination-item,
.ant-pagination-prev,
.ant-pagination-next,
.ant-pagination-jump-prev,
.ant-pagination-jump-next,
.ant-pagination-options {
  margin-top: 15px;
}

.ant-input-group-addon-blue {
  .ant-input-group-addon {
    border-width: 0;
    color: $color-white;
    background-color: $color-primary;
  }
}

.has-error {
  .ant-input-group-addon-blue {
    .ant-input-group-addon {
      border-width: 0;
      color: $color-white;
      background-color: $color-primary;
    }
  }
}

.ant-modal-mask,
.ant-drawer-mask {
  border-radius: 4px;
}

.ant-modal-absolute {
  position: absolute;
}

.image-uploader > .ant-upload,
.image-uploader > .ant-upload img {
  width: 128px;
  height: 128px;
}

.image-idcard-uploader {
  height: 160px;
}
.image-idcard-uploader
  .ant-upload.ant-upload-select-picture-card
  > .ant-upload {
  width: 180px;
  height: 200px;
  box-sizing: content-box;
}
.image-idcard-uploader .ant-upload {
  width: 180px;
  height: 200px;
}
.image-idcard-uploader .ant-upload img {
  width: 162px;
  height: 180px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: $color-font-light;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: $color-font-medium;
}

#app {
  overflow: hidden;
}
.table-row-value {
  @include text-ellipsis;
  display: block;
}
</style>
