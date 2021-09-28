/*
 * http请求类
 */
import axios from "axios";
import router from "@/router";
import store from "@/store";
import { toastFail, dialog } from "utils/tools/feedback";
import { storageNameUser } from "utils/global";
import { dataIsNullNumber } from "utils/tools/common";
// 请求超时
const timeout = 30000;
// token失效提示模态框
let modal = null;

axios.interceptors.request.use(
  config => {
    const user = JSON.parse(
      window.localStorage.getItem(storageNameUser) || "{}"
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
  if (code === 200 || code === 304) {
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
  // 异常状态返回404,500错误等
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
  // 统一处理错误信息
  if (code !== 0) {
    if (code === 2) {
      // token失效
      if (!modal) {
        modal = true;
        dialog(
          {
            message: `${res.message}!`
          },
          "alert"
        ).then(() => {
          modal = null;
          store.dispatch("clearUser");
          router.replace({
            path: "/"
            // query: { redirect: router.currentRoute.fullPath }
          });
        });
      }
    } else {
      toastFail(`${res.message}！`);
    }
  }
  return res;
}

export default {
  get(url, params, headers = null) {
    return axios({
      method: "get",
      url,
      params,
      timeout: timeout,
      headers: headers || {}
    })
      .then(checkStatus)
      .then(checkCode);
  },
  post(url, data, params = null, headers = null) {
    return axios({
      method: "post",
      url,
      params: params || {},
      data: data || { default: "default" },
      timeout: timeout,
      headers: headers || {}
    })
      .then(checkStatus)
      .then(checkCode);
  }
};
