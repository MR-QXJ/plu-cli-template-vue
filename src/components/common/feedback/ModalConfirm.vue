// 取消确定对话框
<template>
  <a-modal
    :body-style="bodyStyle"
    centered
    :destroy-on-close="destroyOnClose"
    :get-container="() => container"
    :mask-closable="false"
    :mask-style="{ position: 'absolute' }"
    :title="title"
    :width="width"
    wrapClassName="ant-modal-absolute"
    v-model="visible"
    @cancel="handleCancel"
  >
    <template v-slot:footer>
      <a-space size="middle">
        <slot name="contentFooter"></slot>
        <a-button key="cancel" @click="handleCancel">
          取消
        </a-button>
        <span v-if="!hideOk && havePower('save')">
          <a-popconfirm :title="`${popConfirmMsg}？`" @confirm="handleOk">
            <a-button
              key="submit"
              type="primary"
              :loading="submitting"
              v-show="
                (popConfirmMsg !== '' && !popConfirmNeedCheck) ||
                  (popConfirmMsg !== '' &&
                    popConfirmNeedCheck &&
                    popConfirmChecked)
              "
            >
              {{ okText }}
            </a-button>
          </a-popconfirm>
          <a-button
            key="submit"
            type="primary"
            :loading="submitting"
            @click="handleOk"
            v-show="
              popConfirmMsg === '' ||
                (popConfirmMsg !== '' &&
                  popConfirmNeedCheck &&
                  !popConfirmChecked)
            "
          >
            {{ okText }}
          </a-button>
        </span>
        <a-tooltip placement="top" title="无操作权限">
          <a-button disabled v-if="!hideOk && !havePower('save')">
            保存
          </a-button>
        </a-tooltip>
      </a-space>
    </template>
    <slot name="content"></slot>
  </a-modal>
</template>

<script>
export default {
  props: {
    // 关闭销毁
    destroyOnClose: {
      type: Boolean,
      default: true
    },
    // 宽度
    width: {
      type: Number || String,
      default: 520
    },
    // body样式
    bodyStyle: {
      type: Object,
      default: () => {
        return {};
      }
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
    // 确定提示
    popConfirmMsg: {
      type: String,
      default: ""
    },
    // 确定提示是否校验后提示
    popConfirmNeedCheck: {
      type: Boolean,
      default: false
    },
    // 确定提示是否校验通过
    popConfirmChecked: {
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
    // 挂载容器
    container: null
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
