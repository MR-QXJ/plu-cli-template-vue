<template>
  <!--支队内容卡片-->
  <div class="card-box w100">
    <div class="card-cont w100 h100">
      <div class="title-box w100 flex-align-center-between">
        <div class="title flex-align-center" @click.capture="unitDetails">
          <span class="title-text text-ellipsis">{{ unitName }}</span>
          <img
            :src="require('../../assets/img/safe/bo0.png')"
            class="title-img"
          />
        </div>
        <div
          v-if="userLevel > 1"
          class="attention h100 flex-center"
          @click.capture="attention"
        >
          <img :src="attentionImg" class="attention-img" />
        </div>
      </div>
      <div class="details-box w100 flex-align-center-between">
        <div class="content-box alarm" @click.capture="alarmDetails">
          <span
            class="num"
            v-if="alarm != -1"
            style="background-color: #09bb07"
            >{{ alarm }}</span
          >
          <span v-else>/</span>
          <div class="num-box">
            <div class="num-name alram-name">物联告警</div>
          </div>
        </div>
        <div class="content-box fault" @click.capture="disposeDetails">
          <span
            class="num"
            v-if="alarm != -1"
            style="background-color: #3260BC"
            >{{ hidden }}</span
          >
          <text v-else>/</text>
          <div class="num-box">
            <div class="num-name hidden-name">隐患处置</div>
          </div>
        </div>
        <div class="content-box video" @click.capture="videoDetails">
          <span
            class="num video-num"
            style="background-color: #FF7E14"
            v-if="video != -1"
            >{{ video }}</span
          >
          <span v-else>/</span>
          <div class="num-box">
            <div class="num-name video-name">视频监控</div>
          </div>
        </div>
        <div class="content-box video" @click.capture="riskDetails">
          <image src="" />
          <div class="num-box">
            <div class="num-name risk-name">{{ riskName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 单位ID
    unitID: {
      type: String,
      default: ""
    },
    // 单位名称
    unitName: {
      type: String,
      default: ""
    },
    // 告警数
    alarm: {
      type: String,
      default: "0"
    },
    // 告警等级
    alarmGrade: {
      type: String,
      default: "0"
    },
    // 故障率
    hidden: {
      type: String,
      default: "0"
    },
    // 监控数
    video: {
      type: String,
      default: "0"
    },
    // 关注
    isShow: {
      type: Boolean,
      default: false
    },
    // 风险名称
    riskName: {
      type: String,
      default: ""
    },
    // 角色权限
    userLevel: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 告警数背景
      alarmBgcolor: "",
      // 故障率背景
      faultBgcolor: "",
      // 关注
      attentionZ: null,
      // 关注图标
      attentionImg: ""
    };
  },
  methods: {
    // 进入单位详情页
    unitDetails: function() {
      console.log("detail");
      this.$router.push(
        `/unitInfo?id=${this.unitID}&name=${this.unitName}&userlevel=${this.userLevel}`
      );
    },
    // 进入物联告警
    alarmDetails: function() {
      this.$router.push({
        path: "/contentAlarm",
        query: {
          id: this.unitID,
          name: this.unitName
        }
      });
    },
    // 进入隐患处理
    disposeDetails: function() {
      this.$router.push(
        `/hiddenDispose?id=${this.unitID}&name=${this.unitName}&userlevel=${this.userLevel}`
      );
    },
    // 进入视频监控
    videoDetails: function() {
      this.$router.push(`/videoPage?id=${this.unitID}&name=${this.unitName}`);
    },
    // 进入风险警告
    riskDetails: function() {
      this.$router.push(`/risk?id=${this.unitID}&name=${this.unitName}`);
    },
    // 关注取关
    attention: function() {
      // this.attentionZ = !this.attentionZ;
      this.$emit("isShowF", {
        unitId: this.unitID,
        isShow: !this.attentionZ
      });
    }
  },
  watch: {
    isShow: {
      handler(to) {
        this.attentionZ = to;
      },
      immediate: true
    },
    alarmGrade: {
      handler(to) {
        let bgcolor = "";
        switch (to) {
          case "2":
            bgcolor = "#ffb300";
            break;
          case "3":
            bgcolor = "#f76260";
            break;
          default:
            bgcolor = "#09bb07";
            break;
        }
        this.alarmBgcolor = bgcolor;
      },
      immediate: true
    },
    hidden: {
      handler(to) {
        let bgcolor = "";
        if (to >= 80) {
          bgcolor = "#f76260";
        } else if (to <= 30) {
          bgcolor = "#09bb07";
        } else {
          bgcolor = "#ffb300";
        }
        this.faultBgcolor = bgcolor;
      },
      immediate: true
    },
    attentionZ: {
      handler(to) {
        const img = to
          ? require("../../assets/img/safe/concern.png")
          : require("../../assets/img/safe/concern-no.png");
        this.attentionImg = img;
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.card-box {
  box-sizing: border-box;
  margin-bottom: 15px;
}

.card-cont {
  background-color: #fff;
  border-radius: 3px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0px 2px 2px #dadfdf;
}

.title-box {
  height: 30px;
  padding: 0 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #e8e8e8;
  font-size: 14px;
  color: #666;
}

.title {
  width: 95%;
}

.title-text {
  max-width: 90%;
}

.title-img {
  display: block;
  width: 16px;
  height: 16px;
  margin-left: 5px;
}

.attention {
  width: 5%;
}

.attention-img {
  width: 12px;
  height: 12px;
}

.details-box {
  height: 40px;
  overflow: hidden;
}

.content-box {
  width: calc(100% / 4);
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 11px;
  box-sizing: border-box;
  padding: 0 5px;
}

.content-item {
  height: 80%;
  line-height: 80%;
  padding: 0 3px;
}

.content-box image {
  display: block;
  width: 17px;
  height: 14px;
}

.alarm image {
  display: block;
  width: 17px;
  height: 17px;
}

.fault image {
  display: block;
  width: 17px;
  height: 17px;
}

.video image {
  display: block;
  width: 17px;
  height: 15px;
}

.num-box {
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #999;
  margin-left: 3px;
}

.num {
  height: 12px;
  line-height: 12px;
  color: #fff;
  border-radius: 5px;
  padding: 0 4px;
}

.num-box text {
  font-size: 9px;
}

.video-num {
  background-color: #50b7f2;
}
.alram-name {
  color: #43f04b;
}
.hidden-name {
  color: #3260bc;
}
.video-name {
  color: #ff7e14;
}
.risk-name {
  color: #ff1a1a;
}
</style>
