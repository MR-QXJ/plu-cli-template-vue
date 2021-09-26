<template functional>
  <div class="list-title">
    <img
      :src="require('../../assets/img/index/title.png')"
      alt=""
    /><slot></slot>
  </div>
</template>
<style lang="scss" scoped>
.list-title {
  display: flex;
  align-items: center;
  height: 40px;
  margin: 0 10px;
  border-bottom: 1px solid #e6e6e6;
  color: #2a57b7;
  img {
    width: 2.2px;
    height: 12px;
    margin-right: 5px;
  }
}
</style>
