<template>
  <div class="w100 h100 pointdetail">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      title="部位详情"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class=" pointdetail-container">
      <div class="chart">
        <van-loading
          class="van-loading"
          v-if="loading"
          type="spinner"
          color="#1989fa"
          size="18"
        />
        <p>历史曲线数据</p>
        <span v-if="isEmpty" class="no-data">暂无数据</span>
        <div class="w100 h100 lineChart" id="lineChart"></div>
      </div>
      <div class="img">
        <p>点位图片</p>
        <img :src="`${GETIMG}${data.imgUrl}`" alt="" preview />
      </div>
    </div>
  </div>
</template>

<script>
import { getBSUnitPointDetailChart, GETIMG } from "@/utils/api";
import {
  removeBackButton,
  addBackButton,
  dataIsNullArray,
  dataIsNullNumber
} from "@/utils/tool";

export default {
  data() {
    return {
      GETIMG,
      data: {},
      isEmpty: false,
      loading: false,
      finished: false,
      refreshing: false
    };
  },

  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);
    console.log(this.$route);
    if (this.$route.query.item) {
      this.data = this.$route.query.item;
      this.getChart();
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    getChart() {
      this.loading = true;
      getBSUnitPointDetailChart({
        pointId: this.data.pointId,
        beginDate: "2020-12-13 00:00:00",
        endDate: "2020-12-13 23:59:59"
      }).then(res => {
        this.loading = false;
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullArray(res.data);
          if (!data.length) {
            this.isEmpty = true;
            return;
          }
          let x = [],
            y1 = [],
            y2 = [],
            y3 = [],
            y4 = [];
          data.map(item => {
            x.push(item.time.slice(-8));
            y1.push(item.floorValue);
            y2.push(item.standardValue);
            y3.push(item.upperValue);
            y4.push(item.value);
          });
          this.drawLineChart(x, y1, y2, y3, y4);
        }
      });
    },
    //折线图统计
    drawLineChart(xData, yData1, yData2, yData3, yData4) {
      let el = document.getElementById("lineChart");
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
          left: 10,
          right: 10,
          bottom: 40,
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
        legend: {
          show: true,
          bottom: 0,
          data: ["下限值", "标准值", "上限值", "设备值"]
        },
        series: [
          {
            name: "下限值",
            type: "line",
            data: yData1
          },
          {
            name: "标准值",
            type: "line",
            data: yData2
          },
          {
            name: "上限值",
            type: "line",
            data: yData3
          },
          {
            name: "设备值",
            type: "line",
            data: yData4
          }
        ]
      };
      this.lineChart && this.lineChart.clear();
      this.lineChart.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.pointdetail {
  background: #f1f1f1;
  .pointdetail-container {
    position: relative;
    bottom: 0;
    height: calc(100% - 1.23rem);
    overflow-y: auto;
    padding: 0 px2rem(20px) px2rem(20px);

    .van-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 100;
    }
    .chart,
    .img {
      border-radius: 0.10667rem;
      box-shadow: 0 0.05333rem 0.21333rem rgba(0, 0, 0, 0.09);
      margin-top: 0.53333rem;
      background: white;
      position: relative;
      .no-data {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #b1b1b1;
      }
    }
    p {
      font-size: 14px;
      padding: px2rem(10px) px2rem(20px);
      border-bottom: 1px solid #b1b1b1;
      text-align: left;
    }
    #lineChart {
      height: 6rem;
    }
    .img {
      // padding: px2rem(40px);
      text-align: center;
      img {
      }
    }
    img {
      width: 90%;
      padding-top: px2rem(20px);
    }
  }
}
</style>
