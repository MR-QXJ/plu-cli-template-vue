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
    },
    {
      path: "/businessGuide",
      name: "businessGuide",
      component: () => import("./views/guide/Guide.vue")
    },
    {
      path: "/guideDetail",
      name: "guideDetail",
      component: () => import("./views/guide/GuideDetail.vue")
    },
    {
      path: "/businesscConsulting",
      name: "businesscConsulting",
      component: () => import("./views/consulting/BusinesscConsulting.vue")
    },
    {
      path: "/consulting",
      name: "consulting",
      component: () => import("./views/consulting/Consulting.vue")
    },
    {
      path: "/hiddenPicture",
      name: "hiddenPicture",
      component: () => import("./views/hiddenPicture/HiddenPicture.vue")
    },
    {
      // 登录
      path: "/login",
      name: "login",
      component: () => import("./views/Login.vue")
    },
    {
      // 我的
      path: "/mine",
      name: "mine",
      component: () => import("./views/mine/Mine.vue")
    },
    {
      // 修改密码
      path: "/changePwd",
      name: "changePwd",
      component: () => import("./views/mine/ChangePwd.vue")
    },
    {
      // 隐患举报
      path: "/hiddenReport",
      name: "hiddenReport",
      component: () => import("./views/hiddenReport/HiddenReport.vue")
    },
    {
      // 隐患详情
      path: "/reportDetail/:key",
      name: "reportDetail",
      component: () => import("./views/hiddenReport/ReportDetail.vue")
    },
    {
      //消防安全管理
      path: "/fireSafety",
      name: "fireSafety",
      component: () => import("./views/fireSafety/FireSafety.vue")
    },
    {
      //物联告警
      path: "/contentAlarm",
      name: "contentAlarm",
      component: () => import("./views/fireSafety/ContentAlarm.vue")
    },
    {
      //物联告警
      path: "/hiddenDispose",
      name: "hiddenDispose",
      component: () => import("./views/fireSafety/HiddenDispose.vue")
    },
    {
      //物联告警
      path: "/dispose",
      name: "dispose",
      component: () => import("./views/fireSafety/Dispose.vue")
    },
    {
      //单位详情
      path: "/unitInfo",
      name: "unitInfo",
      component: () => import("./views/fireSafety/unitInfo/UnitInfo.vue")
    },
    {
      //从业人员修改新增
      path: "/employeeForm",
      name: "employeeForm",
      component: () => import("./views/fireSafety/unitInfo/EmployeeForm.vue")
    },
    {
      //单位编辑
      path: "/compile",
      name: "compile",
      component: () => import("./views/fireSafety/unitInfo/Compile.vue")
    },
    {
      //风险警告
      path: "/risk",
      name: "risk",
      component: () => import("./views/fireSafety/risk/Risk.vue")
    },
    {
      //视频监控
      path: "/videoPage",
      name: "videoPage",
      component: () => import("./views/fireSafety/videoPage/VideoPage.vue")
    }
  ]
});
