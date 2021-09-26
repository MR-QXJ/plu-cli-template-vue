<template>
  <div class="w100 h100 insidevideo">
    <div class="h100 left-video">
      <iframe
        v-if="showVideo"
        ref="videoIframe"
        style="width:100%;height:100%"
        controls="controls"
        frameborder="0"
        allowfullscreen="true"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
      >
      </iframe>
    </div>
    <div class="h100 right-menu">
      <div class="prev"></div>
      <div class="next"></div>
      <div class="w100 camera-menu">
        <div
          v-for="(item, index) in cameraList"
          :key="index"
          :class="[activeIndex == index ? 'active' : '']"
          @click="changeVideo(item)"
        >
          {{ item.pointName }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getBuildVideoDevice } from "@/utils/api";
import { urlVideoPlayerOnline } from "@/utils/global";
import { dataIsNullNumber, dataIsNullArray } from "@/utils/tool";
export default {
  data() {
    return {
      videoUrl: "",
      showVideo: false,
      activeIndex: null,
      //当前高粱
      cameraList: []
    };
  },
  props: {
    buildId: {
      type: String,
      default: ""
    }
  },
  methods: {
    //获取视频
    getBuildVideoDeviceHandle: function() {
      this.showVideo = false;
      getBuildVideoDevice({
        buildId: this.buildId
      }).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullArray(res.data);
          if (data.length) {
            this.cameraList = JSON.parse(JSON.stringify(data));
            this.videoUrl = data[0].imei;
            this.showVideo = true;

            setTimeout(() => {
              this.$nextTick(() => {
                const videoPlayer = this.$refs["videoIframe"];
                if (videoPlayer) {
                  videoPlayer.setAttribute(
                    "src",
                    `${urlVideoPlayerOnline}?vid=${this.videoUrl}&platform=sc&channel=1&timestamp=${this.videoUrl}`
                  );
                }
              });
            }, 500);
          }
        }
      });
    },
    changeVideo: function(item) {
      this.activeIndex = item.index;
      setTimeout(() => {
        this.$nextTick(() => {
          const videoPlayer = this.$refs["videoIframe"];
          if (videoPlayer) {
            videoPlayer.setAttribute(
              "src",
              `${urlVideoPlayerOnline}?vid=${item.imei}&platform=sc&channel=1&timestamp=${item.imei}`
            );
          }
        });
      }, 500);
    }
  },
  mounted() {
    // this.getBuildVideoDeviceHandle();
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.insidevideo {
  padding: px2rem(50px) px2rem(58px);
  @include flex;
  @include flex-primary-axis-between;
  .left-video {
    width: px2rem(1500px);
    border: solid px2rem(2px) #01edf3;
    text-align: center;
    span {
      line-height: px2rem(800px);
      font-size: px2rem(25px);
      color: #56d8ff47;
    }
  }
  .right-menu {
    width: px2rem(168px);
    position: relative;

    .prev,
    .next {
      width: px2rem(62px);
      height: px2rem(40px);
      background: url("../../assets/img/fireresuce/wheel-point-bg.png") 0 0
        no-repeat;
      background-size: 100%;
      position: absolute;
      top: 0;
      left: 50%;
      margin-left: px2rem(-31px);
      z-index: 2;
    }
    .next {
      top: calc(100% - 0.8rem);
      transform: rotate(180deg);
      -webkit-transform: rotate(180deg);
      -ms-transform: rotate(180deg);
      -moz-transform: rotate(180deg);
    }
    .camera-menu {
      margin: px2rem(80px) 0;
      position: absolute;
      top: 0;
      left: 0;
      height: calc(100% - 3rem);
      @include flex;
      @include flex-column;
      overflow: auto;
      div {
        width: 100%;
        padding: px2rem(25px) px2rem(22px);
        margin-bottom: px2rem(78px);
        background: url("../../assets/img/fireresuce/wheel-bg.png");
        background-size: 100%;
        font-size: px2rem(25px);
        color: #56d8ff;
        text-align: center;
        transition: all 0.1s linear;
        &.active {
          background: #01edf3;
          color: #1c273c;
        }
      }
      // 滚动条
      &::-webkit-scrollbar {
        height: px2rem(0px);
        width: px2rem(0px);
      }
      // 槽
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
      //滑动块
      &::-webkit-scrollbar-thumb {
        background-color: transparent;
      }
    }
  }
}
</style>
