/*
 * Copyright (c) 2021-2022. Revo Digital
 * ---
 * Author: gabriele
 * File: Wedge.ts
 * Project: pamela
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { Factory } from '../Factory';
import { Shape, ShapeConfig } from '../Shape';
import { Pamela }             from '../Global';
import { getNumberValidator } from '../Validators';
import { _registerNode } from '../Global';

import { GetSet }       from '../types';
import { SceneContext } from '../Context';

export interface WedgeConfig extends ShapeConfig {
  angle: number;
  radius: number;
  clockwise?: boolean;
}

/**
 * Wedge constructor
 * @constructor
 * @memberof Konva
 * @augments Pamela.Shape
 * @param {Object} config
 * @param {Number} config.angle in degrees
 * @param {Number} config.radius
 * @param {Boolean} [config.clockwise]
 * @@shapeParams
 * @@nodeParams
 * @example
 * // draw a wedge that's pointing downwards
 * var wedge = new Konva.Wedge({
 *   radius: 40,
 *   fill: 'red',
 *   stroke: 'black'
 *   strokeWidth: 5,
 *   angleDeg: 60,
 *   rotationDeg: -120
 * });
 */
export class Wedge extends Shape<WedgeConfig> {
  _sceneFunc(context: SceneContext) {
    context.beginPath();
    context.arc(
      0,
      0,
      this.radius(),
      0,
      Pamela.getAngle(this.angle()),
      this.clockwise()
    );
    context.lineTo(0, 0);
    context.closePath();
    context.fillStrokeShape(this);
  }
  getWidth() {
    return this.radius() * 2;
  }
  getHeight() {
    return this.radius() * 2;
  }
  setWidth(width) {
    this.radius(width / 2);
  }
  setHeight(height) {
    this.radius(height / 2);
  }

  radius: GetSet<number, this>;
  angle: GetSet<number, this>;
  clockwise: GetSet<boolean, this>;
}

Wedge.prototype.className = 'Wedge';
Wedge.prototype._centroid = true;
Wedge.prototype._attrsAffectingSize = ['radius'];
_registerNode(Wedge);

/**
 * get/set radius
 * @name Pamela.Wedge#radius
 * @method
 * @param {Number} radius
 * @returns {Number}
 * @example
 * // get radius
 * var radius = wedge.radius();
 *
 * // set radius
 * wedge.radius(10);
 */
Factory.addGetterSetter(Wedge, 'radius', 0, getNumberValidator());

/**
 * get/set angle in degrees
 * @name Pamela.Wedge#angle
 * @method
 * @param {Number} angle
 * @returns {Number}
 * @example
 * // get angle
 * var angle = wedge.angle();
 *
 * // set angle
 * wedge.angle(20);
 */
Factory.addGetterSetter(Wedge, 'angle', 0, getNumberValidator());

/**
 * get/set clockwise flag
 * @name Pamela.Wedge#clockwise
 * @method
 * @param {Number} clockwise
 * @returns {Number}
 * @example
 * // get clockwise flag
 * var clockwise = wedge.clockwise();
 *
 * // draw wedge counter-clockwise
 * wedge.clockwise(false);
 *
 * // draw wedge clockwise
 * wedge.clockwise(true);
 */
Factory.addGetterSetter(Wedge, 'clockwise', false);

Factory.backCompat(Wedge, {
  angleDeg: 'angle',
  getAngleDeg: 'getAngle',
  setAngleDeg: 'setAngle',
});
