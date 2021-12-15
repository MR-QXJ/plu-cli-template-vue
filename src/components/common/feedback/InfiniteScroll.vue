// 滚动加载
<template>
  <section
    ref="infiniteScroll"
    class="h100 w100 infinite-scroll"
    @scroll="handleScroll"
  >
    <section class="w100 loading" v-if="loading">
      <a-spin :spinning="loading" />
    </section>
    <slot name="content"></slot>
    <section class="w100 loading" v-if="loadingMore">
      <a-spin :spinning="loadingMore" />
    </section>
    <section class="w100 no-more-data" v-cloak v-if="noDataMore">
      {{ $t("state.noDataMore") }}
    </section>
    <a
      class="go-top"
      :title="$t('button.backTop')"
      v-show="goTopVisible"
      @click.stop="handleGoTop"
    >
      <a-icon
        :style="{ fontSize: '50px', color: '#d9d9d9' }"
        type="up-circle"
      />
    </a>
  </section>
</template>

<script>
export default {
  props: {
    // 是否加载数据
    loading: {
      type: Boolean,
      default: false
    },
    // 是否加载更多数据
    loadingMore: {
      type: Boolean,
      default: false
    },
    // 加载更多数据
    loadDataMore: {
      type: Function,
      default: null
    },
    // 是否没有更多数据
    noDataMore: {
      type: Boolean,
      default: false
    },
    // 是否显示去顶部阈值
    goTopThreshold: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      // 是否显示去顶部
      goTopVisible: false
    };
  },
  methods: {
    // 滚动
    handleScroll(e) {
      let scrollTop = e.target.scrollTop;
      let clientHeight = e.target.clientHeight;
      let scrollHeight = e.target.scrollHeight;
      if (scrollTop > 0 && scrollTop + clientHeight >= scrollHeight) {
        // 到底部了
        if (this.loadingMore) {
          return;
        }
        if (this.noDataMore) {
          return;
        }
        if (this.loadDataMore) {
          this.loadDataMore();
        }
      }
      if (scrollTop === 0) {
        // 到顶部了
      }
      this.goTopVisible = scrollTop >= this.goTopThreshold;
      scrollTop = null;
      clientHeight = null;
      scrollHeight = null;
      this.$emit("scroll", e.target);
    },
    // 去顶部（外部调用）
    handleGoTop() {
      let infiniteScroll = this.$refs["infiniteScroll"];
      if (!infiniteScroll) {
        infiniteScroll = null;
        return;
      }
      infiniteScroll.scrollTop = 0;
      infiniteScroll = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.infinite-scroll {
  overflow-x: hidden;
  overflow-y: auto;

  .loading,
  .no-more-data {
    @include flex;
    @include flex-primary-axis-center;
    @include flex-secondary-axis-center;
    height: 50px;
  }
  .no-more-data {
    height: 16px;
    font-size: 14px;
    color: $color-font-light;
    text-align: center;
    line-height: 16px;
  }
  .go-top {
    @include flex;
    @include flex-primary-axis-center;
    @include flex-secondary-axis-center;
    display: block;
    right: 30px;
    bottom: 30px;
    position: absolute;
    z-index: 1;
    height: 50px;
    width: 50px;
    background-color: $color-white;
    border-radius: 100%;
  }
}
</style>
