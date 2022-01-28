/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabriele
 * File: RowLayoutGroup.ts
 * Project: pamela 
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { RowLayout } from './RowLayout';
import { IRow, Row } from '../shapes/Row';
import { Column }    from '../shapes/column';

export interface IRowLayoutGroup {
  rows: RowLayout[];
}

/**
 * Represents a group or row layouts
 */
export class RowLayoutGroup implements IRowLayoutGroup {
  rows: RowLayout[];

  constructor(rowConfigurations?: RowLayout[]) {
    this.rows = rowConfigurations || [];
  }

  /**
   * Returns the number of rows set to auto
   */
  getAutoRowCount(): number {
    let autoC = 0;
    for (const r of this.rows) {
      if (r.heightIsAuto()) autoC++;
    }

    return autoC;
  }

  /**
   * Adds a row at the end of the list
   * @param row
   */
  push(row: RowLayout): void {
    this.rows.push(row);
  }

  /**
   * Returns the auto rows percentage of total space
   */
  getAutoRowPercentage(): number {
    return (100 - this.getRowsTotalSpace()) / (this.getAutoRowCount());
  }

  /**
   * Returns a percentage of all the space hold
   * by override rows
   */
  getRowsTotalSpace(): number {
    let space = 0;

    for (const r of this.rows) {
      if (!r.heightIsAuto()) space += r.height as number;
    }

    return space;
  }


  /**
   * Checks if this group is valid or not
   */
  isValid(): boolean {
    for(const r of this.rows) if(!r.isValid()) return false;
    return true;
  }

  /**
   * Creates a group starting from raw configuration
   * @param config Columns configuration data
   */
  static fromRawConfiguration(config: IRow[]): RowLayoutGroup {
    let group = new RowLayoutGroup();
    for(const r of config)
      group.rows.push(new Row(r).extractLayout());
    return group;
  }

}