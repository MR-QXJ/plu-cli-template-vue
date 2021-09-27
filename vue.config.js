const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

// 是否为生产环境
const isProduction = process.env.NODE_ENV !== "development";
// 本地环境是否需要使用cdn
const devNeedCdn = true;

function resolve(dir) {
  return path.join(__dirname, dir);
}
// cdn链接
const cdn = {
  externals: {
    echarts: "echarts",
    vue: "Vue",
    "vue-router": "VueRouter",
    vuex: "Vuex",
    axios: "axios"
  },
  // cdn的css链接
  css: [],
  // cdn的js链接
  js: [
    "https://cdn.bootcss.com/vue/2.6.10/vue.min.js",
    "https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js",
    "https://cdn.bootcss.com/vue-router/3.0.7/vue-router.min.js",
    "https://cdn.bootcss.com/axios/0.18.0/axios.min.js"
  ]
};

module.exports = {
  // 基础路径
  publicPath: "./",
  // 输出目录
  outputDir: process.env.outputDir || "dist",
  // 资源目录
  assetsDir: "static",
  // webpack 配置
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("network", resolve("src/network"))
      .set("request", resolve("src/network/request"))
      .set("components", resolve("src/components"))
      .set("utils", resolve("src/utils"));

    config.plugin("html").tap(args => {
      // 生产环境或者本地需要cdn时，才注入cdn
      if (isProduction || devNeedCdn) args[0].cdn = cdn;
      return args;
    });
  },
  configureWebpack: config => {
    // 用cdn方式引入，则构建时要忽略相关资源
    if (isProduction || devNeedCdn) config.externals = cdn.externals;

    if (isProduction) {
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
            drop_console: true, //console
            drop_debugger: false
            // pure_funcs: ['console.log']//移除consol
          },
          sourceMap: true,
          parallel: true
        })
      );
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/css/common.scss";`
      },
      less: {
        // vant自定义主题
        modifyVars: {
          // "checkbox-checked-icon-color": "#00ccd1",
          // "checkbox-label-color": "#00a2a6",
          // "checkbox-border-color": "#00ccd1",
          "button-primary-background-color": "#00ccd1"
        },
        javascriptEnabled: true
      }
    }
  },
  // webpack-dev-server 配置
  devServer: {
    // 自动启动浏览器
    open: true,
    // 端口号
    port: 8080,
    // 代理
    proxy: {
      "/api": {
        // 本地测试
        target: "http://192.168.16.131:8898/zhxfgxpnapi",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          // 本地测试
          "^/api": "/"
        }
      }
    }
  }
};
