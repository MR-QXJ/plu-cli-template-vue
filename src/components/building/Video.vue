<template>
  <div class="w100 h100 tab-content-item video">
    <div class="w100 video-container">
      <div class="iframe-container" style="width:100%;height:200px;">
        <iframe
          control
          class="w100 h100"
          ref="videoplayer"
          frameborder="0"
          scrolling="no"
          allowfullscreen="true"
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          v-if="showVideo"
        />
        <p
          v-if="!videoList.length"
          style="text-align:center;color:#b1b1b1;font-size:12px;line-height:180px"
        >
          暂无数据
        </p>
      </div>

      <div class="address">
        <span style="font-size:12px;color:#111">位置：{{ address }}</span>
      </div>
      <div class="video-main">
        <div class="videoList">
          <p>监控视频列表</p>
          <van-row class="w100">
            <p
              v-if="!videoList.length"
              style="text-align:center;color:#b1b1b1;font-size:12px;padding:1rem 0"
            >
              暂无数据
            </p>
            <van-col
              :class="['w100', activeIndex == index ? 'active' : '']"
              v-for="(item, index) in videoList"
              :key="index"
              @click="checkItem(item, index)"
            >
              <span>
                <van-badge
                  class="status"
                  dot
                  :color="
                    item.status == 1
                      ? '#07c160'
                      : item.status == 2
                      ? '#ee0a24'
                      : '#ccc'
                  "
                />{{ item.name }}</span
              >
              <span>{{ activeIndex == index ? "当前" : "" }}</span>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { urlVideoPlayerOnline } from "@/utils/global";
import { getBSBuildVideoList } from "@/utils/api";
import { dataIsNullArray, dataIsNullNumber } from "@/utils/tool";
export default {
  data() {
    return {
      showVideo: false,
      activeIndex: 0,
      address: "",
      player: null,
      videoList: []
    };
  },
  props: {
    buildId: { type: String, default: "" }
  },
  methods: {
    // 创建播放器
    // createPlayer(featureId) {
    //   if (!this.player) {
    //     // eslint-disable-next-line no-undef
    //     this.player = plus.video.createVideoPlayer("videoPlayer", {
    //       src: `${urlVideoPlayerOnline}?vid=${featureId}&platform=sc&channel=1&timestamp=${featureId}`,
    //       top: "94px",
    //       left: "0px",
    //       width: "100%",
    //       height: "200px",
    //       position: "static"
    //     });
    //     // eslint-disable-next-line no-undef
    //     plus.webview.currentWebview().append(this.player);
    //     this.player.play();
    //   }
    // },
    // destroyPlayer() {
    //   // eslint-disable-next-line no-undef
    //   let video = plus.video.getVideoPlayerById("videoPlayer");
    //   // eslint-disable-next-line no-undef
    //   plus.webview.currentWebview().remove(video);
    //   // eslint-disable-next-line no-undef
    //   this.player && plus.webview.currentWebview().remove(this.player);
    //   video && video.close();
    //   this.player && this.player.close();
    //   this.player = null;
    // },
    getList() {
      getBSBuildVideoList({
        buildId: this.buildId,
        pageNo: 1,
        pageSize: 0
      }).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullArray(res.data);
          if (!data.length) {
            return;
          }
          this.videoList = data;
          this.address = data[0].address;

          setTimeout(() => {
            this.showVideo = true;
            this.$nextTick(() => {
              const videoPlayer = this.$refs["videoplayer"];
              if (videoPlayer) {
                videoPlayer.setAttribute(
                  "src",
                  `${urlVideoPlayerOnline}?vid=${data[0].featureId}&platform=sc&channel=1&timestamp=${data[0].featureId}`
                );
              }
            });
          }, 500);
        }
      });
    },
    checkItem(item, index) {
      this.showVideo = false;
      this.activeIndex = index;
      this.address = item.address;
      setTimeout(() => {
        this.showVideo = true;
        this.$nextTick(() => {
          const videoPlayer = this.$refs["videoplayer"];
          if (videoPlayer) {
            videoPlayer.setAttribute(
              "src",
              `${urlVideoPlayerOnline}?vid=${item.featureId}&platform=sc&channel=1&timestamp=${item.featureId}`
            );
          }
        });
      }, 500);
      // eslint-disable-next-line no-undef
      // let video = plus.video.getVideoPlayerById("videoPlayer");
      // video.setStyles({
      //   src: `${urlVideoPlayerOnline}?vid=${item.featureId}&platform=sc&channel=1&timestamp=${item.featureId}`
      // });
    }
  },
  mounted() {
    // this.createPlayer();
    this.getList();
  },
  destroyed() {
    console.log(123);
    // this.destroyPlayer();
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.tab-content-item {
  border-radius: px2rem(4px);
  &:not(:last-child) {
    margin-bottom: px2rem(20px);
  }
  p {
    padding: px2rem(8px) px2rem(15px);
    border-bottom: 1px solid #ececec;
    position: relative;
  }
}
.video {
  height: 100vh;
  position: relative;
  .video-container {
    position: relative;
    .address {
      font-size: 14px;
      padding: px2rem(8px) px2rem(8px);
      @include flex;
      @include flex-primary-axis-between;
      @include flex-secondary-axis-center;
      border-radius: 4px;
      background: white;
      a {
        color: #1989fa;
        i {
          vertical-align: middle;
        }
      }
    }
    .video-main {
      height: 11.5rem;
      overflow-y: auto;
      // padding: 0 px2rem(10px);
      margin-top: px2rem(20px);
      .videoList {
        border-radius: 4px;
        background: white;
        padding: 0 px2rem(10px);
        .van-col {
          padding: px2rem(10px);
          @include flex;
          @include flex-primary-axis-between;
          @include flex-secondary-axis-center;
          line-height: px2rem(20px);
          &.active {
            background: #eaeaea;
          }

          padding-left: px2rem(30px);
          span {
            position: relative;
            .status {
              position: absolute;
              left: px2rem(-15px);
              top: px2rem(6px);
            }
          }
        }
      }
    }
  }
}
</style>
