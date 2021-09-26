<template>
  <div class="guide-detail w100 h100">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      title="指南详情"
      :border="false"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <Detail :detailList="detailList" :hasCustom="true">
      <div slot="custom">
        <div class="rich-text" v-html="richText"></div>
      </div>
    </Detail>
  </div>
</template>
<script>
import Detail from "@/components/pub/Detail.vue";
import {
  removeBackButton,
  addBackButton,
  dataIsNullNumber,
  dataIsNullObj,
  dataIsNullStr,
  showToast
} from "@/utils/tool";
import { URL, getBusinessGuideDetail } from "@/utils/api";
export default {
  components: {
    Detail
  },
  data() {
    return {
      richText: `<div class="h100 none-data">暂无数据</div>`,
      detailList: {}
    };
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);
    const key = this.$route.query.key;
    let params = {
      key
    };
    let obj = {
      list: []
    };
    // util.loading("加载中...");
    getBusinessGuideDetail(params).then(res => {
      const code = dataIsNullNumber(res.code);
      if (code === 0) {
        const data = dataIsNullObj(res.data);
        obj.list.push({
          title: "业务主题",
          info: dataIsNullStr(data.guideTitle, "未知")
        });
        obj.list.push({
          title: "办理时间",
          info: dataIsNullStr(data.updateTime, "未知")
        });
        const rich = data.guideText.replace(/src="\/zhxfgxpnapi/, `src="${URL}`);
        
        this.richText = rich;
        this.detailList = obj;
      } else {
        showToast(res.message);
      }
    });
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.guide-detail {
  overflow: hidden;
  .van-nav-bar {
    background: #0e41a6;
    /deep/.van-nav-bar__title {
      color: #fff;
    }
    /deep/.van-icon {
      color: #fff;
    }
  }
  background: #efeff4;
  @include page-none-data;
}
</style>
