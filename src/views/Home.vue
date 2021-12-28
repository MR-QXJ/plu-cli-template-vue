<template>
  <content-wrapper ref="contentWrapper">
    <template #content>
      <div class="home h100 w100">
        欢迎来到<span class="title" @click="show = true">He-Cli！！</span>
      </div>
    </template>
    <template #drawer>
      <Detail :operateKey="12" :visible="show" @cancel="show = false" />
    </template>
  </content-wrapper>
</template>

<script>
import Detail from "components/test/Detail";
import ContentWrapper from "components/common/layout/ContentWrapper";
export default {
  components: {
    Detail,
    ContentWrapper
  },
  data() {
    return {
      show: false
    };
  }
};
</script>

<style lang="scss" scoped>
.home {
  @include flex;
  @include flex-primary-axis-center;
  @include flex-secondary-axis-center;
  overflow: hidden;
  position: relative;

  text-align: center;
  font-size: 30px;
  .title {
    font-style: italic;
    font-weight: 700;
    color: #00bbe4;
  }
}
</style>
