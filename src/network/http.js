/*
 * http请求类
 */
import axios from "axios";
import router from "@/router";

import { storageNameUser } from "configs/global";
import { dataIsNullNumber } from "utils/common";
import { message, alert } from "utils/feedback";

// import qs from "qs";

// 请求超时
const timeout = 30000;
// token失效提示模态框
let modal = null;

axios.interceptors.request.use(
  config => {
    const user = JSON.parse(
      window.sessionStorage.getItem(storageNameUser) || "{}"
    );
    const token = user.token || "";
    if (token !== "") {
      // header传token
      config.headers.token = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.resolve(error.response);
  }
);

function checkStatus(response) {
  // 处理http状态
  // 正常状态返回数据
  const code = response.status;
  const data = response.data;
  const contentType = response.headers["content-type"];

  if (code === 200 || code === 304) {
    if (
      contentType == "text/html;charset=utf-8" ||
      contentType == "application/pdf" ||
      contentType == "application/vnd.ms-excel"
    ) {
      return {
        code: 0,
        data
      };
    }

    const code = dataIsNullNumber(data.code);
    if (code === 2) {
      // token失效
      return {
        code,
        message: "登录失效，请重新登录",
        data: null
      };
    }
    return data;
  }
  const codeMsg = {
    400: "错误请求",
    401: "服务器未授权的请求",
    403: "服务器拒绝访问",
    404: "无服务器请求",
    405: "服务器未允许的请求方法",
    408: "服务器繁忙",
    500: "服务器错误",
    501: "无网络",
    502: "网络错误",
    503: "服务不可用",
    504: "网络信号弱",
    505: "不支持的请求"
  };
  const message = codeMsg[code] || `连接错误${code}`;

  return {
    code,
    message,
    data: null
  };
}

function checkCode(res) {
  const code = res.code;
  const msg = res.message;
  // 统一处理错误信息
  if (code !== 0) {
    if (code === 2) {
      // token失效
      if (!modal) {
        modal = alert(`${msg}！`).then(confirm => {
          if (!confirm) return;
          // 退出重新登录
          const user = {
            token: null,
            userId: "",
            userName: "未知用户",
            realName: "未知姓名",
            avatarImg: ""
          };
          Promise.resolve()
            .then(() => {
              window.sessionStorage.setItem(
                storageNameUser,
                JSON.stringify(user)
              );
            })
            .then(() => {
              modal.destroy();
              modal = null;
              router.push({
                path: "/login",
                query: { redirect: router.currentRoute.fullPath }
              });
              // location.reload();
            });
        });
      }
    } else {
      message(`${msg}！`, "error");
    }
  }
  return res;
}

function get(url, params, headers = null) {
  return axios({
    method: "get",
    url,
    params,
    timeout: timeout,
    headers: headers || {}
  })
    .then(checkStatus)
    .then(checkCode);
}
function post(url, data, params = null, headers = null) {
  return axios({
    method: "post",
    url,
    params: params || {},
    data: data || null,
    timeout: timeout,
    headers: headers || {}
  })
    .then(checkStatus)
    .then(checkCode);
}
function postDownload(url, data, params = null, headers = null) {
  return axios({
    method: "post",
    url,
    params: params || {},
    data: data || null,
    timeout: timeout,
    headers: headers || {},
    responseType: "blob"
  })
    .then(checkStatus)
    .then(checkCode);
}

export { get, post, postDownload };
