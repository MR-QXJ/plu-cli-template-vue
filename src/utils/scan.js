export const scan = {
  data() {
    return {
      scanCode: "",
      webViewOptions: {
        titleNView: {
          autoBackButton: true,
          backgroundColor: "#1b2b42",
          titleColor: "#ffffff",
          titleText: ""
        },
        scrollIndicator: "none",
        scalable: false,
        backButtonAutoControl: "close"
      }
    };
  },
  mounted() {
    const _this = this;
    window.scaned = function(type, result) {
      // 扫一扫完成
      _this.scanFinished(result);
    };
  },
  methods: {
    createWebView(url, options) {
      if (!window.plus) {
        return null;
      }
      // eslint-disable-next-line no-undef
      const webview = plus.webview.create(url, url, options);
      return webview;
    },
    scanBegin() {
      if (!window.plus) {
        return;
      }
      const url = `http://183.66.64.51:37788/`;
      const options = JSON.parse(JSON.stringify(this.webViewOptions));
      options.titleNView.titleText = "扫描二维码";
      const webview = this.createWebView(url, options);
      webview.show("none");
    }
    // 扫一扫完成
    // scanFinished(qrcodeCode) {
    //   alert(qrcodeCode);
    //   this.scanCode = qrcodeCode;
    // }
  }
};
