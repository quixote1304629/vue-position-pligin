"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const canAddLoader = (moduleResource) => {
    const url = new URL(moduleResource, 'file://');
    const query = Object.fromEntries(url.searchParams.entries());
    return url.pathname.endsWith('.vue') && query.type === 'template' && !query.raw;
};
class VuePositionPlugin {
    apply(compiler) {
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
        compiler.hooks.emit.tapAsync('GenerateScriptPlugin', (compilation, callback) => {
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
        compiler.hooks.compilation.tap('InsertScriptPlugin', (compilation) => {
            html_webpack_plugin_1.default.getHooks(compilation).alterAssetTagGroups.tapAsync('InsertScriptPlugin', (data, callback) => {
                data.headTags.push({
                    tagName: 'script',
                    voidTag: false,
                    attributes: { defer: true, type: 'text/javascript', src: '/js/xxx.js' },
                    meta: {
                        plugin: undefined,
                    },
                });
                callback(null, data);
            });
        });
    }
}
exports.default = VuePositionPlugin;
