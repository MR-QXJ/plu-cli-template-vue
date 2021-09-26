<template>
  <div class="template-index w100 h100">
    <slot name="search"></slot>
    <div class="index-contet w100">
      <slot name="card"></slot>
      <slot name="more"></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.template-index {
  overflow: hidden;
}

.index-contet {
  height: 100%;
  padding-top: 15px;
}

.total-box {
  height: 30px;
  font-size: 12px;
}

.total-before {
  width: 30px;
  margin-right: 5px;
  height: 1px;
  background-color: #ccc;
}

.total-after {
  width: 30px;
  margin-left: 5px;
  height: 1px;
  background-color: #ccc;
}
</style>
