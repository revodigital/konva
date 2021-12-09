/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: Solarize-test.ts
 * Project: pamela
 * Committed last: 2021/12/5 @ 141
 * ---
 * Description:
 */

import { assert } from 'chai';

import { addStage, Konva, loadImage } from '../unit/test-utils';

describe('Solarize', function () {
  // ======================================================
  it('solarize', function (done) {
    var stage = addStage();

    loadImage('darth-vader.jpg', (imageObj) => {
      var layer = new Konva.Layer();
      const darth = new Konva.Image({
        x: 10,
        y: 10,
        image: imageObj,
        draggable: true,
      });

      layer.add(darth);
      stage.add(layer);
      darth.cache();
      darth.filters([Konva.Filters.Solarize]);

      layer.draw();

      done();
    });
    //imageObj.src = 'assets/lion.png';
  });
});
