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

import { CellConfig, CellSize }  from '../shapes/cell';
import { CellCollectionBuilder } from './CellCollectionBuilder';
import { cloneArray }            from '../shapes/utils';

/**
 * Represents a row when building a table
 */
export class RowBuilder extends CellCollectionBuilder {
  constructor(cells: CellConfig[]) {
    super(cells);
    this.cells = cells;
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
   * Creates a new row with a given number of cells with the same configuration
   * @param num Number of cells
   * @param config Configuration to apply to all of them
   */
  static withCells(num: number, config: Partial<CellConfig>): RowBuilder {
    let cells = [];

    for (let i = 0; i < num; i++) cells.push({
      ...config
    });

    return new RowBuilder(cells);
  }


  /**
   * Sets the size of some cells. Size is specified using percentages.
   * In case an invalid configuration is provided, this method does not do nothing. It won't thcollection any exception
   * or stuff like that.
   * @param customCells Each cell that should have a custom size. The other will be set to auto
   */
  setCellsWidth(customCells: CellSize[]): this {
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
   * Clones this row into another object and returns it
   */
  clone(): RowBuilder {
    return new RowBuilder(cloneArray(this.cells));
  }

  build(): CellConfig[] {
    return this.cells;
  }
}