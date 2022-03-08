/*
 * Copyright (c) 2022. Revo Digital
 * ---
 * Author: gabriele
 * File: CellCollectionBuilder.ts
 * Project: complex-shapes-dev
 * Committed last: 2022/2/25 @ 1941
 * ---
 * Description:
 */


import { CellConfig } from '../shapes/cell';
import { Builder }    from './Builder';
import {
  HorizontalAlignment,
  VerticalAlignment
}                     from '../configuration/Alignment';

export abstract class CellCollectionBuilder implements Builder<CellConfig[]> {

  cells: CellConfig[];

  constructor(cells: CellConfig[]) {
    this.cells = cells;
  }

  /**
   * Sets the width of all the cells in this collection
   */
  setWidth(val: number): this {
    if (val < 0 || val > 100) return this;

    this.cells.forEach(it => {
      it.width = val;
    });

    return this;
  }

  /**
   * Set a custom width to all the cells and disable
   * auto-width mode
   * @param val
   */
  customWidth(val: number): this {
    if (val < 0 || val > 100) return this;

    this.cells.forEach(it => {
      it.width = val;
      it.autoWidth = false;
    });

    return this;
  }

  /**
   * Set a custom width to all the cells and disable
   * auto-width mode
   * @param val
   */
  customHeight(val: number): this {
    if (val < 0 || val > 100) return this;

    this.cells.forEach(it => {
      it.height = val;
      it.autoHeight = false;
    });

    return this;
  }

  /**
   * Merges 2 consequent cells using their indexes
   * @param indexA
   * @param indexB
   * @param useA
   */
  abstract mergeCells(indexA: number, indexB: number, useA: boolean);

  /**
   * Checks if all the cells have auto width
   */
  hasAutoWidth(): boolean {
    if (!this.cells) return false;

    for (const r of this.cells)
      if (!r.autoWidth) return false;

    return true;
  }

  /**
   * Checks if all the cells have auto height
   */
  hasAutoHeight(): boolean {
    if (!this.cells) return false;

    for (const r of this.cells)
      if (!r.autoHeight) return false;

    return true;
  }

  /**
   * Sets each cell to auto-width
   */
  autoWidth(): this {
    this.cells.forEach(it => {
      it.autoWidth = true;
    });

    return this;
  }

  /**
   * Removes a cell at the specified index
   * @param index Cell index
   */
  removeCellAt(index: number): this {
    if (!this.hasCellAtIndex(index)) return this;

    this.cells.splice(index, 1);

    return this;
  }

  /**
   * Overwrites the configuration of a cell
   * @param index Index of the cell
   * @param config Configuration to set
   */
  overwrite(index: number, config: CellConfig): this {
    if (!this.hasCellAtIndex(index)) return this;

    this.cells[index] = config;

    return this;
  }

  /**
   * Returns the last index
   */
  lastIndex(): number {
    const last = this.cells.length - 1;
    return last >= 0 ? last : 0;
  }

  /**
   * Overwrites the first cell
   * @param config
   */
  overwriteFirst(config: CellConfig): this {
    return this.overwrite(0, config);
  }

  /**
   * Overwrites the last cell
   * @param config
   */
  overwriteLast(config: CellConfig): this {
    return this.overwrite(this.lastIndex(), config);
  }

  /**
   * Removes every cell that fits to this predicate
   * @param predicate When it returns true, the cell gets removed
   */
  removeWhere(predicate: (cell: CellConfig, index: number, cellsCount: number) => boolean): this {
    for (let i = 0; i < this.cells.length; i++)
      if (predicate(this.cells[i], i, this.cells.length))
        this.cells.splice(i);

    return this;
  }

  /**
   * Returns the number of cells with an automatic width
   */
  getAutoWidthCellsCount(): number {
    let c = 0;

    this.forEachAutoWidthCell(it => {
      c++;
    });

    return c;
  }

  getAutoHeightCellsCount(): number {
    let c = 0;

    this.forEachAutoHeightCell(it => {
      c++;
    });

    return c;
  }

  forEachOVWidthCell(iterator: (cell: CellConfig) => void) {
    this.cells.forEach(it => {
      if (!it.autoWidth) iterator(it);
    });
  }

  forEachOVHeightCell(iterator: (cell: CellConfig) => void) {
    this.cells.forEach(it => {
      if (!it.autoHeight) iterator(it);
    });
  }

  forEachAutoWidthCell(iterator: (cell: CellConfig) => void) {
    this.cells.forEach(it => {
      if (it.autoWidth === true) iterator(it);
    });
  }

  forEachAutoHeightCell(iterator: (cell: CellConfig) => void) {
    this.cells.forEach(it => {
      if (it.autoHeight === true) iterator(it);
    });
  }

  /**
   * Sets each cell to auto-height
   */
  autoHeight(): this {
    this.cells.forEach(it => {
      it.autoHeight = true;
    });

    return this;
  }

  /**
   * Returns the available width in percentage or
   * 0 if it is full
   */
  getAvailableWidth(): number {
    if (!this.cells) return 100;

    let used = 0;

    this.cells.forEach(
      it => {
        if (it.width >= 0 && it.width <= 100)
          used += it.width;
      });

    if (used < 100) return 100 - used;
    else return 0;
  }

  getFreeWidth(): number {
    let c = 0;

    this.forEachOVWidthCell(it => {
      if (it.width > 0 && it.width <= 100) c += it.width;
    });

    return Math.abs(100 - c);
  }

  setAllAutoWidthCells(config: Partial<CellConfig>): this {
    this.forEachAutoWidthCell(it => {
      Object.assign(it, config);
    });

    return this;
  }

  /**
   * Returns the available height in percentage or
   * 0 if it is full
   */
  getAvailableHeight(): number {
    if (!this.cells) return 100;

    let used = 0;

    this.cells.forEach(
      it => {
        if (it.height >= 0 && it.height <= 100)
          used += it.height;
      });

    if (used < 100) return 100 - used;
    else return 0;
  }

  /**
   * Returns true if this collection has a width
   */
  hasWidth(): boolean {
    if (!this.cells) return false;

    if (this.cells[0].width) return true;
  }

  hasHeight(): boolean {
    if (!this.cells) return false;

    if (this.cells[0].height) return true;
  }

  /**
   * Returns the height of this row
   */
  getHeight(): number {
    return this.cells[0]?.height || 0;
  }

  /**
   * Returns the width of this column
   */
  getWidth(): number {
    return this.cells[0]?.width || 0;
  }

  /**
   * Sets the height of all the cells of this collection.
   * All the cells will assume this height in percentage
   * @param val Height in percentage
   */
  setHeight(val: number): this {
    if (val < 0 || val > 100) return this;

    this.cells.forEach(it => {
      it.height = val;
      it.autoHeight = false;
    });

    return this;
  }

  hasOVWidth(): boolean {
    return !this.hasAutoWidth();
  }

  hasOVHeight(): boolean {
    return !this.hasAutoHeight();
  }

  /**
   * Checks if this collection has a cell at the given index
   * @param index
   */
  hasCellAtIndex(index: number): boolean {
    return index >= 0 && index < this.cells.length;
  }

  /**
   * Populates the contents of this collection
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
   * Populates this collection using async data parser
   * @param getter Getter to call for each cell
   */
  // async populateEachAsync(getter: (cell: CellConfig, index: number) => Promise<string>): Promise<this> {
  //   let x = 0;
  //   for (const it of this.cells) {
  //     it.content = await getter(it, x);
  //     x++;
  //   }
  //
  //   return this;
  // }

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
   * Sets the background of this collection
   * @param color
   */
  setBackground(color: string): void {
    this.cells.forEach(it => {
      it.fill = color;
    });
  }

  /**
   * Adds a new cell into this collection
   * @param cell
   */
  addCell(cell: CellConfig): this {
    this.cells.push(cell);
    return this;
  }

  /**
   * Adds multiple cells to this collection
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
   * Sets this configuration to each cell of this collection
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
   * Sets alternatively configuration a or configuration b. The first
   * cell receives a, the second b and so on
   * @param configA Configuration for even cells
   * @param configB Configuration for non-even cells
   */
  setAlternate(configA: Partial<CellConfig>, configB?: Partial<CellConfig>): this {
    let i = 1;

    for (const o of this.cells) {
      if (i % 2) Object.assign(o, configA);
      else Object.assign(o, configB || {});

      i++;
    }

    return this;
  }

  setStepped(step: number, config: Partial<CellConfig>): this {
    return this;
  }

  /**
   * Configure the first cell of this collection
   * @param config
   */
  setFirst(config: Partial<CellConfig>): this {
    Object.assign(this.cells[0], config);

    return this;
  }

  /**
   * Returns the first cell of this collection
   */
  first(): CellConfig | undefined {
    return this.cells[0];
  }

  /**
   * Get a specific cell
   * @param index
   */
  get(index: number): CellConfig | undefined {
    return this.cells[index];
  }

  /**
   * Returns the last cell of this collection
   */
  last(): CellConfig | undefined {
    return this.cells[this.cells.length - 1];
  }

  /**
   * Clones this collection builder
   */
  abstract clone(): CellCollectionBuilder;

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
   * Configure the last cell of this collection
   * @param config
   */
  setLast(config: Partial<CellConfig>): void {
    Object.assign(this.cells[this.lastIndex()], config);
  }

  /**
   * Build this object
   */
  abstract build(): CellConfig[];

  /**
   * Applies all the default values to all the cells
   */
  applyDefaults(): void {
    this.cells.forEach(it => {
      if (!it.textAlign) it.textAlign = HorizontalAlignment.Center;
      if (!it.verticalAlign) it.verticalAlign = VerticalAlignment.Center;
      if (!it.fill) it.fill = 'white';
      if (!it.textColor) it.textColor = 'black';
    });
  }
}
