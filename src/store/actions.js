// actions

const setSysName = ({ commit }, sysName) => {
  const name = sysName || "";
  commit("SETSYSNAME", name);
};

export const actions = {
  setSysName
};
