module.exports = {
  presets: [
    [
      "@vue/app",
      {
        polyfills: ["es6.promise", "es6.symbol"],
        useBuiltIns: "entry"
      }
    ],
    [
      "@babel/env",
      {
        modules: false
      }
    ]
  ],
  plugins: [
    // "@babel/plugin-transform-runtime",
    [
      "import",
      {
        libraryName: "ant-design-vue",
        libraryDirectory: "es",
        style: true
      }
    ]
  ]
};
