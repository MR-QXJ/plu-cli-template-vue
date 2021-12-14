<template>
  <div class="h100 w100 home">
    欢迎来到<span class="title">He-Cli！！</span>
    <Echart :chartOpt="o" />
  </div>
</template>

<script>
import Echart from "components/common/chart/Echart";
export default {
  components: {
    Echart
  },
  data() {
    return {
      o: {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line"
          }
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.home {
  height: 500px;
  line-height: 500px;
  text-align: center;
  font-size: 30px;
  .title {
    font-style: italic;
    font-weight: 700;
    color: #00bbe4;
  }
}
</style>
