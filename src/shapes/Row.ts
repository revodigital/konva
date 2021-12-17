/*
 * Copyright (c) 2021-2021. Revo Digital
 * ---
 * Author: Gabri
 * File: Row.ts
 * Project: complex-shapes
 * Committed last: 2021/10/18 @ 1259
 * ---
 * Description: Implements class Row for representing a table row.
 */

import { TextConfiguration, ITextConfiguration } from '../configuration/TextConfiguration';
import { RowLayout }                             from './rowlayout';

/**
 * Represents a line of a Table
 */
export interface IRow extends ITextConfiguration {
  height: number | 'auto';
  data: string[];
  fill?: string;
}

/**
 * Represents a row into a table. Handles both the configuration and also
 * the content, via the data array.
 */
export class Row extends TextConfiguration {
  /**
   * Row content (each element is a cell of this row)
   */
  data: string[];

  /**
   * Row height, similar to Colulmn width, but in horizontal
   */
  height: number | 'auto';

  /**
   * Fill color
   */
  fill: string;

  /**
   * Creates a new Row object
   * @param options The options to create it
   */
  constructor(options: IRow) {
    super(options);
    this.data = options.data;
    this.height = options.height;
    this.fill = options.fill || 'white';
  }

  /**
   * Loads an array of rows starting from their instances
   * @param array The starting array
   */
  static fromIRowArray(array: IRow[]): Row[] {
    let temp: Row[] = [];

    for(const a of array)
      temp.push(new Row(a));

    return temp;
  }

  /**
   * Extracts the layout of this row
   */
  extractLayout(): RowLayout {
    return new RowLayout(this.height);
  }

  /**
   * Fills the empty cells of the row
   * @param cellPerRow Number of cells per row
   */
  fillEmptyCells(cellPerRow: number): void {
    // Number of cells to fill
    const i = cellPerRow - this.data.length;

    for(let x =  0; x < i; x++)
      this.data.push('');
  }

  /**
   * Checks if there is a cell with the given index
   * @param index The cell index
   */
  existsIndex(index: number): boolean {

    return (index >= 0);
  }

  /**
   * Swaps 2 cells of this row
   * @param indexA First cell index
   * @param indexB Second cell index
   */
  swapCells(indexA: number, indexB: number): void {
    if(!this.existsIndex(indexA) || !this.existsIndex(indexB)) throw new Error('Impossible swap');

    this.fillEmptyCells(indexB + 1);

    const temp = this.data[indexA];
    this.data[indexA] = this.data[indexB];
    this.data[indexB] = temp;
  }
}
