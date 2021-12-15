<template>
  <div class="h100 w100 no-page">
    <section class="image" :style="imageStyle"></section>
    <p>抱歉，您访问的页面不存在</p>
    <a-button type="primary" @click="handleBackHome">
      返回首页
    </a-button>
  </div>
</template>

<script>
import { routePathHome } from "@/constants/global";

export default {
  name: "NoPage",
  computed: {
    // 图片样式
    imageStyle() {
      return {
        background: `url(${require("../assets/imgs/404/404.png")}) center center no-repeat`,
        backgroundSize: "407px 264px"
      };
    }
  },
  methods: {
    // 返回首页
    handleBackHome() {
      this.$router.push({ path: routePathHome });
    }
  }
};
</script>

<style lang="scss" scoped>
.no-page {
  @include flex;
  @include flex-column;
  @include flex-primary-axis-center;
  @include flex-secondary-axis-center;
  background-color: $color-white;

  .image {
    height: 264px;
    width: 407px;
  }
  p {
    font-size: 20px;
    font-weight: 400;
    color: $color-font-light;
    line-height: 56px;
  }
}
</style>
