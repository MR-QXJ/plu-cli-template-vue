<template>
  <a-modal
    centered
    :footer="null"
    :get-container="() => container"
    :mask-closable="false"
    :mask-style="{ position: 'absolute' }"
    wrap-class-name="ant-modal-absolute"
    :bodyStyle="{ padding: 0, height: '500px' }"
    :title="`视频${videoName !== '' ? '-' : ''}${videoName}`"
    :width="780"
    v-model="showVideo"
    @cancel="cancelPlayVideoHandle"
  >
    <iframe
      ref="videoplayer"
      class="h100 w100"
      frameborder="0"
      scrolling="no"
      allowFullScreen="true"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      v-if="showVideo"
    />
  </a-modal>
</template>

<script>
export default {
  props: {
    container: {
      type: Object,
      default: null
    },
    value: {
      type: Boolean,
      default: false
    },
    videoName: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      showVideo: false
    };
  },
  watch: {
    value(to) {
      this.showVideo = to;
    },
    showVideo(to) {
      this.$emit("input", to);
      if (to && this.url) {
        this.$nextTick(() => {
          this.$refs.videoplayer.src = this.url;
        });
      }
    }
  },
  methods: {
    cancelPlayVideoHandle() {
      this.$emit("cancel");
    }
  }
};
</script>
