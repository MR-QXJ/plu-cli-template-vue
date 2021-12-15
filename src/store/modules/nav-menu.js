// state
// 是否加载侧边栏导航菜单
const _menu_loading = "";
// 侧边栏导航菜单当前菜单全路径菜单
const _menu_selected_menus = [];

// getters
// 获取是否加载侧边栏导航菜单
const menuLoading = state => {
  return state._menu_loading;
};
// 获取侧边栏导航菜单当前菜单全路径菜单
const menuSelectedMenus = state => {
  return state._menu_selected_menus;
};

// mutations
// 设置是否加载侧边栏导航菜单
const SETMENULOADING = (state, menuLoading) => {
  state._menu_loading = menuLoading;
};
// 设置侧边栏导航菜单当前菜单全路径菜单
const SETMENUSELECTEDMENUS = (state, menuSelectedMenus) => {
  state._menu_selected_menus = menuSelectedMenus;
};

// actions
// 设置是否加载侧边栏导航菜单
const setMenuLoading = ({ commit }, menuLoading) => {
  commit("SETMENULOADING", menuLoading);
};
// 设置侧边栏导航菜单当前菜单全路径菜单
const setMenuSelectedMenus = ({ commit }, menuSelectedMenus) => {
  commit("SETMENUSELECTEDMENUS", menuSelectedMenus);
};

export default {
  namespaced: true,
  state: {
    _menu_loading,
    _menu_selected_menus
  },
  getters: {
    menuLoading,
    menuSelectedMenus
  },
  mutations: {
    SETMENULOADING,
    SETMENUSELECTEDMENUS
  },
  actions: {
    setMenuLoading,
    setMenuSelectedMenus
  }
};
