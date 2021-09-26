<template>
  <!--pages/businessGuide/index.wxml-->
  <!-- <text>这是业务指南</text> -->
  <div class="w100 h100 guide-container">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      title="业务指南"
      :border="false"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div class="business-container">
      <!-- <tab-bars
        tabBars="{{tabBars}}"
        style="border-bottom: 2px dash #d9d9d9;"
        bind:change="changNav"
      ></tab-bars> -->
      <van-tabs v-model="active" @click="tabClick">
        <van-tab title="办事指南" default></van-tab>
        <van-tab title="表格下载" default></van-tab>
      </van-tabs>
      <!-- 办事指南  -->
      <div v-if="active === 0" class="w100 h100 list-wrap">
        <div class="w100 cell-item">
          <van-list
            v-model="guideLoading"
            :finished="guideFinished"
            finished-text="没有更多了"
            @load="guideOnLoad"
          >
            <van-cell
              v-for="(item, index) in tableData"
              :key="index"
              :title="item.guideTitle"
              @click="
                $router.push({
                  path: '/guideDetail',
                  query: {
                    key: item.key
                  }
                })
              "
            >
              <van-icon
                style="display: flex;align-items: center;"
                slot="right-icon"
                name="arrow"
              />
            </van-cell>
          </van-list>
        </div>
      </div>
      <!-- 表格下载 -->
      <div v-if="active === 1" class="w100 h100 list-wrap">
        <div class="w100 cell-item">
          <van-list
            v-model="filesLoading"
            :finished="filesFinished"
            finished-text="没有更多了"
            @load="fileListLoad"
          >
            <van-cell
              v-for="(item, index) in files"
              :key="index"
              :title="item.tableName"
            >
              <img
                v-if="item.fileUrl"
                slot="right-icon"
                class="download-icon"
                src="../../assets/img/other/download.svg"
                @click="downloadFileEvent(item)"
              />
            </van-cell>
          </van-list>
        </div>
      </div>
      <!-- <div
      class="message w100"
      catch:tap="showMore"
      data-id="{{currentTab}}"
    >
      {{loadMessage}}
    </div> -->
    </div>
    <!-- <van-toast id="van-toast" /> -->
  </div>
</template>
<script>
import {
  removeBackButton,
  addBackButton,
  dataIsNullNumber,
  dataIsNullArray,
  showToast,
  downloadFile
} from "@/utils/tool";
import { getBusinessGuide, getGuideTable, getDownloadFile } from "@/utils/api";
export default {
  data() {
    return {
      active: 0,
      // 选中tab下标
      currentTab: 0,
      index: 0,
      content: {
        pageNo: 1,
        pageSize: 15,
        total: 0
      },
      filesContent: {
        pageNo: 1,
        pageSize: 15,
        total: 0
      },
      tableData: [],
      files: [],
      // 提示
      loadMessage: "",
      cachePath: "",
      triggered: false,
      timeout: null,

      //下拉刷新兼容样式
      paddingBottom: 0,
      guideLoading: false,
      guideFinished: false,
      filesLoading: false,
      filesFinished: false
    };
  },
  methods: {
    tabClick() {
      console.log(this.active);
    },
    handleGuideDetail(item) {
      console.log(item);
    },
    guideOnLoad() {
      let that = this;
      let params = {
        pageNo: that.content.pageNo,
        pageSize: that.content.pageSize
      };
      this.guideLoading = true;
      getBusinessGuide(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          const data = dataIsNullArray(res.data);
          that.tableData = that.tableData.concat(data);
          that.content.total = res.pageData.sumNum;
          that.content.pageNo++;
          if (that.tableData.length >= res.pageData.sumNum) {
            this.guideFinished = true;
          }
        } else {
          showToast(res.message);
        }

        this.guideLoading = false;
      });
    },
    fileListLoad() {
      let that = this;
      let params = {
        pageNo: that.content.pageNo,
        pageSize: that.content.pageSize
      };
      this.filesLoading = true;
      getGuideTable(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          const data = dataIsNullArray(res.data);
          that.files = that.files.concat(data);
          that.filesContent.total = res.pageData.sumNum;
          that.filesContent.pageNo++;
          if (that.files.length >= res.pageData.sumNum) {
            this.filesFinished = true;
          }
        } else {
          showToast(res.message);
        }
        this.filesLoading = false;
      });
    },
    downloadFileEvent(item) {
      // let a = document.createElement("a");
      let url = getDownloadFile({ fileUrl: item.fileUrl });
      // a.setAttribute("download", true);
      // a.href = url;
      // console.log(a);
      // a.click();
      downloadFile(url, item.fileName);
    }
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.guide-container {
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
  background: #efeff4;
  @include page-none-data;
}
/deep/.van-tabs__nav {
  border-radius: 3px 3px 0 0;
  border-bottom: 1px solid #d9d9d9;
  .van-tabs__line {
    display: none;
  }
}
/deep/.van-tab {
  color: rgb(153, 153, 153);
  &.van-tab--active {
    color: rgb(30, 80, 181);
  }
}
/deep/.business-container {
  padding: 10px;
  position: relative;
  .van-tabs__nav--line {
    padding-bottom: 0;
  }
}
.list-wrap {
  height: calc(100vh - 120px);
  border-top: 1px solid #d9d9d944;
  overflow-y: auto;
}
.cell-content {
  top: 50px;
  overflow: hidden;
}
.cell-item {
}
.table-cell {
  background: white;
}
.table-cell:last-child {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
/* 表格下载 */
.download-list-item {
  padding: 12px 15px;
}
.download-icon {
  width: 20px;
  height: 20px;
}
</style>
