/*
 * Copyright (c) 2021-2022. Revo Digital
 * ---
 * Author: gabriele
 * File: Size2D.ts
 * Project: pamela
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { Vector2d } from '../types';

export const sizeOf = (width: number, height: number): Size2D => {
  return Size2D.fromBounds(width, height);
};

export interface ISize2D {
  width: number;
  height: number;
}

export class Size2D {
  private height: number;
  private width: number;

  constructor() {
    this.height = 0;
    this.width = 0;
  }

  public getHeight(): number { return this.height; }

  public getWidth(): number { return this.width; }

  public setHeight(val: number) {this.height = val;}

  public setWidth(val: number) { this.width = val;}

  /**
   * Converts this size to an array
   */
  public toArray(): number[] {
    return [this.width, this.height];
  }

  /**
   * Contructs a size starting from width and height
   * @param width
   * @param height
   */
  public static fromBounds(width: number, height: number): Size2D {
    const l = new Size2D();
    l.setWidth(width);
    l.setHeight(height);
    return l;
  }

  /**
   * Contructs a size starting from an x y vector
   * @param vector
   */
  public static fromVector(vector: Vector2d): Size2D {
    return sizeOf(vector.x, vector.y);
  }

  /**
   * Contruct a new size
   * @param size
   */
  public static fromSize(size: {width: number, height: number}): Size2D {
    return sizeOf(size.width, size.height);
  }

  /**
   * Checks if this size overflows another
   * @param size
   */
  public overflows(size: Size2D): boolean {
    return (this.getWidth() > size.getWidth() || this.getHeight() > size.getHeight());
  }

  /**
   * Checks if this size overflows in width (height is ignored)
   * @param size
   */
  public overflowsWidth(size: Size2D): boolean {
    return (this.width > size.getWidth());
  }

  /**
   * Checks if this size can be contained by other parent size
   * @param size
   */
  public canBeContainedBy(size: Size2D): boolean {
    return (this.width <= size.getWidth() && this.height <= size.getHeight());
  }

  /**
   * Controls if this size overflows in height
   */
  public overflowsHeight(size: Size2D): boolean {
    return this.getHeight() > size.getHeight();
  }

  /**
   * Increases the width and the height of this size
   * @param a Value to increase width
   * @param b Value to increase heightf
   */
  public increase(a: number, b: number): Size2D {
    this.width += a;
    this.height += b;

    return this;
  }

  /**
   * Decreases width and height of this size
   * @param x
   * @param y
   */
  public decrease(x: number, y: number): Size2D {
    this.width -= x;
    this.height -= y;

    return this;
  }

  public equalsTo(size: Size2D): boolean {
    return this.width === size.getWidth() && this.height === size.getHeight();
  }

  /**
   * Returns -1 if this size is contained into other, 1 if this is bigger and
   * 0 if they are equal
   * @param size
   */
  public compareTo(size: Size2D): -1 | 0 | 1 {
    if(this.overflows(size)) return 1;
    else if(this.equalsTo(size)) return 0;
    return -1;
  }

  public toISize(): ISize2D {
    return {
      width: this.width,
      height: this.height,
    };
  }
}