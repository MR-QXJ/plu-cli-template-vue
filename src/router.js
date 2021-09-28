/*
 * 路由
 */

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

//'@/views'为项目存放页面的目录,根据views页面文件夹下的router.js自动引入路由配置
const files = require.context("@/views", true, /router\.js$/);
const routes = files.keys().map(key => {
  //注意require内可以解析代码，但不能放变量
  const page = require("@/views" + key.replace(".", ""));
  return page.default;
});

export default new VueRouter({
  routes: [
    {
      path: "/",
      name: "",
      redirect: "/index"
    },
    {
      path: "/index",
      name: "index",
      component: () => import("./views/Home.vue")
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("./views/Profile.vue")
    },
    ...routes
  ]
});
