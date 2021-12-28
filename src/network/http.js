/*
 * http请求类
 */
import axios from "axios";
import qs from "qs";
import router from "@/router";

import { storageNameUser, apiTimeout as timeout } from "constants/global";
import { antMessage } from "utils/feedback";

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
    config.headers["content-type"] = "application/json;charset=utf-8";
    config.headers["data-type"] = "json";

    //get方式提交数组设置为repeat方式
    if (config.method === "get") {
      config.paramsSerializer = function(params) {
        return qs.stringify(params, { arrayFormat: "repeat" });
      };
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

// 处理http状态
function checkStatus(response) {
  // 正常状态返回数据
  const { data, status: code } = response;

  if (code === 200 || code === 304) {
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

// 统一处理错误信息
function checkCode(res) {
  const { code } = res;
  if (code !== 0) {
    let msg = `${
      res.message ? res.message.replace(/!/g, "") : "系统繁忙，请稍后再试"
    }！`;
    antMessage("error", msg);
    if (code === 2) {
      // token失效
      window.sessionStorage.setItem(storageNameUser, JSON.stringify(user));
      // 退出重新登录
      const user = {
        token: null,
        userId: "",
        userName: "",
        userAccount: "",
        avatarImg: ""
      };
      router.push({
        path: "/login",
        query: { redirect: router.currentRoute.fullPath }
      });
    }
  }
  return res;
}

function get(url, params, headers = null) {
  return axios({
    method: "get",
    url,
    params,
    timeout,
    headers: headers || {}
  })
    .then(checkStatus)
    .then(checkCode);
}
function post(url, data = null, params = {}, headers = {}) {
  return axios({
    method: "post",
    url,
    params,
    data,
    timeout,
    headers
  })
    .then(checkStatus)
    .then(checkCode);
}

export { get, post };
