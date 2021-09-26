<template>
  <div class="w100 tab-content-item pressure" v-if="!active">
    <div class="baseinfo">
      <van-collapse v-model="activeNames">
        <van-collapse-item title="基本信息"
          ><van-row
            v-for="(item, index) in baseInfo"
            :key="index"
            style="padding:0.12rem  0.3rem  "
          >
            <van-col span="8" style="color:#333">{{ item.label }}</van-col>
            <van-col span="16" style="color:#999">{{ item.value }}</van-col>
          </van-row></van-collapse-item
        >
      </van-collapse>
    </div>
    <div class="statistic">
      <p>消防水压系统告警统计</p>
      <van-row class="w100 vrow">
        <van-col
          span="12"
          class="vcol"
          v-for="(item, index) in statisticMenu"
          :key="index"
        >
          <span>{{ item.label }}</span>
          <span>{{ item.value }}</span>
        </van-col>
      </van-row>
    </div>
    <div class="warnPoint">
      <p>当前告警点位</p>
      <van-row class="w100 warnPointTitle">
        <van-col style="width:49%" span="12">位置</van-col>
        <van-col span="4">告警类型</van-col>
        <van-col span="8">时间</van-col>
      </van-row>
      <div class="warnPointList">
        <p
          v-if="!warnPointData.length"
          style="text-align:Center;border:0;color:#b1b1b1;line-height:2rem"
        >
          暂无数据
        </p>
        <van-row v-for="(item, index) in warnPointData" :key="index">
          <van-col style="width:48%" span="12">{{ item.msg || "-" }}</van-col>
          <van-col span="4" class="van-ellipsis">{{
            item.status || "-"
          }}</van-col>
          <van-col span="8" class="van-ellipsis">{{
            item.time || "-"
          }}</van-col>
        </van-row>
      </div>
    </div>
    <div class="trend">
      <p>
        消防水压系统趋势分析
        <van-button
          class="btn"
          type="default"
          size="mini"
          @click="showPicker = true"
          >{{ trendDate }} <van-icon name="arrow-down"
        /></van-button>
      </p>
      <van-popup v-model="showPicker" round position="bottom">
        <van-datetime-picker
          ref="datetimepicker"
          v-model="trendPickerDate"
          type="year-month"
          title="选择年月"
          :min-date="minDate"
          :max-date="maxDate"
          :formatter="formatter"
          @confirm="getDate"
        />
      </van-popup>
      <div class="w100 lineChart" id="linkChart"></div>
    </div>
  </div>
</template>
<script>
import {
  getBSBuildPointNum,
  getBSBuildDetailList,
  getBSBuildDetailChart
} from "@/utils/api";
import {
  dataIsNullNumber,
  dataIsNullArray,
  dataIsNullObj,
  setAxisScale
} from "@/utils/tool";

export default {
  data() {
    return {
      // 显示单位信息弹窗
      showInfo: false,
      activeNames: ["1"],
      active: 0,
      baseInfo: [],
      statisticMenu: [
        { label: "当前报警数", value: 0 },
        { label: "总监测点数", value: 0 },
        { label: "告警率", value: "0%" },
        { label: "本月告警次数", value: 0 }
      ], // 告警点位数据
      warnPointData: [],
      pageNo: 1,
      trendDate: "",
      showPicker: false,
      trendPickerDate: new Date(),
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      linkChart: null
    };
  },
  props: {
    buildId: { type: String, default: "" },
    buildData: { type: Object, default: () => {} }
  },
  methods: {
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    // 获取点位统计
    getStatistic() {
      // this.statisticMenu.length = 0;
      getBSBuildPointNum({ buildId: this.buildId, systemId: "7961" }).then(
        res => {
          const code = dataIsNullNumber(res.code);
          if (code == 0) {
            const data = dataIsNullObj(res.data);
            this.statisticMenu = [
              { label: "当前报警数", value: data.warningnum },
              { label: "总监测点数", value: data.totalnum },
              {
                label: "告警率",
                value:
                  +data.totalnum == 0
                    ? 0
                    : Number((+data.warningnum / +data.totalnum) * 100).toFixed(
                        2
                      ) + "%"
              },
              { label: "本月告警次数", value: data.warnum }
            ];
          }
        }
      );
    },
    // 获取表格
    getTable() {
      this.warnPointData.length = 0;
      getBSBuildDetailList({
        buildId: this.buildId,
        systemId: "7961",
        pageNo: 1,
        pageSize: 0
      }).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullArray(res.data);
          if (!data.length) return;
          this.warnPointData = data;
          console.log(data);
        }
      });
    },

    // 获取chart
    getChart() {
      getBSBuildDetailChart({
        buildId: this.buildId,
        date: this.trendDate,
        systemId: "7961"
      }).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullArray(res.data);

          let xData = [],
            yData = [];
          data.map(item => {
            xData.push(item.time);
            yData.push(item.num);
          });
          let maxYAxis = Math.max(...yData);
          this.drawLineChart(xData, yData, maxYAxis);
        }
      });
    },
    // datepicker确认
    getDate() {
      this.trendDate =
        this.trendPickerDate.getFullYear() +
        "-" +
        (this.trendPickerDate.getMonth() + 1);

      this.showPicker = false;
      this.getChart();
    },
    //折线图统计
    drawLineChart(xData, yData, maxYAxis) {
      let el = document.getElementById("linkChart");
      if (!el) {
        return;
      }
      // eslint-disable-next-line no-undef
      this.linkChart = echarts.init(el);
      let option = {
        tooltip: {
          trigger: "axis",
          backgroundColor: "white",
          padding: 10,
          extraCssText: "box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.09);",
          textStyle: {
            fontSize: "12px",
            color: "#23272e"
          }
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 20,
          top: 40,
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: xData,
          // 网格线
          splitLine: {
            lineStyle: {
              type: "dashed"
            }
          },
          // 坐标轴线
          axisLine: {
            show: false
          },
          // 刻度线
          axisTick: {
            show: false
          }
        },
        yAxis: {
          name: "数量",
          max: setAxisScale(maxYAxis),
          type: "value",
          // 坐标轴线
          axisLine: {
            show: false
          },
          // 刻度线
          axisTick: {
            show: false
          },
          // 网格线
          splitLine: {
            lineStyle: {
              type: "dashed"
            }
          }
        },
        series: [
          {
            type: "line",
            data: yData,
            smooth: true,
            itemStyle: {
              normal: {
                color: "#1989fa"
              }
            }
          }
        ]
      };
      this.linkChart && this.linkChart.clear();
      this.linkChart.setOption(option);
    }
  },
  mounted() {
    this.baseInfo = [
      { label: "建筑名称", value: this.buildData.buildName },
      { label: "地址", value: this.buildData.buildAddress },
      { label: "类型", value: this.buildData.buildTypeName },
      { label: "报警数量", value: this.buildData.alarmNum },
      { label: "未处置数量", value: this.buildData.undisposeNum },
      { label: "经度", value: this.buildData.lon },
      { label: "纬度", value: this.buildData.lat }
    ];

    this.getStatistic();
    this.getTable();
    let date = new Date();
    this.trendDate = date.getFullYear() + "-" + (date.getMonth() + 1);
    this.getChart();
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
.pressure {
  padding: px2rem(15px);
  .statistic {
    margin-top: px2rem(20px);
    border-radius: 4px;
    background: white;
    box-shadow: 0 px2rem(2px) px2rem(8px) rgba(0, 0, 0, 0.09);
    .vrow {
      @include flex;
      flex-wrap: wrap;
      .vcol {
        padding: px2rem(15px) px2rem(30px);
        @include flex;
        @include flex-primary-axis-center;
        @include flex-secondary-axis-center;
        @include flex-column;
        &:nth-child(n) {
          border-bottom: 1px solid #ececec;
        }
        &:nth-child(2n) {
          border-left: 1px solid #ececec;
        }
        &:first-child {
          span:last-child {
            color: #1989fa;
          }
        }
        span {
          &:first-child {
            position: relative;
            padding-bottom: px2rem(10px);
          }
          &:last-child {
            font-size: 16px;
            color: #ee0a24;
          }
        }
      }
    }
  }
  .warnPoint {
    border-radius: 4px;
    box-shadow: 0 px2rem(2px) px2rem(8px) rgba(0, 0, 0, 0.09);
    background: white;
    margin-top: px2rem(20px);
    .warnPointTitle {
      padding: px2rem(5px) px2rem(15px);
      // padding-left: px2rem(15px);
      padding-bottom: 1px solid #ececec;
    }
    .warnPointList {
      height: px2rem(150px);
      overflow: auto;
      font-size: 12px;
      padding-left: px2rem(7px);
      .van-row {
        padding: px2rem(3.6px) 0;
      }
      // padding-bottom: px2rem(5px);
    }
  }
  .trend {
    border-radius: 4px;
    box-shadow: 0 px2rem(2px) px2rem(8px) rgba(0, 0, 0, 0.09);
    margin-top: px2rem(20px);
    background: white;

    .btn {
      position: absolute;
      right: px2rem(7px);
      top: px2rem(5px);
      font-size: 12px;
      transform: scale(0.7);
    }
    #linkChart {
      height: 5rem;
    }
  }
}
</style>
