/*
 * Copyright (c) 2021-2021. Revo Digital
 * ---
 * Author: Gabri
 * File: pointrectangle.ts
 * Project: complex-shapes
 * Committed last: 2021/10/18 @ 1315
 * ---
 * Description: Implements class PointRectangle for managing 4 points rectangles
 */

import { negate } from './utils';
import { Point }  from '../common/Point';

export interface IPointrectangle {
  topLeft: Point;
  topRight: Point;
  bottomLeft: Point;
  bottomRight: Point;
}

/**
 * Represents a rectangle of 4 points. Allows the programmer to simplify geometry calculations.
 */
export class PointRectangle implements IPointrectangle {
  /**
   * Bottom left edge point
   */
  bottomLeft: Point;

  /**
   * Bottom right edge point
   */
  bottomRight: Point;

  /**
   * Top left edge point
   */
  topLeft: Point;

  /**
   * Top right edge point
   */
  topRight: Point;

  /**
   * Creates a new PointRectangle class, with possibility of defining all of its points.
   * If not defined, the default is (0, 0)
   * @param bl Bottom left
   * @param br Bottom right
   * @param tl Top left
   * @param tr Top right
   */
  constructor(bl?: Point, br?: Point, tl?: Point, tr?: Point) {
    // Initialize default points
    this.bottomLeft = bl || new Point(0, 0);
    this.topLeft = tl || new Point(0, 0);
    this.bottomRight = br || new Point(0, 0);
    this.topRight = tr || new Point(0, 0);
  }

  /**
   * Calcolates a PointRectangle with centered coordinates, starting from his width and height
   * @param width The rectangle width
   * @param height The rectangle height
   */
  static calculateFromCenter(width: number, height: number): PointRectangle {
    // Point rectangle
    let rect = new PointRectangle();
    // Calculate half sizes (the coordinates start from the center [0, 0])
    const hm = height / 2;
    const wm = width / 2;
    // Calculate all the edge positions
    rect.topLeft = new Point(negate(wm), negate(hm));
    rect.topRight = new Point(wm, negate(hm));
    rect.bottomLeft = new Point(negate(wm), hm);
    rect.bottomRight = new Point(wm, hm);

    return rect;
  }

  /**
   * Calculates the center coordinates starting from the edges appliying an offset
   */
  getCenterWithOffset(offsetX: number, offsetY: number): Point {
    return new Point ((((this.topLeft.x - this.topRight.x) / 2) + offsetX), ((this.topLeft.y) - (this.bottomLeft.y)) / 2 + offsetY);
  }

  /**
   * Calculates center coordinates starting from the edges
   */
  getCenter(): Point {
    let center = new Point(0, 0);
    center.x = this.topLeft.x + (this.getWidth() / 2);
    center.y = this.topLeft.y + (this.getHeight() / 2);

    return center;
  }

  /**
   * Calculates the width of this rectangle
   */
  getWidth(): number {
    return Math.abs(this.topLeft.x - this.topRight.x);
  }

  /**
   * If topLeft and bottomRight are already specified, it
   * calculates the other 2 edges of this rectangle.
   */
  complete(): void {
    this.bottomLeft = new Point(this.topLeft.x, this.bottomRight.y);
    this.topRight = new Point(this.bottomRight.x, this.topLeft.y);
  }

  /**
   * Calculates the height of this rectangle
   */
  getHeight(): number {
    return Math.abs(this.topLeft.y - this.bottomLeft.y);
  }

  /**
   * Converts this pointrectangle into his json representation
   */
  toJson(): string {
    return JSON.stringify(this);
  }
}

