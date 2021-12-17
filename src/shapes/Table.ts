/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: Table.ts
 * Project: pamela
 * Committed last: 2021/12/14 @ 117
 * ---
 * Description:
 */

import { Shape, ShapeConfig, ShapeGetClientRectConfig } from '../Shape';
import { _registerNode }                                from '../Global';
import { Context }                               from '../Context';
import { Column, IColumn }                       from './column';
import { IRow, Row }                             from './Row';
import { ITextConfiguration, TextConfiguration } from './TextConfiguration';
import { BorderOptions, IBorderOptions }         from './borderoptions';
import { Get, GetSet }                           from '../types';
import { Factory }                               from '../Factory';
import { TableLayout }                           from './TableLayout';
import {
  ColumnRowLayoutConfiguration
}                                                from './columnrowlayoutconfiguration';
import {
  PointRectangle2D
}                                                from '../common/PointRectangle2D';
import { Cell }                 from './cell';
import { CellPosition }         from './cellposition';
import { Point2D }              from '../common/Point2D';
import { InvalidConfiguration } from '../exceptions/invalidConfiguration';
import { Verse }                from './Verse';
import { Vector }               from './Vector';
import { ColumnLayout }         from './columnlayout';
import { ColLayoutGroup }       from './collayoutgroup';
import { insertToArray }        from './utils';
import { RowLayout }            from './rowlayout';
import { RowLayoutGroup }       from './rowlayoutgroup';
import { Transform }            from '../Util';
import { NodeConfig }           from '../Node';

export interface TableConfig extends ShapeConfig {
  header: IColumn[];
  rows: IRow[];

  headerFill?: string;
  headerText?: ITextConfiguration;
  headerHeight: number | 'auto';
  externalBorder?: IBorderOptions;
  internalBorder?: IBorderOptions;
}

/**
 * Represents a table
 */
export class Table extends Shape<TableConfig> {
  /**
   * Table header, defines the column width for all rows of the table
   */
  header: GetSet<Column[], this>;

  /**
   * Array with all the rows of the table. Each Row object handles the configuration
   * and the content of all cells inside it.
   */
  rows: GetSet<Row[], this>;

  /**
   * Configuration for the internal border of this table
   */
  internalBorder: GetSet<IBorderOptions, this>;

  /**
   * Configuration for the external border of this table
   */
  externalBorder: GetSet<IBorderOptions, this>;

  /**
   * The height percentage of the header row
   */
  headerHeight: GetSet<number | 'auto', this>;

  /**
   * Fill color for the background of the header
   */
  headerFill: GetSet<string, this>;

  /**
   * Header text options
   */
  headerText: GetSet<ITextConfiguration, this>;

  /**
   * Adds the header row to the rows
   * @private
   */
  private _getEffectiveRows(): Row[] {
    // Copy array
    const temp = Array.from(this.rows());
    const rowsData = this.header().map((col) => {
      return col.text;
    }) as string[];

    return [new Row({
      height: this.headerHeight(),
      data: rowsData,
      fill: this.headerFill(), ...this.headerText()
    }), ...temp];
  }

  getSelfRect(): { x: number; width: number; y: number; height: number } {
    return {
      x: 0,
      y: 0,
      width: this.width(),
      height: this.height()
    }
  }

  /**
   * Calculates the layout of this table, including rows and columns.
   * @private
   */
  private _calculateLayout(rows: Row[]): TableLayout {
    // Calculate edges positions
    let layout = new TableLayout();
    // Add a row for the header and generate internal values

    layout.parseFromConfiguration(ColumnRowLayoutConfiguration.fromColRowConfig(
      this.header(),
      rows));
    layout.edgesRectangle = PointRectangle2D.calculateFromStart(this.width(),
      this.height());
    layout.tableHeight = this.height();
    layout.tableWidth = this.width();

    return layout;
  }

  _sceneFunc(context: Context) {

    const rows = this._getEffectiveRows();

    // Calculate layout
    const layout = this._calculateLayout(rows);

    this._renderContent(layout, rows, context._context);

    this._renderTableBorders(layout, context._context);

    context.fillStrokeShape(this);
  }

  private _renderTableBorders(layout: TableLayout, ctx: CanvasRenderingContext2D): void {
    // Draw table borders
    ctx.beginPath();
    ctx.moveTo(0,
      0);
    ctx.lineTo(layout.tableWidth,
      0);
    ctx.lineTo(layout.tableWidth, layout.tableHeight);
    ctx.lineTo(0, layout.tableHeight);
    ctx.lineTo(0, 0);
    ctx.closePath();

    ctx.strokeStyle = this.externalBorder().color;
    ctx.lineWidth = this.externalBorder().width;
    ctx.stroke();
  }

  /**
   * Renders the content of this table (effective data)
   * @param ctx The drawing context
   * @param layout Content layout
   * @private
   */
  private _renderContent(layout: TableLayout, rows: Row[], ctx: CanvasRenderingContext2D): void {
    // Drawing start point
    let startingPoint = new Point2D(layout.edgesRectangle.topLeft.x,
      layout.edgesRectangle.topLeft.y);

    for (let row = 0; row < layout.getRowsCount(); row++) {
      for (let col = 0; col < layout.getColumnsCount(); col++) {
        // Create cell layout
        let cellLayout = layout.getCellLayout(new CellPosition(row, col));

        cellLayout.startPoint = startingPoint;
        const cellRect = cellLayout.calculateLayout(this.height(),
          this.width());

        // Draw cell
        let cellContent: string;
        let cellConf: TextConfiguration;

        const rowConfiguration = rows[row];

        cellContent = rowConfiguration.data[col];
        cellConf = rows[row];

        const cell = new Cell({
            content: cellContent,
            edges: cellRect,
            ...cellConf,
            border: this.internalBorder()
          },
          (col === (layout.getColumnsCount() - 1)),
          (row === (layout.getRowsCount() - 1)), this.externalBorder());
        cell._render(ctx);

        // Increment point
        startingPoint = new Point2D(startingPoint.x + cellLayout.getEffectiveWidth(
          this.width()), startingPoint.y);
      }

      // Increment point
      startingPoint.y += layout.getEffectiveRowHeight(row);
      startingPoint.x = layout.edgesRectangle.topLeft.x;
    }
  }

  /**
   * Adds a row to the table
   * @param row The row to add
   * @param index The starting index of the operation
   * @param verse The verse of this operation
   * @param include Indicates if the new row should cause a resize of the table to fully contain it
   */
  public addRow(row: Row, index: number, verse: Verse, include?: boolean): void {
    if (!this.existsRowWithIndex(index)) throw new Error('Invalid row index');

    this.rows(insertToArray<Row>(this.rows(), row, index, verse));

    if (include === true) {
      const rowLayout = new RowLayout(row.height);
      let addHeight: number;

      if (rowLayout.heightIsAuto())
        addHeight = this.height() * (RowLayoutGroup.fromRawConfiguration(
          this.rows()).getAutoRowPercentage() / 100);
      else
        addHeight = this.height() * ((rowLayout.height as number) / 100);

      this.height(this.height() + addHeight);
    }
  }

  /**
   * Checks if there is a row with the given index
   * @param index The row index
   */
  public existsRowWithIndex(index: number): boolean {
    return (index >= 0 && index < this.rows().length && this.rows()[index] !== undefined);
  }

  /**
   * Checks if there is a column with the specifed index
   * @param index The column index
   */
  public existsColumnWithIndex(index: number): boolean {
    return (index >= 0 && index < this.header().length && this.header()[index] !== undefined);
  }

  /**
   * Adds a column to the table
   * @param col The column to add
   * @param index The starting index of this operation
   * @param verse The adding verse, just as addRow
   * @param data Optional array of data string to set in rows
   * @param include Indicates if the new column should increase the width of this table
   * to ensure it is included into it
   */
  public addColumn(col: Column, index: number, verse: Verse, include?: boolean, data?: string[]): void {
    if (!this.existsColumnWithIndex(index)) throw new Error(
      'Invalid column index');

    this.header(insertToArray<Column>(this.header(), col, index, verse));

    let i = 0;

    let dat = data || [];

    // Insert empty row values
    for (let r of this.rows()) {
      r.data = insertToArray<string>(r.data, dat[i] || '', index, verse);
      i++;
    }

    if (include === true) {
      const column = new ColumnLayout(col.width);
      let addWidth: number;

      if (column.widthIsAuto())
        addWidth = this.width() * (ColLayoutGroup.fromRawConfiguration(
          this.header()).getAutoColPercentage() / 100);
      else {
        addWidth = this.width() * ((column.width as number) / 100);
      }

      this.width(this.width() + addWidth);
    }
  }

  /**
   * Clears the contents of an entire row
   * @param index Row index
   */
  public clearRow(index: number): void {
    if (!this.existsRowWithIndex(index)) throw new Error('Invalid row index');

    this.rows()[index].data = [];
  }

  /**
   * Sets the background of a specific range of columns
   * @param color Background color
   * @param start Start index
   * @param end End index
   */
  public setRowsBackground(color: string, start: number = 0, end: number = this.rows().length): void {
    if (color === '') throw new Error('Invalid row background color');
    if (start < 0 || start >= this.rows().length) throw new Error(
      'Invalid start index');
    if (end < 0 || end > this.rows().length) throw new Error('Invalid end index');
    if (start > end) throw new Error('Invalid start / end indexes');

    for (let x = start; x < end; x++) this.rows()[x].fill = color;
  }

  /**
   * Scales width and height applying a percentage
   * @param perc Percentage value
   */
  public scaleAllByPerc(perc: number): void {
    this.scaleWidthByPerc(perc);
    this.scaleHeightByPerc(perc);
  }

  /**
   * Scales width and height applying a percentage
   * @param perc Percentage value
   */
  public downscaleAllByPerc(perc: number): void {
    this.downscaleHeightByPerc(perc);
    this.downscaleWidthByPerc(perc);
  }

  /**
   * Scales this table applying 2 specific percentages
   * @param percW Percentage to scale width
   * @param percH Percentage to scale height
   */
  public scaleBounds(percW: number, percH: number): void {
    this.scaleHeightByPerc(percH);
    this.scaleWidthByPerc(percW);
  }

  /**
   * Downscales this table applying 2 specific percentages
   * @param percW Percentage to downscale width
   * @param percH Percentage to downscale height
   */
  public downscaleBounds(percW: number, percH: number): void {
    this.downscaleHeightByPerc(percH);
    this.downscaleWidthByPerc(percW);
  }

  /**
   * Scales the width of this table using a specific percentage
   * @param perc Percentage value (also 200% is allowed)
   */
  public scaleWidthByPerc(perc: number): void {
    if (perc <= 0) throw new Error('Invalid percentage value');

    this.width(((this.width() * (perc / 100)) + this.width()));
  }

  /**
   * Scales the height of this table using a specific percentage
   * @param perc Percentage value
   */
  public scaleHeightByPerc(perc: number): void {
    if (perc <= 0) throw new Error('Invalid percentage value');

    this.height((this.height() * (perc / 100)) + this.height());
  }

  /**
   * Downscales the height of this table
   * @param perc Percentage to apply
   */
  public downscaleHeightByPerc(perc: number): void {
    if (perc >= 100) throw new Error('Invalid percentage value');

    this.height(this.height() - (this.height() * (perc / 100)));
  }

  /**
   * Downscales the width of this table
   * @param perc Percentage to apply
   */
  public downscaleWidthByPerc(perc: number): void {
    if (perc >= 100) throw new Error('Invalid percentage value');

    this.width(this.width() - (this.width() * (perc / 100)));
  }

  /**
   * Clears the contents of an entire column
   * @param index Column index
   * @param clearHeader Indicates if this operation should affect only the
   * rows data or also the column header (default is true)
   */
  public clearColumn(index: number, clearHeader: boolean = true): void {
    if (!this.existsColumnWithIndex(index)) throw new Error(
      'Invalid column index');

    // Clear header
    if (clearHeader)
      this.header()[index].text = '';

    // Clear all row cells
    for (let r of this.rows())
      r.data[index] = '';
  }

  /**
   * Removes a specific row from the row list
   * @param index Row index
   * @param resize Should resize the table or no?
   */
  public removeRow(index: number, resize?: boolean): void {
    if (!this.existsRowWithIndex(index)) throw new Error('Invalid row index');

    if (resize === true) {
      const rowConf = new RowLayout(this.rows()[index].height);

      if (rowConf.heightIsAuto()) this.downscaleHeightByPerc(RowLayoutGroup.fromRawConfiguration(
        this.rows()).getAutoRowPercentage());
      else this.downscaleHeightByPerc(rowConf.height as number);
    }

    this.rows().splice(index, 1);
  }

  /**
   * Removes a specific column from this table, clears all the data of the
   * given column
   * @param index The column index
   * @param resize Should resize the table or no?
   */
  public removeColumn(index: number, resize?: boolean): void {
    if (!this.existsColumnWithIndex(index)) throw new Error(
      'Invalid column index');

    if (resize === true) {
      const colConf = new ColumnLayout(this.header()[index].width);

      if (colConf.widthIsAuto()) this.downscaleWidthByPerc(ColLayoutGroup.fromRawConfiguration(
        this.header()).getAutoColPercentage());
      else this.downscaleWidthByPerc(colConf.width as number);
    }

    this.header().splice(index, 1);

    for (let r of this.rows())
      r.data.splice(index, 1);
  }

  /**
   * Clears a cell of the table
   * @param pos The position of the cell
   */
  public clearCell(pos: CellPosition): void {
    if (!pos.existsInTable(this.header().length,
      this.rows().length)) throw new Error('Invalid cell position');

    // Clear cell
    this.rows()[pos.rowIndex].data[pos.columnIndex] = '';
  }

  /**
   * Applies a specific padding to all the rows and columns of this table
   * @param padding The padding value to apply
   */
  public applyPadding(padding: number): void {
    for (let col of this.header()) col.padding = padding;
    for (let row of this.rows()) row.padding = padding;
  }

  /**
   * Applies a padding to all the rows in the specified range
   * @param padding Padding to apply
   * @param startIndex Index to start from
   * @param endIndex Index to end with
   */
  public applyPaddingToRows(padding: number, startIndex = 0, endIndex = this.rows().length) {
    if (startIndex > endIndex) throw new Error('Invalid start index');
    if (endIndex < startIndex) throw new Error('Invalid end index');

    for (let x = startIndex; x < endIndex; x++) {
      if (this.rows()[x] === undefined) throw new Error(`Invalid row at index ${ x }`);

      this.rows()[x].padding = padding;
    }
  }

  /**
   * Shifts a row of a specific value in a specific direction
   * @param index The row index
   * @param verse The verse of the shifting
   * @param gap The gap
   */
  public shiftRow(index: number, verse: Verse, gap: number): void {
    if (!this.existsRowWithIndex(index)) throw new Error('Invalid row index');

    const termIndex = verse === Verse.After ? index + gap : index - gap;
    if (!this.existsRowWithIndex(termIndex)) throw new Error('Invalid gap value');

    const temp = this.rows()[index];
    this.rows()[index] = this.rows()[termIndex];
    this.rows()[termIndex] = temp;
  }

  /**
   * Shifts 2 rows by their indexes
   * @param startIndex The index of the first line
   * @param endIndex The index of the second line
   */
  public swapRowsByIndex(startIndex: number, endIndex: number): void {
    if (!this.existsRowWithIndex(startIndex)) throw new Error(
      'Invalid start index');

    if (!this.existsRowWithIndex(endIndex)) throw new Error('Invalid end index');

    const temp = this.rows()[startIndex];
    this.rows()[startIndex] = this.rows()[endIndex];
    this.rows()[endIndex] = temp;
  }

  /**
   * Shifts a column of a specific value in a specific direction
   * @param index The column index
   * @param verse The verse of the shifting
   * @param gap The gap
   * @param includeHeader Indicates if the header should be included or not
   */
  public shiftColumn(index: number, verse: Verse, gap: number, includeHeader: boolean = true): void {
    if (!this.existsColumnWithIndex(index)) throw new Error(
      'Invalid column index');

    const termIndex = verse === Verse.After ? index + gap : index - gap;
    if (!this.existsColumnWithIndex(termIndex)) throw new Error(
      'Invalid gap value');

    if (includeHeader) {
      // Swap columns
      const temp = this.header()[index];
      this.header()[index] = this.header()[termIndex];
      this.header()[termIndex] = temp;
    }

    // Swap row contents
    for (let r of this.rows())
      r.swapCells(index, termIndex);
  }

  /**
   * Shifts 2 cells
   * @param cell Starting cell postion
   * @param vector The moving vector (x column span, y row span)
   */
  public shiftCell(cell: CellPosition, vector: Vector): void {
    if (!cell.existsInTable(this.header().length,
      this.rows().length)) throw new Error('Invalid starting cell');

    const endCell = new CellPosition(cell.rowIndex + vector.y,
      cell.columnIndex + vector.x);
    if (!endCell.existsInTable(this.header().length,
      this.rows().length)) throw new Error('Invalid moving vector');

    // Swap this 2 cells
    const temp = this.rows()[endCell.rowIndex].data[endCell.columnIndex];
    this.rows()[endCell.rowIndex].data[endCell.columnIndex] = this.rows()[cell.rowIndex].data[cell.columnIndex];
    this.rows()[cell.rowIndex].data[cell.columnIndex] = temp;
  }

  /**
   * Initializes the background color of the rows using an alternate color
   * @param contrastColor The background color name or hex value
   * @param primaryColor The primary color
   * @param startFromContrast Indicates if the coloration should start from the contrast color or from
   * the primary
   */
  public autoBackground(contrastColor: string, primaryColor: string, startFromContrast: boolean = true): void {
    if (contrastColor === '') throw new Error('No background color specified');
    if (primaryColor === '') throw new Error('No primary color specified');

    for (let x = 0; x < this.rows().length; x++) {
      if (((startFromContrast ? x + 1 : x) % 2) === 0) {
        this.rows()[x].fill = primaryColor;
      } else this.rows()[x].fill = contrastColor;
    }
  }

  /**
   * Pushes a row into the list
   * @param row Row to add
   * @param resize Indicates if this operation should cause a resize or not
   */
  public pushRow(row: Row, resize?: boolean): void {
    this.addRow(row, this.rows().length - 1, Verse.After, resize);
  }

  /**
   * Adds a column at the end of the table
   * @param col The column to add
   * @param resize Should this operation resize or not?
   */
  public pushColumn(col: Column, resize?: boolean): void {
    this.addColumn(col, this.header().length - 1, Verse.After, resize);
  }

  /**
   * Pops a column from the list
   * @param resize
   */
  public popColumn(resize?: boolean): Column {
    const temp = this.header()[this.header().length - 1];
    this.removeColumn(this.header().length - 1, resize);
    return temp;
  }

  /**
   * Pops a row from this table
   * @param resize
   */
  public popRow(resize?: boolean): Row {
    const temp = this.rows()[this.rows().length - 1];
    this.removeRow(this.rows().length - 1, resize);
    return temp;
  }

  /**
   * Sets the row background color to transparent
   * @param rowIndex The row index
   */
  public setRowTransparent(rowIndex: number): void {
    if (!this.existsRowWithIndex(rowIndex)) throw new Error('Invalid row index');

    this.rows()[rowIndex].fill = 'transparent';
    this.clearCache();
  }
}

/**
 * Get / set table header
 */
Factory.addGetterSetter<Column[]>(Table, 'header', []);

/**
 * Get / set table rows and their content
 */
Factory.addGetterSetter<Row[]>(Table, 'rows', []);

/**
 * Get / set table internal border configuration
 */
Factory.addGetterSetter<IBorderOptions>(Table,
  'internalBorder',
  BorderOptions.getDefaultBorder());

/**
 * Get / set external border configuration
 */
Factory.addGetterSetter<IBorderOptions>(Table,
  'externalBorder',
  BorderOptions.getDefaultBorder());

/**
 * Get / set header height in percentage
 */
Factory.addGetterSetter<number | 'auto'>(Table, 'headerHeight', 0);

/**
 * Get / set header fill (background color)
 */
Factory.addGetterSetter<string>(Table, 'headerFill', 'black');

/**
 * Get / set header text formatting configuration
 */
Factory.addGetterSetter<ITextConfiguration>(Table,
  'headerText',
  TextConfiguration.getDefaultOptions());

Table.prototype.className = 'Table';

// Register this new shape
_registerNode(Table);