// ant-design-vue配置
import {
  Layout,
  Col,
  Row,
  Input,
  Spin,
  Menu,
  LocaleProvider,
  message,
  Button,
  Icon,
  Notification,
  Modal,
  Progress,
  Carousel,
  Empty
} from "ant-design-vue";

const components = [
  Layout,
  Menu,
  Spin,
  Col,
  Row,
  Input,
  LocaleProvider,
  Button,
  Icon,
  Notification,
  Modal,
  Progress,
  Carousel,
  Empty
];

export default {
  install(Vue) {
    components.forEach(com => Vue.use(com));
    //特定的几个组件不放入components，挂载到实例
    Vue.prototype.$message = message;
    Vue.prototype.$modal = Modal;
    Vue.prototype.$notification = Notification;
  }
};
