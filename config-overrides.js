const {
  override,
  fixBabelImports,
  addWebpackExternals,
  addWebpackAlias,
  addLessLoader,
  setWebpackPublicPath,
  watchAll,
  overrideDevServer,
} = require("customize-cra");
const path = require("path");
const packageName = require("./package.json");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const myPlugin = [
  new UglifyJsPlugin({
    uglifyOptions: {
      warnings: false,
      compress: {
        drop_debugger: true,
        drop_console: true,
      },
    },
  }),
];
module.exports = {
  webpack: override(
    fixBabelImports("import", {
      //配置按需加载
      libraryName: "antd",
      libraryDirectory: "es",
      style: true,
    }),
    // setWebpackPublicPath({
    //   library: `${packageName}-[name]`,
    //   libraryTarget: "umd",
    //   globalObject: "window",
    // }),
    addWebpackExternals({
      //不做打包处理配置，如直接以cdn引⼊的
      echarts: "window.echarts",
      // highcharts:"window.highcharts"
    }),
    addWebpackAlias({
      //路径别名
      "@": path.resolve(__dirname, "src"),
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: {
        "@primary-color": "#1DA57A",
      },
    }),

    (config) => {
      //暴露webpack的配置 config ,evn
      // 去掉打包⽣产map ⽂件
      // config.devtool = config.mode === 'development' ? 'cheap-module-source-map' : false;
      if (process.env.NODE_ENV === "production") config.devtool = false;
      if (process.env.NODE_ENV !== "development")
        config.plugins = [...config.plugins, ...myPlugin];

      config.output.library = `${packageName}-[name]`;
      config.output.libraryTarget = "umd";
      // config.output.jsonpFunction = `webpackJsonp_${packageName}`;
      config.output.publicPath = "http://localhost:9001/";
      config.output.globalObject = "window";
      //1.修改、添加loader 配置 :
      // 所有的loaders规则是在config.module.rules(数组)的第⼆项
      // 即：config.module.rules[2].oneof  (如果不是，具体可以打印⼀下是第⼏项⽬)
      // 修改 sass 配置，规则 loader 在第五项(具体看配置)
      const loaders = config.module.rules.find((rule) =>
        Array.isArray(rule.oneOf)
      ).oneOf;
      loaders[5].use.push({
        loader: "sass-resources-loader",
        options: {
          resources: path.resolve(__dirname, "src/asset/base.scss"), //全局引⼊公共的scss ⽂件
        },
      });
      return config;
    }
  ),
  devServer: overrideDevServer((config) => {
    config.headers = config.headers || {};
    config.headers["Access-Control-Allow-Origin"] = "*";
    config.historyApiFallback = true;
    config.hot = false;
    // config.watchContentBase = false;
    config.liveReload = false;
    return config;
  }, watchAll()),
  configureWebpack: {
    output: {
      library: `${packageName}-[name]`,
      libraryTarget: "umd",
      globalObject: "window",
    },
  },
};
