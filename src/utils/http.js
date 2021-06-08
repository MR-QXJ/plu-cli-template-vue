/*
 * http请求类
 */
import axios from "axios";
import { message, Modal } from "ant-design-vue";
import router from "../router";
import { storageNameUser, durationMsg } from "./global";
import { dataIsNullNumber } from "./tool";
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
  if (response.status === 200 || response.status === 304) {
    if (
      response.headers["content-type"] == "text/html;charset=utf-8" ||
      response.headers["content-type"] == "application/pdf"
    ) {
      return {
        code: 0,
        data: response.data
      };
    }
    if (response.headers["content-type"] == "application/vnd.ms-excel") {
      return {
        code: 0,
        data: response.data
      };
    }
    const code = dataIsNullNumber(response.data.code);
    if (code === 2) {
      // token失效
      return {
        code: code,
        message: "登录失效，请重新登录",
        data: null
      };
    }
    return response.data;
  }

  // 异常状态返回404,500错误等
  let message = "";
  switch (response.status) {
    case 400:
      // 错误请求
      message = "错误请求";
      break;
    case 401:
      // 未授权
      message = "服务器未授权的请求";
      break;
    case 403:
      // 拒绝访问
      message = "服务器拒绝访问";
      break;
    case 404:
      // 未找到该资源
      message = "无服务器请求";
      break;
    case 405:
      // 请求方法未允许
      message = "服务器未允许的请求方法";
      break;
    case 408:
      // 请求超时
      message = "服务器繁忙";
      break;
    case 500:
      // 服务器错误
      message = "服务器错误";
      break;
    case 501:
      // 网络未实现
      message = "无网络";
      break;
    case 502:
      // 网络错误
      message = "网络错误";
      break;
    case 503:
      // 服务不可用
      message = "服务不可用";
      break;
    case 504:
      // 网络超时
      message = "网络信号弱";
      break;
    case 505:
      // http版本不支持该请求
      message = "不支持的请求";
      break;
    default:
      message = `连接错误${response.status}`;
  }
  return {
    code: response.status,
    message: message,
    data: null
  };
}

function checkCode(res) {
  // 统一处理错误信息
  if (res.code !== 0) {
    if (res.code === 2) {
      // token失效
      if (!modal) {
        modal = Modal.warning({
          title: "提醒",
          content: `${res.message}！`,
          onOk: () => {
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

            setTimeout(() => {}, 300);
          }
        });
      }
    } else {
      message.error(`${res.message}！`, durationMsg);
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
      data: data || null,
      timeout: timeout,
      headers: headers || {}
    })
      .then(checkStatus)
      .then(checkCode);
  },
  postDownload(url, data, params = null, headers = null) {
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
};
