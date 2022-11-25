/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabrielecavallo
 * File: Point2D.ts
 * Project: pamela
 * Committed last: 2022/11/25 @ 1256
 * ---
 * Description:
 */

import {Vector2d} from '../types';

export interface IPoint2D {
  x: number;
  y: number;
}

/**
 * Create a new point. If called without arguments, creates an empty point
 * @param x
 * @param y
 */
export const pointOf = (x?: number, y?: number): Point2D => {
  return Point2D.fromXY(x || 0, y || 0);
}

/**
 * Represents 2D point into the space.
 */
export class Point2D implements IPoint2D {
  x: number;
  y: number;

  constructor(x?: number, y?: number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  /**
   * Calculates distance between 2 points
   * @param point Second point
   */
  distanceFrom(point: Point2D): number {
    return Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y,
      2));
  }

  /**
   * Distance on X axis
   * @param point
   */
  distanceX(point: Point2D): number {
    return this.x - point.x;
  }

  /**
   * Distance on Y axis
   * @param point
   */
  distanceY(point: Point2D): number {
    return this.y - point.y;
  }

  /**
   * Absolute distance on Y axis
   * @param point
   */
  absoluteDistanceY(point: Point2D): number {
    return Math.abs(this.y - point.y);
  }

  /**
   * Absolute distance on X axis
   * @param point
   */
  absoluteDistanceX(point: Point2D): number {
    return Math.abs(this.x - point.x);
  }

  /**
   * Calculates the distance in x axis, y axis and returns
   * it in form of a vector
   * @param point
   */
  distanceVector(point: Point2D): Vector2d {
    return {
      x: this.distanceX(point),
      y: this.distanceY(point),
    }
  }

  /**
   * Returns the absolute distance vector
   * @param point
   */
  absoluteDistanceVector(point: Point2D): Vector2d {
    return {
      x: this.absoluteDistanceX(point),
      y: this.absoluteDistanceY(point),
    }
  }

  /**
   * Checks if this point is the topleft corner of a rectangle
   */
  isTopLeft(): boolean {
    return this.x === 0 && this.y === 0;
  }

  /**
   * Normalize undefined values
   */
  normalize(): void {
    if (this.x === undefined) this.x = 0;
    if (this.y === undefined) this.y = 0;
  }

  incrementX(value: number): void {
    if (this.x === undefined) this.x = 0;
    this.x += value;
  }

  decrementX(value: number): void {
    if (this.x === undefined) this.x = 0;
    this.x -= value;
  }

  incrementY(value: number): void {
    if (this.y === undefined) this.y = 0;
    this.y += value;
  }

  decrementY(value: number): void {
    if (this.y === undefined) this.y = 0;
    this.y -= value;
  }

  /**
   * Translate this point by a specific vector
   * @param vector
   */
  translate(vector: Vector2d): void {
    this.x += vector.x;
    this.y += vector.y;
  }

  /**
   * Translate a point applying a vector and a scale to reduce its size
   * @param vector
   * @param scale A number != 0 to divide vector coordinates
   */
  translateScale(vector: Vector2d, scale: number) {
    const nV = {
      x: vector.x / scale,
      y: vector.y / scale,
    }

    this.translate(nV);
  }

  /**
   * Get a new point translated of a specific vector
   * @param vector
   */
  translated(vector: Vector2d): Point2D {
    return new Point2D(this.x + vector.x, this.y + vector.y);
  }

  /**
   * Calculates geometric center of the segment between 2 points
   * @param point
   */
  centerOf(point: Point2D): Point2D {
    return new Point2D(
      (this.x + point.x) / 2,
      (this.y + point.y) / 2,
    );
  }

  /**
   * Sets the coordinates of this point passing a vector
   * @param vector
   */
  setVector(vector: Vector2d) {
    this.x = vector.x;
    this.y = vector.y;
  }

  /**
   * Parses this point starting from a vector
   * @param vector
   */
  static fromVector(vector: Vector2d): Point2D {
    return new Point2D(vector.x, vector.y);
  }

  /**
   * Construct a new point starting from x and y
   * @param x
   * @param y
   */
  static fromXY(x: number, y: number): Point2D {
    return new Point2D(x, y);
  }

  /**
   * Converts this point into a vector
   */
  toVector(): Vector2d {
    return {
      x: this.x,
      y: this.y,
    };
  }
}