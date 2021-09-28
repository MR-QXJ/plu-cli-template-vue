import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";

import vant from "utils/use-vant";
Vue.use(vant);

Vue.config.productionTip = false;

new Vue({
  data() {
    return {
      winH: 0, //窗口高(px)
      winW: 0, //窗口宽(px)
    };
  },
  mounted() {
    this.winH =
      document.body.clientHeight || document.documentElement.clientHeight;
    this.winW =
      document.body.clientWidth || document.documentElement.clientWidth;
  },
  store,
  router,
  render: h => h(App)
}).$mount("#app");
