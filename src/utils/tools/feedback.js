import { Dialog, Toast } from "vant";

/**
 * 弹出框
 * @param type 类型 - alert、confirm，不传则为普通弹窗
 * @param opt 配置
 */
export function dialog(opt, type) {
  return type ? Dialog[type](opt) : Dialog(opt);
}

export function closeDialog() {
  Dialog.close();
}

/**
 * 轻提示
 * @param message 消息
 * @param opts 其他配置
 */
export function toast(message, opts) {
  Toast({ message, ...opts });
}

/**
 * 成功提示
 * @param message 消息
 * @param opts 其他配置
 */
export function toastSuc(message, opts) {
  Toast.success({ message, ...opts });
}

/**
 * 失败提示
 * @param message 消息
 * @param opts 其他配置
 */
export function toastFail(message, opts) {
  Toast.fail({ message, ...opts });
}

/**
 * 加载
 * @param message 消息
 * @param opts 其他配置
 */
export function loading(message = "加载中...", opts) {
  Toast.loading({ message, duration: 0, ...opts });
}

export function clearToast() {
  Toast.clear();
}
