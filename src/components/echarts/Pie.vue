<template>
  <div class="h100 w100">
    <Echart :chartOpt="pieOption"></Echart>
  </div>
</template>

<script>
import { getPieOption } from "utils/tool-echart";
import Echart from "components/echarts/Echart";

const Piedata = [
  { name: "有隐患单位", value: 32 },
  { name: "没有隐患单位", value: 144 }
];

export default {
  components: { Echart },
  data() {
    return {
      pieOption: null
    };
  },
  mounted() {
    this.pieOption = getPieOption(Piedata);
  }
};
</script>
