// mutations
import { storageNameNavMenuKey } from "@/utils/global";

const SETSYSNAME = (state, sysName) => {
  const name = sysName || "";
  state._sys.sysName = name;
};
const SETNAVMENUKEY = (state, navMenuKey) => {
  const key = navMenuKey || "";
  state._navMenuKey = key;
  localStorage.setItem(storageNameNavMenuKey, key);
};

const SETNAVMENUS = (state, navMenus) => {
  const menus = navMenus || [];
  state._navMenus = JSON.parse(JSON.stringify(menus));
};

export const mutations = {
  SETSYSNAME,
  SETNAVMENUKEY,
  SETNAVMENUS
};
