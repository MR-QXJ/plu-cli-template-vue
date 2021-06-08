<template>
  <div class="h100 w100 home">
    <a-row class="h100">
      <a-col class="h100">
        <Bar />
      </a-col>
      <a-col span="4" class="h100"></a-col>
    </a-row>
  </div>
</template>

<script>
import Bar from "components/echarts/Bar";
export default {
  data() {
    return {};
  },
  components: { Bar }
};
</script>

<style lang="scss" scoped>
.home {
  height: 320px;
}
</style>
