const path = require("path");
const webpack = require("webpack");
// webpack压缩插件，此插件打包时会引起vue-svg-loader报错
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
    "ant-design-vue": "AntDesignVue",
    vue: "Vue",
    "vue-router": "VueRouter",
    vuex: "Vuex",
    axios: "axios",
    MapToImg: "MapToImg"
  },
  // cdn的css链接
  css: [],
  // cdn的js链接
  js: [
    "https://cdn.jsdelivr.net/npm/echarts@4/dist/echarts.min.js?_v_=1609266909542",
    "https://cdn.bootcss.com/vue/2.6.10/vue.min.js",
    "https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js",
    "https://cdn.bootcss.com/vue-router/3.0.7/vue-router.min.js",
    "https://cdn.bootcss.com/axios/0.18.0/axios.min.js"
  ]
};

const CompressionWebpackPlugin = require("compression-webpack-plugin");
// const timeStamp = new Date().getTime();
module.exports = {
  // 基础路径
  publicPath: "./",
  // 输出目录
  outputDir: "dist",
  // 资源目录
  assetsDir: "static",
  productionSourceMap: false,
  // webpack 配置
  chainWebpack: config => {
    // 目录命名
    config.resolve.alias
      .set("@$", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("utils", resolve("src/utils"));

    config.plugin("html").tap(args => {
      // 生产环境或者本地需要cdn时，才注入cdn
      if (isProduction || devNeedCdn) args[0].cdn = cdn;
      return args;
    });

    // config.module
    //   .rule("@ant-design/icons")
    //   .include.add(require.resolve("@ant-design/icons/lib/dist"))
    //   .end()
    //   .use("ant-icon")
    //   .loader("webpack-ant-icon-loader");
  },
  configureWebpack: config => {
    // moment压缩
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

    // 用cdn方式引入，则构建时要忽略相关资源
    if (isProduction || devNeedCdn) config.externals = cdn.externals;

    if (isProduction) {
      // 代码压缩
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            //生产环境自动删除console
            compress: {
              drop_debugger: true,
              drop_console: true,
              pure_funcs: ["console.log"]
            }
          },
          sourceMap: false,
          parallel: true
        })
      );
      //gzip压缩
      const productionGzipExtensions = ["html", "js", "css"];
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        })
      );
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/assets/css/common.scss";`
      },

      less: {
        // antd自定义主题
        modifyVars: {
          "@primary-color": "#00b3aa",
          "@body-background": "#eaeaea",
          // 按钮
          "@btn-default-bg": "#ffffff",
          // 导航菜单
          "@menu-inline-toplevel-item-height": "50px",
          "@menu-item-height": "50px",
          "@menu-bg": "#00474b",
          "@menu-popup-bg": "#00474b",
          "@menu-item-color": "#ffffff",
          "@menu-item-active-bg": "#00b3aa",
          "@menu-item-active-border-width": "0px",
          "@menu-item-group-title-color": "#ffffff",
          // 表单
          "@form-item-margin-bottom": "19px",
          // 输入框
          "@input-addon-bg": "#e8e8e8",
          // 折叠面板
          "@collapse-header-bg": "#f6f6f6"
          //弹窗头部
          // "@modal-header-bg": "#00bfe8",
          // "@modal-heading-color": "#ffffff"
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
    port: 8892,
    // 代理
    proxy: {
      "/dlaqyjfkapi": {
        // 本地测试
        target: "http://183.230.162.215:9527",
        // 外网测试环境
        // target: "http://183.230.162.215:8200",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          // 本地测试
          "^/dlaqyjfkapi": "/"
        }
      }
    }
  },
  lintOnSave: false
};
