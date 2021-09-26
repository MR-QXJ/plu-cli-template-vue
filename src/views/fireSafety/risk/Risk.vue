<template>
  <div class="risk h100">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      :border="false"
      :title="unitName"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div class="w100 h100">
      <div class="details">
        <list-title :default="true"
          ><span class="title">{{ allData.echartsName }}</span></list-title
        >
        <!-- <div class="title w100">
          <img :src="require('../../../assets/img//index/title.png')" />
          <span></span>
        </div> -->
        <div class="w100 chart-container">
          <Echart :id="'chart' + unitId" :chartOpt="echartOpt" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  removeBackButton,
  addBackButton,
  getDaysInMonth,
  getTime,
  dataIsNullArray
} from "utils/tool";
import { initLineEcharts } from "utils/tool-echart";
import { getFireUnitRiskTendency, getRiskTrendByFire } from "utils/api";
import ListTitle from "components/pub/ListTitle";
import Echart from "components/pub/Echart";
export default {
  components: {
    ListTitle,
    Echart
  },
  data() {
    return {
      // 单位名称
      unitName: "",
      // 单位ID
      unitId: null,
      // 详情数据
      allData: {
        // 无数据
        noDataList: "",
        // echart盒子名
        echartsName: "最近12个月风险指数趋势",
        // 选择年月
        choosedate: "",
        // echart
        chartEc: {
          lazyLoad: true
        }
      },
      echartOpt: {}
    };
  },
  methods: {
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
    getEData(time, date) {
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
          getFireUnitRiskTendency(param).then(res => {
            resolve(res);
          });
        });
      };
      let adminManage = () => {
        return new Promise(resolve => {
          getRiskTrendByFire(param).then(res => {
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
            datas.push(record.riskNum);
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
  created() {
    let date = this.disposeDate();
    this.unitName = this.$route.query.name;
    this.unitId = this.$route.query.id;

    this.getEData(`${date[0]}-${date[1]}`, date[2]);
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);
  }
};
</script>

<style lang="scss" scoped>
.risk {
  background-color: #efeff4;
  /deep/ {
    .list-title {
      margin: 0;
      padding: 0 10px;
    }
  }
  .van-nav-bar {
    background: #0e41a6;
  }
  .details {
    height: 30%;
    background-color: #fff;
    margin: 15px;
    border-radius: 5px;
    box-shadow: 0px 2px 2px #dadfdf;
  }
  .title {
    font-size: 14px;
    color: #333;
  }
  .chart-container {
    height: calc(100% - 30px);
  }
}
</style>
