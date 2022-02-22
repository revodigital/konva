/*
 * Copyright (c) 2021-2022. Revo Digital
 * ---
 * Author: gabriele
 * File: Row.ts
 * Project: pamela
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { Cell } from './cell';

/**
 * Represents a row into a table. Handles both the configuration and also
 * the content.
 */
export class Row {
  cells: Cell[];

  /**
   * Creates a new Row object
   * @param cells Cells to initialize it
   */
  constructor(cells: Cell[]) {
    this.cells = cells;
  }

  /**
   * Checks if there is a cell with the given index
   * @param index The cell index
   */
  existsIndex(index: number): boolean {
    return (index >= 0 && index < this.cells.length);
  }

  /**
   * Swaps 2 cells of this row
   * @param indexA First cell index
   * @param indexB Second cell index
   */
  swapCells(indexA: number, indexB: number): void {

    if (!this.existsIndex(indexA) || !this.existsIndex(indexB)) return;

    const temp = this.cells[indexB];
    this.cells[indexB] = this.cells[indexA];
    this.cells[indexA] = temp;
  }
}
