/*
 * Copyright (c) 2022. Revo Digital
 * ---
 * Author: gabriele
 * File: Row.ts
 * Project: complex-shapes-dev
 * Committed last: 2022/2/23 @ 2224
 * ---
 * Description:
 */

import { CellConfig, CellSize } from '../shapes/cell';
import { cloneArray }           from '../shapes/utils';

/**
 * Represents a row when building a table
 */
export class Row {
  cells: CellConfig[];

  constructor(cells: CellConfig[]) {
    this.cells = cells;
  }

  /**
   * Returns the height of this row
   */
  getHeight(): number {
    return this.cells[0]?.height || 0;
  }

  /**
   * Sets the height of this row. All the cells will assume this height in percentage
   * @param val Height in percentage
   */
  setHeight(val: number): this {
    if (val < 0 || val >= 100) return this;

    this.cells.forEach(it => {
      it.height = val;
    });

    return this;
  }

  /**
   * Checks if this row has a cell at the given index
   * @param index
   */
  hasCellAtIndex(index: number): boolean {
    return index >= 0 && index < this.cells.length;
  }

  /**
   * Sets the width of all the cells
   * @param val Width in percentage
   */
  setWidth(val: number): this {
    if (val < 0 || val >= 100) return this;

    this.cells.forEach(
      it => {
        it.width = val;
      }
    );
  }

  /**
   * Populates the contents of this row
   * @param data
   */
  populate(data: string[]): this {
    let x = 0;
    this.cells.forEach(it => {
      if (data[x])
        it.content = data[x];
      x++;
    });

    return this;
  }

  /**
   * Populates this row using async data parser
   * @param getter Getter to call for each cell
   */
  async populateEachAsync(getter: (cell: CellConfig, index: number) => Promise<string>): Promise<this> {
    let x = 0;
    for (const it of this.cells) {
      it.content = await getter(it, x);
      x++;
    }

    return this;
  }

  /**
   * Populates eanch cell calling a data getter
   * @param getter
   */
  populateEach(getter: (cell: CellConfig, index: number) => string): this {
    let x = 0;
    for (const it of this.cells) {
      it.content = getter(it, x);
      x++;
    }

    return this;
  }

  /**
   * Sets the background of this row
   * @param color
   */
  setBackground(color: string): void {
    this.cells.forEach(it => {
      it.fill = color;
    });
  }

  /**
   * Adds a new cell into this row
   * @param cell
   */
  addCell(cell: CellConfig): this {
    this.cells.push(cell);
    return this;
  }

  /**
   * Adds multiple cells to this row
   * @param cells
   */
  addCells(cells: CellConfig[]): this {
    this.cells.push(...cells);

    return this;
  }

  /**
   * Configure a specific cell
   * @param index Index to configure
   * @param config Configuration to apply
   */
  set(index: number, config: Partial<CellConfig>): this {
    if (!this.hasCellAtIndex(index)) return this;

    Object.assign(this.cells[index], config);
    return this;
  }

  /**
   * Sets this configuration to each cell of this row
   * @param config
   */
  setAll(config: Partial<CellConfig>): this {
    this.cells.forEach(
      it => {
        Object.assign(it, config);
      }
    );

    return this;
  }

  /**
   * Configure the first cell of this row
   * @param config
   */
  setFirst(config: Partial<CellConfig>): void {
    Object.assign(this.cells[0], config);
  }

  /**
   * Clones this row into another object and returns it
   */
  clone(): Row {
    return new Row(cloneArray(this.cells));
  }

  /**
   * Sets the size of some cells. Size is specified using percentages.
   * In case an invalid configuration is provided, this method does not do nothing. It won't throw any exception
   * or stuff like that.
   * @param customCells Each cell that should have a custom size. The other will be set to auto
   */
  setCellsSize(customCells: CellSize[]): this {
    const ovCells = customCells.length;
    const autoCells = this.getCellCount() - ovCells;

    let space = 0;
    for (const it of customCells) {
      if (it.percentage <= 0 || it.percentage > 100) return this;
      space += it.percentage;

      if (space > 100) return this;
    }


    // Calculate remaining free space
    const remainingSpace = 100 - space;
    const autoSpace = Math.floor(remainingSpace / autoCells);

    let index = 0;
    this.cells.forEach(
      it => {
        const customConf: CellSize | undefined = customCells.find(it => it.index === index);

        if (customConf)
          it.width = customConf.percentage;
        else it.width = autoSpace;

        index++;
      });

    return this;
  }

  /**
   * Sets only the configuration of this cells, specified by index
   * @param cellIndexes Indexes to apply configuration to
   * @param config Configuration to apply
   */
  setOnly(cellIndexes: number[], config: Partial<CellConfig>): this {
    let index = 0;

    this.cells.forEach(
      it => {
        if (cellIndexes.includes(index)) Object.assign(it, config);
        index++;
      }
    );

    return this;
  }

  getCellCount(): number {
    return this.cells.length;
  }

  /**
   * Creates a new row with a given number of cells with the same configuration
   * @param num Number of cells
   * @param config Configuration to apply to all of them
   */
  static withCells(num: number, config: Partial<CellConfig>): Row {
    let cells = [];

    for (let i = 0; i < num; i++) cells.push({
      ...config
    });

    return new Row(cells);
  }

  /**
   * Calculates a new width to make all cells fit into the specified total
   * percentage
   * @param totalPerc Percentage of space to use
   */
  fitWidth(totalPerc?: number): this {
    const total = totalPerc || 100;

    const part = total / this.getCellCount();

    return this.setAll({
      width: part
    });
  }

  /**
   * Configure the last cell of this row
   * @param config
   */
  setLast(config: Partial<CellConfig>): void {
    Object.assign(this.cells[this.cells.length - 1], config);
  }

  toCells(): CellConfig[] {
    return this.cells;
  }
}