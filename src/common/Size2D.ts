/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: Size2D.ts
 * Project: pamela
 * Committed last: 2021/12/15 @ 929
 * ---
 * Description:
 */

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

  public toVector(): number[] {
    return [this.width, this.height];
  }

  public static fromBounds(width: number, height: number): Size2D {
    const l = new Size2D();
    l.setWidth(width);
    l.setHeight(height);
    return l;
  }

  public overflows(size: Size2D): boolean {
    return (this.getWidth() > size.getWidth() || this.getHeight() > size.getHeight());
  }

  public canBeContainedBy(size: Size2D): boolean {
    return (this.width <= size.getWidth() && this.height <= size.getHeight());
  }

  public overflowsHeight(height: number): boolean {
    return this.getHeight() > height;
  }

  public increase(a: number, b: number): Size2D {
    this.width += a;
    this.height += b;

    return this;
  }

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