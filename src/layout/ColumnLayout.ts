/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: Gabri
 * File: ColumnLayout.ts
 * Project: complex-shapes-dev
 * Committed last: 2021/10/20 @ 179
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