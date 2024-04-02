import { Compiler, DefinePlugin } from 'webpack';
import fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

const canAddLoader = (moduleResource: string) => {
  const url = new URL(moduleResource, 'file://');
  const query = Object.fromEntries(url.searchParams.entries());
  return url.pathname.endsWith('.vue') && query.type === 'template' && !query.raw;
};

const __VUE_INSPECTOR_OPTIONS__ = JSON.stringify({
  cwd: process.cwd().replace(/\\/g, '/'),
  modifierKey: 'ctrl|meta',
  dataKey: 'data-v-pos',
});

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

    // 在emit阶段插入ui js文件
    compiler.hooks.emit.tapPromise('GenerateScriptPlugin', async (compilation) => {
      const jsContent = fs.readFileSync(path.join(__dirname, './vue-position-ui.js')).toString();

      const processEnv = {
        ...process.env,
        __VUE_INSPECTOR_OPTIONS__,
      };

      const replacedJsContent = jsContent.replace(/\bprocess\.env\.(\w+)\b/g, (match, p1) =>
        processEnv[p1] ? "'" + `${processEnv[p1]}` + "'" : match,
      );

      compilation.assets['js/vue-position-ui.js'] = {
        source: () => replacedJsContent,
        size: () => replacedJsContent.length,
        map: () => null,
        sourceAndMap: () => ({ source: replacedJsContent, map: {} }),
        updateHash: () => null,
        buffer: () => Buffer.from(replacedJsContent),
      };
    });

    // 使用html-webpack-plugin插入<script>标签
    compiler.hooks.compilation.tap('InsertScriptPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapPromise(
        'InsertScriptPlugin',
        async (data) => {
          data.headTags.push({
            tagName: 'script',
            voidTag: false,
            attributes: { defer: true, src: '/js/vue-position-ui.js' },
            meta: {
              plugin: undefined,
            },
          });
          return data;
        },
      );
    });
  }
}

export default VuePositionPlugin;
