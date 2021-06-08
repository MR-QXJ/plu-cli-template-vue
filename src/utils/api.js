import qs from "qs";
import http from "./http";
export const URL = "/hhoffice";

/*
 * 接口定义
 */
// 一、服务
export const ATTACHMENT = `/attachments`;
// 保存图片
export const SAVEIMG = `/attachments/image/saveZonesImg`;
// 获取图片
export const GETIMG = `${URL}/attachments/image/get`;
// 保存文件
export const SAVEFILE = `${URL}/attachments/file/saveFileMessage`;
// 下载文件
export const DOWNLOADFILE = `${URL}/attachments/file/getFile`;

// 二、通用
export const COMMON = `/hehang-common`;
//获取验证码
export const CAPTCHA = `${COMMON}/api/common/user/captcha`;
// 登录
export const LOGIN = `${COMMON}/api/common/user/login`;
// 登出
export const LOGOUT = `${COMMON}/api/common/user/logout`;
// 查询是否是第一次登录
export const ISFIRSTLOGIN = `${COMMON}/api/common/user/getUserFirstLogin`;
// 获取登录用户信息
export const GETLOGININFO = `${COMMON}/api/common/user/getUserInfo`;
// 修改密码
export const EDITPWD = `${COMMON}/api/common/user/updatePassword`;
//根据用户名查询账号是否可用
export const USERNAMEENABLE = `${COMMON}/api/common/user/userNameEnabled`;

// 获取导航页菜单
export const GETGUIDEMENUBLOCK = `${COMMON}/api/common/function/searchTopSysFunction`;
// 获取权限菜单
export const GETPOWERFUNS = `${COMMON}/api/common/function/searchSysFunctionByPid`;
// 获取字典
export const GETCODES = `${COMMON}/api/common/codeValue/searchCodeValue`;
// 获取国标区域字典
export const GETCODESREGIONGB = `${COMMON}/api/base/baseAreaCode/getAreaCodeList`;

//查询部门列表
export const GETDEPARTMENT = `${COMMON}/api/common/codeValue/search/getDepartmentList`;
// 查询项目列表
export const GETPROJECT = `${COMMON}/api/common/codeValue/search/getProjectList`;
/*
 * 接口
 */

// 参数序列化
export function paramsSerializer(name, params, type = 1) {
  switch (type) {
    case 1: {
      const arr = {};
      arr[name] = params;
      return qs.stringify(arr, { indices: false });
    }
  }
}

// 获取权限菜单
export async function getPowerFuns(data, params) {
  const res = await http.post(`${URL}${GETPOWERFUNS}`, data, params);
  return res;
}
