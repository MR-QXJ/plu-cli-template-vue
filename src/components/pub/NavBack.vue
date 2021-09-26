<template>
  <div class="nav-back">
    <img
      :src="require('../../assets/img/diyNav/back.png')"
      @click="$router.go(-1)"
    />{{ title }}
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="scss" scoped>
.nav-back {
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 16px;
  > img {
    margin-right: 4px;
    width: 17px;
    height: 17px;
  }
}
</style>
