<template>
  <div class="w100 h100 tab-content-item pointdata">
    <!-- <van-nav-bar :style="{ 'padding-top': $root.barH }" title="部位列表" left-arrow @click-left="onClickLeft" /> -->
    <div class="w100 h100 pointdata-container">
      <van-list
        v-model="loading"
        :finished="finished"
        loading-text="加载中"
        finished-text="没有更多了"
      >
        <van-cell
          v-for="item in list"
          :key="item.pointId"
          :title="` ${item.pointName}`"
          :label="`地址：${item.address}`"
          @click="toDetail(item)"
        >
          <!-- 使用 right-icon 插槽来自定义右侧图标 -->
          <template #extra>
            <span
              :style="{
                fontSize: '12px',
                color: item.status == '1' ? '#2CD52C' : '#FD2A54'
              }"
            >
              {{
                item.status == "1" || item.status == "2"
                  ? item.value + item.valueUnits
                  : item.value
              }}</span
            >
          </template>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import { getBSBuildPointList } from "@/utils/api";
import {
  removeBackButton,
  addBackButton,
  dataIsNullArray,
  dataIsNullNumber
} from "@/utils/tool";
import { mapGetters } from "vuex";
export default {
  props: {
    buildId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      list: [],
      loading: true,
      finished: false,
      refreshing: false
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);
    this.onLoad();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onLoad() {
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }
      this.loading = true;
      getBSBuildPointList({
        buildId: this.buildId,
        userId: this.user.userId
      }).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullArray(res.data);
          data.map(item => {
            if (!item.pointName) {
              item.pointName = "未知部位";
            }
            if (!item.address) {
              item.address = "未知地址";
            }
          });
          this.list = data;
          this.finished = true;
        }
      });

      //   // 加载状态结束
      this.loading = false;
    },
    toDetail(item) {
      this.$router.push({ path: "/pointdetail", query: { item } });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/common.scss";
.pointdata {
  background: #f1f1f1;
}
.pointdata-container {
  position: relative;
  bottom: 0;
  // height: calc(100% - 1.23rem);
  overflow-y: auto;
}
</style>
