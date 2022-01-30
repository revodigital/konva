/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabriele
 * File: ColumnLayout.ts
 * Project: pamela 
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

export interface IColumnlayout {
  width: number | 'auto';
}

/**
 * The column layout
 */
export class ColumnLayout implements IColumnlayout {
  width: number | "auto";

  /**
   * Creates a new ColumnLayout
   * @param width The width of this column in percentage
   */
  constructor(width: number | 'auto') {
    this.width = width;
  }

  /**
   * Checks if the percentage of this row layout is valid or not
   */
  isValid(): boolean {
    if(!ColumnLayout.isAuto(this.width)) {
      const val = this.width as number;
      return val > 0 && val <= 100;
    } return true;
  }

  /**
   * Checks if the width is automatic
   */
  widthIsAuto(): boolean {
    return ColumnLayout.isAuto(this.width);
  }

  /**
   * Determinates if this is a auto value
   * @param val The value to check
   */
  public static isAuto(val: number | 'auto'): val is 'auto' {
    return (val as 'auto').length !== undefined;
  }
}