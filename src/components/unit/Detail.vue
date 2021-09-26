<template>
  <div class="w100 h100 unitdetail">
    <van-overlay :show="showInfo" @click="closeInfoHandle" :lock-scroll="false">
      <div
        @click.stop
        class="h100 wrapper"
        style="display:flex;justify-content:center;align-items:center"
      >
        <div
          class="block"
          style="width:90%; background:white;border-radius:4px;padding:5px;position:relative"
        >
          <van-icon
            @click="showInfo = false"
            name="close"
            style="position:absolute;top:-1.5rem;z-index:2;left:calc(50% - 15px)"
            color="white"
            size="30"
          />
          <h3 style="font-size:17px;text-align:center;padding:0.5rem 0">
            历史告警记录
          </h3>
          <van-row class="w100" style="border-bottom:1px solid #ccc">
            <van-col style="width:49%" span="12">位置</van-col>
            <van-col span="4">内容</van-col>
            <van-col span="8">时间</van-col>
          </van-row>
          <p
            v-if="!historyData.length"
            style="text-align:center;color:#b1b1b1;font-size:12px;padding:1rem 0"
          >
            暂无数据
          </p>
          <div
            class="w100 warnPointList"
            style="max-height:30vh;overflow:auto;padding:5px 0"
          >
            <van-row v-for="(item, index) in historyData" :key="index">
              <van-col style="width:48%" span="12">{{
                item.alarmAddress
              }}</van-col>
              <van-col span="4" class="van-ellipsis">{{
                item.alarmContent
              }}</van-col>
              <van-col span="8" class="van-ellipsis">{{
                item.alarmTime
              }}</van-col>
            </van-row>
          </div>
        </div>
      </div>
    </van-overlay>
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      title="详情"
      left-arrow
      @click-left="onClickLeft"
    >
      <template #right>
        <van-icon
          name="info-o"
          size="18"
          @click="showInfoHandle"
          v-if="active != 1 && active != 3"
        /> </template
    ></van-nav-bar>
    <div class="w100 unitdetail-container">
      <van-tabs v-model="active" color="#1989fa" @change="tabChange">
        <van-tab :title="item" v-for="(item, index) in tabMenu" :key="index">
          <div class="w100 tab-container">
            <div class="w100 tab-content">
              <transition name="van-fade">
                <Pressure v-if="!index" :unitId="unitId" :unitData="unitData" />

                <Video v-if="index == 1" ref="videoTemp" :unitId="unitId" />

                <LinkNetwork
                  v-if="index == 2"
                  :unitId="unitId"
                  :unitData="unitData"
                />
                <PointData
                  v-if="index == 3"
                  :unitId="unitId"
                  :unitData="unitData"
                />
              </transition>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import Pressure from "@/components/unit/Pressure.vue";
import Video from "@/components/unit/Video.vue";
import LinkNetwork from "@/components/unit/LinkNetwork.vue";
import PointData from "@/components/unit/PointData.vue";
import {
  removeBackButton,
  addBackButton,
  dataIsNullArray,
  dataIsNullNumber
} from "@/utils/tool";

import { getBSWarningRecord } from "@/utils/api";
export default {
  components: {
    Pressure,
    Video,
    LinkNetwork,
    PointData
  },
  data() {
    return {
      unitId: "",
      unitData: {},
      showInfo: false,
      historyData: [],
      active: 0,
      tabMenu: ["水压/水位", "视频监控", "联网监控", "点位列表"]
    };
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);
    if (this.$route.query.unitId) {
      this.unitId = this.$route.query.unitId;
    }
    console.log(this.$route);
    if (this.$route.query.data) {
      this.unitData = this.$route.query.data;
    }
  },

  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    tabChange() {},
    showInfoHandle() {
      this.showInfo = true;
      this.getRecord();
    },
    closeInfoHandle() {
      this.showInfo = false;
    },
    getRecord() {
      let date = new Date();
      const params = {
        pageNo: 1,
        pageSize: 0,
        unitId: this.unitId,
        beginDate: "1990-1-1 00:00:00",
        endDate:
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate() +
          " 23:59:59"
      };
      if (this.active) {
        params.systemId = "7961";
      } else {
        params.systemId = "7963";
      }
      getBSWarningRecord(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullArray(res.data);
          this.historyData = data;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.unitdetail {
  background: #f1f1f1;
  .unitdetail-container {
    position: relative;
    bottom: 0;
    height: calc(100% - 1.5rem);

    .tab-container {
      .tab-content {
        height: calc(100vh - 2.5rem);
        overflow: auto;
      }
    }
  }
}
</style>
