<template>
  <!--index.wxml-->
  <div class="w100 h100 container index-page">
    <!-- <nav-bar title="掌上消防" icon=""></nav-bar> -->
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      title="掌上消防"
      :border="false"
    />
    <BottomBar />
  </div>
</template>
<script>
import BottomBar from "components/pub/BottomBar";
import { mapGetters, mapActions } from "vuex";
import { removeBackButton, addBackButton } from "@/utils/tool";
export default {
  components: {
    BottomBar
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["user"])
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    const backFn = () => {
      if (this.slide) {
        this.slide = false;
      } else {
        this.$root.backBtnFn();
      }
    };
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(backFn);
  },
  methods: {
    ...mapActions(["clearUser"])
  }
};
</script>
<style lang="scss" scoped>
.index-page {
  .van-nav-bar {
    background: #0e41a6;
    /deep/.van-nav-bar__title {
      color: #fff;
    }
  }
  @include page-none-data;
}

/* 底部导航栏内联样式修改 */
.van-tabbar-item__icon {
  margin-bottom: 0 !important;
}
</style>
