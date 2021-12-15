// 预览单图
<template>
  <a-modal
    centered
    destroyOnClose
    :footer="null"
    :get-container="() => container"
    :mask-style="{ position: 'absolute' }"
    wrapClassName="ant-modal-absolute"
    v-model="visible"
    @cancel="visible = false"
  >
    <img class="w100 image-preview" :src="url" v-if="url" />
    <a-icon
      :style="{
        padding: '30px 0',
        width: '100%',
        fontSize: '180px',
        color: '#cccccc'
      }"
      type="picture"
      v-else
    />
  </a-modal>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    container: {
      type: Object,
      default: null
    },
    url: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      visible: false
    };
  },
  watch: {
    value(to) {
      this.visible = to;
    },
    //反向修改v-model对应的数据
    visible(to) {
      this.$emit("input", to);
    }
  }
};
</script>
