/*
 * Copyright (c) 2021-2022. Revo Digital
 * ---
 * Author: gabriele
 * File: index-node.ts
 * Project: pamela
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

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
