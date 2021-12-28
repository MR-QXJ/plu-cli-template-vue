// ant-design-vue配置
import {
  ConfigProvider,
  Layout,
  Col,
  Row,
  Form,
  Drawer,
  Input,
  Spin,
  Menu,
  LocaleProvider,
  Button,
  Icon,
  Progress,
  Carousel,
  Empty
} from "ant-design-vue";

//需要use的组件
const components = [
  ConfigProvider,
  Layout,
  Form,
  Drawer,
  Menu,
  Spin,
  Col,
  Row,
  Input,
  LocaleProvider,
  Button,
  Icon,
  Progress,
  Carousel,
  Empty
];

export default {
  install(Vue) {
    components.forEach(com => Vue.use(com));
  }
};
