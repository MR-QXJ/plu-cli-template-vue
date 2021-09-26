<template>
  <div class="cont-alarm">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      :title="unitName"
      :border="false"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div class="system">
      <div class="system-box w100 h100">
        <div class="details-top details w100">
          <div class="title w100">
            <img src="../../assets/img/index/title.png" class="title-icon" />
            <span class="title-name">{{ name }}</span>
          </div>
          <div class="content w100">
            <div class="s-box">
              <div class="box h100">
                <div>{{ statistics[0] }}</div>
                <div class="all num" v-if="statisticsNum.length > 0">
                  {{ statisticsNum[0] }}
                </div>
              </div>
              <div class="box right h100">
                <div>{{ statistics[1] }}</div>
                <div class="num">
                  <span v-if="statisticsNum.length > 1">{{
                    statisticsNum[1]
                  }}</span>
                </div>
              </div>
            </div>
            <div class="s-box bot">
              <div class="box h100">
                <div>{{ statistics[2] }}</div>
                <div class="num" v-if="statisticsNum.length > 2">
                  {{ statisticsNum[2] }}
                </div>
              </div>
              <div class="box right h100">
                <div>{{ statistics[3] }}</div>
                <div class="num" v-if="statisticsNum.length > 3">
                  {{ statisticsNum[3] }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="details-center details w100">
          <div class="title w100 flex-align-center">
            <img src="../../assets/img/index/title.png" class="title-icon" />
            <span class="title-name">当前告警点位</span>
          </div>
          <div class="content cen-cont w100">
            <div class="td-title td">
              <span
                v-for="(item, index) in tableTh"
                :key="index"
                :style="`width:${item.width}`"
                >{{ item.text }}</span
              >
            </div>
            <div class="noDataList" v-if="tableTr.length == 0">
              {{ noDataList }}
            </div>
            <div class="alarmContent" v-else>
              <div v-for="(item, index) in tableTr" :key="index" class="td tr">
                <span
                  class="tds h100"
                  v-for="(it, idx) in item.tableTd"
                  :key="idx"
                  :style="`width: ${it.width}`"
                  >{{ it.text }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="details-bot details w100">
          <div class="title w100">
            <div style="display: flex;align-items:center">
              <img src="../../assets/img/index/title.png" class="title-icon" />
              <span class="title-name">{{ echartsName }}</span>
            </div>
            <!-- <div class="chooseDay flex-align-center h100"></div> -->
          </div>
          <div class="content echarts-box w100">
            <Echart :id="'chart' + unitId" :chartOpt="echartOpt" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getFireUnitInternetThings,
  getPointAlarmStatisticByFire,
  getFireUnitNowAlarm,
  getAlarmInfolistByFire,
  getFireUnitAlarmTendency,
  getAlarmTendencyByFire
} from "@/utils/api";
import {
  removeBackButton,
  addBackButton,
  dataIsNullObj,
  dataIsNullStr,
  dataIsNullArray,
  getDaysInMonth,
  getTime
} from "@/utils/tool";
import Echart from "@/components/pub/Echart.vue";
import { initLineEcharts } from "utils/tool-echart";
export default {
  components: {
    Echart
  },
  data() {
    return {
      // 单位名称
      unitName: "",
      // 单位ID
      unitId: null,
      // 统计名
      statistics: ["总点位数", "当前告警", "告警率", "本月新增告警数"],
      // 统计值
      statisticsNum: [],
      // 告警点位表头
      tableTh: [
        {
          width: "30%",
          text: "位置"
        },
        {
          width: "50%",
          text: "告警内容"
        },
        {
          width: "20%",
          text: "告警时间"
        }
      ],
      // 告警点位数据
      tableTr: [],
      // 无数据
      noDataList: "",
      name: "物联网系统告警统计",
      // echart盒子名
      echartsName: "最近12个月告警数量趋势",
      // 选择年月
      choosedate: "",
      // echart
      chartEc: {
        lazyLoad: true
      },
      // 说明弹窗
      showModals: false,
      // 说明内容
      modalContent: [
        {
          title: "总点位数",
          content: ["当前单位共多少监测点位"]
        },
        {
          title: "当前告警",
          content: ["正在发生告警的点位"]
        },
        {
          title: "告警率",
          content: ["实时告警 / 总点位"]
        },
        {
          title: "本月新增告警数",
          content: ["当前月份，一共新增多少次告警"]
        }
      ],
      echartOpt: {}
    };
  },
  methods: {
    // 获取告警统计数据
    getStatisticsNum: function() {
      let params = {};
      const param = JSON.parse(JSON.stringify(params));
      param.key = this.unitId;
      let unitManage = () => {
        return new Promise(resolve => {
          getFireUnitInternetThings(param).then(res => {
            resolve(res);
          });
        });
      };
      let adminManage = () => {
        return new Promise(resolve => {
          getPointAlarmStatisticByFire(param).then(res => {
            resolve(res);
          });
        });
      };
      const user = localStorage.getItem("identity");
      Promise.all([user == "adminManager" ? adminManage() : unitManage()]).then(
        res => {
          const staData = dataIsNullObj(res[0].data);
          let data = [];
          data.push(dataIsNullStr(staData.pointNum, 0));
          data.push(dataIsNullStr(staData.alarmNum, 0));
          data.push(dataIsNullStr(staData.alarmRate, "0%"));
          data.push(dataIsNullStr(staData.montNewAlarm, 0));
          this.statisticsNum = data;
        }
      );
    },
    // 水系统当前告警点位
    getTableTd: function() {
      this.noDataList = "加载中...";
      let params = {};
      const param = JSON.parse(JSON.stringify(params));
      param.key = this.unitId;
      let unitManage = () => {
        return new Promise(resolve => {
          getFireUnitNowAlarm(param).then(res => {
            resolve(res);
          });
        });
      };
      let adminManage = () => {
        return new Promise(resolve => {
          getAlarmInfolistByFire(param).then(res => {
            resolve(res);
          });
        });
      };

      const user = localStorage.getItem("identity");
      Promise.all([user == "adminManager" ? adminManage() : unitManage()]).then(
        res => {
          const data = dataIsNullArray(res[0].data);
          // let setD = this.tableTr;
          let reData = [];
          data.map(record => {
            reData.push({
              tableTd: [
                {
                  width: "30%",
                  text: dataIsNullStr(record.pointName, "未知")
                },
                {
                  width: "50%",
                  text: record.alarmContent
                },
                {
                  width: "20%",
                  text: record.alarmTime
                }
              ]
            });
          });
          if (reData.length == 0) {
            this.noDataList = "暂无数据";
          }
          // this.setData({
          //   [setD]: reData
          // });
          this.tableTr = reData;
        }
      );
    },
    // 处理日期和月份
    disposeDate: function(diy) {
      let date = getTime();
      let mouth = "";
      let day = null;
      if (date[1] == 1) {
        mouth = 12;
      } else {
        mouth = parseInt(date[1] - 1);
      }
      if (mouth < 10) {
        mouth = `0${mouth}`;
      }
      if (diy) {
        let newd = diy.split("-");
        day = getDaysInMonth(newd[0], newd[1]);
      } else {
        day = getDaysInMonth(date[0], mouth);
      }
      // 年，月，天数
      return [date[0], mouth, day];
    },
    // 消防水压系统趋势分析
    getEData: function(time, date) {
      let Xdata = [];
      for (let i = 0; i < date; i++) {
        Xdata.push(`${i + 1}`);
      }
      let params = {};
      let yAxisData = {};
      const param = JSON.parse(JSON.stringify(params));
      param.key = this.unitId;
      let unitManage = () => {
        return new Promise(resolve => {
          getFireUnitAlarmTendency(param).then(res => {
            resolve(res);
          });
        });
      };
      let adminManage = () => {
        return new Promise(resolve => {
          getAlarmTendencyByFire(param).then(res => {
            resolve(res);
          });
        });
      };

      const user = localStorage.getItem("identity");
      Promise.all([user == "adminManager" ? adminManage() : unitManage()]).then(
        res => {
          const data = dataIsNullArray(res[0].data);
          let datas = [],
            times = [];
          data.map(record => {
            datas.push(record.alarmNum);
            times.push(record.dateTime);
          });

          yAxisData.name = "指数";
          this.echartOpt = initLineEcharts(
            times,
            datas,
            yAxisData,
            Math.max(...datas)
          );
        }
      );
    }
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);

    let date = this.disposeDate();
    let options = this.$route.query;
    this.unitName = options.name;
    this.unitId = options.id;
    this.choosedate = `${date[0]}-${date[1]}`;
    this.getStatisticsNum(options.id);
    this.getTableTd();
    this.getEData(`${date[0]}-${date[1]}`, date[2]);
  }
};
</script>
<style lang="scss" scoped></style>

<style lang="scss" scoped>
.cont-alarm {
  overflow: hidden;
  .van-nav-bar {
    background: #0e41a6;
    /deep/.van-nav-bar__title {
      color: #fff;
    }
    /deep/.van-icon {
      color: #fff;
    }
  }
  background: #efeff4;
}
.system {
  height: calc(100vh - 46px);
  padding: 10px;
}
.system-box {
  overflow-x: hidden;
  overflow-y: auto;
}

.details {
  background-color: #fff;
  margin-top: 15px;
  border-radius: 5px;
  box-shadow: 0px 2px 2px #dadfdf;
}

.details-top {
  margin-top: 0;
}

.title {
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #e8e8e8;
  box-sizing: border-box;
  height: 38px;
  padding: 0 10px;
  line-height: 38px;
  display: flex;
  align-items: center;
  img {
    margin-right: 10px;
  }
}

.title-name {
  color: #2957b7;
}

.explain {
  width: 30px;
}

.explain-img {
  display: block;
  width: 15px;
  height: 15px;
}

.content {
  height: calc(100% - 30px);
  overflow: hidden;
}

.s-box {
  /* height: 50%; */
  box-sizing: border-box;
  color: #666;
  font-size: 12px;
  display: flex;
  padding: 7.5px 0;
}

.bot {
  border-top: 1px solid #e8e8e8;
}

.box {
  width: 50%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.right {
  border-left: 1px solid #e8e8e8;
}

.num {
  font-size: 12px;
  color: #f76260;
  padding-top: 7.5px;
}

.all {
  color: #0ceb17;
}

.details-center {
  height: 36%;
}

.details-bot {
  height: 32%;
}

.cen-cont {
  box-sizing: border-box;
  padding: 0 10px;
}

.td {
  height: 25px;
  width: 100%;
  font-size: 10px;
  color: #999;
}

.tr {
  height: 30px;
}

.tds {
  line-height: 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.td-title {
  box-sizing: border-box;
  border-bottom: 1px solid #e8e8e8;
  font-size: 12px;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.noDataList {
  height: 25px;
  width: 100%;
  font-size: 12px;
  color: #999;
  line-height: 25px;
  text-align: center;
  padding-top: 50px;
}

.alarmContent {
  height: calc(100% - 40px);
  overflow-y: auto;
  & > div.td {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.picker {
  width: 60px;
  height: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 5px;
  color: #ccc;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 5px;
}

.bo {
  width: 8px;
  height: 8px;
}

.echarts-box {
  box-sizing: border-box;
  padding: 0 5px;
}
</style>
