/*
 * 入口js
 */

import "@babel/polyfill";
import Vue from "vue";
import moment from "moment";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import initAntd from "configs/use-antd";
// 全局注册组件
import { storageNameUser } from "constants/global";

// 注册ant-design-vue
Vue.use(initAntd);

Vue.config.productionTip = false;
Vue.prototype.$moment = moment;

// 自定义指令-更改标题
Vue.directive("title", {
  inserted: function(el, binding) {
    document.title = binding.value;
  }
});

router.beforeEach((to, from, next) => {
  //路由带有requiresAuth元数据
  if (to.matched.some(record => record.meta.requiresAuth)) {
    //保存导航菜单key
    if (to.query._navMenuKey) {
      store.dispatch("setNavMenuKey", to.query._navMenuKey);
    }

    const user = JSON.parse(
      window.sessionStorage.getItem(storageNameUser) || "{}"
    );
    //检测token
    const token = user.token || "";
    if (token === "") {
      return next({
        path: "/"
        // query: { redirect: to.fullPath }
      });
    }
  }
  next();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
