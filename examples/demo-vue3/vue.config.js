const path = require('path');

const { defineConfig } = require('@vue/cli-service');
// const VueInspectorPlugin = require('vue-inspector-plugin/webpack').default;
const VuePositionPlugin = require('./plugins/index.js').default;

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new VuePositionPlugin()],
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'development') {
      // config.plugin('vue-inspector-plugin').use(VueInspectorPlugin());
      // config.plugin('vue-position-plugin').use(new VuePositionPlugin());
    }
  },
});
