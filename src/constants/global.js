/*
 * 全局变量类
 */

// 1、请求根路径
export const URL = process.env.VUE_APP_API;

// 2、浏览器
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

// 3、路由
// 主页
export const routePathHome = "/";

// 4、登录
// 用户localStorage变量名
export const storageNameUser = "user_hhofficeplatform";
// 权限菜单当前父key localStorage变量名
export const storageNameNavMenuPKey = "navmenupkey_hhofficeplatform";
// 权限菜单当前key localStorage变量名
export const storageNameNavMenuKey = "navmenukey_hhofficeplatform";

// 5、文件
// 上传图片类型
export const imgAccept = "image/png,image/jpg,image/jpeg";
// 上传图标类型
export const iconAccept = "image/png";
// 图片规格
export const imgModal = {
  // 通用
  normal: "normal",
  // 1寸登记照
  photoone: "photoone",
  // 身份证
  card: "card",
  // 营业执照
  businesslicense: "businesslicense",
  // 头像
  avatar: "avatar",
  // 图标
  icon: "icon"
};

//6、请求
// 超时时间(30秒)
export const apiTimeout = 30000;

//7、moment时间格式
// 日期
export const formatMomentDate = "YYYY-MM-DD";
// 时间
export const formatMomentTime = "YYYY-MM-DD HH:mm:ss";
// 时间省略秒
export const formatMomentTimeNoSecond = "YYYY-MM-DD HH:mm";
