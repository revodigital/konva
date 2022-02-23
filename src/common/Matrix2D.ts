/*
 * Copyright (c) 2022. Revo Digital
 * ---
 * Author: gabriele
 * File: Matrix2D.ts
 * Project: complex-shapes-dev
 * Committed last: 2022/2/23 @ 1643
 * ---
 * Description:
 */

import { Point2D } from './Point2D';

export class MatrixIndex extends Point2D {}

/**
 * Represents a bidimensional matrix
 */
export class Matrix2D<T> {
  private data: T[][];

  constructor(data?: T[][]) {
    if (data) this.data = data;
  }

  /**
   * Returns a specific cell of this table
   * @param index Cell index
   */
  public getCell(index: MatrixIndex): T | undefined {
    if (!this.hasCellAtIndex(index)) return undefined;

    else return this.data[index.y][index.x];
  }

  /**
   * Iterates all the cells of this matrix
   * @param iterator
   */
  public forEachCell(iterator: (cell: T) => void) {
    this.data.forEach(it => it.forEach(iterator));
  }

  /**
   * Iterates every column of this matrix
   * @param iterator
   */
  public forEachColumn(iterator: (column: T[]) => void) {
    for (let index = 0; index < this.getColumnsCount(); index++)
      iterator(this.getColumn(index));
  }

  public forEachRow(iterator: (column: T[]) => void) {
    this.data.forEach(iterator);
  }

  /**
   * Adds a new row to this matrix
   * @param row
   */
  public pushRow(row: T[]): void {
    this.data.push(row);
  }

  /**
   * Adds a new column to this matrix
   * @param column
   */
  public pushColumn(column: T[]): void {
    let index = 0;
    this.data.forEach(it => {
      it.push(column[index]);
      index++;
    });
  }

  /**
   * Counts the rows where this predicate is true
   * @param predicate
   */
  public countRowsWhere(predicate: (it: T[]) => boolean): number {
    let i = 0;
    for(const r of this.data)
      if(predicate(r)) i++;

    return i;
  }

  /**
   * Checks if this table has a cell at the given index
   * @param index
   */
  public hasCellAtIndex(index: MatrixIndex): boolean {
    if (this.data.length < index.y) return false;
    return this.data[index.y][index.x] !== undefined;
  }

  /**
   * Returns the number of rows into this table
   */
  public getRowsCount(): number {
    return this.data.length || 0;
  }

  /**
   * Returns the number of columns into this table
   */
  public getColumnsCount(): number {
    return this.data[0].length || 0;
  }

  /**
   * Get a specific row of this table
   * @param index
   */
  public getRow(index: number): T[] | undefined {
    if (!this.data) return undefined;

    return this.data[index];
  }

  /**
   * Returns a column starting from its index
   * @param index Column index
   */
  public getColumn(index: number): T[] | undefined {
    if (!this.data) return undefined;

    return this.data.map(it => {
      return it[0];
    }) || [];
  }

  /**
   * Returns the first column or undefined if it is empty
   */
  public firstColumn(): T[] | undefined {
    return this.getColumn(0);
  }

  /**
   * Returns the last valid row index of this table
   */
  public lastRowIndex(): number {
    return this.data.length - 1;
  }

  /**
   * Returns the last valid column index
   */
  public lastColumnIndex(): number {
    if (this.data && this.data[0]) return this.data[0].length - 1;
    return 0;
  }

  /**
   * Returns the last column of this table
   */
  public lastColumn(): T[] | undefined {
    return this.getColumn(this.lastColumnIndex());
  }

  /**
   * Returns the last row of this table
   */
  public lastRow(): T[] | undefined {
    return this.getRow(this.lastRowIndex());
  }

  /**
   * Returns the first row of this table
   */
  public firstRow(): T[] | undefined {
    return this.getRow(0);
  }

  public length(): number {
    return this.data.length;
  }
}