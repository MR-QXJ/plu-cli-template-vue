import Vue from "vue";
import Vuex from "vuex";
import { mutations } from "./mutations";
import { getters } from "./getters";
import { actions } from "./actions";
import navMenu from "@/store/modules/nav-menu";

Vue.use(Vuex);

// state
// 系统信息
const _sys = {
  // 系统名称
  sysName: "vue项目基础模板-antd-vue"
};

const state = {
  _sys
};

const modules = {
  navMenu
};
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules
});
