/*
 * Copyright (c) 2021-2021. Revo Digital
 * ---
 * Author: gabriele
 * File: ColumnRowLayoutConfiguration.ts
 * Project: pamela
 * Committed last: 2021/12/14 @ 1735
 * ---
 * Description:
 */

import { ColumnLayout } from './ColumnLayout';
import { RowLayout }    from '../shapes/rowlayout';
import { Column }         from '../shapes/column';
import { Row }            from '../shapes/Row';
import { ColLayoutGroup } from './ColLayoutGroup';
import { RowLayoutGroup } from '../shapes/rowlayoutgroup';

export interface IColumnRowLayoutConfiguration {
  columnGroup: ColLayoutGroup;
  rowGroup: RowLayoutGroup;
}

/**
 * Represents a configuration of a set of column and rows
 */
export class ColumnRowLayoutConfiguration implements IColumnRowLayoutConfiguration {
  /**
   * List with the layout of all the columns in the table
   */
  columnGroup: ColLayoutGroup;

  /**
   * List with all the layout of the rows
   */
  rowGroup: RowLayoutGroup;

  /**
   * Creates a new ColumnRowConfiguration
   * @param columns The columns layout to start from
   * @param rows The rows layout to start from
   */
  constructor(columns?: ColumnLayout[], rows?: RowLayout[]) {
    this.columnGroup = new ColLayoutGroup(columns);
    this.rowGroup = new RowLayoutGroup(rows);
  }

  /**
   * Checks if this configuration is valid
   */
  isValid(): boolean {
    if (!this.columnGroup.isValid()) return false;
    if (!this.rowGroup.isValid()) return false;

    return true;
  }

  /**
   * Adds a row to the configuration
   * @param row The row to add
   */
  addRow(row: RowLayout): void {
    this.rowGroup.push(row);
  }

  /**
   * Adds a column to the layout
   * @param col
   */
  addColumn(col: ColumnLayout): void {
    this.columnGroup.push(col);
  }


  /**
   * Returns the number of rows that override the height
   */
  getOverrideRowCount(): number {
    return this.rowGroup.rows.length - this.rowGroup.getAutoRowCount();
  }

  /**
   * Generates a layout configuration extracting the columns and rows configuration
   * @param columns The column objects representing their properties, including color, borders, etc...
   * @param rows The row objects
   */
  static fromColRowConfig(columns: Column[], rows: Row[]): ColumnRowLayoutConfiguration {
    let config = new ColumnRowLayoutConfiguration();

    // Columns
    for (const c of columns)
      config.addColumn((new Column(c)).extractLayout());

    // Rows
    for (const r of rows)
      config.addRow((new Row(r)).extractLayout());

    return config;
  }
}