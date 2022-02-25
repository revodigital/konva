/*
 * Copyright (c) 2022. Revo Digital
 * ---
 * Author: gabriele
 * File: ColumnBuilder.ts
 * Project: complex-shapes-dev
 * Committed last: 2022/2/25 @ 2031
 * ---
 * Description:
 */

import { CellCollectionBuilder } from './CellCollectionBuilder';
import { CellConfig, CellSize }  from '../shapes/cell';
import { cloneArray }            from '../shapes/utils';

export class ColumnBuilder extends CellCollectionBuilder {
  constructor(cells: CellConfig[]) {
    super(cells);
    this.cells = cells;
  }

  /**
   * Calculates a new width to make all cells fit into the specified total
   * percentage
   * @param totalPerc Percentage of space to use
   */
  fitHeight(totalPerc?: number): this {
    const total = totalPerc || 100;

    const part = total / this.getCellCount();

    return this.setAll({
      height: part
    });
  }


  /**
   * Sets the height of some cells of this column. Size is specified using percentages.
   * In case an invalid configuration is provided, this method does not do nothing. It won't thcollection any exception
   * or stuff like that.
   * @param customCells Each cell that should have a custom size. The other will be set to auto
   */
  setCellsHeight(customCells: CellSize[]): this {
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
          it.height = customConf.percentage;
        else it.height = autoSpace;

        index++;
      });

    return this;
  }

  /**
   * Creates a new row with a given number of cells with the same configuration
   * @param num Number of cells
   * @param config Configuration to apply to all of them
   */
  static withCells(num: number, config: Partial<CellConfig>): ColumnBuilder {
    let cells = [];

    for (let i = 0; i < num; i++) cells.push({
      ...config
    });

    return new ColumnBuilder(cells);
  }


  /**
   * Clones this row into another object and returns it
   */
  clone(): ColumnBuilder {
    return new ColumnBuilder(cloneArray(this.cells));
  }

  build(): CellConfig[] {
    return this.cells;
  }
}