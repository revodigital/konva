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
import { Verse }   from '../shapes/Verse';

export class MatrixIndex extends Point2D {}

/**
 * Represents a bidimensional matrix
 */
export class Matrix2D<T> {
  private data: T[][];

  constructor(data?: T[][]) {
    this.data = data || [];
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
    let c = 0;

    for (let i = 0; i < column.length; i++) {
      if (!this.data[i]) this.data[i] = [];
      this.data[i].push(column[c]);
      c++;
    }
  }

  /**
   * Checks if there is a column with the given index
   */
  public hasColumnAt(index: number): boolean {
    return index >= 0 && index < this.getColumnsCount() && this.getColumn(index) !== undefined;
  }

  /**
   * Counts the rows where this predicate is true
   * @param predicate
   */
  public countRowsWhere(predicate: (it: T[]) => boolean): number {
    let i = 0;
    for (const r of this.data)
      if (predicate(r)) i++;

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
    if (!this.data || !this.data[0]) return 0;

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

    let i = 0;
    let data = [];

    if (!this.data[i]) return undefined;

    while (this.data[i] && this.data[i][index]) {
      data.push(this.data[i][index]);
      i++;
    }

    return data;
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

  /**
   * Sets the content of a row
   * @param index Row index
   * @param value Value to set
   */
  public setRow(index: number, value: T[]) {
    if (index >= 0 && index < this.data.length)
      this.data[index] = value;
  }

  /**
   * Inserts an element into a matrix specificating the position, the shifting verse and the object to add
   * @param object
   * @param startIndex
   * @param verse
   */
  insertRow(object: T[], startIndex: number, verse: Verse) {
    // Check errors
    if (startIndex < 0 || startIndex >= this.data.length) return;

    let a = this.data;

    // Simple push
    if (startIndex === (a.length - 1) && verse === Verse.After) {
      a.push(object);
      return a;
    }

    if (startIndex === 0 && verse === Verse.Before) {
      const temp = a;
      a = [object];
      a.push(...temp);
      return a;
    }

    const temp_after = a.slice(startIndex + 1);
    const temp_before = a.slice(0, startIndex);
    const currItem = a[startIndex];

    switch (verse) {
      case Verse.After:
        a = [...temp_before];
        a.push(currItem);
        a.push(object);
        a.push(...temp_after);
        break;
      case Verse.Before:
        a = [...temp_before];
        a.push(object);
        a.push(currItem);
        a.push(...temp_after);
        break;
    }

    this.data = a;
  }
}