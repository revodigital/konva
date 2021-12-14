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

import { Shape, ShapeConfig }                    from '../Shape';
import { _registerNode }                         from '../Global';
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
import { PointRectangle }                        from './pointrectangle';

interface TableConfig extends ShapeConfig {
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
  private _addHeaderRow(): void {
    // Copy array
    const temp = Array.from(this.rows());
    const rowsData = this.header().map((col) => {
      return col.text;
    }) as string[];

    this.rows([new Row({
      height: this.headerHeight(),
      data: rowsData,
      fill: this.headerFill(), ...this.headerText()
    }), ...temp]);
  }

  /**
   * Calculates the layout of this table, including rows and columns.
   * @private
   */
  private _calculateLayout(): TableLayout {
    // Calculate edges positions
    let layout = new TableLayout();
    // Add a row for the header and generate internal values

    layout.parseFromConfiguration(ColumnRowLayoutConfiguration.fromColRowConfig(
      this.header(),
      this.rows()));
    layout.edgesRectangle = PointRectangle.calculateFromCenter(this.width(),
      this.height());
    layout.tableHeight = this.height();
    layout.tableWidth = this.width();

    return layout;
  }

  _sceneFunc(context: Context) {
    this._addHeaderRow();

    // Calculate layout
    const layout = this._calculateLayout();

    this._renderTableBorders(layout, context._context);
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
    // ctx.lineTo(layout.edgesRectangle.bottomRight.x,
    //   layout.edgesRectangle.bottomRight.y);
    // ctx.lineTo(layout.edgesRectangle.bottomLeft.x,
    //   layout.edgesRectangle.bottomLeft.y);
    // ctx.lineTo(layout.edgesRectangle.topLeft.x,
    //   layout.edgesRectangle.topLeft.y);
    ctx.closePath();

    ctx.strokeStyle = this.externalBorder().color;
    ctx.lineWidth = this.externalBorder().width;
    ctx.stroke();
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