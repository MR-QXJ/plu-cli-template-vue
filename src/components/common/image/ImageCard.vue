// 图片卡片
<template>
  <section class="image-card" :style="wrapperStyle" @click.stop="() => {}">
    <img
      class="h100 w100 image"
      :src="imageSrc"
      :data-src="imageSrc"
      v-if="showImage"
      @load="handleLoad"
      @error="handleError"
      @mouseover="handleMouseOver"
      @mouseout="handleMouseOut"
    />
    <a-icon
      :style="{ fontSize: '80px', color: '#cccccc' }"
      type="picture"
      v-if="showImageDef"
    />
    <section class="loading" v-show="showImage && loading">
      <a-icon :style="{ fontSize: '20px', color: '#cccccc' }" type="loading" />
    </section>
    <section
      class="tool-cover"
      v-show="showImage && showToolCover"
      @mouseover="handleMouseOver"
      @mouseout="handleMouseOut"
    >
      <a-icon
        :style="{ fontSize: '14px', color: '#ffffff', cursor: 'pointer' }"
        :type="cover"
        :title="title"
        @click.stop="handleOpenPreview"
      />
    </section>
    <a-modal
      v-if="!diyPreview"
      centered
      destroyOnClose
      :footer="null"
      :get-container="() => container"
      :mask-style="{ position: 'absolute' }"
      wrapClassName="ant-modal-absolute"
      v-model="imagePreviewVisible"
      @cancel="handleClosePreview"
    >
      <img class="w100 image-preview" :src="imageSrc" />
    </a-modal>
  </section>
</template>

<script>
export default {
  props: {
    // 样式
    wrapperStyle: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 图片地址
    url: {
      type: String,
      default: ""
    },
    // 图片懒加载地址
    urlLazyLoad: {
      type: String,
      default: null
    },
    //hover提示
    title: {
      type: String,
      default: "图片预览"
    },
    //遮罩图标类型
    cover: {
      type: String,
      default: "eye"
    },
    // 自定义图片预览 为true点击图片不会弹窗，会触发preview事件
    diyPreview: {
      type: Boolean,
      default: false
    },
    // 图片预览挂载容器
    container: null
  },
  data() {
    return {
      // 是否加载图片
      loading: true,
      // 是否加载图片错误
      loadError: false,
      // 是否显示工具遮罩层
      showToolCover: false,
      // 是否显示图片预览
      imagePreviewVisible: false
    };
  },
  computed: {
    // 图片地址
    imageSrc() {
      return this.urlLazyLoad === null ? this.url : this.urlLazyLoad;
    },
    // 是否显示图片
    showImage() {
      return (
        (this.urlLazyLoad === null && this.url !== "") ||
        (this.urlLazyLoad !== null && this.urlLazyLoad !== "")
      );
    },
    // 是否显示默认图片
    showImageDef() {
      return (
        (this.urlLazyLoad === null && this.url === "") ||
        (this.urlLazyLoad !== null && this.urlLazyLoad === "") ||
        this.loadError
      );
    }
  },
  methods: {
    // 图片加载
    handleLoad() {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    // 图片加载错误
    handleError() {
      this.loadError = true;
    },
    // 鼠标移至图片
    handleMouseOver() {
      this.showToolCover = true;
    },
    // 鼠标移开图片
    handleMouseOut() {
      this.showToolCover = false;
    },
    // 打开图片预览
    handleOpenPreview() {
      if (this.diyPreview) return this.$emit("preview");
      this.imagePreviewVisible = true;
    },
    // 关闭图片预览
    handleClosePreview() {
      this.imagePreviewVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.image-card {
  @include flex;
  @include flex-primary-axis-center;
  @include flex-secondary-axis-center;
  padding: 4px;
  position: relative;
  flex-shrink: 0;
  border: 1px solid #e8e8e8;
  border-radius: 3px;

  .image {
    object-fit: contain;
  }
  .loading,
  .tool-cover {
    @include flex;
    @include flex-primary-axis-center;
    @include flex-secondary-axis-center;
    left: 4px;
    top: 4px;
    position: absolute;
    height: calc(100% - 8px);
    width: calc(100% - 8px);
    background-color: rgba($color-black, 0.4);
  }
  .loading {
    background-color: $color-white;
  }
}
</style>
