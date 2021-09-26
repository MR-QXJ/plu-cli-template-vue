<template>
  <div class="h100 w100">
    <div class="w100 h100" :id="id" @resize="resizeHandle"></div>
    <object
      v-if="autoResize"
      ref="objectRef"
      tabindex="-1"
      type="text/html"
      aria-hidden="true"
      data="about:blank"
      style="display: block; 
            position: absolute; 
            top: 0px; 
            left: 0px; 
            width: 100%; 
            height: 100%; 
            border: none; 
            padding: 0px; 
            margin: 0px; 
            opacity: 0; 
            z-index: -1000; 
            pointer-events: none;"
    >
    </object>
  </div>
</template>

<script>
import { initEchart, debounce } from "utils/tool-echart";

export default {
  props: {
    id: {
      type: String,
      default: "echart"
    },
    //配置
    chartOpt: {
      type: Object,
      default: () => {}
    },
    //启动自适应宽度
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      echart: null,
      //防抖方式resize图表，写在methods中不会被缓存生成闭包
      resizeHandle: debounce(() => {
        this.echart && this.echart.resize();
      }, 200)
    };
  },
  mounted() {
    this.echart = initEchart(this.id, this.chartOpt || {}, e => {
      this.$emit("click", e);
    });

    if (!this.autoResize) return;
    //利用object标签监听宽度变化
    this.$refs["objectRef"].contentDocument.defaultView.addEventListener(
      "resize",
      () => {
        this.resizeHandle();
      }
    );
  },
  watch: {
    chartOpt: {
      handler(to) {
        this.echart.setOption(to);
      },
      deep: true
    }
  }
};
</script>
