<template>
  <div class="page profile">
    <van-nav-bar title="我的" :border="false" />

    <main class="content"><span class="title">Profile</span></main>

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
  }
};
</script>
<style lang="scss" scoped>
.profile {
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
