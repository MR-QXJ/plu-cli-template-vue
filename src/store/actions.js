// actions
const setSysName = ({ commit }, sysName) => {
  commit("SETSYSNAME", sysName);
};
const setNavMenuKey = ({ commit }, navMenuKey) => {
  commit("SETNAVMENUKEY", navMenuKey);
};
const setNavMenus = ({ commit }, navMenus) => {
  commit("SETNAVMENUS", navMenus);
};

export const actions = {
  setSysName,
  setNavMenuKey,
  setNavMenus
};
