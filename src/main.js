/*
 * 入口js
 */

import "@babel/polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 注册ant-design-vue
import initAntd from "utils/use-antd";
Vue.use(initAntd);

// 全局注册组件
import { storageNameUser } from "@/utils/global";
import { outputmoney } from "utils/tools/common";

Vue.config.productionTip = false;

import "moment/locale/zh-cn";

// 自定义指令-更改标题
Vue.directive("title", {
  inserted: function(el, binding) {
    document.title = binding.value;
  }
});
Vue.directive("money", {
  inserted: function(el, binding) {
    el.innerHTML = outputmoney(binding.value);
  },
  update: function(el, binding) {
    el.innerHTML = outputmoney(binding.value);
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (to.query._navMenuKey) {
      store.dispatch("setNavMenuKey", to.query._navMenuKey);
    }

    const user = JSON.parse(
      window.sessionStorage.getItem(storageNameUser) || "{}"
    );

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
