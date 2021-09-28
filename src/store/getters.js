// getter
import {
  storageNameUser,
  storageNameNavMenuPKey,
  storageNameNavMenuKey
} from "utils/global";

const sys = state => {
  return state._sys;
};
const user = state => {
  state._user = JSON.parse(
    window.localStorage.getItem(storageNameUser) || "{}"
  );
  return state._user;
};
const navMenuPKey = state => {
  state._navMenuPKey = localStorage.getItem(storageNameNavMenuPKey) || "";
  return state._navMenuPKey;
};

const navMenuKey = state => {
  state._navMenuKey = localStorage.getItem(storageNameNavMenuKey) || "";
  return state._navMenuKey;
};

const navMenus = state => {
  return state._navMenus;
};
export const getters = {
  sys,
  user,
  navMenuPKey,
  navMenuKey,
  navMenus
};
