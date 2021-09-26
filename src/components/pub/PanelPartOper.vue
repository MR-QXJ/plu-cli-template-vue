<template>
  <div class="w100 h100 panelpartoper">
    <div class="left" :style="{ flex: leftFlex }">
      <panel-part
        height="100%"
        :title="leftTitle"
        :loading="leftLoading"
        :isEmpty="leftEmpty"
      >
        <template slot="content">
          <slot name="left-content"></slot>
        </template>
      </panel-part>
    </div>
    <div class="right" :style="{ flex: rightFlex }">
      <panel-part
        height="100%"
        :title="rightTitle"
        :loading="rightLoading"
        :isEmpty="rightEmpty"
      >
        <template slot="content">
          <slot name="right-content"></slot>
        </template>
      </panel-part>
    </div>
  </div>
</template>
<script>
import panelPart from "@/components/pub/PanelPart.vue";
export default {
  data() {
    return {};
  },
  components: {
    "panel-part": panelPart
  },
  props: {
    leftFlex: {
      type: Number,
      default: 1.2
    },
    rightFlex: {
      type: Number,
      default: 5.56
    },
    // 左侧标题
    leftTitle: {
      type: String,
      default: ""
    },
    // 右侧标题
    rightTitle: {
      type: String,
      default: ""
    },
    // 左侧loading
    leftLoading: {
      type: Boolean,
      default: false
    },
    // 右侧loading
    rightLoading: {
      type: Boolean,
      default: false
    },
    // 左侧数据是否为空
    leftEmpty: {
      type: Boolean,
      default: false
    },
    // 右侧数据是否为空
    rightEmpty: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  methods: {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.panelpartoper {
  @include flex;
  @include flex-row;
  .left {
    height: 100%;
  }
  .right {
    height: 100%;
    margin-left: px2rem(38px);
  }
}
</style>
