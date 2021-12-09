/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: Filter-test.ts
 * Project: pamela
 * Committed last: 2021/12/5 @ 141
 * ---
 * Description:
 */

import { addStage, Konva, cloneAndCompareLayer } from '../unit/test-utils';

describe('Filter', function () {
  it('pixelRaio check', function () {
    Konva.pixelRatio = 2;
    var stage = addStage();
    var layer = new Konva.Layer();

    var circle = new Konva.Circle({
      x: stage.width() / 2,
      y: stage.height() / 2,
      fill: 'red',
      stroke: 'green',
      radius: 15,
    });

    layer.add(circle);
    stage.add(layer);
    circle.cache();
    circle.filters([Konva.Filters.Blur]);
    circle.blurRadius(0);
    layer.draw();

    cloneAndCompareLayer(layer, 150);
    Konva.pixelRatio = 1;
  });
});
