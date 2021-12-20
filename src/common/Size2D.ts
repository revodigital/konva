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
    return [ this.width, this.height ];
  }

  public static fromBounds(width: number, height: number): Size2D {
    const l = new Size2D();
    l.setWidth(width);
    l.setHeight(height);
    return l;
  }

  public toISize(): ISize2D {
    return {
      width: this.width,
      height: this.height,
    }
  }
}