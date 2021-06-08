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
      // 登录
      path: "/login",
      name: "login",
      component: () => import("./views/Login.vue"),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: "/table",
      name: "table",
      component: () => import("./views/table/TableHome.vue"),
      children: [
        {
          // 树
          path: "/treesearch",
          name: "treesearch",
          component: () => import("./views/table/children/Tree.vue"),
          meta: {
            requiresAuth: false
          }
        }
      ],
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
    {
      path: "*",
      redirect: "/notfound"
    }
  ]
});
