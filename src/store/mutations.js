// mutations

const SETSYSNAME = (state, sysName) => {
  state._sys.sysName = sysName;
};
const SETNAVMENUKEY = (state, navMenuKey) => {
  state._navMenuKey = navMenuKey;
};

const SETNAVMENUS = (state, navMenus) => {
  state._navMenus = navMenus;
};

export const mutations = {
  SETSYSNAME,
  SETNAVMENUKEY,
  SETNAVMENUS
};
