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
      component: () => import("./views/Index.vue")
    }
  ]
});
