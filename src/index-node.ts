// main entry for umd build for rollup
import { Pamela }  from './_FullInternals';
import * as Canvas from 'canvas';

const canvas = Canvas['default'] || Canvas;

const isNode = typeof global.document === 'undefined';

if (isNode) {
  Pamela.Util['createCanvasElement'] = () => {
    const node = canvas.createCanvas(300, 300) as any;
    if (!node['style']) {
      node['style'] = {};
    }
    return node;
  };

  // create image in Node env
  Pamela.Util.createImageElement = () => {
    const node = new canvas.Image() as any;
    return node;
  };
}

export default Pamela;
