<template>
  <div class="w100 h100 detail">
    <div class="detail-contianer">
      <div class="detail-content">
        <div
          class="detail-item list-boder"
          v-for="(item, index) in detailList.list"
          :key="index"
        >
          <span class="detail-item-title">{{ item.title }}:</span>
          <span class="detail-item-info">{{ item.info }}</span>
        </div>
        <div v-if="hasMap" class="list-boder">
          <slot name="hiddenMap"></slot>
        </div>
        <div class="list-boder content-description">
          <div v-if="hasCustom" class="w100 h100 custom">
            <slot name="custom" />
          </div>
          <van-cell-group v-if="!hasCustom">
            <van-field
              :value="detailList.infoText"
              type="textarea"
              placeholder="暂无内容"
              input-class="input-class"
              autosize
              disabled
              :border="false"
            />
          </van-cell-group>
          <div class="detail-image" v-if="hasImage">
            <slot name="image" />
          </div>
        </div>
      </div>
      <div class="radio-wrap" v-if="hasRadio">
        <slot name="radio" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    detailList: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 地图
    hasMap: {
      type: Boolean,
      default: false
    },
    // 图片
    hasImage: {
      type: Boolean,
      default: false
    },
    // 描述
    hasCustom: {
      type: Boolean,
      default: false
    },
    // radio
    hasRadio: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss" scoped>
.detail-contianer {
  padding: 10px 15px;
  height: calc(100vh - 46px);
  overflow-y: auto;
  /* 多行文本样式 */
  /deep/ [class*="van-hairline"]::after {
    display: none;
  }
  /deep/ .van-field__control {
    background-color: #f8f8ff;
    font-size: 12px;
  }
}
/* 详情内容 */
.detail-content {
  padding: 10px;
  /* padding-top:0; */
  font-size: 12px;
  background: #fff;
  border-radius: 5px;
}
/* 详情项 */
.detail-item {
  padding: 15px 0;
  color: #6a6a6a;
  /* border-bottom: 2px solid #e5e5e5; */
}
.list-boder:not(:last-child) {
  border-bottom: 1px solid #e5e5e5;
}
.detail-item-info {
  margin-left: 10px;
}
/* 内容描述 */
.content-description {
  position: relative;
  min-height: 122.5px;
  /* padding: 20px; */
  background: #f8f8ff;
  margin-top: 10px;
  padding: 10px 10px 0;
}
.custom {
  overflow: auto;
}
</style>
