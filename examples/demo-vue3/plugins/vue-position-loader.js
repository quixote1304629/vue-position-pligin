"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const magic_string_1 = __importDefault(require("magic-string"));
const compiler_dom_1 = require("@vue/compiler-dom");
const EXCLUDED_TAG = ['script', 'style', 'template'];
const DATA_KEY = 'data-v-pos';
function VuePositionLoader(source) {
    const resourcePath = this.resourcePath;
    const s = new magic_string_1.default(source);
    const ast = (0, compiler_dom_1.parse)(source, {
        comments: true,
    });
    (0, compiler_dom_1.transform)(ast, {
        nodeTransforms: [
            (node) => {
                if (node.type === 1 &&
                    (node.tagType === 0 || node.tagType === 1) &&
                    !EXCLUDED_TAG.includes(node.tag)) {
                    if (node.loc.source.includes(DATA_KEY))
                        return;
                    const position = node.loc.start.offset + node.tag.length + 1;
                    const { line, column } = node.loc.start;
                    s.prependLeft(position, ` ${DATA_KEY}="${resourcePath}:${line}:${column}"`);
                }
            },
        ],
    });
    return s.toString();
}
exports.default = VuePositionLoader;
