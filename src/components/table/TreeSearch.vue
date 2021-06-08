<template>
  <div class="tree-search h100">
    <tree-oper>
      <template #search>
        <a-input-search
          placeholder="搜索名称"
          :title="searchKeyTree"
          v-model="searchKeyTree"
          @search="searchKeyTreeHandle"
        />
      </template>
    </tree-oper>
  </div>
</template>

<script>
import TreeOper from "components/pub/TreeOper";
export default {
  components: {
    TreeOper
  },
  data() {
    return {
      searchKeyTree: ""
    };
  },
  methods: {
    searchKeyTreeHandle() {}
  }
};
</script>

<style lang="scss">
.tree-search {
  background-color: #fff;
  box-shadow: 0px 2px 3px rgba(84, 84, 84, 0.1);
  border-radius: 4px;
}
</style>
