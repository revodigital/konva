/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: Invert-test.ts
 * Project: pamela
 * Committed last: 2021/12/5 @ 141
 * ---
 * Description:
 */

import { assert } from 'chai';

import { addStage, Konva, loadImage } from '../unit/test-utils';

describe('Invert', function () {
  // ======================================================
  it('basic', function (done) {
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
      darth.filters([Konva.Filters.Invert]);
      layer.draw();

      done();
    });
  });

  // ======================================================
  it('crop', function (done) {
    var stage = addStage();

    loadImage('darth-vader.jpg', (imageObj) => {
      var layer = new Konva.Layer();
      const darth = new Konva.Image({
        x: 10,
        y: 10,
        image: imageObj,
        crop: { x: 128, y: 48, width: 256, height: 128 },
        draggable: true,
      });

      layer.add(darth);
      stage.add(layer);

      darth.cache();
      darth.filters([Konva.Filters.Invert]);
      layer.draw();

      done();
    });
  });

  // ======================================================
  it('transparancy', function (done) {
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
      darth.filters([Konva.Filters.Invert]);
      layer.draw();

      done();
    });
  });
});
