// 取消确定抽屉
<template>
  <a-drawer
    :destroy-on-close="destroyOnClose"
    :get-container="false"
    :mask-closable="false"
    :title="title"
    :visible="visible"
    :width="width"
    :placement="placement"
    :wrap-style="{ position: 'absolute' }"
    :after-visible-change="afterVisibleChange"
    @close="handleCancel"
  >
    <section class="w100 content">
      <slot name="content"></slot>
    </section>
    <footer class="w100 tool">
      <a-space size="middle">
        <slot name="contentFooter"></slot>
        <a-button :loading="hideOk && submitting" @click="handleCancel">
          取消
        </a-button>
        <a-button
          type="primary"
          :loading="submitting"
          @click="handleOk"
          v-if="!hideOk && havePower('save')"
        >
          {{ okText }}
        </a-button>
        <a-tooltip placement="top" title="无操作权限">
          <a-button disabled v-if="!hideOk && !havePower('save')">
            保存
          </a-button>
        </a-tooltip>
      </a-space>
    </footer>
  </a-drawer>
</template>

<script>
export default {
  props: {
    // 关闭销毁
    destroyOnClose: {
      type: Boolean,
      default: true
    },
    // 标题
    title: {
      type: String,
      default: ""
    },
    // 确定按钮文本
    okText: {
      type: String,
      default: ""
    },
    // 是否隐藏确定按钮
    hideOk: {
      type: Boolean,
      default: false
    },
    // 忽略权限
    ignorePowers: {
      type: Boolean,
      default: false
    },
    // 按钮权限
    buttonPowers: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 是否提交
    submitting: {
      type: Boolean,
      default: false
    },
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    // 宽度
    width: {
      type: String,
      default: "300"
    },
    // 位置
    placement: {
      type: String,
      default: "right"
    }
  },
  computed: {
    // 按钮是否有权限
    havePower() {
      return key => {
        return this.ignorePowers
          ? true
          : this.buttonPowers.length === 0
          ? false
          : this.buttonPowers.findIndex(power => power.code === key) !== -1;
      };
    }
  },
  methods: {
    // 切换可见
    afterVisibleChange(visible) {
      this.$emit("visibleChange", visible);
    },
    // 取消
    handleCancel() {
      this.$emit("cancel");
    },
    // 确认
    handleOk() {
      this.$emit("ok");
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  position: absolute;
  right: 0;
  top: 55px;
  height: calc(100% - 55px - 53px);
  overflow-x: hidden;
  overflow-y: auto;
}
.tool {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
  padding: 10px 16px;
  border-top: 1px solid #e9e9e9;
  background-color: $color-white;
  text-align: right;
}
</style>
