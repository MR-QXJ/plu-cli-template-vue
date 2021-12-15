// 左侧条件树
<template>
  <section class="h100 w100 left-tree">
    <section class="h100 w100 tree-loading" v-if="loading">
      <a-spin :spinning="loading" />
    </section>
    <section v-else>
      <empty-simple-image :desc="emptyDesc" v-if="noData" />
      <a-tree
        ref="tree"
        :tree-data="data"
        :disabled="disabled"
        :load-data="treeNode => loadData(treeNode, loadDataCallBack)"
        :selected-keys="selectedKeys"
        showLine
        @expand="(expandedKeys, e) => expand(expandedKeys, e, expandCallBack)"
        @select="(selectedKeys, e) => select(selectedKeys, e, selectCallBack)"
        v-else
      />
    </section>
  </section>
</template>

<script>
import EmptySimpleImage from "components/common/state/EmptySimpleImage.vue";

export default {
  components: {
    EmptySimpleImage
  },
  props: {
    // 是否加载数据
    loading: {
      type: Boolean,
      default: false
    },
    // 空状态描述
    emptyDesc: {
      type: String,
      default: ""
    },
    // 是否无数据
    noData: {
      type: Boolean,
      default: false
    },
    // 不可用
    disabled: {
      type: Boolean,
      default: false
    },
    // 数据
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 选择节点
    selectedKeys: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 异步加载数据
    loadData: {
      type: Function,
      default: null
    },
    // 异步加载数据回调
    loadDataCallBack: {
      type: Function,
      default: null
    },
    // 展开节点
    expand: {
      type: Function,
      default: null
    },
    // 展开节点回调
    expandCallBack: {
      type: Function,
      default: null
    },
    // 选择节点
    select: {
      type: Function,
      default: null
    },
    // 选择节点回调
    selectCallBack: {
      type: Function,
      default: null
    }
  },
  methods: {
    // 获取树组件对象（外部调用）
    getTreeComponent() {
      return this.$refs["tree"];
    }
  }
};
</script>

<style lang="scss" scoped>
.left-tree {
  position: relative;
  padding: 4px 0 4px 6px;
  overflow: auto;

  .tree-loading {
    @include flex;
    @include flex-primary-axis-center;
    left: 0;
    position: absolute;
    top: 0;
    z-index: 1;
    padding-top: 50px;
    background-color: $color-white;
  }
}
</style>
