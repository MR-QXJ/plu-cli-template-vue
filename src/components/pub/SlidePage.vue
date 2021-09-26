<template>
  <div
    :class="['slide-page', slide ? 'active' : '']"
    :style="{ zIndex: zIndex }"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    slide: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: String,
      default: "100"
    }
  }
};
</script>
<style lang="scss" scoped>
.slide-page {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  right: -100vw;
  transition: right 0.3s;
  &.active {
    right: 0;
  }
}
</style>
