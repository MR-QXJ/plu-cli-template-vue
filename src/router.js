/*
 * 路由
 */
import Home from "@/views/Home";

import Vue from "vue";
import VueRouter from "vue-router";

const originalPush = VueRouter.prototype.push;
if (originalPush.catch) {
  VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
      return originalPush.call(this, location, onResolve, onReject);
    return originalPush.call(this, location).catch(err => err);
  };
}
Vue.use(VueRouter);

//'@/views'为项目存放页面的目录,根据views内页面对应的router.js自动引入路由配置
const files = require.context("@/views", true, /router\.js$/);
const routes = files.keys().map(key => {
  //注意require内可以解析代码，但不能放变量
  const page = require("@/views" + key.replace(".", ""));
  return page.default;
});

export default new VueRouter({
  routes: [
    {
      // 引导页
      path: "/",
      name: "home",
      component: Home,
      meta: {
        requiresAuth: false
      }
    },
    {
      // 404
      path: "/notfound",
      name: "notfound",
      component: () => import("./views/NotFound.vue"),
      meta: {
        requiresAuth: false
      }
    },
    ...routes,
    {
      path: "*",
      redirect: "/notfound"
    }
  ]
});
