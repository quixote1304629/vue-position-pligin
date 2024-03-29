const path = require('path');

const { defineConfig } = require('@vue/cli-service');
// const VueInspectorPlugin = require("vue-inspector-plugin/webpack").default;
const VuePositionPlugin = require(path.resolve(__dirname, '../../dist/index.js')).default;

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'development') {
      // config.plugin("vue-inspector-plugin").use(VueInspectorPlugin());
      config.plugin('vue-inspector-plugin').use(new VuePositionPlugin());
    }
  },
});
