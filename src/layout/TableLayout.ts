/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabriele
 * File: TableLayout.ts
 * Project: pamela 
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { CellLayout }   from './CellLayout';
import { CellPosition }                 from '../common/CellPosition';
import { ColumnRowLayoutConfiguration } from './ColumnRowLayoutConfiguration';
import {
  InvalidConfiguration
}                                       from '../exceptions/InvalidConfiguration';
import { PointRectangle2D }  from '../common/PointRectangle2D';
import { RowLayout }         from './RowLayout';
import { InvalidPercentage } from '../exceptions/InvalidPercentage';

export interface ITableLayout {
  rowsPercentages: number[];
  columnPercentages: number[];
  tableWidth: number;
  tableHeight: number;
}

/**
 * Represents the layout of a table
 */
export class TableLayout implements ITableLayout {
  columnPercentages: number[];
  rowsPercentages: number[];
  tableHeight: number;
  tableWidth: number;
  /**
   * Rectangle with the 4 edges of this shape
   * @private
   */
  edgesRectangle = new PointRectangle2D();

  /**
   * Creates a new TableLayout.
   */
  constructor() {
    this.columnPercentages = [];
    this.rowsPercentages = [];
    this.tableHeight = 0;
    this.tableWidth = 0;
    this.edgesRectangle = new PointRectangle2D();
  }

  /**
   * Returns the column percentage of a specific column
   * @param columnIndex Column index
   */
  getColumnPercentage(columnIndex: number): number {
    return this.columnPercentages[columnIndex];
  }

  /**
   *  Returns the effective column width applying the percentage to the real value
   * @param columnIndex
   */
  getEffectiveColumnWidth(columnIndex: number): number {
    return (this.columnPercentages[columnIndex] / 100) * this.tableWidth;
  }

  /**
   * Returns the effective row height applying the percentage to the real value
   * @param rowIndex The row index
   */
  getEffectiveRowHeight(rowIndex: number): number {
    return (this.rowsPercentages[rowIndex] / 100) * this.tableHeight;
  }

  /**
   * Returns the percentage of a specific row
   * @param rowIndex Row index
   */
  getRowPercentage(rowIndex: number): number {
    return this.rowsPercentages[rowIndex];
  }

  /**
   * Returns the layout of a specific cell
   * @param position The position of the cell
   */
  getCellLayout(position: CellPosition): CellLayout {
    return new CellLayout(this.rowsPercentages[position.rowIndex],
      this.columnPercentages[position.columnIndex]);
  }

  /**
   * Calculates the number of rows in this layout
   */
  getRowsCount(): number {
    return this.rowsPercentages.length;
  }

  /**
   * Calculates the number of columns in this layout
   */
  getColumnsCount(): number {
    return this.columnPercentages.length;
  }

  /**
   * Initializes this layout with a set of fixed-size columns and rows
   * @param cols Column number
   * @param rows Rows number
   */
  initLayout(cols: number, rows: number): void {
    if (cols < 0 || rows < 0) throw new Error('Invalid column or row count. ');

    const rPerc = 100 / rows;
    const cPerc = 100 / cols;

    // Create arrays
    this.columnPercentages = new Array(cols).fill(cPerc, 0, cols + 1);
    this.rowsPercentages = new Array(rows).fill(rPerc, 0, rows + 1);
  }

  /**
   * Calculates a layout of a table starting from his configuration
   * @param config The configuration
   */
  parseFromConfiguration(config: ColumnRowLayoutConfiguration): void {
    // Validate values
    if (!config.isValid()) throw new InvalidConfiguration(config);

    // Calculate auto width for columns
    const autoRows = config.rowGroup.getAutoRowCount();
    const autoCols = config.columnGroup.getAutoColCount();

    const rowAutoWidth = (100 - config.rowGroup.getRowsTotalSpace()) / (config.rowGroup.getAutoRowCount());
    const colAutoWidth = (100 - config.columnGroup.getColsTotalSpace()) / config.columnGroup.getAutoColCount();

    const columnsCount = config.columnGroup.columns.length;
    const rowsCount = config.rowGroup.rows.length;

    // Fill array
    this.columnPercentages = [];
    let csum = 0;
    for (let x = 0; x < columnsCount; x++) {
      let val;
      if (config.columnGroup.columns[x].widthIsAuto())
        val = colAutoWidth;

      else val = config.columnGroup.columns[x].width as number;

      this.columnPercentages.push(val);
      csum += val;

      if (csum > 100) throw new InvalidPercentage(csum,
        `invalid percentage for column ${ x }.`);
    }

    this.rowsPercentages = [];
    let rsum = 0;
    for (let y = 0; y < rowsCount; y++) {
      let val;
      let row: RowLayout;

      if (y === 0) row = config.rowGroup.rows[0];
      else row = config.rowGroup.rows[y];

      if (row.heightIsAuto())
        val = rowAutoWidth;
      else
        val = config.rowGroup.rows[y].height as number;

      this.rowsPercentages.push(val);
      rsum += val;
    }

    // Calculate auto height for rows
  }
}