/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabriele
 * File: PointRectangle2D.ts
 * Project: pamela 
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { negate }  from '../shapes/utils';
import { Point2D } from './Point2D';

export interface IPointrectangle {
  topLeft: Point2D;
  topRight: Point2D;
  bottomLeft: Point2D;
  bottomRight: Point2D;
}

/**
 * Represents a rectangle of 4 points. Allows the programmer to simplify geometry calculations.
 */
export class PointRectangle2D implements IPointrectangle {
  /**
   * Bottom left edge point
   */
  bottomLeft: Point2D;

  /**
   * Bottom right edge point
   */
  bottomRight: Point2D;

  /**
   * Top left edge point
   */
  topLeft: Point2D;

  /**
   * Top right edge point
   */
  topRight: Point2D;

  /**
   * Creates a new PointRectangle class, with possibility of defining all of its points.
   * If not defined, the default is (0, 0)
   * @param bl Bottom left
   * @param br Bottom right
   * @param tl Top left
   * @param tr Top right
   */
  constructor(bl?: Point2D, br?: Point2D, tl?: Point2D, tr?: Point2D) {
    // Initialize default points
    this.bottomLeft = bl || new Point2D(0, 0);
    this.topLeft = tl || new Point2D(0, 0);
    this.bottomRight = br || new Point2D(0, 0);
    this.topRight = tr || new Point2D(0, 0);
  }

  /**
   * Calcolates a PointRectangle with centered coordinates, starting from his width and height
   * @param width The rectangle width
   * @param height The rectangle height
   */
  static calculateFromCenter(width: number, height: number): PointRectangle2D {
    // Point rectangle
    let rect = new PointRectangle2D();
    // Calculate half sizes (the coordinates start from the center [0, 0])
    const hm = height / 2;
    const wm = width / 2;
    // Calculate all the edge positions
    rect.topLeft = new Point2D(negate(wm), negate(hm));
    rect.topRight = new Point2D(wm, negate(hm));
    rect.bottomLeft = new Point2D(negate(wm), hm);
    rect.bottomRight = new Point2D(wm, hm);

    return rect;
  }

  /**
   * Calculates coordinates from normal start at topleft angle
   * @param width Rectangle width
   * @param height Rectangle height
   */
  static calculateFromStart(width: number, height: number): PointRectangle2D {
    let rect = new PointRectangle2D();
    rect.topLeft = new Point2D(0, 0);
    rect.topRight = new Point2D(width, 0);
    rect.bottomLeft = new Point2D(0, height);
    rect.bottomRight = new Point2D(width, height);

    return rect;
  }

  /**
   * Calculates the center coordinates starting from the edges appliying an offset
   */
  getCenterWithOffset(offsetX: number, offsetY: number): Point2D {
    return new Point2D ((((this.topLeft.x - this.topRight.x) / 2) + offsetX), ((this.topLeft.y) - (this.bottomLeft.y)) / 2 + offsetY);
  }

  /**
   * Calculates center coordinates starting from the edges
   */
  getCenter(): Point2D {
    let center = new Point2D(0, 0);
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
    this.bottomLeft = new Point2D(this.topLeft.x, this.bottomRight.y);
    this.topRight = new Point2D(this.bottomRight.x, this.topLeft.y);
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

