// element-ui配置
// import "element-ui/lib/theme-chalk/index.css";
// // elementUI组件响应式布局隐藏元素使用
// import "element-ui/lib/theme-chalk/display.css";
import { Input, Button, Row, Col } from "element-ui";
// import lang from 'element-ui/lib/locale/lang/en'
// import locale from 'element-ui/lib/locale'

// 设置语言
// locale.use(lang)

const components = [Input, Button, Row, Col];

export default {
  install(Vue) {
    components.forEach(com => Vue.use(com));
  }
};
