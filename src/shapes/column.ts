/*
 * Copyright (c) 2021-2022. Revo Digital
 * ---
 * Author: gabriele
 * File: column.ts
 * Project: pamela
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { ITextConfiguration } from '../configuration/TextConfiguration';
import { Cell }               from './cell';

/**
 * Represents a Column into a Table
 */
export interface IColumn extends ITextConfiguration {
  width: number | 'auto';
  text?: string;
}

/**
 * Implements the Column class for representing a table column.
 * It unites the column configuration and the content of it. In a column, you only specify
 * a text, witch is the content of the first cell of the column (header cell).
 */
export class Column {
  cells: Cell[];

  /**
   * Creates a new Column
   * @param cells Cells composing this column
   */
  constructor(cells: Cell[]) {
    this.cells = cells;
  }
}