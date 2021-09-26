<template>
  <div class="w100 tab-content-item lavel" v-if="!active">
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
      <p>消防水位系统告警统计</p>
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
        <van-row v-for="(item, index) in warnPointData" :key="index">
          <van-col style="width:48%" span="12">{{ item.position }}</van-col>
          <van-col span="4" class="van-ellipsis">{{ item.type }}</van-col>
          <van-col span="8" class="van-ellipsis">{{ item.time }}</van-col>
        </van-row>
      </div>
    </div>
    <div class="trend">
      <p>
        消防水位系统趋势分析
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
      <div class="w100 lineChart" id="lineChart2"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 显示单位信息弹窗
      showInfo: false,
      activeNames: ["1"],
      active: 0,
      baseInfo: [
        { label: "单位名称", value: "12312312123" },
        { label: "地址", value: "从情况计时你的公交那你是" },
        { label: "面积", value: "123㎡" },
        { label: "单位性质", value: "高层公共建筑" },
        { label: "监督等级", value: "二级重点单位" },
        { label: "安全管理人", value: "谭永军" },
        { label: "联系电话", value: "4008208820" },
        { label: "值班电话", value: "16526215123" }
      ],
      statisticMenu: [
        { label: "总点位数", value: 123 },
        { label: "实时告警", value: 123 },
        { label: "告警率", value: "12%" },
        { label: "本月新增告警数", value: 35 }
      ], // 告警点位数据
      warnPointData: [
        {
          position: "位置位置位置位置位置位置位置位置位置位置位置位置",
          type: "类型类型",
          time: "2020-12-12 12:12:12"
        },
        {
          position: "位置位置位置位置位置位置位置位置位置位置位置位置",
          type: "类型类型",
          time: "2020-12-12 12:12:12"
        },
        {
          position: "位置位置位置位置位置位置位置位置位置位置位置位置",
          type: "类型类型",
          time: "2020-12-12 12:12:12"
        },
        {
          position: "位置位置位置位置位置位置位置位置位置位置位置位置",
          type: "类型类型",
          time: "2020-12-12 12:12:12"
        },
        {
          position: "位置位置位置位置位置位置位置位置位置位置位置位置",
          type: "类型类型",
          time: "2020-12-12 12:12:12"
        },
        {
          position: "位置位置位置位置位置位置位置位置位置位置位置位置",
          type: "类型类型",
          time: "2020-12-12 12:12:12"
        },
        {
          position: "位置位置位置位置位置位置位置位置位置位置位置位置",
          type: "类型类型",
          time: "2020-12-12 12:12:12"
        },
        {
          position: "位置位置位置位置位置位置位置位置位置位置位置位置",
          type: "类型类型",
          time: "2020-12-12 12:12:12"
        },
        {
          position: "位置位置位置位置位置位置位置位置位置位置位置位置",
          type: "类型类型",
          time: "2020-12-12 12:12:12"
        },
        {
          position: "位置位置位置位置位置位置位置位置位置位置位置位置",
          type: "类型类型",
          time: "2020-12-12 12:12:12"
        },
        {
          position: "位置位置位置位置位置位置位置位置位置位置位置位置",
          type: "类型类型",
          time: "2020-12-12 12:12:12"
        }
      ],
      trendDate: "2012-11",
      showPicker: false,
      trendPickerDate: new Date(),
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      lineChart: null
    };
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
    // datepicker确认
    getDate() {
      this.trendDate =
        this.trendPickerDate.getFullYear() +
        "-" +
        (this.trendPickerDate.getMonth() + 1);

      this.showPicker = false;
    },
    //折线图统计
    drawLineChart2(xData, yData1) {
      let el = document.getElementById("lineChart2");
      if (!el) {
        return;
      }
      // eslint-disable-next-line no-undef
      this.lineChart = echarts.init(el);
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
          top: 20,
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
            data: yData1,
            smooth: true,
            itemStyle: {
              normal: {
                color: "#1989fa"
              }
            }
          }
        ]
      };
      this.lineChart && this.lineChart.clear();
      this.lineChart.setOption(option);
    }
  },
  mounted() {
    let x = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      y = [111, 222, 333, 111, 444, 555, 222];
    // this.$nextTick(() => {
    this.drawLineChart2(x, y);
    // });
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
.lavel {
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
      padding-bottom: px2rem(5px);
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
    #lineChart2 {
      height: 5rem;
    }
  }
}
</style>
