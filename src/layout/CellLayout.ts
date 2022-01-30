/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabriele
 * File: CellLayout.ts
 * Project: pamela 
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { PointRectangle2D } from '../common/PointRectangle2D';
import { Point2D }          from '../common/Point2D';

export interface ICelllayout {
  widthPercentage: number;
  heightPercentage: number;
}

/**
 * Represents the layout of a specific cell
 */
export class CellLayout implements ICelllayout {
  heightPercentage: number;
  widthPercentage: number;
  startPoint: Point2D;

  /**
   * Creates a new CellLayout
   * @param heightPerc Percentage of height
   * @param widthPerc Percentage of width
   * @param startPoint TopLeft point of the cell
   */
  constructor(heightPerc: number, widthPerc: number, startPoint?: Point2D) {
    this.heightPercentage = heightPerc;
    this.widthPercentage = widthPerc;
    this.startPoint = startPoint || new Point2D(0, 0);
  }

  /**
   * Calculates this cell layout
   * @param tableHeight
   * @param tableWidth
   */
  calculateLayout(tableHeight: number, tableWidth: number): PointRectangle2D {
    const effectiveWidth = (this.widthPercentage / 100) * tableWidth;
    const effectiveHeight = (this.heightPercentage / 100) * tableHeight;

    let rect = new PointRectangle2D();
    rect.topLeft = this.startPoint;
    rect.bottomRight = new Point2D(rect.topLeft.x + effectiveWidth, rect.topLeft.y + effectiveHeight);
    rect.complete();

    return rect;
  }

  /**
   * Returns the effective width of this cell layout
   * @param tableWidth
   */
  getEffectiveWidth(tableWidth: number): number {
    return (this.widthPercentage / 100) * tableWidth;
  }

  /**
   * Returns the effective height
   * @param tableHeight
   */
  getEffectiveHeight(tableHeight: number): number {
    return (this.heightPercentage / 100) * tableHeight;
  }
}