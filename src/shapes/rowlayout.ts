/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: Gabri
 * File: rowlayout.ts
 * Project: complex-shapes-dev
 * Committed last: 2021/10/20 @ 1711
 * ---
 * Description: Implements the class RowLayout
 */

export interface IRowlayout {
  height: number | 'auto';
}

/**
 * Represents the layout of a specifc row. Includes all the informations used to calculate
 * it.
 */
export class RowLayout implements IRowlayout {
  height: number | "auto";

  /**
   * Creates a new RowLayout instance
   * @param height The height percentage of this row
   */
  constructor(height: number | 'auto') {
    this.height = height;
  }

  /**
   * Checks if the percentage of this row layout is valid or not
   */
  isValid(): boolean {
    if(!RowLayout.isAuto(this.height)) {
      const val = this.height as number;
      return val > 0 && val <= 100;
    } return true;
  }

  /**
   * Checks if the height is automatic
   */
  heightIsAuto(): boolean {
    return RowLayout.isAuto(this.height);
  }

  /**
   * Determinates if this is a auto value
   * @param val The value to check
   */
  public static isAuto(val: number | 'auto'): val is 'auto' {
    return (val as 'auto').length !== undefined;
  }
}