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
const SETUSER = (state, user) => {
  state._user = user;
};

export const mutations = {
  SETSYSNAME,
  SETNAVMENUKEY,
  SETNAVMENUS,
  SETUSER
};
