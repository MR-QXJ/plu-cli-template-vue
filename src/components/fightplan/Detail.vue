<template>
  <div class="w100 h100 detail">
    <panel-part-oper height="100%" leftTitle="作战预案" :rightLoading="loading">
      <template slot="left-content">
        <div class="w100 h100 left-content">
          <div
            v-for="(item, index) in planMenu"
            :key="index"
            :class="['w100', activeIndex == index ? 'active' : '']"
            @click="checkIndex(index)"
          >
            {{ item }}
          </div>
        </div>
      </template>
      <template slot="right-content">
        <div class="w100 h100 right-content">
          <div class="w100 h100 img-container">
            <!-- 力量展开 -->
            <van-swipe
              v-if="!activeIndex"
              indicator-color="white"
              class="w100 h100"
              @change="onChangePower"
            >
              <van-swipe-item
                v-for="(item, index) in powerOn"
                :key="index"
                class="w100 h100 swip"
              >
                <img
                  v-lazy="`${GETIMG}${item.content}`"
                  class="h100"
                  style="margin:0 auto"
                />
              </van-swipe-item>
              <div class="custom-indicator" slot="indicator">
                {{ current + 1 }}/{{ powerOn.length }}
              </div>
            </van-swipe>
            <!-- 作战部署 -->
            <van-swipe
              v-else
              indicator-color="white"
              class="w100 h100"
              @change="onChangePrepation"
            >
              <van-swipe-item
                v-for="(item, index) in prepation"
                :key="index"
                class="w100 h100"
              >
                <img
                  v-lazy="`${GETIMG}${item.preparationContent}`"
                  class="h100"
                  style="margin:0 auto"
                />
              </van-swipe-item>
              <div class="custom-indicator" slot="indicator">
                {{ current + 1 }}/{{ prepation.length }}
              </div>
            </van-swipe>
          </div>
          <div class="w100 h100 descr" v-if="!activeIndex">
            {{ descrPowerOn }}
          </div>
          <div class="w100 h100 descr" v-else>
            {{ descrPrepation }}
          </div>
        </div>
      </template>
    </panel-part-oper>
    <van-icon
      name="arrow"
      class="back-icon"
      color="#00faff"
      size="1rem"
      @click="$emit('cancel')"
    />
  </div>
</template>
<script>
import PanelPartOper from "@/components/pub/PanelPartOper.vue";
import { fightPlanDetail, GETIMG } from "@/utils/api";
import { dataIsNullNumber, dataIsNullObj, dataIsNullArray } from "@/utils/tool";
export default {
  data() {
    return {
      GETIMG,
      planMenu: ["力量展开", "作战部署"],
      activeIndex: 0,
      images: [
        "https://img.yzcdn.cn/vant/apple-1.jpg",
        "https://img.yzcdn.cn/vant/apple-2.jpg"
      ],
      current: 0,
      //图片描述、
      descrPowerOn: "",
      descrPrepation: "",
      //力量展开数据
      powerOn: [],
      //作战部署数据
      prepation: [],
      loading: false
    };
  },
  components: {
    "panel-part-oper": PanelPartOper
  },
  props: {
    recordKey: {
      type: String,
      default: ""
    }
  },
  methods: {
    //获取详情
    getDetail: function() {
      this.loading = true;
      fightPlanDetail({
        key: this.recordKey
      }).then(res => {
        this.loading = false;
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullObj(res.data);
          this.powerOn = dataIsNullArray(data.rescuePowerOn);
          this.prepation = dataIsNullArray(data.rescueOperationalPreparations);
          if (this.powerOn.length) {
            this.descrPowerOn = this.powerOn[0].explain;
            this.descrPrepation = this.prepation[0].preparationExplain;
          }
        }
      });
    },
    checkIndex(index) {
      this.current = 0;
      this.activeIndex = index;
    },
    onChangePower(index) {
      this.current = index;
      this.descrPowerOn = this.powerOn[index].explain;
    },
    onChangePrepation(index) {
      this.current = index;
      this.descrPrepation = this.prepation[index].preparationExplain;
    }
  },
  mounted() {
    this.getDetail();
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.detail {
  background: #1c273c;
  position: relative;
  .left-content {
    padding: px2rem(10px) px2rem(32px);
    div {
      margin-top: px2rem(25px);
      height: px2rem(148px);
      font-size: px2rem(29px);
      color: #06c3dd;
      text-align: center;
      line-height: px2rem(148px);
      background: url("../../assets/img/fireresuce/defaultVehicle-bg.png") 0 0
        no-repeat;
      background-size: 100%;
      &.active {
        background: url("../../assets/img/fireresuce/activeVehicle-bg.png") 0 0
          no-repeat;
        background-size: 100%;
      }
    }
  }
  .right-content {
    @include flex;
    @include flex-column;
    .img-container {
      height: px2rem(500px);
      padding: px2rem(50px) px2rem(130px);
      flex: 3;
      .van-swipe {
        position: relative;
        .van-swipe-item {
          height: 100%;
          width: 100%;
          text-align: center;
          @include flex;
          @include flex-secondary-axis-center;
        }
        img {
        }
        .custom-indicator {
          right: 0;
          bottom: 0;
          position: absolute;
          font-size: px2rem(28px);
          text-align: right;
          padding: px2rem(10px);
          color: #fff;
          background: rgba(0, 0, 0, 0.1);
        }
      }
    }
    .descr {
      flex: 1;
      border-top: px2rem(2px) solid #01edf3;
      padding: px2rem(50px) px2rem(120px);
      font-size: px2rem(29px);
      color: #01edf3;
      line-height: px2rem(50px);
      overflow: auto;
    }
  }
  .back-icon {
    position: absolute;
    bottom: px2rem(50px);
    right: px2rem(50px);
  }
}
</style>
