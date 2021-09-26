<template>
  <div class="w100 h100 con-page">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      title="业务咨询"
      :border="false"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <div class="">
      <Search
        :selectArray="sonsultingType"
        @searchInfo="searchImp"
        placehodler="请输入咨询主题"
      />
      <!-- <div class=" detail-container"> -->
      <div
        class="detail-container"
        :style="`height: ${contentHeight}px;min-height: ${contentHeight}px;`"
      >
        <div class="detail-content">
          <div class="h100">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="load"
              class="w100 h100"
              :style="`max-height:${contentHeight}px;overflow-y: auto;`"
            >
              <van-pull-refresh v-model="refreshing" @refresh="refresh">
                <div
                  class="detail-item"
                  v-for="(item, index) in contentList"
                  :key="index"
                  @click="handleConsultDetail(item.key)"
                >
                  <div class="wrap flex flex-align-center-between ">
                    <span class="item-text">{{ item.consultTypeName }}</span>
                    <span class="item-text text-ellipsis">{{
                      item.consultTheme
                    }}</span>
                    <span>{{ item.consultTime }}</span>
                  </div>
                </div>
                <div
                  class="h100 flex-center"
                  style="font-size:10px;color:#bbb;"
                  v-if="contentList.length < 1"
                >
                  暂无数据
                </div>
              </van-pull-refresh>
            </van-list>
          </div>
        </div>
      </div>

      <div class="w100 consult-btn-content">
        <van-button @click="hadnleTo" square class="w100 custom-btn"
          >我要咨询</van-button
        >
      </div>
    </div>
    <Slide :slide="slide">
      <van-nav-bar
        :style="{ 'padding-top': $root.barH }"
        title="咨询详情"
        :border="false"
        left-arrow
        @click-left="slide = false"
      />
      <div
        class="consult-detail"
        :style="{
          height: `calc(100vh - ${46 * $root.ratePX}px - ${$root.barH})`
        }"
      >
        <Detail
          :detailList="item"
          v-for="(item, index) in consults"
          :key="index"
        ></Detail>
      </div>
    </Slide>
  </div>
</template>
<script>
import Search from "@/components/pub/Search.vue";
import Slide from "@/components/pub/SlidePage.vue";
import Detail from "@/components/pub/Detail.vue";
import {
  getBusinessConsultDetail,
  getBusinessConsultLists,
  getSelectList
} from "@/utils/api";
import {
  removeBackButton,
  addBackButton,
  dataIsNullNumber,
  dataIsNullObj,
  dataIsNullArray,
  dataIsNullStr,
  showToast
} from "@/utils/tool";
export default {
  components: {
    Search,
    Slide,
    Detail
  },
  data() {
    return {
      loading: false,
      finished: false,
      params: {
        pageNo: 1,
        pageSize: 15,
        total: 0
      },
      // 列表数据
      contentList: [],
      // 下拉选项
      sonsultingType: [],
      // 详情数据
      consultDetail: {},
      consultType: "",
      consultTheme: "",
      index: 0,
      // 定时器
      timeout: null,
      triggered: false,
      paddingBottom: 0,
      contentHeight: 667,
      refreshing: false,
      slide: false,
      consults: {}
    };
  },
  methods: {
    // 详情点击事件
    handleConsultDetail(key) {
      let that = this;
      let params = {
        key
      };
      let consoultObj = {
        list: []
      };
      let replyObj = {
        list: []
      };
      let detailArr = [];
      getBusinessConsultDetail(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          const data = dataIsNullObj(res.data);
          consoultObj.list.push({
            title: "咨询主题",
            info: dataIsNullStr(data.consultTheme, "未知")
          });
          consoultObj.list.push({
            title: "咨询时间",
            info: dataIsNullStr(data.consultTime, "未知")
          });
          consoultObj.infoText = data.consultText;
          detailArr.push(consoultObj);

          replyObj.list.push({
            title: "回复时间",
            info: dataIsNullStr(data.revertTime, "未知")
          });
          replyObj.infoText = dataIsNullStr(data.revertText, "无内容");
          detailArr.push(replyObj);
          that.consults = detailArr;
          this.slide = true;
        } else {
          showToast(res.message);
        }
      });
    },
    // 下拉刷新
    refresh() {
      this.params = {
        pageNo: 1,
        pageSize: 15,
        total: 0
      };
      this.finished = false;
      this.initaTableData();
    },
    load() {
      let that = this;
      if (that.params.total > that.contentList.length) {
        that.params.pageNo = that.params.pageNo + 1;
        this.initaTableData();
      }
    },
    // 初始化列表
    initaTableData() {
      let that = this;
      const params = {
        consultType: that.consultType,
        consultTheme: that.consultTheme,
        pageNo: that.params.pageNo,
        pageSize: that.params.pageSize
      };
      for (let i in params) {
        if (!params[i]) {
          delete params[i];
        }
      }
      this.loading = true;
      getBusinessConsultLists(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          const data = dataIsNullArray(res.data);
          if (this.refreshing) {
            this.refreshing = false;
            that.contentList = data;
          } else {
            that.contentList = that.contentList.concat(data);
          }
          this.loading = false;
          that.params.total = res.pageData.sumNum;
          if (that.contentList.length >= res.pageData.sumNum) {
            this.finished = true;
          }
          console.log(that.contentList.length >= res.pageData.sumNum);
          that.paddingBottom = 0;
        }
      });
    },
    // 资讯类别下拉选项
    searchImp(e) {
      const select = this.sonsultingType.filter(ar => {
        return ar.key === e.select;
      })[0];
      let consultType = select ? select.key : null;
      let consultTheme = e.text;
      let pageNo = this.params.pageNo;
      let total = this.params.total;
      this.consultType = consultType;
      this.consultTheme = consultTheme;
      this.params.pageNo = pageNo;
      this.params.total = total;
      this.loadData();
    },
    // 加载列表数据
    loadData() {
      this.contentList = [];
      this.initaTableData();
    },
    // 加载下拉框
    loadSelectList() {
      let that = this;
      const NUM = "0033001";
      const params = {
        pKey: NUM
      };
      getSelectList(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          const data = dataIsNullArray(res.data);
          data.unshift({
            key: "",
            title: "咨询类别"
          });
          that.sonsultingType = data;
        }
      });
    },
    // 跳转到我要咨询
    hadnleTo() {
      this.$router.push("/consulting");
    }
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    const backFn = () => {
      if (this.slide) {
        this.slide = false;
      } else {
        this.$root.backBtnFn();
      }
    };
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(backFn);

    const BUTTON = 59;
    const NAVIGATE = 46;
    const SEARCH = 45;
    const PADDING = 10;
    const MARGIN = 10;
    this.contentHeight =
      document.body.clientHeight -
      BUTTON -
      NAVIGATE -
      SEARCH -
      PADDING -
      MARGIN;

    this.params.pageNo = 1;
    this.params.total = 0;
    this.loadData();
    this.loadSelectList();
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.con-page {
  overflow: hidden;
  .van-nav-bar {
    background: #0e41a6;
    /deep/.van-nav-bar__title {
      color: #fff;
    }
    /deep/.van-icon {
      color: #fff;
    }
  }
  // 覆盖Detail样式，否则每个评论高度全屏
  /deep/ .detail {
    height: auto;
    .detail-contianer {
      height: auto;
    }
  }
  background: #efeff4;
  @include page-none-data;
  .detail-container {
    padding: 5px;
  }
  .detail-content {
    font-size: 12px;
    height: 100%;
    border-radius: 5px;
  }

  .detail-item {
    .wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    padding: 0 10px;
    background: white;
  }
  .detail-item:first-child {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .detail-item div {
    padding: 17.5px;
    border-bottom: 1px solid #ebedf0;
  }
  .detail-item:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .detail-item:last-child div {
    border: none;
  }
  .item-text:first-child {
    color: #2d4993;
  }
  .item-text:nth-child(2) {
    width: 35%;
    color: #868686;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .item-text:last-child {
    color: #b5b5b5;
  }
  /* 咨询按钮 */
  .consult-btn-content {
    position: fixed;
    bottom: 0;
  }
  .custom-btn {
    width: 100% !important;
    height: 59px;
    line-height: 59px;
    font-size: 18px;
    background: #14b9cc;
    color: #b1e8ee;
    padding: 0;
    color: #fff;
  }
}
.consult-detail {
  overflow-y: auto;
  .van-nav-bar {
    background: #0e41a6;
    /deep/.van-nav-bar__title {
      color: #fff;
    }
    /deep/.van-icon {
      color: #fff;
    }
  }
  background: #efeff4;
}
</style>
