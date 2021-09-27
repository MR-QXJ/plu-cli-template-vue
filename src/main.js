/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
// import echarts from "echarts";

// Vue.prototype.$echarts = echarts;

// 引入全部样式
import "vant/lib/index.less";

import {
  Button,
  Field,
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  Picker,
  Popup,
  Pagination,
  Icon,
  Toast,
  Loading,
  Swipe,
  SwipeItem,
  Lazyload,
  RadioGroup,
  Radio,
  PullRefresh,
  Overlay,
  Tabbar,
  TabbarItem,
  NavBar,
  List,
  Tab,
  Tabs,
  Col,
  Row,
  Badge,
  DatetimePicker,
  Popover,
  Collapse,
  CollapseItem,
  Search,
  DropdownMenu,
  DropdownItem,
  Progress,
  Uploader,
  Sticky,
  Dialog,
  Image as VanImage
} from "vant";

Vue.use(Cell);
Vue.use(Progress);
Vue.use(Dialog);
Vue.use(Sticky);
Vue.use(Uploader);
Vue.use(CellGroup);
Vue.use(Button);
Vue.use(Field);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Picker);
Vue.use(Popup);
Vue.use(Pagination);
Vue.use(Icon);
Vue.use(Toast);
Vue.use(Loading);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Lazyload);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(PullRefresh);
Vue.use(Overlay);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(NavBar);
Vue.use(List);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Col);
Vue.use(Row);
Vue.use(DatetimePicker);
Vue.use(Badge);
Vue.use(Popover);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Search);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(VanImage);
Vue.config.productionTip = false;

import { mapGetters, mapActions } from "vuex";
import { showToast, storageClear, quitApp, storageGet } from "@/utils/tool";

new Vue({
  data() {
    return {
      routerDelay: 300,
      backBtnFn: null, //物理返回按钮
      taskStorage: {},
      // taskStorage: !localStorage.getItem("taskStorage")
      //   ? {}
      //   : JSON.parse(localStorage.getItem("taskStorage")),
      // 是否可回退
      canBack: false,
      // 回退次数
      back: 0,
      // 回退延时器
      backT: null,

      //暂存当前socket消息
      tempSocketMsg: [],
      //socket对象
      socket: null,
      //心跳对象
      heartCheck: null,
      //socket是否连接成功
      isConnected: false,
      //避免重复连接
      lockReconnect: false,
      isNewMsg: false,
      winH: 0,
      winW: 0,
      navH: 0, //导航栏高度
      barH: 0 //状态栏高度
    };
  },
  computed: {
    ...mapGetters(["flockId", "user"]),
    contentHeight() {
      return this.winH - this.navH;
    },
    ratePX() {
      return this.winW / 375;
    }
  },
  mounted() {
    document.addEventListener(
      "plusready",
      () => {
        //状态栏高度
        this.barH = plus.navigator.getStatusbarHeight() + "px" || 0;
      },
      false
    );
    const whiteList = ["/index", "/"];
    const path = this.$route.fullPath;
    const inWhite = whiteList.includes(path);
    let loginInfo = storageGet("loginInfo");
    if (loginInfo) {
      this.setLoginState(JSON.parse(loginInfo)); //刷新之后继续保留用户信息数据
    } else if (!inWhite) {
      this.$router.push("/login");
      storageClear();
      window.localStorage.clear();
      window.sessionStorage.clear();
      // localStorage.clear();
    }
    this.taskStorage = !storageGet("taskStorage")
      ? {}
      : JSON.parse(storageGet("taskStorage"));
    this.winH =
      document.body.clientHeight || document.documentElement.clientHeight;
    this.winW =
      document.body.clientWidth || document.documentElement.clientWidth;
  },
  methods: {
    ...mapActions(["setFlockId"]),
    /*
     * 回退页面
     * @param t this
     */
    goBack() {
      this.$router.go(-1);
    },
    backPage: function(t) {
      const isReLogin = t.$route.query ? t.$route.query.isReLogin : undefined;
      t.$router.history.go(isReLogin ? -2 : -1);
    },
    // app首页回退
    backAppHandle: function() {
      if (this.back === 1 && !this.canBack) {
        return;
      }
      this.back += 1;
      switch (this.back) {
        case 1:
          this.canBack = true;
          // 停止回退延时器
          this.stopBackT();
          this.backT = setTimeout(() => {
            // 清空app首页回退数据
            this.clearBackAppData();
          }, 2000);
          showToast("再按一次退出");
          break;
        case 2:
          // 退出app
          // localStorage.clear();
          storageClear();
          window.localStorage.clear();
          window.sessionStorage.clear();
          quitApp();
          break;
      }
    },
    // 停止回退延时器
    stopBackT: function() {
      if (this.backT) {
        clearTimeout(this.backT);
        this.backT = null;
      }
    },
    // 清空app首页回退数据
    clearBackAppData: function() {
      this.canBack = false;
      this.back = 0;
    },
    // 停止app首页回退
    stopBackApp: function() {
      // 停止回退延时器
      this.stopBackT();
      // 清空app首页回退数据
      this.clearBackAppData();
    }
  },
  store,
  router,
  // eslint-disable-next-line no-undef
  // echarts,
  render: h => h(App)
}).$mount("#app");
