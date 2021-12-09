/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: Gabri
 * File: collayoutgroup.ts
 * Project: complex-shapes-dev
 * Committed last: 2021/11/8 @ 1118
 * ---
 * Description:
 */

import { ColumnLayout }    from './columnlayout';
import { Column, IColumn } from './column';

export interface IColLayoutGroup {
  columns: ColumnLayout[];
}

/**
 * Represents a group of column layouts
 */
export class ColLayoutGroup implements IColLayoutGroup {
  columns: ColumnLayout[];

  constructor(cols?: ColumnLayout[]) {
    this.columns = cols || [];
  }

  /**
   * Returns the auto cols percentage of total space
   */
  getAutoColPercentage(): number {
    return (100 - this.getColsTotalSpace()) / this.getAutoColCount();
  }

  /**
   * Calculates the number of columns set to auto
   */
  getAutoColCount(): number {
    let cont = 0;

    for(const c of this.columns) {
      if(c.widthIsAuto()) cont ++;
    }

    return cont;
  }

  /**
   * Checks if this group is valid or not
   */
  isValid(): boolean {
    for(const c of this.columns) if(!c.isValid()) return false;
    return true;
  }

  /**
   * Adds a column at the end of the list
   * @param col
   */
  push(col: ColumnLayout): void {
    this.columns.push(col);
  }

  /**
   * Calculates the number of columns set to override
   */
  getOverrideColCount(): number {
    let cont = 0;

    for(const c of this.columns) {
      if(!c.widthIsAuto()) cont ++;
    }

    return cont;
  }


  /**
   * Returns a percentage of all the space
   * hold by override columns
   */
  getColsTotalSpace(): number {
    let space = 0;

    for(const c of this.columns) {
      if(!c.widthIsAuto()) space += c.width as number;
    }

    return space;
  }

  /**
   * Creates a group starting from raw configuration
   * @param columnData Columns configuration data
   */
  static fromRawConfiguration(columnData: IColumn[]): ColLayoutGroup {
    let group = new ColLayoutGroup();
    for(const c of columnData)
      group.columns.push(new Column(c).extractLayout());
    return group;
  }
}