import Vue from "vue";
import Vuex from "vuex";
import {
  storageNameUser,
  storageNameNavMenu,
  storageNamePosition
} from "@/utils/global";
Vue.use(Vuex);

// state
// 系统信息
const _sys = {
  // 系统名称
  sysName: "平南掌上消防"
};
// 用户信息
const _user = {
  // token
  token: null,
  // 用户ID
  userId: "",
  // 用户名
  userName: "未知用户",
  // 真实姓名
  realName: "未知姓名",
  // 头像图片
  avatarImg: ""
};
// 公司信息
const _unitInfo = {
  name: "",
  id: ""
};

//当前菜单
const _navMenu = "";

//当前警情Id
const _fireAlarmId = "";
//当前警情信息
const _fireAlarmInfo = {};
//当前聊天群id
const _flockId = "";

const _geoPosition = "";

const state = {
  _sys,
  _user,
  _fireAlarmId,
  _fireAlarmInfo,
  _flockId,
  _navMenu,
  _geoPosition,
  _unitInfo
};

// getter
const sys = state => {
  return state._sys;
};
const user = state => {
  state._user = JSON.parse(
    window.localStorage.getItem(storageNameUser) || "{}"
  );
  return state._user;
};
const navMenu = state => {
  state._navMenu = window.localStorage.getItem(storageNameNavMenu) || "";
  return state._navMenu;
};
const geoPosition = state => {
  state._geoPosition = window.localStorage.getItem(storageNamePosition) || "";
  return state._geoPosition;
};
const getters = {
  sys,
  user,
  navMenu,
  geoPosition
};

// mutations
const SETSYSNAME = (state, sysName) => {
  const name = sysName || "";
  state._sys.sysName = name;
};
const SETUSER = (state, user) => {
  let name = user.userName || "";
  name = name !== "" ? name : "未知用户";
  user.userName = name;
  let rname = user.realName || "";
  rname = rname !== "" ? rname : "未知姓名";
  user.realName = rname;
  state._user = JSON.parse(JSON.stringify(user));
  window.localStorage.setItem(storageNameUser, JSON.stringify(user));
};
const CLEARUSER = state => {
  const user = {
    token: null,
    userId: "",
    userName: "未知用户",
    realName: "未知姓名",
    avatarImg: ""
  };
  state._user = JSON.parse(JSON.stringify(user));
  window.localStorage.setItem(storageNameUser, JSON.stringify(user));
};
const SETGEOPOSITION = (state, geoPosition) => {
  const data = geoPosition || "";
  state._geoPosition = data;
  window.localStorage.setItem(storageNamePosition, data);
};
const mutations = {
  SETSYSNAME,
  SETUSER,
  CLEARUSER,
  SETGEOPOSITION
};

// actions
const setSysName = ({ commit }, sysName) => {
  commit("SETSYSNAME", sysName);
};

const setUser = ({ commit }, user) => {
  commit("SETUSER", user);
};

const clearUser = ({ commit }) => {
  commit("CLEARUSER");
};
const setGeoPosition = ({ commit }, geoPosition) => {
  commit("SETGEOPOSITION", geoPosition);
};
const actions = {
  setSysName,
  setUser,
  clearUser,
  setGeoPosition
};

// modules
const modules = {};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules,
  getters
});
