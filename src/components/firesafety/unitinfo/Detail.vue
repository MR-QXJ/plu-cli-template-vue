<template>
  <div class="info-box w100 h100">
    <div class="info-title w100 flex-align-center-between">
      <span>单位简介</span>
      <span v-if="userlevel == 1" class="compile" @click="clickUnit">编辑</span>
    </div>
    <div class="info-s w100">
      <div
        class="info flex-align-center"
        v-for="(item, index) in unitInfo"
        :key="index"
      >
        <div class="info-name">{{ item.name }}</div>
        <div class="info-cont">{{ item.data }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["userlevel", "unitInfo"],
  methods: {
    clickUnit() {
      this.$emit("compile");
    }
  }
};
</script>

<style>
.info-box {
  border-radius: 5px;
  margin-top: 10px;
}

.info-title {
  height: 35px;
  line-height: 35px;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  color: #333333;
  background-color: #fff;
  padding: 0 10px;
}

.compile {
  font-size: 12px;
  color: #50b7f2;
}

.info-s {
  height: calc(100% - 100px);
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 10px;
  background: white;
}

.info {
  height: 35px;
  box-sizing: border-box;
  font-size: 12px;
  color: #666;
}

.info-name {
  width: 30%;
}

.info-cont {
  width: 70%;
  color: #999;
}
</style>
