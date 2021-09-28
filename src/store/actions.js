// actions
import { storageNameNavMenuKey, storageNameUser } from "@/utils/global";

const setSysName = ({ commit }, sysName) => {
  const name = sysName || "";
  commit("SETSYSNAME", name);
};
const setNavMenuKey = ({ commit }, navMenuKey) => {
  const key = navMenuKey || "";
  commit("SETNAVMENUKEY", key);
  localStorage.setItem(storageNameNavMenuKey, key);
};
const setNavMenus = ({ commit }, navMenus) => {
  const menus = navMenus || [];
  commit("SETNAVMENUS", JSON.parse(JSON.stringify(menus)));
};
const setUser = ({ commit }, user) => {
  user.userName = user.userName || "未知用户";
  user.realName = user.realName || "未知姓名";
  commit("SETUSER", JSON.parse(JSON.stringify(user)));

  window.localStorage.setItem(storageNameUser, JSON.stringify(user));
};
const clearUser = ({ commit }) => {
  const user = {
    token: null,
    userId: "",
    userName: "未知用户",
    realName: "未知姓名",
    avatarImg: ""
  };
  commit("SETUSER", JSON.parse(JSON.stringify(user)));
  window.localStorage.setItem(storageNameUser, JSON.stringify(user));
};

export const actions = {
  setSysName,
  setNavMenuKey,
  setNavMenus,
  setUser,
  clearUser
};
