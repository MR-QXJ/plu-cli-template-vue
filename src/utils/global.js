/*
 * 全局变量类
 */
// 用户localStorage变量名
export const storageNameUser = "user_pingnanapp";
export const storageNameFireAlarmId = "firealarmid_pingnanapp";
export const storageNameFlockId = "flockid_pingnanapp";
export const storageNameNavMenu = "menu_pingnanapp";
export const storageNameFireAlarmInfo = "firealarminfo_pingnanapp";
export const storageNamePosition = "geoposition_pingnanapp";
// export const urlVideoPlayerOnline =
//   process.env.NODE_ENV === "development"
//     ? "https://hik.hehang.net:9992/#/"
//     : "https://zhxf.bbwyun.com:82/videoplayer/#/";
// export const urlVideoPlayerOnline = "https://hik.hehang.net:9992/#/";
export const urlVideoPlayerOnline = process.env.VUE_APP_VIDEO;
// 浏览器信息
export const browser = {
  versions: (function() {
    const u = navigator.userAgent;
    // const app = navigator.appVersion;
    return {
      // 移动终端浏览器版本信息
      trident: u.indexOf("Trident") > -1, // IE内核
      presto: u.indexOf("Presto") > -1, // opera内核
      webKit: u.indexOf("AppleWebKit") > -1, // 苹果、谷歌内核
      gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, // 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, // android终端或uc浏览器
      iPhone: u.indexOf("iPhone") > -1, // 是否为iPhone或者QQHD浏览器
      iPad: u.indexOf("iPad") > -1, // 是否iPad
      webApp: u.indexOf("Safari") == -1 // 是否web应该程序，没有头部与底部
    };
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
