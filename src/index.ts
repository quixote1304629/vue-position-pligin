import { Compiler } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const canAddLoader = (moduleResource: string) => {
  const url = new URL(moduleResource, 'file://');
  const query = Object.fromEntries(url.searchParams.entries());
  return url.pathname.endsWith('.vue') && query.type === 'template' && !query.raw;
};

class VuePositionPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap('VuePositionPlugin', (compilation) => {
      compilation.hooks.normalModuleLoader.tap('VuePositionPlugin', (loaderContext, module) => {
        if (canAddLoader(module.resource)) {
          module.loaders.push({
            loader: require.resolve('./vue-position-loader.js'),
            options: undefined,
            ident: null,
            type: null,
          });
        }
      });
    });

    // 在emit阶段插入xxx.js文件
    compiler.hooks.emit.tapAsync('PositionScriptPlugin', (compilation, callback) => {
      const myJsContent = 'console.log("Hello from xxx.js!");'; // 你的JS文件内容
      compilation.assets['js/xxx.js'] = {
        source: () => myJsContent,
        size: () => myJsContent.length,
        map: () => null,
        sourceAndMap: () => ({ source: myJsContent, map: {} }),
        updateHash: () => null,
        buffer: () => Buffer.from(myJsContent),
      };
      callback();
    });

    // 使用html-webpack-plugin插入<script>标签
    compiler.hooks.compilation.tap('PositionScriptPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        'PositionScriptPlugin',
        (data, callback) => {
          data.headTags.push({
            tagName: 'script',
            voidTag: false,
            attributes: { defer: true, src: '/js/xxx.js' },
            meta: {},
          });
          callback(null, data);
        },
      );
    });
  }
}

export default VuePositionPlugin;
