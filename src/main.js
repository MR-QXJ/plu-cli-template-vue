/*
 * 入口js
 */

import "@babel/polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 注册ant-design-vue
import { Empty } from "ant-design-vue";
import initAntd from "@/utils/use-antd";
Vue.use(initAntd);

// 全局注册组件
// import globalComponents from "@/components/global/index.js";
// Vue.use(globalComponents);
import { durationMsg, storageNameUser } from "@/utils/global";
import {
  GUID,
  strToTimestamp,
  dataIsNullStr,
  dataIsNullNumber,
  dataIsNullObj,
  outputmoney
} from "@/utils/tool";

//城市联动数据
// import cityOptions from "@/utils/city.json";

Vue.config.productionTip = false;

import "moment/locale/zh-cn";

// 自定义指令-更改标题
Vue.directive("title", {
  inserted: function(el, binding) {
    document.title = binding.value;
  }
});
Vue.directive("money", {
  inserted: function(el, binding) {
    el.innerHTML = outputmoney(binding.value);
  },
  update: function(el, binding) {
    el.innerHTML = outputmoney(binding.value);
  }
});
//拖拽
Vue.directive("move", {
  inserted: function(a) {
    // 鼠标按下事件
    a.onmousedown = function(e) {
      var disX = e.clientX - a.offsetLeft;
      var disY = e.clientY - a.offsetTop;

      if (a.setCapture) {
        a.setCapture();
      }
      // 鼠标移动事件-----给文档流绑定移动事件
      document.onmousemove = function(e) {
        e.preventDefault();
        var L = e.clientX - disX;
        var T = e.clientY - disY;

        L = Math.min(
          Math.max(L, 0),
          document.documentElement.clientWidth - a.offsetWidth
        );
        T = Math.min(
          Math.max(T, 0),
          document.documentElement.clientHeight - a.offsetHeight
        );

        a.style.left = L + "px";
        a.style.top = T + "px";
      };
      // 鼠标离开事件
      document.onmouseup = function() {
        document.onmousemove = document.onmousedown = null;
        if (a.releaseCapture) {
          a.releaseCapture(); // 拖动后在解除事件锁定
        }
      };
    };
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (to.query._navMenuKey) {
      store.dispatch("setNavMenuKey", to.query._navMenuKey);
    }

    // this route requires auth, check if logged in
    // if not, redirect to login page.
    const user = JSON.parse(
      window.sessionStorage.getItem(storageNameUser) || "{}"
    );

    const token = user.token || "";
    if (token === "") {
      next({
        path: "/"
        // query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    // make sure to always call next()!
    next();
  }
});

new Vue({
  data() {
    return {
      // cityOptions,
      // 表格操作列的宽度，权限不同，宽度自适应
      actionWidth: "auto",
      // 暂无数据图片
      PRESENTED_IMAGE_SIMPLE: Empty.PRESENTED_IMAGE_SIMPLE
    };
  },
  methods: {
    /*
     * 显示消息提示
     * @param type 类型
     * @param msg 消息
     * @param duration 消失时间
     */
    showMessage: function(type, msg, duration, key) {
      const durationTime = duration !== undefined ? duration : durationMsg;
      if (key) {
        this.$message[type]({ content: `${msg}！`, key, durationTime });
      } else {
        this.$message[type](`${msg}！`, durationTime);
      }
    },

    /*
     * 显示消息提示（模态框）
     * @param type 类型
     * @param title 标题
     * @param msg 消息
     */
    showMessageModal: function(type, title, msg, ok) {
      // let modal = null;
      let ope = type;
      if (!this.$modal[type]) {
        ope = "info";
      }
      const modal = this.$modal[ope]({
        title: title,
        content: `${msg}！`,
        onOk: ok
      });
      // switch (type) {
      //   case "info":
      //     modal = this.$modal.info({
      //       title: title,
      //       content: `${msg}！`,
      //       onOk: ok
      //     });
      //     break;
      //   case "warning":
      //     modal = this.$modal.warning({
      //       title: title,
      //       content: `${msg}！`,
      //       onOk: ok
      //     });
      //     break;
      //   case "success":
      //     modal = this.$modal.success({
      //       title: title,
      //       content: `${msg}！`,
      //       onOk: ok
      //     });
      //     break;
      //   case "error":
      //     modal = this.$modal.error({
      //       title: title,
      //       content: `${msg}！`,
      //       onOk: ok
      //     });
      //     break;
      //   default:
      //     modal = this.$modal.info({
      //       title: title,
      //       content: `${msg}！`,
      //       onOk: ok
      //     });
      //     break;
      // }
      return modal;
    },
    /*
     * 过滤下拉框
     * @param input 输入
     * @param option 选项
     */
    selectFilter: function(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    showNotification: function(type, title, msg, clickHandle) {
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
      this.$notification.open({
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
    },
    /*
     * 下拉框打开时美化选项滚动条
     * @param input 输入
     * @param option 选项
     */
    dropdownVisibleDiyScrollBar: function(open) {
      if (!open) {
        return;
      }
      // setTimeout(() => {
      //   this.diyScrollBar();
      // }, 100);
    },
    /*
     * 美化滚动条
     * @param
     */
    diyScrollBar: function() {
      const selectMenus = document.getElementsByClassName(
        "ant-select-dropdown-menu"
      );
      const maxI = selectMenus.length;
      let i = 0;
      for (i = 0; i < maxI; i++) {
        if (selectMenus[i]) {
          if (selectMenus[i].parentNode) {
            selectMenus[i].parentNode.style.overflow = "hidden";
          }
          const id = selectMenus[i].getAttribute("id");
          if (!id) {
            let guid = GUID();
            guid = guid.replace(/-/g, "");
            selectMenus[i].setAttribute("id", guid);
            const container = document.getElementById(guid);
            if (container) {
              // eslint-disable-next-line
              const pScrollBar = new PerfectScrollbar(container);
              pScrollBar.update();
            }
          }
        }
      }
      const tableBodys = document.getElementsByClassName("ant-table-body");
      const maxJ = tableBodys.length;
      let j = 0;
      for (j = 0; j < maxJ; j++) {
        if (tableBodys[j]) {
          if (tableBodys[j].parentNode) {
            tableBodys[j].parentNode.style.overflow = "hidden";
          }
          const id = tableBodys[j].getAttribute("id");
          if (!id) {
            let guid = GUID();
            guid = guid.replace(/-/g, "");
            tableBodys[j].setAttribute("id", guid);
            tableBodys[j].style.position = "relative";
            const container = document.getElementById(guid);
            if (container) {
              // eslint-disable-next-line
              const pScrollBar = new PerfectScrollbar(container);
              pScrollBar.update();
            }
          }
        }
      }
    },
    /*
     * 表格列内容最大宽度
     * @param maxWidth 最大宽度
     * @param isLoading 是否加载列
     * @param jianWidth 减去其他内容的宽度
     */
    tableColumnMaxWidth: function(maxWidth, isLoading = false, jianWidth = 0) {
      const style =
        dataIsNullNumber(maxWidth) !== -1
          ? {
              display: isLoading ? "inline-block" : "block",
              height: "19px",
              lineHeight: "19px",
              transform: jianWidth > 0 ? "translate(0, 4px)" : "",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxWidth: `${dataIsNullNumber(maxWidth) - 32 - jianWidth}px`
            }
          : undefined;
      return style;
    },
    // 计算表格操作列宽度
    computeActionWidth() {
      let tableaction = document.getElementsByClassName("tableaction");

      this.actionWidth =
        Array.from(tableaction).reduce(
          (total, curr) =>
            total > curr.offsetWidth ? total : curr.offsetWidth,
          0
        ) + (Array.from(tableaction).length ? 35 : 60);
    },
    /*
     * 字符排序
     * @param a 第一个值
     * @param b 第二个值
     * @param key 属性名
     */
    sortStr: function(a, b, key) {
      const paramA = (a[key] || "").toUpperCase();
      const paramB = (b[key] || "").toUpperCase();
      return paramB.localeCompare(paramA) > 1 ? 1 : -1;
    },
    /*
     * 数字排序
     * @param a 第一个值
     * @param b 第二个值
     * @param key 属性名
     */
    sortNumber: function(a, b, key) {
      const paramA = a[key] || 0;
      const paramB = b[key] || 0;
      return paramA < paramB ? -1 : paramA > paramB ? 1 : 0;
    },
    /*
     * 时间排序
     * @param a 第一个值
     * @param b 第二个值
     * @param key 属性名
     */
    sortTime: function(a, b, key) {
      const paramA = strToTimestamp(a[key]);
      const paramB = strToTimestamp(b[key]);
      return paramA < paramB ? -1 : paramA > paramB ? 1 : 0;
    },
    /*
     * ip地址排序
     * @param a 第一个值
     * @param b 第二个值
     * @param key 属性名
     */
    sortIp: function(a, b, key) {
      let paramA = a[key] || "";
      let paramB = b[key] || "";
      paramA = paramA.replace(/(\\d+)/g, "00$1");
      paramB = paramB.replace(/(\\d+)/g, "00$1");
      paramA = paramA.replace(/0*(\\d{3})/g, "$1");
      paramB = paramB.replace(/0*(\\d{3})/g, "$1");
      paramA = paramA.replace(/\./g, "");
      paramB = paramB.replace(/\./g, "");
      return paramA < paramB ? -1 : paramA > paramB ? 1 : 0;
    },
    /*
     * 无权限按钮样式
     * @param funcs 功能权限
     * @param checkFun 校验功能权限
     */
    noPermissionStyle: function(funcs, checkFun) {
      const currFun = dataIsNullObj(checkFun);
      if (dataIsNullStr(currFun.sysFunCode) === "") {
        return {};
      }
      let isHave = false;
      funcs.map(fun => {
        if (
          dataIsNullStr(fun.sysFunCode) === dataIsNullStr(currFun.sysFunCode)
        ) {
          isHave = dataIsNullNumber(fun.isPermission, 0) === 1;
        }
      });
      return isHave
        ? {}
        : {
            color: "#999999"
          };
    },
    /*
     * 校验功能权限
     * @param obj 返回的权限
     * @param currFun 筛选的当前菜单的所有权限
     */
    // checkFunPermission: function(data, tag) {
    //   let obj = {},
    //     currFun = sysFunCodeGather[`${tag}`];
    //   data.map(item => {
    //     currFun.map(curr => {
    //       if (item.sysFunCode == curr.code) {
    //         obj[`${curr.name}`] = item.isPermission ? true : false;
    //       }
    //     });
    //   });
    //   return obj;
    // },
    //级联框搜索
    cascaderFilter: function(inputValue, path) {
      return path.some(
        option =>
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      );
    },
    //金额格式化，带逗号
    formatMoney: function(value) {
      return outputmoney(value);
    }
  },
  router,
  store,
  render: h => h(App)
}).$mount("#app");
