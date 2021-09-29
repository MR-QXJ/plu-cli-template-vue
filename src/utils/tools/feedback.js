import { Loading, Message, MessageBox, Notification } from "element-ui";

/**
 * @param content 消息文字
 * @param type 主题 - success/warning/info/error
 * @param opt 覆盖配置
 * @returns Message实例，可通过其close方法关闭动画
 */
export function message(content, type = "info", opt) {
  const msg = Message({
    type,
    showClose: true,
    message: content,
    ...opt
  });
  return msg;
}

/**
 *
 * @param opt 覆盖配置
 * @returns loading实例，可通过其close方法关闭动画
 */
export function loading(opt) {
  return Loading.service({
    lock: true,
    text: "Loading",
    // spinner: 'el-icon-loading',
    background: "rgba(0, 0, 0, 0.7)",
    ...opt
  });
}

/**
 * @param content 消息文字
 * @param title 标题
 * @param opt 覆盖配置
 * @returns 返回promise对象
 */
export function alert(content, title = "提示", opt) {
  return MessageBox(content, title, {
    type: "warning",
    ...opt
  }).catch(() => {});
}

/**
 * @param content 消息文字
 * @param title 标题
 * @param opt 覆盖配置
 * @returns 返回promise对象
 */
export function confirm(content, title = "提示", opt) {
  return MessageBox.confirm(content, title, {
    type: "warning",
    ...opt
  }).catch(() => {});
}

/**
 * @param content 消息文字
 * @param title 标题
 * @param opt 覆盖配置
 * @returns 返回promise对象
 */
export function prompt(content, title = "注意", opt) {
  return MessageBox.prompt(content, title, {
    type: "info",
    ...opt
  })
    .then(({ value }) => {
      return value && value.trim();
    })
    .catch(() => {});
}

/**
 * @param message 消息文字
 * @param opt 覆盖配置
 * @returns 返回promise对象
 */
export function notify(message, opt) {
  Notification({
    title: "提示",
    type: "info",
    message,
    ...opt
  });
}
