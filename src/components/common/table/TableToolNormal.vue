// 表格工具（常规）
<template>
  <section class="w100 table-tool">
    <a-row :gutter="24">
      <a-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="layout === 'compact' ? 24 : 16"
        :xl="layout === 'compact' ? 24 : 16"
        :xxl="16"
        :style="{ lineHeight: '32px' }"
      >
        <section class="left">
          <a-space size="middle">
            <span class="title" v-cloak>{{ title }}</span>
            <a-popover
              placement="rightTop"
              trigger="click"
              v-if="tableColumnsVisibleCache.length > 1"
            >
              <template v-slot:title>
                <section class="h100 w100 col-set-header">
                  <span v-cloak>列展示</span>
                  <a v-cloak @click="handleTableColumnReset">重置</a>
                </section>
              </template>
              <template v-slot:content>
                <a-tree
                  blockNode
                  :tree-data="columns"
                  checkable
                  :draggable="true"
                  :expandedKeys="tableColumnsExpandedKeys"
                  :selectable="false"
                  v-model="tableColumnsVisible"
                  @check="handleTableColumnCheck"
                  @drop="handleTableColumnDrop"
                >
                  <my-icon
                    :style="{ transform: 'scale(0.83333333) rotate(90deg)' }"
                    slot="switcherIcon"
                    type="icon-move"
                  />
                </a-tree>
              </template>
              <a-tooltip placement="top" title="列设置">
                <a-button
                  :disabled="disabled"
                  type="link"
                  v-if="columns.length > 0"
                >
                  <a-icon type="setting" />
                </a-button>
              </a-tooltip>
            </a-popover>
          </a-space>
          <slot name="toolLeftContent"></slot>
        </section>
      </a-col>
      <a-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="layout === 'compact' ? 24 : 8"
        :xl="layout === 'compact' ? 24 : 8"
        :xxl="8"
        :style="{ textAlign: 'right' }"
      >
        <a-space size="middle">
          <slot name="extraButtons" v-if="extraButtonsBefore"></slot>
          <span v-if="!hideButton('add')">
            <a-button
              :disabled="disabled || disabledAddData"
              type="primary"
              v-if="havePower('add') && !noButton('add')"
              @click="handleAdd"
              >新增</a-button
            >
            <a-tooltip placement="top" :title="noButtonTooltip('add')">
              <a-button
                disabled
                type="primary"
                v-if="havePower('add') && noButton('add')"
                >新增</a-button
              >
            </a-tooltip>
            <a-tooltip placement="top" title="无操作权限">
              <a-button disabled type="primary" v-if="!havePower('add')">
                新增
              </a-button>
            </a-tooltip>
          </span>
          <span v-if="!hideButton('import')">
            <a-button
              :disabled="disabled || disabledAddData"
              v-if="havePower('import')"
              @click="handleImport"
              >导入</a-button
            >
            <a-tooltip placement="top" title="无操作权限">
              <a-button disabled v-if="!havePower('import')">
                导入
              </a-button>
            </a-tooltip>
          </span>
          <span v-if="!hideButton('export')">
            <a-button
              :disabled="disabled"
              v-if="havePower('export')"
              @click="handleExport"
              >导出</a-button
            >
            <a-tooltip placement="top" title="无操作权限">
              <a-button disabled v-if="!havePower('export')">导出</a-button>
            </a-tooltip>
          </span>
          <slot name="extraButtons" v-if="!extraButtonsBefore"></slot>
          <span v-if="!hideButton('refresh')">
            <a-tooltip placement="top" title="刷新">
              <a-button
                :disabled="disabled"
                type="link"
                v-if="havePower('refresh')"
                @click="handleRefresh"
              >
                <a-icon type="reload" />
              </a-button>
            </a-tooltip>
            <a-tooltip placement="top" title="无操作权限">
              <a-button disabled type="link" v-if="!havePower('refresh')">
                <a-icon type="reload" />
              </a-button>
            </a-tooltip>
          </span>
        </a-space>
      </a-col>
    </a-row>
  </section>
</template>

<script>
export default {
  props: {
    // 布局类型
    layout: {
      type: String,
      default: ""
    },
    // 标题
    title: {
      type: String,
      default: ""
    },
    // 表格列
    columns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 不可用
    disabled: {
      type: Boolean,
      default: false
    },
    // 新增数据不可用
    disabledAddData: {
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
    // 禁止按钮
    noButtons: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 扩展按钮是否前置
    extraButtonsBefore: {
      type: Boolean,
      default: false
    },
    // 按钮权限
    buttonPowers: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      // 表格显示列
      tableColumnsVisible: [],
      // 表格显示列缓存
      tableColumnsVisibleCache: [],
      // 表格显示列排序序号
      tableColumnsSortNo: [],
      // 表格显示列排序序号缓存
      tableColumnsSortNoCache: [],
      // 表格显示列展开节点
      tableColumnsExpandedKeys: []
    };
  },
  computed: {
    // 是否隐藏按钮
    hideButton() {
      return key => {
        let checkKey = (keys, checkKey) => {
          let exists = keys.filter(key => key === checkKey);
          return exists && exists[0] ? true : false;
        };
        return checkKey(this.hideButtons, key);
      };
    },
    // 是否禁止按钮
    noButton() {
      return key => {
        let checkKey = (keys, checkKey) => {
          let exists = keys.filter(key => key.key === checkKey);
          return exists && exists[0] ? true : false;
        };
        return checkKey(this.noButtons, key);
      };
    },
    // 是否禁止按钮
    noButtonTooltip() {
      return key => {
        let checkKey = (keys, checkKey) => {
          let exists = keys.filter(key => key.key === checkKey);
          return exists && exists[0] ? exists[0].tooltip || "" : "";
        };
        return checkKey(this.noButtons, key);
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
    // 表格列设置列初始化
    initTableColumns() {
      this.columns.map(column => {
        if (column.visible) {
          this.tableColumnsVisible.push(column.key);
        }
        this.tableColumnsSortNo.push({
          key: column.key,
          sortNo: column.sortNo
        });
      });
      this.tableColumnsVisibleCache = [...this.tableColumnsVisible];
      this.tableColumnsSortNoCache = this.tableColumnsSortNo.map(column => ({
        ...column
      }));
    },
    // 表格列设置重置
    handleTableColumnReset() {
      let checkedKeys = [...this.tableColumnsVisibleCache];
      this.handleTableColumnCheck(checkedKeys);
      checkedKeys = null;
      this.tableColumnsSortNo = this.tableColumnsSortNoCache.map(column => ({
        ...column
      }));
      this.tableColumnSort();
    },
    // 表格列设置是否显示勾选
    handleTableColumnCheck(checkedKeys) {
      this.tableColumnsVisible = [...checkedKeys];
      this.$emit("tableColumnCheck", this.tableColumnsVisible);
    },
    // 表格列设置列拖动结束
    handleTableColumnDrop(info) {
      if (!info.dropToGap) {
        return;
      }
      if (!info.dragNodesKeys || info.dragNodesKeys.length === 0) {
        return;
      }
      if (!info.node || !info.node.eventKey) {
        return;
      }
      let dragKey = info.dragNodesKeys[0];
      let dragColumn = this.tableColumnsSortNo.filter(
        column => column.key === dragKey
      );
      let dragNo = dragColumn[0] ? dragColumn[0].sortNo : -1;
      let targetKey = info.node.eventKey;
      let targetColumn = this.tableColumnsSortNo.filter(
        column => column.key === targetKey
      );
      let targetNo = targetColumn[0] ? targetColumn[0].sortNo : -1;
      if (dragNo === -1 || targetNo === -1) {
        return;
      }
      let after = dragNo < targetNo;
      targetNo = after
        ? targetNo < info.dropPosition
          ? targetNo
          : targetNo - 1
        : targetNo > info.dropPosition
        ? targetNo
        : targetNo + 1;
      if (targetNo < 0) {
        return;
      }
      if (dragNo === targetNo) {
        return;
      }
      this.tableColumnsSortNo.map(column => {
        if (after && column.sortNo <= targetNo && column.sortNo >= dragNo) {
          if (column.key === dragKey) {
            column.sortNo = targetNo;
          } else {
            column.sortNo -= 1;
          }
        }
        if (!after && column.sortNo <= dragNo && column.sortNo >= targetNo) {
          if (column.key === dragKey) {
            column.sortNo = targetNo;
          } else {
            column.sortNo += 1;
          }
        }
      });
      dragKey = null;
      dragColumn = null;
      dragNo = null;
      targetKey = null;
      targetColumn = null;
      targetNo = null;
      after = null;
      this.tableColumnSort();
    },
    // 表格列设置拖动排序
    tableColumnSort() {
      this.$emit("tableColumnSort", this.tableColumnsSortNo);
    },
    // 新增
    handleAdd() {
      this.$emit("add");
    },
    // 导入
    handleImport() {
      this.$emit("import");
    },
    // 导出
    handleExport() {
      this.$emit("export");
    },
    // 刷新
    handleRefresh() {
      this.$emit("refresh");
    }
  },
  mounted() {
    this.initTableColumns();
  }
};
</script>

<style lang="scss" scoped>
.table-tool {
  flex-shrink: 0;
  padding-bottom: 20px;

  .left {
    @include flex;
    @include flex-secondary-axis-center;

    .title {
      color: $color-font-medium;
      font-size: 16px;
    }
  }
}
.col-set-header {
  @include flex;
  @include flex-primary-axis-between;
  @include flex-secondary-axis-center;
}
</style>
