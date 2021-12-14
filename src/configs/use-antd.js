// ant-design-vue配置
import {
  Layout,
  Col,
  Row,
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
  Progress,
  Carousel,
  Empty
];

export default {
  install(Vue) {
    components.forEach(com => Vue.use(com));
  }
};
