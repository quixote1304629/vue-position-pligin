import MagicString from 'magic-string';
import { parse, transform } from '@vue/compiler-dom';

const EXCLUDED_TAG = ['script', 'style', 'template'];
const DATA_KEY = 'data-v-pos';

function VuePositionLoader(this: any, source: string) {
  const resourcePath = this.resourcePath;

  // console.log("origincode:", JSON.stringify(source));
  // console.log(
  //   "resourcePath:",
  //   JSON.stringify(this.resourcePath),
  //   JSON.stringify(this.query)
  // );

  const s = new MagicString(source);

  const ast = parse(source, {
    comments: true,
  });

  transform(ast, {
    nodeTransforms: [
      (node) => {
        if (
          node.type === 1 &&
          (node.tagType === 0 || node.tagType === 1) &&
          !EXCLUDED_TAG.includes(node.tag)
        ) {
          if (node.loc.source.includes(DATA_KEY)) return;

          const position = node.loc.start.offset + node.tag.length + 1;
          const { line, column } = node.loc.start;

          s.prependLeft(position, ` ${DATA_KEY}="${resourcePath}:${line}:${column}"`);
        }
      },
    ],
  });

  return s.toString();
}

export default VuePositionLoader;
