/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: Wedge-test.ts
 * Project: pamela
 * Committed last: 2021/12/5 @ 141
 * ---
 * Description:
 */

import { assert } from 'chai';

import { addStage, Konva } from './test-utils';

describe('Wedge', function () {
  // ======================================================
  it('add wedge', function () {
    var stage = addStage();
    var layer = new Konva.Layer();
    var wedge = new Konva.Wedge({
      x: 100,
      y: 100,
      radius: 70,
      angle: 180 * 0.4,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
      name: 'myCircle',
      draggable: true,
    });

    layer.add(wedge);
    stage.add(layer);

    assert.equal(wedge.getClassName(), 'Wedge');

    var trace = layer.getContext().getTrace();
    //console.log(trace);
    assert.equal(
      trace,
      'clearRect(0,0,578,200);save();transform(1,0,0,1,100,100);beginPath();arc(0,0,70,0,1.257,false);lineTo(0,0);closePath();fillStyle=green;fill();lineWidth=4;strokeStyle=black;stroke();restore();'
    );
  });

  it('attrs sync', function () {
    var stage = addStage();
    var layer = new Konva.Layer();
    var wedge = new Konva.Wedge({
      x: stage.width() / 2,
      y: stage.height() / 2,
      angle: 180 * 0.4,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
    });

    layer.add(wedge);
    stage.add(layer);

    assert.equal(wedge.getWidth(), 140);
    assert.equal(wedge.getHeight(), 140);

    wedge.setWidth(100);
    assert.equal(wedge.radius(), 50);
    assert.equal(wedge.getHeight(), 100);

    wedge.setHeight(120);
    assert.equal(wedge.radius(), 60);
    assert.equal(wedge.getHeight(), 120);
  });

  it('getSelfRect', function () {
    var stage = addStage();
    var layer = new Konva.Layer();
    var wedge = new Konva.Wedge({
      x: stage.width() / 2,
      y: stage.height() / 2,
      angle: 180 * 0.4,
      radius: 70,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4,
    });

    layer.add(wedge);
    stage.add(layer);

    assert.deepEqual(wedge.getSelfRect(), {
      x: -70,
      y: -70,
      width: 140,
      height: 140,
    });
  });
});
