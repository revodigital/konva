/*
 * Copyright (c) 2022-2022. Revo Digital
 * ---
 * Author: gabriele
 * File: TableBuilder.ts
 * Project: complex-shapes-dev
 * Committed last: 2022/2/23 @ 1637
 * ---
 * Description:
 */

import { Table, TableConfig } from '../shapes/Table';
import { Builder }            from './Builder';
import { Matrix2D }           from '../common/Matrix2D';
import { CellConfig }         from '../shapes/cell';
import { RowBuilder }         from './RowBuilder';
import { Verse }              from '../shapes/Verse';
import { ColumnBuilder }      from './ColumnBuilder';

export interface AddRowConfig {
  row: RowBuilder;
  index?: number;
  verse?: Verse;
  include?: boolean;
}

export interface AddColumnConfig {
  column: ColumnBuilder;
  index?: number;
  verse?: Verse;
  include?: boolean;
}

/**
 * Represents a builder for a Table, created to manipulate it
 */
export class TableBuilder implements Builder<Table> {
  cells: Matrix2D<CellConfig>;
  options: Partial<TableConfig>;
  autoRows: number;
  columnAutoWidth: number;

  /**
   * Creates a new table builder starting from an initial configuration
   * @param initial
   */
  constructor(initial?: Partial<TableConfig>) {
    this.options = initial || {};
    this.cells = new Matrix2D<CellConfig>();
  }

  setWidth(val: number): this {
    if (this.options)
      this.options.width = val;
    else this.options = { width: val };
    return this;
  }

  setHeight(val: number): this {
    if (this.options)
      this.options.height = val;
    else this.options = { height: val };
    return this;
  }

  getHeight(): number {
    return this.options.height || 0;
  }

  getWidth(): number {
    return this.options.width || 0;
  }

  /**
   * Sets some more options of this table
   * @param options Options to add to current configuration
   */
  setOptions(options: Partial<TableConfig>): this {
    Object.assign(this.options, options);
    return this;
  }

  /**
   * Adds a row to the table, with advanced parameters.
   *
   * NOTE: This method does not handle row sizing, it should be pre-set before adding it into the table.
   * To do so, use Row sizing methods or Column ones.
   * @param options Options to configure this method
   */
  public addRow(options: AddRowConfig): this {
    const include = options.include || true;

    // Insert the row
    if (!options.index) this.cells.pushRow(options.row.build());
    else
      this.cells.insertRow(options.row.build(), options.index, options.verse);

    if (!include) {
      const addHeight = this.getHeight() * (100 / options.row.getHeight());
      this.setHeight(this.getHeight() + addHeight);
    }

    return this;
  }

  /**
   * Checks if there is a row with the given index
   * @param index The row index
   */
  public existsRowWithIndex(index: number): boolean {
    return (index >= 0 && index < this.cells.length() && this.cells[index] !== undefined);
  }

  /**
   * Checks if there is a column with the specifed index
   * @param index The column index
   */
  public existsColumnWithIndex(index: number): boolean {
    return this.cells.hasColumnAt(index);
  }

  /**
   * Adds a column to the table
   *
   * @param config Advanced configuration for adding to this
   * builder.
   * to ensure it is included into it
   * TODO: Implement indexing prolicy
   */
  public addColumn(config: AddColumnConfig): this {
    const include = config.include || true;
    console.log('Add');

    if (!config.column.hasWidth()) {
      // We need to give it a width
      // Set it to auto
      config.column.setAutoWidth();
      // Calculate new auto coefficent
      const autoCols = this.getAutoColCount() + 1;

      const k = this.getHFreeSpace() / autoCols;
      config.column.setWidth(k);

      // Change width of all other auto columns
      this.setToAllAutoCol({
        width: k,
      });
    }

    if (!config.column.hasHeight()) {
      config.column.setHeight(100 / config.column.getCellCount());
      config.column.setAutoHeight();
    }

    if (config.index === undefined) {
      this.cells.pushColumn(config.column.build());
      console.log('Push');
    } else if (config.index !== undefined) {
      console.log('Insert');
      this.cells.insertColumn(config.column.build(),
        config.index,
        config.verse || Verse.After);
    }

    if (!include) {
      const addWidth = this.getWidth() * (100 / config.column.getWidth());
      this.setWidth(this.getWidth() + addWidth);
    }

    return this;
  }

  /**
   * Returns the number of rows with auto-height
   */
  getAutoRowsCount(): number {
    if (!this.cells) return 0;
    let c = 0;

    this.cells.forEachRow(it => {
      const builder = new RowBuilder(it);
      if (builder.hasAutoHeight()) c++;
    });

    return c;
  }

  /**
   * Returns the number of columns with auto-width
   */
  getAutoColCount(): number {
    if (!this.cells) return 0;
    let c = 0;

    this.cells.forEachColumn(it => {
      const builder = new ColumnBuilder(it);
      if (builder.hasAutoWidth()) c++;
    });

    return c;
  }

  /**
   * Returns the number of column in this table
   */
  getColumnsCount(): number {
    if (!this.cells) return 0;

    return this.cells.getColumnsCount();
  }

  /**
   * Returns the number of columns with a specific width
   * (not auto)
   */
  getOVColCount(): number {
    return this.getColumnsCount() - this.getAutoColCount();
  }

  forEachOVCol(iterator: (it: ColumnBuilder) => void): this {
    if (!this.cells) return this;

    this.cells.forEachColumn(it => {
      const b = new ColumnBuilder(it);
      if (b.hasOVWidth()) iterator(b);
    });

    return this;
  }

  /**
   * Returns the horizontal space in percentage not used by
   * the overwritten columns (with custom width)
   */
  getHFreeSpace(): number {
    let c = 0;

    this.forEachOVCol(it => {
      if (it.getWidth() > 0 && it.getWidth() <= 100)
        c += it.getWidth();
    });

    return Math.abs(100 - c);
  }

  /**
   * Iterate throught every auto column
   * @param iterator
   */
  forEachAutoCol(iterator: (it: ColumnBuilder) => void): this {
    if (!this.cells) return this;

    this.cells.forEachColumn(it => {
      const builder = new ColumnBuilder(it);

      if (builder.hasAutoWidth()) iterator(builder);
    });

    return this;
  }

  /**
   * For each auto row use this iterator
   * @param iterator
   */
  forEachAutoRow(iterator: (it: RowBuilder) => void): this {
    if (!this.cells) return this;

    this.cells.forEachRow(it => {
      const builder = new RowBuilder(it);

      if (builder.hasAutoHeight()) iterator(builder);
    });

    return this;
  }

  /**
   * Set a configuration to all the auto rows
   * @param config
   */
  setToAllAutoRow(config: Partial<CellConfig>): this {
    this.forEachAutoRow(it => {
      it.setAll(config);
    });

    return this;
  }

  setToAllAutoCol(config: Partial<CellConfig>): this {
    this.forEachAutoCol(it => {
      it.setAll(config);
    });

    return this;
  }

  /**
   * Clears the contents of an entire row
   * @param index Row index
   */
  public clearRow(index: number): void {
    if (!this.existsRowWithIndex(index)) return;

    this.cells[index].forEach(it => it.content = '');
  }

  /**
   * Returns a specific row of this builder
   * @param index Index to extract from
   */
  getRow(index: number): RowBuilder | undefined {
    if (!this.existsRowWithIndex(index)) return undefined;

    return new RowBuilder(this.cells.getRow(index));
  }

  /**
   * Returns a column from its index or undefined if not found
   * @param index Index to search from
   */
  getColumn(index: number): ColumnBuilder | undefined {
    if (!this.existsColumnWithIndex(index)) return undefined;

    return new ColumnBuilder(this.cells.getColumn(index));
  }

  /**
   * Returns the first column of this Table
   */
  firstColumn(): ColumnBuilder | undefined {
    return new ColumnBuilder(this.cells.firstColumn());
  }

  /**
   * Returns the first row of this table
   */
  firstRow(): RowBuilder | undefined {
    return new RowBuilder(this.cells.firstRow());
  }

  /**
   * Returns the last row of this table
   */
  lastRow(): RowBuilder | undefined {
    return new RowBuilder(this.cells.lastRow());
  }

  /**
   * Returns the last column of this table
   */
  lastColumn(): ColumnBuilder | undefined {
    return new ColumnBuilder(this.cells.lastColumn());
  }

  /**
   * Returns the pure matrix of cells that represent this table
   */
  getMatrix(): Matrix2D<CellConfig> {
    return this.cells;
  }

  /**
   * Returns the number of rows in this table. If it is empty
   * it returns 0
   */
  getRowsCount(): number {
    if (!this.cells) return 0;

    return this.cells.getRowsCount();
  }

  /**
   * Get the header of this table.
   * If not defined, returns *undefined*
   */
  getHeader(): RowBuilder | undefined {
    if (this.getRowsCount() > 0) return new RowBuilder(this.cells.firstRow());
    return undefined;
  }

  /**
   * Sets the background of a specific range of columns
   * @param color Background color
   * @param start Start index
   * @param end End index
   */
  // public setRowsBackground(color: string, start: number = 0, end: number = this.rows().length): void {
  //   if (color === '') throw new Error('Invalid row background color');
  //   if (start < 0 || start >= this.rows().length) throw new Error(
  //     'Invalid start index');
  //   if (end < 0 || end > this.rows().length) throw new Error('Invalid end index');
  //   if (start > end) throw new Error('Invalid start / end indexes');
  //
  //   for (let x = start; x < end; x++) this.rows()[x].fill = color;
  // }

  /**
   * Clears the contents of an entire column
   * @param index Column index
   * @param clearHeader Indicates if this operation should affect only the
   * rows data or also the column header (default is true)
   */
  // public clearColumn(index: number, clearHeader: boolean = true): void {
  //   if (!this.existsColumnWithIndex(index)) throw new Error(
  //     'Invalid column index');
  //
  //   // Clear header
  //   if (clearHeader)
  //     this.header()[index].text = '';
  //
  //   // Clear all row cells
  //   for (let r of this.rows())
  //     r.data[index] = '';
  // }

  /**
   * Removes a specific row from the row list
   * @param index Row index
   * @param resize Should resize the table or no?
   */
  // public removeRow(index: number, resize?: boolean): void {
  //   if (!this.existsRowWithIndex(index)) throw new Error('Invalid row index');
  //
  //   if (resize === true) {
  //     const rowConf = new RowLayout(this.rows()[index].height);
  //
  //     if (rowConf.heightIsAuto()) this.downscaleHeightByPerc(RowLayoutGroup.fromRawConfiguration(
  //       this.rows()).getAutoRowPercentage());
  //     else this.downscaleHeightByPerc(rowConf.height as number);
  //   }
  //
  //   this.rows().splice(index, 1);
  // }

  /**
   * Removes a specific column from this table, clears all the data of the
   * given column
   * @param index The column index
   * @param resize Should resize the table or no?
   */
  // public removeColumn(index: number, resize?: boolean): void {
  //   if (!this.existsColumnWithIndex(index)) throw new Error(
  //     'Invalid column index');
  //
  //   if (resize === true) {
  //     const colConf = new ColumnLayout(this.header()[index].width);
  //
  //     if (colConf.widthIsAuto()) this.downscaleWidthByPerc(ColLayoutGroup.fromRawConfiguration(
  //       this.header()).getAutoColPercentage());
  //     else this.downscaleWidthByPerc(colConf.width as number);
  //   }
  //
  //   this.header().splice(index, 1);
  //
  //   for (let r of this.rows())
  //     r.data.splice(index, 1);
  // }

  /**
   * Clears a cell of the table
   * @param pos The position of the cell
   */
  // public clearCell(pos: CellPosition): void {
  //   if (!pos.existsInTable(this.header().length,
  //     this.rows().length)) throw new Error('Invalid cell position');
  //
  //   // Clear cell
  //   this.rows()[pos.rowIndex].data[pos.columnIndex] = '';
  // }

  /**
   * Applies a specific padding to all the rows and columns of this table
   * @param padding The padding value to apply
   */
  // public applyPadding(padding: number): void {
  //   for (let col of this.header()) col.padding = padding;
  //   for (let row of this.rows()) row.padding = padding;
  // }

  /**
   * Applies a padding to all the rows in the specified range
   * @param padding Padding to apply
   * @param startIndex Index to start from
   * @param endIndex Index to end with
   */
  // public applyPaddingToRows(padding: number, startIndex = 0, endIndex = this.rows().length) {
  //   if (startIndex > endIndex) throw new Error('Invalid start index');
  //   if (endIndex < startIndex) throw new Error('Invalid end index');
  //
  //   for (let x = startIndex; x < endIndex; x++) {
  //     if (this.rows()[x] === undefined) throw new Error(`Invalid row at index ${ x }`);
  //
  //     this.rows()[x].padding = padding;
  //   }
  // }

  /**
   * Shifts a row of a specific value in a specific direction
   * @param index The row index
   * @param verse The verse of the shifting
   * @param gap The gap
   */
  // public shiftRow(index: number, verse: Verse, gap: number): void {
  //   if (!this.existsRowWithIndex(index)) throw new Error('Invalid row index');
  //
  //   const termIndex = verse === Verse.After ? index + gap : index - gap;
  //   if (!this.existsRowWithIndex(termIndex)) throw new Error('Invalid gap value');
  //
  //   const temp = this.rows()[index];
  //   this.rows()[index] = this.rows()[termIndex];
  //   this.rows()[termIndex] = temp;
  // }

  /**
   * Shifts 2 rows by their indexes
   * @param startIndex The index of the first line
   * @param endIndex The index of the second line
   */
  // public swapRowsByIndex(startIndex: number, endIndex: number): void {
  //   if (!this.existsRowWithIndex(startIndex)) throw new Error(
  //     'Invalid start index');
  //
  //   if (!this.existsRowWithIndex(endIndex)) throw new Error('Invalid end index');
  //
  //   const temp = this.rows()[startIndex];
  //   this.rows()[startIndex] = this.rows()[endIndex];
  //   this.rows()[endIndex] = temp;
  // }

  /**
   * Shifts a column of a specific value in a specific direction
   * @param index The column index
   * @param verse The verse of the shifting
   * @param gap The gap
   * @param includeHeader Indicates if the header should be included or not
   */
  // public shiftColumn(index: number, verse: Verse, gap: number, includeHeader: boolean = true): void {
  //   if (!this.existsColumnWithIndex(index)) throw new Error(
  //     'Invalid column index');
  //
  //   const termIndex = verse === Verse.After ? index + gap : index - gap;
  //   if (!this.existsColumnWithIndex(termIndex)) throw new Error(
  //     'Invalid gap value');
  //
  //   if (includeHeader) {
  //     // Swap columns
  //     const temp = this.header()[index];
  //     this.header()[index] = this.header()[termIndex];
  //     this.header()[termIndex] = temp;
  //   }
  //
  //   // Swap row contents
  //   for (let r of this.rows())
  //     r.swapCells(index, termIndex);
  // }

  /**
   * Shifts 2 cells
   * @param cell Starting cell postion
   * @param vector The moving vector (x column span, y row span)
   */
  // public shiftCell(cell: CellPosition, vector: Vector): void {
  //   if (!cell.existsInTable(this.header().length,
  //     this.rows().length)) throw new Error('Invalid starting cell');
  //
  //   const endCell = new CellPosition(cell.rowIndex + vector.y,
  //     cell.columnIndex + vector.x);
  //   if (!endCell.existsInTable(this.header().length,
  //     this.rows().length)) throw new Error('Invalid moving vector');
  //
  //   // Swap this 2 cells
  //   const temp = this.rows()[endCell.rowIndex].data[endCell.columnIndex];
  //   this.rows()[endCell.rowIndex].data[endCell.columnIndex] = this.rows()[cell.rowIndex].data[cell.columnIndex];
  //   this.rows()[cell.rowIndex].data[cell.columnIndex] = temp;
  // }

  /**
   * Initializes the background color of the rows using an alternate color
   * @param contrastColor The background color name or hex value
   * @param primaryColor The primary color
   * @param startFromContrast Indicates if the coloration should start from the contrast color or from
   * the primary
   */
  // public autoBackground(contrastColor: string, primaryColor: string, startFromContrast: boolean = true): void {
  //   if (contrastColor === '') throw new Error('No background color specified');
  //   if (primaryColor === '') throw new Error('No primary color specified');
  //
  //   for (let x = 0; x < this.rows().length; x++) {
  //     if (((startFromContrast ? x + 1 : x) % 2) === 0) {
  //       this.rows()[x].fill = primaryColor;
  //     } else this.rows()[x].fill = contrastColor;
  //   }
  // }

  /**
   * Pushes a row into the list
   * @param row Row to add
   * @param resize Indicates if this operation should cause a resize or not
   */
  // public pushRow(row: Row, resize?: boolean): void {
  //   this.addRow(row, this.rows().length - 1, Verse.After, resize);
  // }

  /**
   * Adds a column at the end of the table
   * @param col The column to add
   * @param resize Should this operation resize or not?
   */
  // public pushColumn(col: Column, resize?: boolean): void {
  //   this.addColumn(col, this.header().length - 1, Verse.After, resize);
  // }

  /**
   * Pops a column from the list
   * @param resize
   */
  // public popColumn(resize?: boolean): Column {
  //   const temp = this.header()[this.header().length - 1];
  //   this.removeColumn(this.header().length - 1, resize);
  //   return temp;
  // }

  /**
   * Pops a row from this table
   * @param resize
   */
  // public popRow(resize?: boolean): Row {
  //   const temp = this.rows()[this.rows().length - 1];
  //   this.removeRow(this.rows().length - 1, resize);
  //   return temp;
  // }

  build(): Table {
    return new Table({
      ...this.options,
      cells: this.cells
    });
  }
}