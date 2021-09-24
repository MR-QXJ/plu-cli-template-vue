import { message, Modal, Notification } from "ant-design-vue";
import { durationMsg } from "@/utils/global";

/**
 * 消息提示
 * @param type 类型 - success、error、info、warning、warn、loading
 * @param msg 消息
 * @param duration 消失时间
 * @param key 提示唯一标识
 */
export function antMessage(type, msg, duration, key) {
  const durationTime = duration !== undefined ? duration : durationMsg;
  if (key) {
    message[type]({ content: `${msg}！`, key, durationTime });
  } else {
    message[type](`${msg}！`, durationTime);
  }
}

/**
 * 消息提示（模态框）
 * @param type 类型 - success、error、info、warning、confirm
 * @param title 标题
 * @param msg 消息
 */
export function antModal(type, title, msg, ok) {
  let ope = type;
  if (!Modal[ope]) {
    ope = "info";
  }
  const modal = Modal[ope]({
    title: title,
    content: `${msg}！`,
    onOk: ok
  });
  return modal;
}

/**
 *消息提示(通知提醒框)
 * @param type 类型 - success、error、info、warning
 * @param title 标题
 * @param msg 消息
 * @param clickHandle 点击回调
 */
export function antNotification(type, title, msg, clickHandle) {
  let icon = {
    class:
      type == "info"
        ? "info"
        : type == "success"
        ? "check-"
        : type == "error"
        ? "close"
        : type == "warning"
        ? "exclamation"
        : "info",
    color:
      type == "info"
        ? "#1890ff"
        : type == "success"
        ? "#52c41a"
        : type == "error"
        ? "#f5222d"
        : type == "warning"
        ? "#faad14"
        : "#1890ff"
  };
  Notification.open({
    message: title,
    description: `${msg}`,
    icon: h => {
      return h("a-icon", {
        style: {
          color: `${icon.color}`
        },
        props: {
          type: `${icon.class}-circle-o`,
          size: "small"
        }
      });
    },
    onClick: clickHandle
  });
}
