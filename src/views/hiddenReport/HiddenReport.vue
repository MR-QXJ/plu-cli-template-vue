<template>
  <div class="container w100 h100">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      :border="false"
      title="隐患举报"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div
      class="report-list"
      :style="{
        'min-height': `${$root.contentHeight}px`,
        height: `${$root.contentHeight}px`
      }"
    >
      <div class="report-content">
        <!-- :style="{ width: '100%', height: `${contentHeight - barHeight}px` }" -->
        <van-list
          :finished="noMore"
          finished-text="没有更多啦"
          v-model="loading"
          offset="200"
          @load="showMore"
          :style="{
            height: `${$root.contentHeight - 20 * $root.ratePX}px`,
            'overflow-y': 'auto'
          }"
        >
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <div>
              <div class="h100 scroll-content">
                <div
                  class="report-row"
                  v-for="(item, index) in tableList"
                  :key="index"
                >
                  <div
                    class="flex-align-center-between"
                    @click="handleDetail(item.key)"
                  >
                    <div class="list-text col6">
                      {{ item.dataGenerationDate }}
                    </div>
                    <div class="list-text text-ellipsis col10">
                      {{ item.typeName }}
                    </div>
                    <div :class="['list-text', 'col3', stateList[item.state]]">
                      {{ item.stateName }}
                    </div>
                    <div class="col5">
                      <van-image
                        width="100%"
                        height="100%"
                        fit="contain"
                        :src="
                          item.appletHiddenImgList[0] &&
                            item.appletHiddenImgList[0].url
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-pull-refresh>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import {
  removeBackButton,
  addBackButton,
  dataIsNullNumber,
  dataIsNullArray,
  dataIsNullStr,
  clearArray
} from "utils/tool";
import { getHiddenDangertLists, getImage } from "utils/api";
export default {
  data() {
    return {
      tableList: [],
      index: 0,
      params: {
        pageNo: 1,
        pageSize: 15,
        total: 0
      },
      // 处置状态字体样式
      stateList: {
        "0031001001": "wait",
        "0031001002": "already"
      },
      refreshing: false,
      loading: false,
      timeout: null,
      noMore: false
    };
  },
  methods: {
    handleDetail(key) {
      this.$router.push(`/reportDetail/${key}`);
    },
    // 下拉刷新
    onRefresh() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.$set(this.params, "pageNo", 1);
        this.noMore = false;
        this.refreshing = false;
        this.loadData();
      }, 500);
    },
    // 加载更多
    showMore() {
      if (this.params.total > this.tableList.length) {
        this.$set(this.params, "pageNo", ++this.params.pageNo);
        this.initData();
      }
    },
    loadData() {
      clearArray(this.tableList);
      this.initData();
    },
    initData() {
      const params = {
        pageNo: this.params.pageNo,
        pageSize: this.params.pageSize
      };
      let list = [];
      let imgList = [];
      getHiddenDangertLists(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          const data = dataIsNullArray(res.data);
          data.map(item => {
            let appletHiddenImgList = dataIsNullArray(item.appletHiddenImgList);
            if (appletHiddenImgList.length === 0) {
              imgList = [];
            } else {
              imgList = [
                {
                  url: getImage(dataIsNullStr(appletHiddenImgList[0].imgUrl))
                }
              ];
            }
            list.push({
              key: dataIsNullStr(item.key),
              dataGenerationDate: dataIsNullStr(
                item.dataGenerationDate,
                "未知"
              ),
              typeName: dataIsNullStr(item.typeName),
              stateName: dataIsNullStr(item.stateName),
              appletHiddenImgList: dataIsNullArray(imgList),
              state: dataIsNullStr(item.state)
            });
          });
          this.tableList.push(...list);
          this.$set(this.params, "total", res.pageData.sumNum);
          this.noMore = this.params.total <= this.tableList.length;
        } else if (code === 3) {
          this.$router.push("/index");
        }
        this.loading = false;
      });
    }
  },
  created() {
    this.loadData();
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);
    //计算顶部导航高度,以自动计算出内容高度contentHeight
    this.$root.navH = document.querySelector(".van-nav-bar").offsetHeight;
  }
};
</script>

<style lang="scss" scoped>
.container {
  overflow: hidden;
  /deep/ .van-image__img {
    width: 100% !important;
    height: 54px;
  }
  .van-nav-bar {
    background: #0e41a6;
  }
}
.report-list {
  padding: 10px;
}
.report-content {
  background: #efeff4;

  font-size: 12px;
  color: #666;
}
.scroll-content {
  background-color: #fff;
  padding: 0 10px;
  border-radius: 5px;
}
.space {
  padding-bottom: 11px;
  margin-top: 10px;
}
.report-row {
  padding: 18px 0;
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }
}
.list-image {
  width: 28px;
  height: 28px;
}
.col-class {
  font-size: 12px;
}
.col6 {
  width: calc(100% / 4);
}
.col10 {
  width: calc(100% / 2.4);
}
.col3 {
  width: calc(100% / 7);
}
.col5 {
  width: calc(100% / 6);
}
.wait {
  color: #ee3d43;
}
.already {
  color: #252e47;
}
.detachment {
  height: calc(100% - 50px);
}
</style>
