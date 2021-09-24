// actions
import { storageNameNavMenuKey } from "@/utils/global";

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

export const actions = {
  setSysName,
  setNavMenuKey,
  setNavMenus
};
