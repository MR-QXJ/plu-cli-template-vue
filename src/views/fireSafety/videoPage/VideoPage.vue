<template>
  <div class="video w100 h100">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      :border="false"
      :title="unitName"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div
      class="video-content w100"
      :style="{ height: $root.contentHeight + 'px' }"
    >
      <VideoTem
        :videoData="videoData"
        @playError="playError"
        @statechange="statechange"
        @callNum="callNum"
        @palyVideo="palyVideo"
      />
    </div>
  </div>
</template>

<script>
import {
  dataIsNullArray,
  removeBackButton,
  addBackButton,
  arouseCall
} from "utils/tool";
import {
  getFireUnitVideo,
  getVideoInfoByFire
  // getPlayHlsVideo
} from "utils/api.js";
import VideoTem from "components/pub/VideoTem";
export default {
  components: {
    VideoTem
  },
  data() {
    return {
      // 单位名称
      unitName: "",
      // 单位ID
      unitId: null,
      // 数据
      videoData: {
        featureId: "",
        // 视频地址
        videoSrc: "",
        // 视频标题
        videoTitle: "",
        // 视频无法播放时显示
        novideo: "暂无视频",
        // 控制室电话
        telNum: "暂无电话",
        // 视频列表
        videoList: [],
        // 播放选中
        actives: 0,
        showP: true,
        showT: ""
      }
    };
  },
  methods: {
    // 获取视频
    getVideo: function() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      let params = {
        // key: 97230
        key: this.unitId
      };
      const param = JSON.parse(JSON.stringify(params));
      // param.prjId = this.unitId;
      let unitManage = () => {
        return new Promise(resolve => {
          getFireUnitVideo(param).then(res => {
            resolve(res);
          });
        });
      };
      let adminManage = () => {
        return new Promise(resolve => {
          getVideoInfoByFire(param).then(res => {
            resolve(res);
          });
        });
      };
      const user = localStorage.getItem("identity");
      Promise.all([user == "adminManager" ? adminManage() : unitManage()]).then(
        res => {
          let data = [];
          let vList = [];
          if (res[0].data && res[0].data.videos) {
            data = dataIsNullArray(res[0].data.videos);
          }
          data.map(record => {
            vList.push({
              name: record.pointName,
              videoSrc: record.featureId,
              IsOnLine: 1
            });
          });

          if (vList.length != 0) {
            console.log(vList);
            this.$set(this.videoData, "videoList", vList);
            this.$set(this.videoData, "videoSrc", vList[0].videoSrc);
            this.$set(this.videoData, "videoTitle", vList[0].name);
            this.$set(this.videoData, "telNum", res[0].data.telephone || "");
            this.$set(this.videoData, "videoTitle", vList[0].name);
            this.getVideoSrc(vList[0].videoSrc);
            this.$set(this.videoData, "videoList", vList);
            this.$set(this.videoData, "videoTitle", vList[0].name);
            this.$set(this.videoData, "telNum", res[0].data.telephone || "");
          } else {
            this.$set(this.videoData, "videoList", vList);
            this.$set(this.videoData, "videoTitle", "");
            this.$set(this.videoData, "telNum", "暂无电话");
          }
          this.$toast.clear();
        }
      );
    },
    // 开始播放
    bindtimeupdate: function() {
      this.$toast.clear();
      this.$set(this.videoData, "showP", false);
      this.$set(this.videoData, "showT", "");
    },
    // 列表点击播放
    palyVideo: function(index, video) {
      const { IsOnLine, name, videoSrc } = video;
      this.$set(this.videoData, "actives", index);
      this.$set(this.videoData, "showP", true);
      this.$set(this.videoData, "showT", "加载中...");
      this.$set(this.videoData, "videoSrc", "");
      this.$set(this.videoData, "novideo", "该监控离线");
      if (IsOnLine) {
        this.$set(this.videoData, "videoTitle", name);
        this.$set(this.videoData, "videoSrc", "");
        this.$set(this.videoData, "novideo", "正在获取视频...");
        this.$nextTick(() => this.getVideoSrc(videoSrc));
      } else {
        this.$set(this.videoData, "videoSrc", "");
        this.$set(this.videoData, "novideo", "该监控离线");
      }
    },
    // 获取播放地址
    getVideoSrc: function(video) {
      this.$set(this.videoData, "featureId", video);
      this.$set(this.videoData, "videoSrc", video);
      // let params = {
      //   // name: "hik1223",
      //   name: video,
      //   isSub: 1
      // };
      // getPlayHlsVideo(params).then(res => {
      //   this.$set(this.videoData, "videoSrc", res.data || "");
      //   this.$set(this.videoData, "novideo", res.message);
      // });
    },
    // 播放错误
    playError: function() {
      this.$toast.clear();
    },
    statechange(e) {
      if (e.detail.code == 3005) {
        this.$set(this.videoData, "videoSrc", "");
        this.$set(this.videoData, "novideo", "播放失败");
      }
    },
    // 拨打电话
    callNum: function() {
      if (this.videoData.telNum != "暂无电话") {
        arouseCall(this.videoData.telNum);
      }
    }
  },
  created() {
    (this.unitName = this.$route.query.name),
      (this.unitId = this.$route.query.id);
    this.getVideo();
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);
    this.$root.navH = document.querySelector(".van-nav-bar").offsetHeight;
  }
};
</script>

<style lang="scss" scoped>
.video {
  background-color: #efeff4;
  .van-nav-bar {
    background: #0e41a6;
  }
  .video-content {
    overflow: hidden;
    box-sizing: border-box;
    padding: 10px;
  }
}
</style>
