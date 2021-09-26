<template>
  <div class="w100 h100 firefacility">
    <div class="w100 h100 firefacility-content">
      <div v-for="(item, index) in list" :key="index" :class="item.class">
        <img :src="item.url" alt="" />
        <div>
          <div>{{ item.name }}</div>
          <div>{{ item.valueUnit }}</div>
          <div>{{ item.state }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getBuildFireDevice } from "@/utils/api";
import { dataIsNullNumber, dataIsNullArray, dataIsNullStr } from "@/utils/tool";
export default {
  data() {
    return {
      list: []
    };
  },
  props: {
    buildId: {
      type: String,
      default: ""
    }
  },
  computed: {},
  methods: {
    //获取消防设施
    getFacilityHandle: function() {
      getBuildFireDevice({
        buildId: this.buildId
      }).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          // eslint-disable-next-line no-unused-vars
          const data = dataIsNullArray(res.data);
          if (data.length) {
            data.map(item => {
              if (item.typ == "98304") {
                //压力
                let arr = dataIsNullArray(item.buildFirePointPojoList);
                arr.map(record => {
                  this.list.push({
                    name: dataIsNullStr(record.pointName),
                    valueUnit: `压力：${dataIsNullNumber(
                      record.value
                    )}${dataIsNullStr(record.valueUnit)}`,
                    class: "force",
                    url: require("../../assets/img/fireresuce/force.png"),
                    state: `状态：${dataIsNullStr(record.stateName)}`
                  });
                });
              } else {
                //液位
                let arr = dataIsNullArray(item.buildFirePointPojoList);
                arr.map(record => {
                  this.list.push({
                    name: dataIsNullStr(record.pointName),
                    valueUnit: `液位：${dataIsNullNumber(
                      record.value
                    )}${dataIsNullStr(record.valueUnit)}`,
                    class: "watertank",
                    url: require("../../assets/img/fireresuce/watertank.png"),
                    state: `状态：${dataIsNullStr(record.stateName)}`
                  });
                });
              }
            });
          }
        }
      });
    }
  },
  mounted() {
    // this.getFacilityHandle();
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.firefacility {
  padding: px2rem(80px);
}
.firefacility-content {
  overflow-x: auto;
  @include flex;
  @include flex-primary-axis-between;
  // 滚动条
  &::-webkit-scrollbar {
    height: px2rem(0px);
    width: px2rem(0px);
  }
  // 槽
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  //滑动块
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
  & > div {
    margin-right: px2rem(20px);
    flex-shrink: 0;
    width: px2rem(400px);
    padding: px2rem(86px) 0;
    background-color: #131723;
    border: solid px2rem(2px) #005a8a;
    @include flex;
    @include flex-column;
    @include flex-primary-axis-between;
    @include flex-secondary-axis-center;

    &.watertank {
      img {
        margin-top: px2rem(80px);
      }
    }
    div {
      font-size: px2rem(28px);
      color: #0099cc;
      font-weight: bold;
      font-family: MicrosoftYaHei;
    }
  }
}
</style>
