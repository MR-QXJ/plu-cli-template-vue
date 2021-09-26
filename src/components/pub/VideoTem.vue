<template>
  <div class="video-tem w100 h100">
    <div class="videos w100 flex-center">
      <div v-if="videoData.videoSrc == ''">
        {{ videoData.novideo }}
      </div>
      <iframe
        v-else
        ref="videoplayer"
        class="h100 w100"
        frameborder="0"
        scrolling="no"
        allowfullscreen="true"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
      />
    </div>
    <div class="tell flex-align-center-between w100">
      <span>控制室电话</span>
      <div class="tel-num flex-align-center">
        <img
          :src="require('../../assets/img/other/phone.png')"
          class="tel-img"
        />
        <div class="call" @click="callNum">{{ videoData.telNum }}</div>
      </div>
    </div>
    <div class="viedo-list w100">
      <div class="list-title w100">
        监控视频列表
      </div>
      <div class="list-box w100">
        <div
          v-for="(video, index) in videoData.videoList"
          :key="index"
          :class="[
            'list',
            'w100',
            'flex-align-center-between',
            videoData.actives == index ? 'active-video' : ''
          ]"
          @click="palyVideo(index, video)"
        >
          <div class="video-name flex-align-center text-ellipsis">
            <div
              :class="['line', video.IsOnLine ? 'on-line' : 'off-line']"
            ></div>
            {{ video.name }}
          </div>
          <div class="play-video" v-if="videoData.actives == index">
            正在播放...
          </div>
        </div>
        <div class="none-video" v-if="videoData.videoList == 0">
          暂无视频
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { urlVideoPlayerOnline } from "utils/global";
export default {
  props: {
    videoData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      video: null
    };
  },
  methods: {
    palyVideo(index, video) {
      this.$emit("palyVideo", index, video);
    },
    callNum() {
      this.$emit("callNum");
    },
    statechange() {
      this.$emit("statechange");
    },
    playError() {
      this.$emit("playError");
    }
  },
  // mounted() {
  //   const rect = document.querySelector(".videos").getBoundingClientRect();
  //   const plus = window.plus;
  //   const barH = plus.navigator.getStatusbarHeight() || 0;
  //   if (!plus) return;
  //   this.video = plus.video.createVideoPlayer("videoplayer", {
  //     left: rect.left + "px",
  //     top: rect.top + barH + "px",
  //     height: rect.height + "px",
  //     width: rect.width + "px",
  //     autoplay: true,
  //     playStrategy: 3,
  //     "show-progress": false,
  //     "enable-progress-gesture": false
  //   });
  //   plus.webview.currentWebview().append(this.video);
  //   this.video.show();
  // },
  // destroyed() {
  //   this.video.close();
  // },
  watch: {
    "videoData.featureId"(to) {
      if (!to) return;
      this.$nextTick(() => {
        const videoPlayer = this.$refs["videoplayer"];
        if (videoPlayer) {
          videoPlayer.setAttribute(
            "src",
            `${urlVideoPlayerOnline}?vid=${to}&platform=sc&channel=1&timestamp=${Date.now()}`
          );
        }
      });
    }
    // "videoData.videoSrc"(to) {
    //   const ope = to ? "show" : "hide";
    //   if (!this.video) return;
    //   this.video[ope]();
    //   if (!to) return;
    //   this.$nextTick(() => {
    //     this.video.setStyles({
    //       src: to
    //     });
    //   });
    // }
  }
};
</script>

<style lang="scss" scoped>
.video-tem {
  overflow: hidden;
}

.videos {
  position: relative;
  height: 210px;
  background-color: #000;
  color: #fff;
  border-radius: 5px 5px 0 0;
}

.videoB {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000;
  z-index: 9999;
  text-align: center;
  line-height: 210px;
  color: #fff;
}

.trans {
  background-color: transparent;
}

.tell {
  background-color: #fff;
  line-height: 35px;
  box-sizing: border-box;
  padding: 0 10px;
  border-radius: 0 0 5px 5px;
  font-size: 14px;
  color: #666;
  box-shadow: 0px 2px 2px #dadfdf;
}

.tel-num {
  color: #50b7f2;
}

.tel-img {
  display: block;
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

.viedo-list {
  border-radius: 5px;
  margin-top: 15px;
  height: calc(100% - 255px);
  background-color: #fff;
}

.list-title {
  font-size: 14px;
  color: #666666;
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid #e8e8e8;
  box-sizing: border-box;
  padding: 0 10px;
}

.list-box {
  height: calc(100% - 30px);
  box-sizing: border-box;
  overflow: auto;
  padding: 5px 10px 0 10px;
}

.list {
  height: 30px;
  border-radius: 5px;
  font-size: 12px;
  box-sizing: border-box;
  padding: 0 10px;
  margin-bottom: 5px;
}

.active-video {
  background-color: #f2f2f2;
}

.video-name {
  width: 70%;
}

.line {
  width: 6px;
  height: 6px;
  margin-right: 15px;
  border-radius: 50%;
}

.on-line {
  background-color: #2dcc70;
}

.off-line {
  background-color: #b3b3b3;
}
.none-video {
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #888;
}
</style>
