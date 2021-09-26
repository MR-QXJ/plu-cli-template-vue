const path = require("path");
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // 基础路径
  publicPath: "./",
  // 输出目录
  outputDir: process.env.outputDir,
  // 资源目录
  // assetsDir: "static",
  // webpack 配置
  chainWebpack: config => {
    config.resolve.alias
      .set("@$", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("modules", resolve("src/modules"))
      .set("utils", resolve("src/utils"));
  },
  configureWebpack: config => {
    config.externals = {
      CoordTransform: "CoordTransform",
      echarts: "echarts"
    };
    if (process.env.NODE_ENV === "production") {
      // config.plugins.push(
      //   new UglifyJsPlugin({
      //     uglifyOptions: {
      //       warnings: false,
      //       drop_console: true, //console
      //       drop_debugger: false
      //       // pure_funcs: ['console.log']//移除consol
      //     },
      //     sourceMap: true,
      //     parallel: true
      //   })
      // );
    }
  },
  css: {
    loaderOptions: {
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
      // "/guideapp/attachments": {
      //   // "/guideapp": {
      //   target: "http://192.168.16.159:8200",
      //   ws: false,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/guideapp/attachments": "/attachments"
      //     // "^/guideapp": "/"
      //   }
      // },
      // "/guideapp/guide-common": {
      //   // "/guideapp": {
      //   target: "http://192.168.16.159:8200",
      //   ws: false,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/guideapp/guide-common": "/guide-common"
      //     // "^/guideapp": "/"
      //   }
      // },
      // "/guideapp/guide-patrol-app": {
      //   // 本地测试
      //   target: "http://192.168.16.9:8080",
      //   ws: false,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/guideapp/guide-patrol-app": "/"
      //   }
      // }
      "/zhxfgxpnapi": {
        // 本地测试
        target: "http://192.168.16.131:8898/zhxfgxpnapi",
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          "^/zhxfgxpnapi": ""
        }
      }
    }
  }
};
