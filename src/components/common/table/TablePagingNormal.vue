// 表格分页（常规）
<template>
  <footer class="w100 table-paging" v-show="recordTotal > 0">
    <a-pagination
      :current="pageNo"
      :disabled="disabled"
      :hide-on-single-page="false"
      :page-size="pageSize"
      :show-less-items="recordTotal > 0"
      :show-quick-jumper="recordTotal > 0"
      :show-size-changer="recordTotal > 0"
      :show-total="total => `共 ${total} 条`"
      :total="recordTotal"
      @change="handleChange"
      @showSizeChange="handleSizeChange"
    />
  </footer>
</template>

<script>
export default {
  props: {
    // 当前页码
    pageNo: {
      type: Number,
      default: 1
    },
    // 每页显示记录数
    pageSize: {
      type: Number,
      default: 20
    },
    // 总记录数
    recordTotal: {
      type: Number,
      default: 0
    },
    // 不可用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 页码改变
    handleChange(page, pageSize) {
      this.$emit("change", {
        pageNo: page,
        pageSize: pageSize
      });
    },
    // 每页显示记录数改变
    handleSizeChange(current, pageSize) {
      this.$emit("showSizeChange", {
        current: current,
        pageSize: pageSize
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.table-paging {
  @include flex;
  flex-shrink: 0;
  padding-bottom: 15px;
}
</style>
