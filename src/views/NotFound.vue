// 404
<template>
  <div :class="['h100', 'w100', 'notfound', bgIsCover ? 'notfound-cover' : '']">
    <div class="h100 w100 bg">
      <div class="content" :style="getContentMarginTop">
        <div class="h100 w100 content-bg">
          <span class="title">ERROR</span>
          <span class="msg">对不起，您访问的地址不存在！</span>
          <a class="button" :style="getBackButtonBg" @click="homeHandle" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "notfound",
  data() {
    return {
      // 背景图是否cover
      bgIsCover: false,
      // 内容垂直居中marginTop
      contentMarginTop: "0px"
    };
  },
  computed: {
    // 获取内容垂直居中marginTop
    getContentMarginTop: function() {
      return {
        marginTop: `${this.contentMarginTop}px`
      };
    },
    // 获取返回按钮背景
    getBackButtonBg: function() {
      return {
        background: `url(${require(`@/assets/imgs/notfound/button-back.png`)}) no-repeat 0 0`,
        backgroundSize: "100% 100%"
      };
    }
  },
  methods: {
    // 获取背景图是否cover
    getBgIsCover: function() {
      this.bgIsCover =
        document.body.clientWidth / document.body.clientHeight < 1920 / 1080;
    },
    // 计算内容垂直居中marginTop
    calContentMarginTop: function() {
      this.contentMarginTop =
        document.body.clientHeight > 448
          ? (document.body.clientHeight - 448) * 0.5
          : 0;
    },
    // 跳转首页
    homeHandle: function() {
      this.$router.push({
        path: "/"
      });
    },
    // 页面改变（外部调用）
    callResize: function() {
      this.getBgIsCover();
      this.calContentMarginTop();
    }
  },
  mounted() {
    this.getBgIsCover();
    this.calContentMarginTop();
  }
};
</script>

<style lang="scss" scoped>
.notfound {
  background: #ececec url(../assets/imgs/notfound/bg-1.png) 0 0;
  background-repeat: repeat;
  background-size: contain;
  overflow: hidden;

  .bg {
    @include bg("notfound/bg-2.png", center, center);
    background-size: contain;
    overflow-x: hidden;
    overflow-y: auto;

    .content {
      height: 448px;
      margin: 0 auto;
      position: relative;
      width: 796px;

      .content-bg {
        @include bg("notfound/content.png", 0, 0);
        @include flex;
        @include flex-column;
        @include flex-primary-axis-center;
        @include flex-secondary-axis-center;
        background-size: 796px 100%;
        left: 0;
        position: absolute;
        top: 0;
        z-index: 2;

        .title {
          color: #cccccc;
          font-family: "fzhtjw";
          font-size: 60px;
          font-weight: bold;
        }
        .msg {
          color: $color-font2;
          display: block;
          font-size: 16px;
        }
        .button {
          display: block;
          height: 44px;
          margin-top: 86px;
          position: relative;
          width: 180px;
        }
      }
    }
  }
}
</style>
