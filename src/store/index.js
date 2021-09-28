import Vue from "vue";
import Vuex from "vuex";
import { mutations } from "./mutations";
import { getters } from "./getters";
import { actions } from "./actions";
// import {
//   storageNameUser,
//   storageNameNavMenuPKey,
//   storageNameNavMenuKey,
//   storageNameFireAlarmId,
//   storageNameDigitalUnitId
// } from "@/utils/global";

Vue.use(Vuex);

// state
// 系统信息
const _sys = {
  // 系统名称
  sysName: "vue项目基础模板"
};

const state = {
  _sys,
  // 权限菜单当前key
  _navMenuKey: "",
  // 权限菜单当前父key
  _navMenuPKey: "",
  // 权限菜单
  _navMenus: []
};

export default new Vuex.Store({
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
});
