import http from "./http";
/**
 * 接口
 */

// 代理前缀
// const URL = `/zhxfgxpnapi`;
const isDev = process.env.NODE_ENV === "development";
// const HOST = isDev ? "http://192.168.16.43:8080" : "";
// const HOST = isDev ? "/zhxfgxpnapi" : "";

// app 打包测试地址
// export const URL = `${isDev ? "" : "http://192.168.16.131:8898"}/zhxfgxpnapi`;
// app 打包 正式地址
export const URL = isDev ? '/zhxfgxpnapi' : process.env.VUE_APP_API;

const APPLET = "/pingnan-producer-applet/api/applet";
// 通用平台
const COMMON = "/pingnan-common/api/common";

/**
 * 登录
 * loginname 用户名
 * loginpsw  密码
 */

/**
 * 获取登录用户信息
 * userId 用户id
 */

const GETUSERINFO = "https://api.weixin.qq.com/sns/jscode2session";

/**
 * 字典查询
 */
const SELECTLIST = "/codeValue/searchCodeValue";

/**
 * 文件下载
 */
// const DOWNLOADFILE = "zhxfgxpnapi/attachments/file/getFile";
const DOWNLOADFILE = "/attachments/file/getFile";

// 保存图片信息
const UPLOADIMAGE = "/attachments/image/saveZonesImg";
// const UPLOADIMAGE = "zhxfgxpnapi/attachments/image/saveZonesImg";
// 加载图片
const GETIMAGE = "/attachments/image/get";
// const GETIMAGE = "zhxfgxpnapi/attachments/image/get";

/**
 * 视频流播放
 */
// const HLSVIDEO = "zhxfgxpnapi/video/api/sc/getOneHlsUrlByName"
const HLSVIDEO = "/video/api/sc/getOneHlsUrlByName";
/**
 * 登陆
 */
const LOGIN = "/user/login";
// 修改密码
const UPDATEUPWD = "/user/updatePassword";

/**
 * 首页消防咨询
 */
// 首页菜单
const SEARCHMENU = "/function/searchSysFunctionByPid";
const SEARCHMENUNOTOKEN = "/function/searchSysFunctionNOUser";
const INDEXFIREINFO = "/home/search/searchFireInformation";
// 消防咨询详情
const FIREINFODETAIL = "/home/search/searchFireInformationById";
// 添加用户登录日志
const USERLOGINLOG = "/home/search/saveUserLogInLogger";

/**
 * 一键报警
 */
const ONEKEYHELP = "/home/onekey/save/saveOnekeyAlarm";

/**
 * 业务咨询
 */
// 保存咨询信息
const INSERTBUSINESSCONSULT = "/home/businessConsult/save/saveBusinessConsult";
/**
 * 带分页查询业务咨询
 */
const BUSINESSCONSULT =
  "/home/businessConsult/search/searchAppletBusinessConsult";
// 根据ID查询业务咨询
const BUSINESSCONSULTDETAIL =
  "/home/businessConsult/search/searchBusinessConsultById";

/**
 * 消防安全
 */
// 根据单位ID查询物当前告警信息
// const GETUNITINFO = "/home/FireSafetyManagement/search/getAlarmInfolist";
// 根据单位ID查询最近12个月告警数量趋势
// const GETUNITONEYEARALARMTENDENCY = "/home/FireSafetyManagement/search/getAlarmTendency";
// 根据单位ID查询未处置完成的隐患列表
// const GETUNITNOTDISPOSE = "/home/FireSafetyManagement/search/getFireHiddenDanger";
// 根据单位ID查询物联网系统告警统计
// const GETUNITINTERNETTHINGS = "/home/FireSafetyManagement/search/getPointAlarmStatistic";
// 根据单位ID查询最近12个月风险指数趋势
// const GETUNITONEYEARRISKTENDENCY = "/home/FireSafetyManagement/search/getRiskTrend";
// 根据单位ID查询单位户籍化信息
// const GETUNITHOUSEREGISTER = "/home/FireSafetyManagement/search/getUnitDetails";
// 根据单位ID查询单位视频监控信息
// const GETUNITVIDEO = "/home/FireSafetyManagement/search/getVideoInfo";
/**
 * 单位列表--根据用户权限查询单位统计数据列表（默认按物联告警数量排序）
 */
// const GETUNITLISTS = "/home/FireSafetyManagement/search/getUnitList"
// 查询社会从业人员信息详情
// const GETLOYEERDETAIL = "/home/FireSafetyManagement/*/search/queryEmployeeDetails";
// 删除社会从业人员信息,可操作多条数据
// const DELETELOYEER = "/home/FireSafetyManagement/delete/deleteEmployee";
// 单位列表-取消关注单位
// const DELETEFOCUSUNIT = "/home/FireSafetyManagement/delete/deleteUserUnitLink";
// 保存社会从业人员信息
// const INSERTLOYEER = "/home/FireSafetyManagement/save/saveEmployee";
// 保存隐患处置信息
// const INSERTHIDDENDISPOSE = "/home/FireSafetyManagement/save/saveFireHiddenDangerDispose";
// 单位列表-关注单位
// const FOCUSUNIT = "/home/FireSafetyManagement/save/saveUserUnitLink";
// 修改单位信息(单位类型pid=0005001、监管级别pid=0005002、行业pid=0005003)
// const UPDATEUNITDATA = "/home/FireSafetyManagement/update/updateBaseUnit";
// 修改社会从业人员信息
// const UPDATELOYEERDATA = "/home/FireSafetyManagement/update/updateEmployee";
// 查隐患类型下拉框信息
// const GETHIDDENDIPOSESELECT = "/home/FireSafetyManagement/search/getDisposeTypeSelect";
// 查询社会从业人员职务下拉框
// const GETLOYEERSELECT = "/home/FireSafetyManagement/search/getEmployeeDutySelect";
// 根据隐患id查询隐患详细信息
// const GETHIDDENDETAIL = "/home/FireSafetyManagement/search/getFireHiddenDangerById";
// 根据单位Id查询社会从业人员信息列表
// const EMPLOYEERLIST = "/home/FireSafetyManagement/search/searchEmployee";

// 掌上消防--消防安全管理-单位用户

// 查询社会从业人员信息详情
const GETLOYEERDETAIL =
  "/home/fireSafetyManagement/unitFireSafetyManagement/*/search/queryEmployeeDetails";
// 删除社会从业人员信息,可操作多条数据
const DELETELOYEER =
  "/home/fireSafetyManagement/unitFireSafetyManagement/delete/deleteEmployee";
// 保存社会从业人员信息
const INSERTLOYEER =
  "/home/fireSafetyManagement/unitFireSafetyManagement/save/saveEmployee";
// 保存隐患处置信息
const INSERTHIDDENDISPOSE =
  "/home/fireSafetyManagement/unitFireSafetyManagement/save/saveFireHiddenDangerDispose";
// 根据单位ID查询物当前告警信息
const GETUNITINFO =
  "/home/fireSafetyManagement/unitFireSafetyManagement/search/getAlarmInfolist";
// 根据单位ID查询最近12个月告警数量趋势
const GETUNITONEYEARALARMTENDENCY =
  "/home/fireSafetyManagement/unitFireSafetyManagement/search/getAlarmTendency";
// 查隐患类型下拉框信息
const GETHIDDENDIPOSESELECT =
  "/home/fireSafetyManagement/unitFireSafetyManagement/search/getDisposeTypeSelect";
// 查询社会从业人员职务下拉框
const GETLOYEERSELECT =
  "/home/fireSafetyManagement/unitFireSafetyManagement/search/getEmployeeDutySelect";
// 根据单位ID查询未处置完成的隐患列表
const GETUNITNOTDISPOSE =
  "/home/fireSafetyManagement/unitFireSafetyManagement/search/getFireHiddenDanger";
// 根据隐患id查询隐患详细信息
const GETHIDDENDETAIL =
  "/home/fireSafetyManagement/unitFireSafetyManagement/search/getFireHiddenDangerById";
// 根据单位ID查询物联网系统告警统计
const GETUNITINTERNETTHINGS =
  "/home/fireSafetyManagement/unitFireSafetyManagement/search/getPointAlarmStatistic";
// 根据单位ID查询最近12个月风险指数趋势
const GETUNITONEYEARRISKTENDENCY =
  "/home/fireSafetyManagement/unitFireSafetyManagement/search/getRiskTrend";
// 根据单位ID查询单位户籍化信息
const GETUNITHOUSEREGISTER =
  "/home/fireSafetyManagement/unitFireSafetyManagement/search/getUnitDetails";
// 根据用户权限查询单位统计数据列表（默认按物联告警数量排序）
const GETUNITLISTS =
  "/home/fireSafetyManagement/unitFireSafetyManagement/search/getUnitList";
// 根据单位ID查询单位视频监控信息
const GETUNITVIDEO =
  "/home/fireSafetyManagement/unitFireSafetyManagement/search/getVideoInfo";
// 根据单位Id查询社会从业人员信息列表
const EMPLOYEERLIST =
  "/home/fireSafetyManagement/unitFireSafetyManagement/search/searchEmployee";
// 修改单位信息(单位类型pid=0005001、监管级别pid=0005002、行业pid=0005003)
const UPDATEUNITDATA =
  "/home/fireSafetyManagement/unitFireSafetyManagement/update/updateBaseUnit";
// 修改社会从业人员信息
const UPDATELOYEERDATA =
  "/home/fireSafetyManagement/unitFireSafetyManagement/update/updateEmployee";

// 掌上消防--消防安全管理-消防部门用户

// 单位列表-取消关注单位
const CANCELATTENTIONUNIT =
  "/home/fireSafetyManagement/departmentFireSafetyManagement/delete/deleteUserUnitLink";
// 单位列表-关注单位
const ATTENTIONUNIT =
  "/home/fireSafetyManagement/departmentFireSafetyManagement/save/saveUserUnitLink";
// 根据单位ID查询物当前告警信息
const ALARMINFORMATIONBYUNITID =
  "/home/fireSafetyManagement/departmentFireSafetyManagement/search/getAlarmInfolist";
// 根据单位ID查询最近12个月告警数量趋势
const ONEYEARALARMTOTAL =
  "/home/fireSafetyManagement/departmentFireSafetyManagement/search/getAlarmTendency";
// 根据单位ID查询未处置完成的隐患列表
const NOTDISPOSEHIDENLISTBYUNITID =
  "/home/fireSafetyManagement/departmentFireSafetyManagement/search/getFireHiddenDanger";
// 根据单位ID查询物联网系统告警统计
const IOTALARMTOTALBYUNITID =
  "/home/fireSafetyManagement/departmentFireSafetyManagement/search/getPointAlarmStatistic";
// 根据单位ID查询最近12个月风险指数趋势
const ONEYEARRISKBYUNITID =
  "/home/fireSafetyManagement/departmentFireSafetyManagement/search/getRiskTrend";
// 根据单位ID查询单位户籍化信息
const REGISTRATIONBYUNITID =
  "/home/fireSafetyManagement/departmentFireSafetyManagement/search/getUnitDetails";
// 根据用户权限查询单位统计数据列表（默认按物联告警数量排序）
const UNITSTATISTICAL =
  "/home/fireSafetyManagement/departmentFireSafetyManagement/search/getUnitList";
// 根据单位ID查询单位视频监控信息
const VIDEOBYUNITID =
  "/home/fireSafetyManagement/departmentFireSafetyManagement/search/getVideoInfo";
// 根据单位Id查询社会从业人员信息列表
const EMPLOYEERLISTBYUNITID =
  "/home/fireSafetyManagement/departmentFireSafetyManagement/search/searchEmployee";

/**
 * 隐患举报
 */
// 带分页查询隐患
const HIDDENDANGERLISTS = "/home/hiddenDanger/search/searchAppletHiddenDanger";
// 根据Id查询隐患详情
const HIDDENDANGERDETAIL =
  "/home/hiddenDanger/search/searchAppletHiddenDangerById";
// 修改隐患状态
const UPDATEHIDDENSTATE =
  "/home/hiddenDanger/update/updateHiddenDangerStateById";

/**
 * 拍照上传
 */
const UPLOADPITURE = "/home/snapshot/save/saveAppletHiddenDanger";

/**
 *  业务指南
 */
// 带分页查询业务指南
const QUERYBUSINESSGUIDE =
  "/home/businessGuide/search/searchAppletBusinessGuide";
// 带分页查询业务指南
const QUERYBUSINESSGUIDEDETAIL =
  "/home/businessGuide/search/searchAppletBusinessGuideById";
// 分页查看表格
const QUERYBGUIDETABLE = "/home/businessGuide/search/searchTable";

/**
 * 接口方法
 * @param {*} params 传入参数
 * @param {*} success 成功后执行方法
 * @param {*} fail 失败后执行方法
 * 方法可用也可不用
 */
// 登录
export const login = function(params) {
  return http.post(`${URL}${COMMON}${LOGIN}`, params);
};
// 修改密码
export const updatePassword = function(params) {
  return http.post(`${URL}${COMMON}${UPDATEUPWD}`, params);
};
// 获取登录用户信息
export const userInfo = function(params) {
  return http.get(`${GETUSERINFO}`, params);
};

/**
 * 字典查询
 */
export const getSelectList = function(params) {
  return http.get(`${URL}${COMMON}${SELECTLIST}`, params);
};

/**
 * 文件下载
 */
export const getDownloadFile = function(params) {
  // return http.get(`${URL}${DOWNLOADFILE}${params.fileUrl}`, {});
  return `${URL}${DOWNLOADFILE}${params.fileUrl}`;
  // return http.get(`${URL}${DOWNLOADFILE}/${params.group}/${params.name}`, {});
};
// 保存图片信息
export const uploadImage = function(params) {
  return http.post(`${URL}${UPLOADIMAGE}`, params);
};
// 加载图片
export const getImage = function(image) {
  return `${URL}${GETIMAGE}${image}`;
};

/**
 * 视频播放
 */
export const getPlayHlsVideo = function(params) {
  return http.get(`${URL}${HLSVIDEO}`, params);
};

/***
 * 首页
 */
export const getSearchMenu = function(params) {
  return http.get(`${URL}${COMMON}${SEARCHMENU}`, params);
};
export const getSearchMenuNoToken = function(params) {
  return http.get(`${URL}${COMMON}${SEARCHMENUNOTOKEN}`, params);
};
export const getIndexInfo = function(params) {
  return http.get(`${URL}${APPLET}${INDEXFIREINFO}`, params);
};
// 咨询详情
export const getIndexInfoDetail = function(params) {
  return http.get(`${URL}${APPLET}${FIREINFODETAIL}`, params);
};
// 添加用户登录日志
export const getUserLog = function(params) {
  return http.get(`${URL}${APPLET}${USERLOGINLOG}`, params);
};

/**
 * 业务咨询
 */
// 保存查询信息
export const insertBusinessConsult = function(params) {
  return http.post(`${URL}${APPLET}${INSERTBUSINESSCONSULT}`, params);
};
// 分页查询业务咨询
export const getBusinessConsultLists = function(params) {
  return http.get(`${URL}${APPLET}${BUSINESSCONSULT}`, params);
};
// 根据ID查询业务咨询
export const getBusinessConsultDetail = function(params) {
  return http.get(`${URL}${APPLET}${BUSINESSCONSULTDETAIL}`, params);
};

/**
 * 掌上消防--消防安全管理-单位用户
 */
// 查询社会从业人员信息详情
export const getLoyeerDetail = function(params) {
  return http.get(`${URL}${APPLET}${GETLOYEERDETAIL}`, params);
};
// 删除社会从业人员信息,可操作多条数据
export const deleteLoyeerData = function(params) {
  return http.post(`${URL}${APPLET}${DELETELOYEER}`, params);
};
// 保存社会从业人员信息
export const insertLoyeerData = function(params) {
  return http.post(`${URL}${APPLET}${INSERTLOYEER}`, params);
};
// 保存隐患处置信息
export const insertHiddenDispose = function(params) {
  return http.post(`${URL}${APPLET}${INSERTHIDDENDISPOSE}`, params);
};
// 根据单位ID查询物当前告警信息
export const getFireUnitNowAlarm = function(params) {
  return http.get(`${URL}${APPLET}${GETUNITINFO}`, params);
};
// 根据单位ID查询最近12个月告警数量趋势
export const getFireUnitAlarmTendency = function(params) {
  return http.get(`${URL}${APPLET}${GETUNITONEYEARALARMTENDENCY}`, params);
};
// 根据单位ID查询未处置完成的隐患列表
export const getFireUnitNotDispose = function(params) {
  return http.get(`${URL}${APPLET}${GETUNITNOTDISPOSE}`, params);
};
// 查隐患类型下拉框信息
export const getHiddenDisposeSelect = function(params) {
  return http.get(`${URL}${APPLET}${GETHIDDENDIPOSESELECT}`, params);
};
// 查询社会从业人员职务下拉框
export const getLoyeerSelect = function(params) {
  return http.get(`${URL}${APPLET}${GETLOYEERSELECT}`, params);
};
// 根据隐患id查询隐患详细信息
export const getHiddenDetail = function(params) {
  return http.get(`${URL}${APPLET}${GETHIDDENDETAIL}`, params);
};
// 根据单位ID查询物联网系统告警统计
export const getFireUnitInternetThings = function(params) {
  return http.get(`${URL}${APPLET}${GETUNITINTERNETTHINGS}`, params);
};
// 根据单位ID查询最近12个月风险指数趋势
export const getFireUnitRiskTendency = function(params) {
  return http.get(`${URL}${APPLET}${GETUNITONEYEARRISKTENDENCY}`, params);
};
// 根据单位ID查询单位户籍化信息
export const getFireUnitHouseRegister = function(params) {
  return http.get(`${URL}${APPLET}${GETUNITHOUSEREGISTER}`, params);
};
// 单位列表--根据用户权限查询单位统计数据列表（默认按物联告警数量排序）
export const getFireUnitLists = function(params) {
  return http.get(`${URL}${APPLET}${GETUNITLISTS}`, params);
};
// 根据单位ID查询单位视频监控信息
export const getFireUnitVideo = function(params) {
  return http.get(`${URL}${APPLET}${GETUNITVIDEO}`, params);
};
// 根据隐患id查询隐患详细信息
export const getEmployers = function(params) {
  return http.get(`${URL}${APPLET}${EMPLOYEERLIST}`, params);
};
// 修改单位信息(单位类型pid=0005001、监管级别pid=0005002、行业pid=0005003)
export const updateUnitData = function(params) {
  return http.post(`${URL}${APPLET}${UPDATEUNITDATA}`, params);
};
// 修改社会从业人员信息
export const updateLoyeerData = function(params) {
  return http.post(`${URL}${APPLET}${UPDATELOYEERDATA}`, params);
};

/**
 * 掌上消防--消防安全管理-消防部门用户
 */
// 单位列表-取消关注单位
export const deleteFocusUnitByFire = function(params) {
  return http.post(`${URL}${APPLET}${CANCELATTENTIONUNIT}`, params);
};
// 单位列表-关注单位
export const insertFocusUnitByFire = function(params) {
  return http.post(`${URL}${APPLET}${ATTENTIONUNIT}`, params);
};
// 根据单位ID查询物当前告警信息
export const getAlarmInfolistByFire = function(params) {
  return http.get(`${URL}${APPLET}${ALARMINFORMATIONBYUNITID}`, params);
};
// 根据单位ID查询最近12个月告警数量趋势
export const getAlarmTendencyByFire = function(params) {
  return http.get(`${URL}${APPLET}${ONEYEARALARMTOTAL}`, params);
};
// 根据单位ID查询未处置完成的隐患列表
export const getFireHiddenDangerByFire = function(params) {
  return http.get(`${URL}${APPLET}${NOTDISPOSEHIDENLISTBYUNITID}`, params);
};
// 根据单位ID查询物联网系统告警统计
export const getPointAlarmStatisticByFire = function(params) {
  return http.get(`${URL}${APPLET}${IOTALARMTOTALBYUNITID}`, params);
};
// 根据单位ID查询最近12个月风险指数趋势
export const getRiskTrendByFire = function(params) {
  return http.get(`${URL}${APPLET}${ONEYEARRISKBYUNITID}`, params);
};
// 根据单位ID查询单位户籍化信息
export const getUnitDetailsByFire = function(params) {
  return http.get(`${URL}${APPLET}${REGISTRATIONBYUNITID}`, params);
};
// 根据用户权限查询单位统计数据列表（默认按物联告警数量排序）
export const getUnitListByFire = function(params) {
  return http.get(`${URL}${APPLET}${UNITSTATISTICAL}`, params);
};
// 根据单位ID查询单位视频监控信息
export const getVideoInfoByFire = function(params) {
  return http.get(`${URL}${APPLET}${VIDEOBYUNITID}`, params);
};
// 根据单位Id查询社会从业人员信息列表
export const searchEmployeeByFire = function(params) {
  return http.get(`${URL}${APPLET}${EMPLOYEERLISTBYUNITID}`, params);
};

/**
 * 隐患举报
 */
// 带分页查询隐患
export const getHiddenDangertLists = function(params) {
  return http.get(`${URL}${APPLET}${HIDDENDANGERLISTS}`, params);
};
// 根据Id查询隐患详情
export const getHiddenDangertListsDetail = function(params) {
  return http.get(`${URL}${APPLET}${HIDDENDANGERDETAIL}`, params);
};
// 修改隐患状态
export const updateHiddenState = function(params) {
  return http.post(`${URL}${APPLET}${UPDATEHIDDENSTATE}`, params);
};

/**
 * 隐患快拍
 */
// 隐患拍照
export const insertPictureData = function(params) {
  return http.post(`${URL}${APPLET}${UPLOADPITURE}`, params);
};

/**
 * 业务指南
 */
// 带分页查询业务指南
export const getBusinessGuide = function(params) {
  return http.get(`${URL}${APPLET}${QUERYBUSINESSGUIDE}`, params);
};
// 根据ID查询业务指南
export const getBusinessGuideDetail = function(params) {
  return http.get(`${URL}${APPLET}${QUERYBUSINESSGUIDEDETAIL}`, params);
};
// 分页查看表格
export const getGuideTable = function(params) {
  return http.get(`${URL}${APPLET}${QUERYBGUIDETABLE}`, params);
};

/**
 * 一键报警
 */
export const insetOneKeyHelp = function(params) {
  return http.post(`${URL}${APPLET}${ONEKEYHELP}`, params);
};
