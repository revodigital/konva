/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: Point.ts
 * Project: pamela
 * Committed last: 2021/12/9 @ 1836
 * ---
 * Description:
 */

export interface IPoint {
  x: number;
  y: number;
}

export class Point2D implements IPoint {
  x: number;
  y: number;

  constructor(x?: number, y?: number) {
    this.x = x || 0;
    this.y = y || 0;
  }
}