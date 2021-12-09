/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: Gabri
 * File: cellposition.ts
 * Project: complex-shapes-dev
 * Committed last: 2021/10/20 @ 1650
 * ---
 * Description:
 */

export interface ICellposition {
  rowIndex: number;
  columnIndex: number;
}

/**
 * Represents the position of a cell
 */
export class CellPosition implements ICellposition {
  columnIndex: number;
  rowIndex: number;

  /**
   * Creates a new CellPosition
   * @param row The row index
   * @param col The colulmn index
   */
  constructor(row: number, col: number) {
    this.columnIndex = col;
    this.rowIndex = row;
  }

  /**
   * Checks if the cell exists into the specified table
   * @param columnsCount Number of columns
   * @param rowsCount Number of rows
   */
  existsInTable(columnsCount: number, rowsCount: number): boolean {
    return (this.columnIndex < columnsCount && this.rowIndex < rowsCount &&
            this.rowIndex >= 0 && this.columnIndex >= 0);
  }
}