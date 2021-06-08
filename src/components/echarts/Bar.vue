<template>
  <div class="h100 w100">
    <Echart :chartOpt="barOption"></Echart>
  </div>
</template>

<script>
import { getBarOption } from "utils/tool-echart";
import Echart from "components/echarts/Echart";

const xAxisData = ["15:48", "15:51", "15:57", "16:00", "16:03"];
const yAxisData = [0, 2, 0, 5, 0];

export default {
  components: { Echart },
  data() {
    return {
      barOption: null
    };
  },
  mounted() {
    this.barOption = getBarOption(xAxisData, yAxisData);
  }
};
</script>
