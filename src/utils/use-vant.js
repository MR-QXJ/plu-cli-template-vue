// vant配置
// 引入全部样式
import "vant/lib/index.less";
import { Button, Icon, Lazyload, NavBar, Uploader, Image } from "vant";

const components = [Button, Icon, Lazyload, NavBar, Uploader, Image];

export default {
  install(Vue) {
    components.forEach(com => Vue.use(com));
  }
};
