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
import { Node }               from '../Node';

export interface AddRowConfig {
  row: RowBuilder;
  index?: number;
  verse?: Verse;
  resize?: boolean;
}

export interface AddColumnConfig {
  column: ColumnBuilder;
  index?: number;
  verse?: Verse;
  resize?: boolean;
}

/**
 * Represents a builder for a Table, created to manipulate it
 */
export class TableBuilder implements Builder<Table> {
  cells: Matrix2D<CellConfig>;
  options: Partial<TableConfig>;

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
   * Overrides the options of a table using only the
   * specified ones
   * @param options
   */
  overrideOptions(options: Partial<TableConfig>): this {
    this.options = options;

    return this;
  }

  /**
   * Sets the header of this table
   * @param header
   */
  withHeader(header: RowBuilder): this {
    if (!this.cells) this.cells = new Matrix2D([header.build()]);

    if (this.cells[0]) this.cells[0] = header.build();
    else this.cells.pushRow(header.build());

    if (header.hasAutoWidth()) header.fitWidth();

    this.adaptVSpace();
    return this;
  }

  /**
   * Adds a row to the table, with advanced parameters.
   *
   * @param options Options to configure this method
   */
  public addRow(options: AddRowConfig): this {
    let resize = options.resize;

    if (!options.row.hasHeight()) {
      // We need to give it a width
      // Set it to auto
      options.row.autoHeight();
      // Calculate new auto coefficent
      const autoRows = this.getAutoRowsCount() + 1;

      const k = this.getVFreeSpace() / autoRows;
      options.row.setHeight(k);

      // Change width of all other auto columns
      this.setToAllAutoRow({
        height: k,
      });
    }

    if (!options.row.hasWidth()) {
      options.row.autoWidth();
      options.row.fitWidth();
    }

    // Insert the row
    if (!options.index) this.cells.pushRow(options.row.build());
    else
      this.cells.insertRow(options.row.build(),
        options.index,
        options.verse || Verse.After);

    if (resize) {
      const addHeight = this.getHeight() * (options.row.getHeight() / 100);
      this.setHeight(this.getHeight() + addHeight);
    }

    this.adaptVSpace();

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
   */
  public addColumn(config: AddColumnConfig): this {
    const resize = config.resize;

    if (!config.column.hasWidth()) {
      // We need to give it a width
      // Set it to auto
      config.column.autoWidth();
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
      config.column.autoHeight();
    }

    if (config.index === undefined) {
      this.cells.pushColumn(config.column.build());
    } else {
      this.cells.insertColumn(config.column.build(),
        config.index,
        config.verse || Verse.After);
    }

    if (resize) {
      const addWidth = this.getWidth() * (config.column.getWidth() / 100);
      this.setWidth(this.getWidth() + addWidth);
    }

    return this;
  }

  /**
   * Adapts the horizontal space, recalculating auto-width columns
   */
  adaptHSpace(): this {
    // Calculate new auto coefficent
    const autoCols = this.getAutoColCount();

    const k = this.getHFreeSpace() / autoCols;

    // Change width of all other auto columns
    this.setToAllAutoCol({
      width: k,
    });

    return this;
  }

  /**
   * Adapts rows space, recalculating auto-rows height
   */
  adaptVSpace(): this {
    // Calculate new auto coefficent
    const autoRows = this.getAutoRowsCount();

    const k = this.getVFreeSpace() / autoRows;

    // Change width of all other auto columns
    this.setToAllAutoRow({
      height: k,
    });

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
   * Iterates every column of this table
   * @param iterator
   */
  forEachColumn(iterator: (column: ColumnBuilder) => void) {
    this.cells.forEachColumn(it => iterator(new ColumnBuilder(it)));
  }

  /**
   * Iterates every row of this table
   * @param iterator
   */
  forEachRow(iterator: (row: RowBuilder) => void) {
    this.cells.forEachRow(it => iterator(new RowBuilder(it)));
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

  /**
   * Returns the number of rows that override the auto width
   */
  getOVRowCount(): number {
    return this.getRowsCount() - this.getAutoRowsCount();
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
   * Iterates throught every override row (with custom height)
   * @param iterator
   */
  forEachOVRow(iterator: (it: RowBuilder) => void): this {
    if (!this.cells) return this;

    this.cells.forEachRow(it => {
      const b = new RowBuilder(it);
      if (b.hasOVHeight()) iterator(b);
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
   * Returns the vertical space in percentage not used by
   * the overwritten rows (with custom height)
   */
  getVFreeSpace(): number {
    let c = 0;

    this.forEachOVRow(it => {
      if (it.getHeight() > 0 && it.getHeight() <= 100)
        c += it.getHeight();
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
   * Recalculates auto space to fit container
   */
  adaptSpace(): this {
    this.adaptHSpace();
    this.adaptVSpace();

    return this;
  }

  /**
   * Sets the cells of this table
   * @param cells
   */
  setCells(cells: Matrix2D<CellConfig>): this {
    this.cells = cells;
    this.adaptSpace();
    return this;
  }

  /**
   * Returns a specific row of this builder
   * @param index Index to extract from
   */
  getRow(index: number): RowBuilder | undefined {
    return new RowBuilder(this.cells.getRow(index));
  }

  /**
   * Returns a column from its index or undefined if not found
   * @param index Index to search from
   */
  getColumn(index: number): ColumnBuilder | undefined {
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
   * The last column index
   */
  lastColumnIndex(): number {
    return this.cells.lastColumnIndex();
  }

  /**
   * The last row index
   */
  lastRowIndex(): number {
    return this.cells.lastRowIndex();
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
   * Checks if this table has a row at the specified index
   * @param index Index to check
   */
  hasRowAtIndex(index: number): boolean {
    return this.cells.hasRowAt(index);
  }

  /**
   * Checks if this table has a column at a specific index
   * @param index
   */
  hasColumnAtIndex(index: number): boolean {
    return this.cells.hasColumnAt(index);
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
   * Construct a new table giving complete number of cells (5x5)
   * @param x Number of cells per row
   * @param y Number of rows
   * @param shapeConfig Initial shape configuration
   * @param cellConfig Cell configuration to apply to all the cells
   */
  static withCells(x: number, y: number, shapeConfig?: TableConfig, cellConfig?: Partial<CellConfig>): TableBuilder {
    let builder = new TableBuilder(shapeConfig);

    if (x <= 0 || y <= 0) return builder;

    for (let i = 0; i < y; i++)
      builder.addRow({
        row: RowBuilder.withCells(x, cellConfig)
      });

    return builder;
  }

  /**
   * Constructs a table starting from the JSON.
   *
   * @param json The json string to parse (it has to have the same structure of the Table class)
   * @returns TableBuilder A table builder to perform operations on the loaded table
   */
  static fromJSON(json: string): TableBuilder {
    let builder = new TableBuilder();

    try {
      const table = Node.create(json) as Table;

      return TableBuilder.fromTable(table);
    } catch (e) {

    }

    return builder;
  }

  /**
   * Removes a row from this table
   * @param index Index of the row to remove
   * @param resize Indicates if this operation should let the size of the table shrink or not
   */
  removeRow(index: number, resize: boolean = true): this {
    if (!this.hasRowAtIndex(index)) return this;

    const rowHeight = this.getRow(index).getHeight();
    const newHeight = this.getHeight() - ((rowHeight / 100) * this.getHeight());

    this.cells.removeRow(index);

    if (resize) this.setHeight(newHeight);

    return this;
  }

  /**
   * Removes a specific column from this table
   * @param index The column index
   * @param resize Should resize the table or no?
   */
  removeColumn(index: number, resize: boolean = true): this {
    if (!this.hasColumnAtIndex(index)) return this;

    const columnWidth = this.getColumn(index).getWidth();
    const newWidth = this.getWidth() - ((columnWidth / 100) * this.getWidth());

    this.cells.removeColumn(index);

    if (resize) this.setWidth(newWidth);

    return this;
  }

  /**
   * Pushes a row at the bottom of this table
   * @param row Row to add
   * @param resize Indicates if this operation should cause a resize or not
   */
  public pushRow(row: RowBuilder, resize?: boolean): this {
    this.addRow({
      row,
      resize
    });

    return this;
  }

  /**
   * Adds a column at the end of the table
   * @param column The column to add
   * @param resize Should this operation resize or not?
   */
  public pushColumn(column: ColumnBuilder, resize?: boolean): this {
    return this.addColumn({
      column,
      resize
    });
  }

  /**
   * Creates a builder to edit a specific table
   * @param table To edit
   */
  static fromTable(table: Table): TableBuilder {
    const b = new TableBuilder(table.toConfig());
    b.setCells(new Matrix2D<CellConfig>(table.cells().slice()));

    return b;
  }

  /**
   * Build the cells of this table, excluding pure shape configuration
   */
  buildCells(): Matrix2D<CellConfig> {
    return this.cells;
  }

  /**
   * Builds the content of this table directly to a pre-existing
   * table object. This does not transfer shape configuration (external border, width, height)
   * but only cells data.
   * @param table
   */
  buildTo(table: Table): void {
    table.cells(this.cells.data);
  }

  /**
   * Builds all the cells of this table to a matrix containing
   * only their content
   */
  buildContent(): Matrix2D<string> {
    return this.getMatrix().map<string>(it => it.content);
  }

  /**
   * Populates the content of a Table
   * @param content A matrix containing only the contents of the string
   * @param includesHeader Should it start from the header or skip to the next row?
   */
  populateContent(content: Matrix2D<string>, includesHeader?: boolean): this {
    const headered = !!includesHeader;
    let rowIndex = headered ? 0 : 1;

    content.forEachRow(row => {
      let index = 0;

      const r = this.cells.getRow(rowIndex);
      if (r !== undefined)
        r.forEach(it => {
          it.content = row[index] || '';
          index++;
        });

      rowIndex++;
    });

    return this;
  }

  /**
   * Builds a new table from this builder
   */
  build(): Table {
    return new Table({
      ...this.options,
      cells: this.cells.data
    });
  }

  /**
   * Build directly a JSON string for this table
   */
  buildJSON(): string {
    return this.build().toJSON();
  }
}