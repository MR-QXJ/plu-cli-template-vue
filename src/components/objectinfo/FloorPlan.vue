<template>
  <div class="w100 h100 floorplan">
    <div class="h100 left-img">
      <img :src="`${GETIMG}${imgUrl}`" alt="图片" class="h100" />
    </div>
    <div class="h100 right-menu">
      <div class="prev"></div>
      <div class="next"></div>
      <div class="w100 floor-menu">
        <div
          v-for="(item, index) in floorList"
          :key="index"
          :class="['floor-item', item.key == activeKey ? 'active' : '']"
          @click="checkFloor(item)"
        >
          <div>
            {{ item.realFloor }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getBuildFloorInfo, GETIMG } from "@/utils/api";
import { dataIsNullNumber, dataIsNullArray } from "@/utils/tool";
export default {
  data() {
    return {
      GETIMG,
      imgUrl: "",
      activeKey: null,
      floorList: []
    };
  },
  props: {
    buildId: {
      type: String,
      default: ""
    }
  },
  methods: {
    //获取楼层
    getFloorInfo: function() {
      const params = {
        buildId: this.buildId
      };
      getBuildFloorInfo(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullArray(res.data);
          if (data.length) {
            this.floorList = JSON.parse(JSON.stringify(data));
            this.imgUrl = data[0].floorImgUrl;
          }
        }
      });
    },
    checkFloor: function(item) {
      this.activeKey = item.key;
      this.imgUrl = item.floorImgUrl;
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.floorplan {
  padding: px2rem(50px) px2rem(58px);
  @include flex;
  @include flex-primary-axis-between;
  .left-img {
    width: px2rem(1600px);
    border: solid px2rem(2px) #01edf3;
  }
  .right-menu {
    width: px2rem(168px);
    position: relative;

    .prev,
    .next {
      width: px2rem(62px);
      height: px2rem(40px);
      background: url("../../assets/img/fireresuce/wheel-point-bg.png") 0 0
        no-repeat;
      background-size: 100%;
      position: absolute;
      top: 0;
      left: 50%;
      margin-left: px2rem(-31px);
      z-index: 2;
    }
    .next {
      top: calc(100% - 0.8rem);
      transform: rotate(180deg);
      -webkit-transform: rotate(180deg);
      -ms-transform: rotate(180deg);
      -moz-transform: rotate(180deg);
    }
    .floor-menu {
      margin: px2rem(60px) 0;
      position: absolute;
      top: 0;
      left: 0;
      height: calc(100% - 2rem);
      @include flex;
      @include flex-column;
      @include flex-secondary-axis-center;
      overflow: auto;
      .floor-item {
        width: px2rem(120px);
        height: px2rem(160px);
        padding-bottom: px2rem(30px);
        &:last-child {
          padding: 0;
        }
        div {
          width: px2rem(120px);
          height: px2rem(120px);
          line-height: px2rem(120px);
          background: url("../../assets/img/fireresuce/objectfloor.png") 0 0
            no-repeat;
          background-size: contain;
          font-size: px2rem(28px);
          color: white;
          text-align: center;
          font-family: MicrosoftYaHei;
          transition: all 0.1s linear;
        }
        &.active {
          div {
            background: url("../../assets/img/fireresuce/objectfloorActive.png");
            background-size: 100%;
            color: #04dbe3;
          }
        }
      }

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
    }
  }
}
</style>
