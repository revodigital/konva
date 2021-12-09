/*
 * Copyright (c) 2021-2021. Revo Digital
 * ---
 * Author: Gabri
 * File: column.ts
 * Project: complex-shapes
 * Committed last: 2021/10/18 @ 1259
 * ---
 * Description: Implements the Column class for representing a table column.
 */

import { TextConfiguration, ITextConfiguration } from './TextConfiguration';
import { ColumnLayout }                          from './columnlayout';

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
export class Column extends TextConfiguration {

  /**
   * Column width, can be a number (percentual) for example 50 stands for 50%.
   * If not specified or "auto", the width will be calculated during render-time.
   */
  width: number | "auto";

  /**
   * The first column cell heading content. An optional string
   */
  text?: string;

  /**
   * Creates a new Column
   * @param options The options for this column
   */
  constructor(options: IColumn) {
    super(options);
    this.width = options.width;
    this.text = options.text;
  }

  /**
   * Creates an array of column instances starting from an array of
   * interfaces
   * @param array The starting array
   */
  static fromIColumnArray(array: IColumn[]): Column[] {
    let temp: Column[] = [];

    for(const a of array)
      temp.push(new Column(a));

    return temp;
  }

  /**
   * Extracts the layout of this column
   */
  extractLayout(): ColumnLayout {
    return new ColumnLayout(this.width);
  }
}