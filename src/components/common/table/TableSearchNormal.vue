// 表格查询（常规）
<template>
  <header class="w100 table-search">
    <a-form :form="formSearch">
      <a-row :gutter="24">
        <a-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="24"
          :xl="12"
          :xxl="colSpan"
          v-if="!onlyOther"
        >
          <a-form-item
            :label="otherTotal > 0 ? placeHolderDis : ''"
            :label-col="{
              xs: { span: colLabelSpan('xs') },
              sm: { span: colLabelSpan('sm') },
              md: { span: colLabelSpan('md') },
              lg: { span: colLabelSpan('lg') },
              xl: { span: colLabelSpan('xl') },
              xxl: { span: colLabelSpan('xxl') }
            }"
            :wrapper-col="{
              xs: { span: colWrapperSpan('xs') },
              sm: { span: colWrapperSpan('sm') },
              md: { span: colWrapperSpan('md') },
              lg: { span: colWrapperSpan('lg') },
              xl: { span: colWrapperSpan('xl') },
              xxl: { span: colWrapperSpan('xxl') }
            }"
          >
            <a-input
              :disabled="disabled"
              type="text"
              allowClear
              :placeholder="placeHolderDis"
              :title="searchKey"
              :style="{ width: '100%' }"
              v-model="searchKey"
              @keyup.enter="handleSearch"
            >
              <a-icon
                :style="{ fontSize: '16px', color: '#cccccc' }"
                slot="prefix"
                type="search"
              />
            </a-input>
          </a-form-item>
        </a-col>
        <slot
          name="conditions"
          :colxs="24"
          :colsm="24"
          :colmd="24"
          :collg="24"
          :colxl="12"
          :colxxl="colSpan"
          :colLabelxs="colLabelSpan('xs')"
          :colLabelsm="colLabelSpan('sm')"
          :colLabelmd="colLabelSpan('md')"
          :colLabellg="colLabelSpan('lg')"
          :colLabelxl="colLabelSpan('xl')"
          :colLabelxxl="colLabelSpan('xxl')"
          :colWrapperxs="colWrapperSpan('xs')"
          :colWrappersm="colWrapperSpan('sm')"
          :colWrappermd="colWrapperSpan('md')"
          :colWrapperlg="colWrapperSpan('lg')"
          :colWrapperxl="colWrapperSpan('xl')"
          :colWrapperxxl="colWrapperSpan('xxl')"
        ></slot>
        <a-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="24"
          :xl="colSpanLast(12)"
          :xxl="colSpanLast(getColSpan())"
          :style="{ textAlign: 'right' }"
        >
          <a-form-item>
            <a-space size="middle">
              <span v-if="!hideButton('search')">
                <a-button
                  :disabled="disabled"
                  type="primary"
                  v-if="havePower('search')"
                  @click="handleSearch"
                  >查询</a-button
                >
                <a-tooltip placement="top" title="无操作权限">
                  <a-button disabled type="primary" v-if="!havePower('search')"
                    >查询</a-button
                  >
                </a-tooltip>
              </span>
              <span v-if="!hideButton('reset')">
                <a-button
                  :disabled="disabled"
                  v-if="havePower('reset')"
                  @click="handleReset"
                  >重置</a-button
                >
                <a-tooltip placement="top" title="无操作权限">
                  <a-button disabled type="primary" v-if="!havePower('reset')"
                    >重置</a-button
                  >
                </a-tooltip>
              </span>
              <a class="trigger" v-if="showTrigger" @click="handleTrigge">
                <span v-cloak>
                  {{ collapsed ? "展开" : "收起" }}
                </span>
                <a-icon :type="collapsed ? 'down' : 'up'" />
              </a>
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </header>
</template>

<script>
export default {
  props: {
    // 一行显示条件数
    rowSize: {
      type: Number,
      default: 3
    },
    // 是否只使用额外条件
    onlyOther: {
      type: Boolean,
      default: false
    },
    // 额外条件数
    otherTotal: {
      type: Number,
      default: 0
    },
    // placeholder
    placeHolder: {
      type: String,
      default: ""
    },
    // 不可用
    disabled: {
      type: Boolean,
      default: false
    },
    // 隐藏按钮
    hideButtons: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 按钮权限
    buttonPowers: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 清空查询条件
    clearCondition: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      // 条件是否折叠
      collapsed: false,
      // 表单
      formSearch: this.$form.createForm(this),
      // 查询关键字
      searchKey: ""
    };
  },
  computed: {
    // 列span
    colSpan() {
      return this.getColSpan();
    },
    // 最后一列span
    colSpanLast() {
      return span => {
        let total = this.otherTotal;
        total += !this.onlyOther ? 1 : 0;
        if (this.collapsed) {
          total = 1;
        }
        let fullTotal = 24 / span;
        let spaceTotal = total % fullTotal;
        return 24 - spaceTotal * span;
      };
    },
    // 列标题span
    colLabelSpan() {
      return type => {
        return this.getColLabelSpan(type);
      };
    },
    // 列容器span
    colWrapperSpan() {
      return type => {
        const span = 24 - this.getColLabelSpan(type);
        return span === 0 ? 24 : span;
      };
    },
    // placeholder显示
    placeHolderDis() {
      return this.placeHolder || "关键字";
    },
    // 是否显示折叠切换按钮
    showTrigger() {
      let total = this.otherTotal;
      total += !this.onlyOther ? 1 : 0;
      return total > 2;
    },
    // 是否隐藏按钮
    hideButton() {
      return key => {
        let checkKey = (keys, checkKey) => {
          let exist = false;
          keys.map(key => {
            if (key === checkKey) {
              exist = true;
            }
          });
          return exist;
        };
        return checkKey(this.hideButtons, key);
      };
    },
    // 按钮是否有权限
    havePower() {
      return key => {
        return this.buttonPowers.findIndex(power => power.code === key) !== -1;
      };
    }
  },
  methods: {
    // 获取列span
    getColSpan() {
      return 24 / this.rowSize;
    },
    // 获取列标题span
    getColLabelSpan(type) {
      switch (type) {
        case "xs":
          return this.otherTotal > 0 ? 24 : 0;
        case "sm":
        case "md":
        case "lg":
          return this.otherTotal > 0 ? 6 : 0;
        case "xl":
          return this.otherTotal > 0 ? 7 : 0;
        case "xxl":
          return this.otherTotal > 0 ? 8 : 0;
      }
    },
    // 查询
    handleSearch() {
      this.$emit("search", this.searchKey);
    },
    // 重置
    handleReset() {
      this.clearCondition && this.clearCondition();
      this.searchKey = "";
      this.$emit("searchReset", this.searchKey);
    },
    // 条件切换折叠
    handleTrigge() {
      this.collapsed = !this.collapsed;
      this.$emit("trigger", this.collapsed);
    }
  }
};
</script>

<style lang="scss" scoped>
.table-search {
  flex-shrink: 0;
  padding-top: 24px;
}
</style>
