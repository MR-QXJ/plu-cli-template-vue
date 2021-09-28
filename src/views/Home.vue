<template>
  <div class="page home">
    <van-nav-bar title="首页" :border="false" />

    <main class="content">欢迎来到<span class="title">He-Cli！！</span></main>

    <BottomBar />
  </div>
</template>
<script>
import BottomBar from "components/pub/BottomBar";
export default {
  components: {
    BottomBar
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.home {
  .content {
    height: 500px;
    line-height: 500px;
    text-align: center;
    font-size: 30px;
    .title {
      font-style: italic;
      font-weight: 700;
      color: #00bbe4;
    }
  }
}
</style>
