const path = require('path');

const { defineConfig } = require('@vue/cli-service');
const VuePositionPlugin = require('./position-plugin/index.js').default;

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [],
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'development') {
      config.plugin('vue-position-plugin').use(new VuePositionPlugin());
    }
  },
});
