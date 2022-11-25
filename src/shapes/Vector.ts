/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabrielecavallo
 * File: Vector.ts
 * Project: pamela 
 * Committed last: 2022/11/25 @ 1256
 * ---
 * Description:
 */

export interface IVector {
  x: number;
  y: number;
}

/**
 * Represents a moving vector
 */
export class Vector implements IVector {
  /**
   * The movement on x axis
   */
  x: number;

  /**
   * The movement on y axis
   */
  y: number;

  /**
   * Creates a new 2DVector
   * @param x Movement on x axis
   * @param y Movement on y axis
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}