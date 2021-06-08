<template>
  <div class="tree h100">
    <div class="left h100">
      <TreeSearch />
    </div>
  </div>
</template>

<script>
import TreeSearch from "components/table/TreeSearch.vue";
export default {
  components: { TreeSearch }
};
</script>

<style lang="scss">
.tree {
  padding: 70px 0 30px;
}
.left {
  width: 230px;
}
</style>
