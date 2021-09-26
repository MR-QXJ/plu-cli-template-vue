<template>
  <!--index.wxml-->
  <div class="w100 h100 container index-page">
    <!-- <nav-bar title="掌上消防" icon=""></nav-bar> -->
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      title="掌上消防"
      :border="false"
    />
    <div class="page-container">
      <!-- 头部menu -->
      <div class="page-top"></div>
      <div class="w100 menu-container">
        <div class="h100 menu-tram">
          <div class="h100 menu-box" :style="`top:${barHeight}px`">
            <div
              @click="toPage(item)"
              v-for="(item, index) in menuList"
              :key="index"
              class="menu-content"
            >
              <img class="menu-image" :src="item.imag" />
              <div>{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 消防咨询list -->
      <div class="w100 consulti-container">
        <div class="h100 consulti-tram">
          <div class="h100 fire-consulting">
            <div class="h100 fire-consulting-title">
              <img
                class="consulting-title-icon"
                src="../assets/img/index/title.png"
              />
              <span>消防资讯</span>
            </div>
            <div class="w100 h100 scroll-wrap">
              <van-pull-refresh v-model="refreshing" @refresh="getData">
                <div class="h100 scroll-content">
                  <div
                    class="fire-consulting-item"
                    v-for="(item, index) in counuseing"
                    :key="index"
                    @click="toDetail(item)"
                  >
                    <div class="w100" style="border-top: 1px solid #ebedf0">
                      <span class="consulting-item-text text-ellipsis">{{
                        item.informationTitle
                      }}</span>
                      <span class="consulting-item-text date-time">{{
                        item.updateTime
                      }}</span>
                    </div>
                  </div>
                  <div class="h100 none-data" v-if="counuseing.length < 1">
                    暂无数据
                  </div>
                </div>
              </van-pull-refresh>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 一键119弹窗 -->
    <van-dialog
      use-slot
      show-cancel-button
      custom-style="width: 30%"
      title="是否确认拨打火警热线"
      v-model="show"
      confirm-button-text="拨打"
      cancel-button-text="取消"
      @cancel="cancelDialog"
      @confirm="confirmDialog"
      confirm-button-color="#FA1B1B"
      cancel-button-color="#24DA11"
    >
      <div class="fire-online-content">119</div>
    </van-dialog>
    <!-- 底部tabbar -->
    <bottom-bar />
    <Slide :slide="slide">
      <div class="information-detail">
        <van-nav-bar
          :style="{ 'padding-top': $root.barH }"
          title="资讯详情"
          :border="false"
          left-arrow
          @click-left="slide = false"
        />
        <Detail :detailList="informations" :hasCustom="true">
          <div slot="custom">
            <div class="rich-text" v-html="richText"></div>
          </div>
        </Detail>
      </div>
    </Slide>
    <div class="page-loading" v-if="pageLoading">
      <van-loading type="spinner" size="30px" />
    </div>
  </div>
</template>
<script>
import {
  URL,
  getSearchMenu,
  getSearchMenuNoToken,
  getIndexInfo,
  insetOneKeyHelp,
  getUserLog,
  getIndexInfoDetail
} from "@/utils/api";
import BottomBar from "@/components/pub/BottomBar.vue";
import Slide from "@/components/pub/SlidePage.vue";
import Detail from "@/components/pub/Detail.vue";
import { mapGetters, mapActions } from "vuex";
import {
  removeBackButton,
  addBackButton,
  dataIsNullNumber,
  dataIsNullArray,
  showToast,
  arouseCall,
  getDeviceInfo,
  dataIsNullObj
} from "@/utils/tool";
export default {
  components: {
    "bottom-bar": BottomBar,
    Slide,
    Detail
  },
  data() {
    return {
      index: 0,
      menuList: [],
      infoParmas: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      // 消防咨询列表
      counuseing: [],
      // 导航栏高
      barHeight: 0,
      contentHeight: 0,
      // 消防咨询详情
      fireInfoDetail: {},
      hotlineVisiable: false,
      // 拨打热线
      hotlineList: [
        {
          name: "拨打",
          color: "#5ee450"
        },
        {
          name: "取消",
          color: "#ff6565"
        }
      ],
      openId: "",
      show: false,
      options: {
        // confirmButtonText: "拨打"
      },
      // tabbar
      active: 0,
      icon: {
        index: "../assets/img/index/index.png",
        indexActive: "../assets/img/index/index2.png",
        user: "../assets/img/index/my1.png",
        userActive: "../assets/img/index/my2.png"
      },
      timeout: null,
      triggered: false,
      refreshing: false,
      slide: false,
      informations: {},
      richText: `<div class="h100 none-data">暂无数据</div>`,
      pageLoading: false
    };
  },
  computed: {
    ...mapGetters(["user"])
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

    this.initData();
    this.getData();
    this.userLog();
  },
  methods: {
    ...mapActions(["clearUser"]),
    toPage({ url, isPermission }) {
      if (url == "oneKeyPolice") {
        this.show = true;
        return;
      }
      this.pageLoading = true;
      const isFireSafety = url.indexOf("/fireSafety") > -1;
      const isHiddenReport = url.indexOf("/hiddenReport") > -1;
      if (isFireSafety || isHiddenReport) {
        let token = this.user.token;
        if (!token) {
          this.pageLoading = false;
          this.$router.push(`/login?into=${isFireSafety ? "5" : "6"}`);
        } else {
          if (isPermission === 0) {
            this.pageLoading = false;
            this.$toast.fail("没有该模块权限");
          } else {
            this.pageLoading = false;
            this.$router.push(url);
          }
        }
        return;
      }
      this.pageLoading = false;
      this.$router.push(url);
    },
    // 加载消防资讯
    getData() {
      this.pageLoading = true;
      let that = this;
      const params = {
        pageNo: that.infoParmas.pageNo,
        pageSize: that.infoParmas.pageSize
      };
      getIndexInfo(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          const data = dataIsNullArray(res.data);
          that.counuseing = data; //that.counuseing.concat(data);
          that.infoParmas.total = res.pageData.sumNum;
          this.refreshing = false;
          this.pageLoading = false;
        }
      });
    },
    // 初始化首页数据
    initData() {
      this.pageLoading = true;
      let that = this;
      const menu = () => {
        return new Promise(resolve => {
          const params = {
            pKey: 1487
          };
          if (that.user.userId) {
            getSearchMenu(params).then(res => {
              resolve(res);
            });
          } else {
            getSearchMenuNoToken(params).then(res => {
              resolve(res);
            });
          }
          this.pageLoading = false;
        });
      };
      let list = [];
      // util.loading("加载中...");
      menu()
        .then(res => {
          let code = dataIsNullNumber(res.code);
          if (code === 2) {
            this.clearUser();
            this.initData();
            return;
          }
          if (code === 0) {
            const data = dataIsNullArray(res.data);
            const item = data[0].children;
            list.push({
              key: item[0].key,
              name: item[0].title,
              isPermission: item[0].isPermission,
              menuId: 1,
              url: "/businessGuide",
              imag: require("../assets/img/index/business_guide.png")
            });
            list.push({
              key: item[1].key,
              name: item[1].title,
              isPermission: item[1].isPermission,
              menuId: 2,
              url: "/businesscConsulting",
              imag: require("../assets/img/index/business_consult.png")
            });
            list.push({
              key: item[2].key,
              name: item[2].title,
              isPermission: item[2].isPermission,
              menuId: 3,
              url: "oneKeyPolice",
              imag: require("../assets/img/index/119.png")
            });
            list.push({
              key: item[3].key,
              name: item[3].title,

              isPermission: item[3].isPermission,
              menuId: 4,
              url: "/hiddenPicture",
              imag: require("../assets/img/index/hidden_pic.png")
            });
            list.push({
              key: item[5].key,
              name: item[5].title,
              isPermission: item[5].isPermission,
              menuId: 6,
              url: "/fireSafety?icon=back",
              imag: require("../assets/img/index/fire_safe.png")
            });
            list.push({
              key: item[4].key,
              name: item[4].title,
              isPermission: item[4].isPermission,
              menuId: 5,
              url: "/hiddenReport",
              imag: require("../assets/img/index/hidden_report.png")
            });
            that.menuList = list;
            that.infoParmas.pageNo = 1;
          } else {
            showToast(res.message);
          }
        })
        .then(() => {
          // this.loadInfoData();
        });
    },
    // 关闭一键拨号dialog
    cancelDialog() {
      this.show = false;
    },
    // 拨打紧急电话
    confirmDialog() {
      const date = (() => {
        const DATA = new Date();
        const Y = DATA.getFullYear();
        const M = DATA.getMonth() + 1;
        const D = DATA.getDate();
        const h = DATA.getHours();
        const m = DATA.getMinutes();
        const s = DATA.getSeconds();
        const ten = n => {
          return n < 10 ? `0${n}` : n;
        };
        return `${Y}-${ten(M)}-${ten(D)} ${ten(h)}:${ten(m)}:${ten(s)}`;
      })();

      // const openId = wx.getStorageSync("openid")
      const params = {
        alarmTime: date,
        openId: "openId"
      };
      insetOneKeyHelp(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          arouseCall(119);
          this.show = false;
        } else {
          showToast(res.message);
        }
      });
    },

    // 消防咨询详情
    toDetail: function({ key }) {
      this.pageLoading = true;
      let params = {
        key
      };
      let obj = {
        list: []
      };
      getIndexInfoDetail(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          const data = dataIsNullObj(res.data);
          obj.list.push({
            title: "资讯主题",
            info: data.informationTitle
          });
          obj.list.push({
            title: "发布时间",
            info: data.updateTime
          });
          const rich = data.informationText.replace(
            /src="\/zhxfgxpnapi/,
            `src="${URL}`
          );
          this.richText = rich;
          this.informations = obj;
          this.slide = true;
          this.pageLoading = false;
        }
      });
    },
    // 用户登录日志
    userLog() {
      getDeviceInfo(
        e => {
          getUserLog({ openId: e.uuid }).then(() => {});
        },
        err => {
          showToast(err);
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.index-page {
  .van-nav-bar {
    background: #0e41a6;
    /deep/.van-nav-bar__title {
      color: #fff;
    }
  }
  @include page-none-data;
}

.page-container {
  position: relative;
  height: calc(100% - 66px);
  overflow: hidden;
}

.page-top {
  height: 129px;
  background: #0e41a6;
  position: absolute;
  width: 100%;
  z-index: 0;
}

.menu-container {
  height: 187px;
  z-index: 1;
  position: relative;
  // position: absolute;
  // top: 0;
  // left: 50%;
  // transform: translate(-50%, 0);
}

.menu-tram {
  padding: 0 10px;
}

.menu-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  background: #fff;
  border-radius: 5px;
  @include flex-primary-axis-between;
}

.menu-content {
  width: 30%;
  text-align: center;
  font-size: 12px;
}

.menu-image {
  width: 40px;
  height: 40px;
}

/* 消防资讯 */
.consulti-container {
  position: relative;
  height: calc(100% - 250px);
  overflow-y: auto;
  margin-top: 10px;
  border-radius: 5px;
}

.consulti-tram {
  padding: 0 10px;
  overflow-y: hidden;
}

.fire-consulting {
  border-radius: 5px;
}

.fire-consulting-title {
  background: white;
  padding-left: 10px;
  color: #1e50b5;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.consulting-title-icon {
  width: 2.5px;
  height: 13px;
  margin-right: 7.5px;
}

.fire-consulting-item {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  background: white;
  & > div {
    display: flex;
    @include flex-primary-axis-between;
  }
}

.fire-consulting-item:last-child {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.consulting-item-text {
  font-size: 12px;
  color: #666;
}

/deep/.fire-dialog {
  width: 30%;
}

.date-time {
  color: #a6a6a6;
}

.fire-online-content {
  color: #ff7b57;
  font-size: 54px;
  font-weight: 900;
  height: 100px;
  text-align: center;
  line-height: 100px;
}
.scroll-wrap {
  overflow-y: auto;
  &::-webkit-scrollbar-track-piece {
    background: #fff;
  }
  // 减去导航，瓷片区，顶部外边距，底部边距，菜单栏
  height: calc(100vh - 363px);
}
.scroll-content {
  /* background: white; */
  /* padding: 0 20px; */
}

/* 底部导航栏内联样式修改 */
.van-tabbar-item__icon {
  margin-bottom: 0 !important;
}
.page-loading {
  z-index: 1000;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;
  background: #fff4;
}
.information-detail {
  overflow-y: hidden;
  height: 100%;
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
