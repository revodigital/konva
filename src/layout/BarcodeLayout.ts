/*
 * Copyright (c) 2021-2021. Revo Digital
 * ---
 * Author: gabriele
 * File: BarcodeLayout.ts
 * Project: pamela
 * Committed last: 2021/12/20 @ 110
 * ---
 * Description:
 */


import { PointRectangle2D } from '../common/PointRectangle2D';
import { Point2D }          from '../common/Point2D';
import { negate }           from '../Util';

export interface IBarcodeLayout {
  width: number;
  height: number;
}

/**
 * Represents the layout of a Barcode
 */
export class BarcodeLayout implements IBarcodeLayout {
  height: number;
  width: number;
  edges: PointRectangle2D;

  /**
   * Creates a new BarcodeLayout
   * @param initial The initial configuration
   */
  constructor(initial: IBarcodeLayout) {
    this.height = initial.height;
    this.width = initial.width;
    this.edges = this.initRectangle();
  }

  /**
   * Initializes the rectangle of points
   */
  initRectangle(): PointRectangle2D {
    let rect = new PointRectangle2D();
    rect.topLeft = new Point2D(negate(this.width / 2), negate(this.height / 2));
    rect.bottomRight = new Point2D(this.width / 2, this.height / 2);
    rect.complete();
    return rect;
  }

  /**
   * Returns the center of this layout
   */
  getCenter(): Point2D {
    return this.edges.getCenter();
  }

  /**
   * Prepares this layout
   */
  initLayout(): void {
    this.edges = this.initRectangle();
  }
}