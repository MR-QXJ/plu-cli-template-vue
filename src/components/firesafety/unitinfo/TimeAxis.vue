<template>
  <div class="time-axis flex time-container">
    <div class="itemTimeZ">
      <!--  左边 -->
      <div class="leftView">
        <div :class="isCurent === true ? 'roundVIew' : 'outRoundVIew'"></div>
        <div v-if="isShowLeftLine" class="leftLine"></div>
      </div>

      <!-- 右边 -->
      <div class="rightContent">
        <slot name="rightChilren"></slot>
        <div v-if="textArray.length > 0">
          <span
            v-for="(item, index) in textArray"
            :key="index"
            :class="isCurent === true ? 'curentTitle' : 'outTitle'"
            >{{ item }}</span
          >
        </div>
        <div :class="isCurent === true ? 'curentTitle' : 'outTitle'">
          {{ disposeDate }}
        </div>
        <div
          v-if="disposeContent"
          :class="isCurent === true ? 'curentTitle' : 'outTitle'"
        >
          处置内容: {{ disposeContent }}
        </div>
        <div
          v-if="disposeStateName1"
          :class="isCurent === true ? 'curentTitle' : 'outTitle'"
        >
          处置状态: {{ disposeStateName1 }}
        </div>
        <div
          v-if="nextDisposeDate"
          :class="isCurent === true ? 'curentTitle' : 'outTitle'"
        >
          计划处置时间: {{ nextDisposeDate }}
        </div>
        <div
          v-if="personName"
          :class="isCurent === true ? 'curentTitle' : 'outTitle'"
        >
          处置人员: {{ personName }}
        </div>
      </div>
    </div>
    <div class="right-image" v-if="imageUrl.length" @click="onClickShow">
      <img
        class="w100 h100"
        @click="onClickShow"
        :src="item.imgUrl"
        v-for="(item, index) in imageUrl"
        :key="index"
      />
    </div>
    <van-popup :show="show" bind:close="onClose">
      <img :src="imageUrl" />
    </van-popup>
  </div>
</template>
<script>
export default {
  props: {
    isCurent: {
      type: Boolean,
      default: false
    },
    isShowLeftLine: {
      type: Boolean,
      default: true
    },
    // 处置内容
    disposeContent: {
      type: String,
      default: ""
    },
    // 处置时间
    disposeDate: {
      type: String,
      default: ""
    },
    textArray: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 图片
    imageUrl: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 处置状态名称
    disposeStateName1: {
      type: String,
      default: ""
    },
    // 计划处置时间
    nextDisposeDate: {
      type: String,
      default: ""
    },
    // 处置人
    personName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    onClickShow() {
      this.show = true;
    },
    onClose() {
      this.show = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.time-axis {
  /* Components/timeAxis/timeAxis.wxss */
  &.time-container {
    padding: 0 10px;
  }
  .itemTimeZ {
    display: flex;
    flex: 1;
    /* padding:0px 15px 0 15px; */
  }
  .leftView {
    display: flex;
    flex-direction: column;
  }
  .roundVIew {
    width: 9px;
    height: 9px;
    border-radius: 4.5px;
    background: red;
  }
  .outRoundVIew {
    width: 9px;
    height: 9px;
    border-radius: 4.5px;
    border: 1px solid #698ace;
  }
  .leftLine {
    display: flex;
    flex: 1;
    width: 1px;
    margin-left: 3.5px;
    padding-bottom: 6px;
    background: #dadada;
  }

  .rightContent {
    /* display: flex;
  flex:1;
  flex-direction: column; */
    margin-top: -6px;
    margin-left: 15px;
    /* padding-bottom: 24px; */
    font-size: 12px;
    padding: 5px 0;
  }

  .curentTitle {
    /* font-size: 16px; */
    line-height: 20px;
    color: #fe473c;
  }
  .curentTime {
    /* font-size: 14px; */
    color: #fe473c;
  }
  .outTitle {
    /* font-size: 16px; */
    line-height: 20px;
    color: #999;
  }
  .outTime {
    /* font-size: 14px; */
    color: #999;
    line-height: 20px;
  }

  .right-image {
    /* margin-left:  */
    width: 22.5px;
    height: 22.5px;
  }
}
</style>
