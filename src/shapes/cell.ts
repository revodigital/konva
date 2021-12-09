/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: cell.ts
 * Project: complex-shapes
 * Committed last: 2021/10/18 @ 1641
 * ---
 * Description: Implements the class Cell for rendering a cell
 */

import { PointRectangle }                         from './pointrectangle';
import { HorizontalAlignment, VerticalAlignment } from './alignment';
import { ITextConfiguration, TextConfiguration }  from './TextConfiguration';
import { IBorderOptions }                         from './borderoptions';
import { Point }                                  from '../common/Point';

/**
 * Defines the configuration properties of a single cell
 */
export interface ICell extends ITextConfiguration {
  content?: string;
  edges: PointRectangle;
  fill?: string;
  border?: IBorderOptions;
}

/**
 * Provides a low-level api for rendering table cells. After you specify a rectangle
 * containing all the points of the cell, you can add a configuration to the cell.
 * Column and Row unify more cells. The configuration of a single cell respects the
 * configuration of a Column or a Row.
 */
export class Cell extends TextConfiguration {
  /**
   * Cell content
   */
  content: string;

  /**
   * Cell edges rectangle
   */
  edges: PointRectangle;

  /**
   * Cell fill color
   */
  fill: string;

  /**
   * Indicates if this cell should have some borders
   */
  border: IBorderOptions;

  private _lastOfCol: boolean;
  private _lastOfRow: boolean;
  private _tableExternalBorder: IBorderOptions;

  /**
   * Creates a new instance of a Cell class, for drawing a Cell into a table.
   * @param options Configuration following ICell interface.
   * @param lastOfColumn Indicates if this cell is the last of the column
   * @param lastOfRow Indicates if this cell is the last of the row
   * @param tableExternalBorder The table external border informations
   */
  constructor(options: ICell, lastOfColumn: boolean, lastOfRow: boolean, tableExternalBorder: IBorderOptions) {
    super(options);
    this.content = options.content || '';
    this.edges = options.edges;
    this.fill = options.fill || 'gray';
    this.border = options.border || {
      visible: true,
      color: 'black',
      width: 1
    };
    this._lastOfCol = lastOfColumn;
    this._lastOfRow = lastOfRow;
    this._tableExternalBorder = tableExternalBorder;
  }

  /**
   * Renders this cell
   * @param ctx The drawing context
   */
  _render(ctx: CanvasRenderingContext2D): void {
    if (this.fill !== 'transparent') {
      ctx.fillStyle = this.fill;
      ctx.fillRect(this.edges.topLeft.x,
        this.edges.topLeft.y,
        this.edges.getWidth(),
        this.edges.getHeight());
    }

    this._renderText(ctx);

    if (this.border.visible) this._renderBorders(ctx);
  }

  /**
   * Renders the cell text
   * @param ctx Drawing context
   * @private
   */
  private _renderText(ctx: CanvasRenderingContext2D): void {
    // Set fill style
    ctx.fillStyle = this.textColor;
    // Format font configuration string
    ctx.font = this._formatFontString();

    // Calculate rectangle center
    const center = this.edges.getCenter();
    const textMeasure = ctx.measureText(this.content);
    let startPoint = new Point(0, 0);

    // Set horizontal position
    switch (this.textAlign) {
      case HorizontalAlignment.Center:
        ctx.textAlign = 'center';
        startPoint.x = center.x;
        break;
      case HorizontalAlignment.Left:
        ctx.textAlign = 'start';
        startPoint.x = this.edges.topLeft.x + this.padding;
        break;
      case HorizontalAlignment.Right:
        ctx.textAlign = 'end';
        startPoint.x = this.edges.topRight.x - this.padding;
        break;
    }

    // Set vertical position
    switch (this.verticalAlign) {
      case VerticalAlignment.Center:
        startPoint.y = center.y + (textMeasure.actualBoundingBoxAscent / 2);
        break;
      case VerticalAlignment.Bottom:
        startPoint.y = this.edges.bottomRight.y - this.padding - (textMeasure.actualBoundingBoxAscent);
        break;
      case VerticalAlignment.Top:
        startPoint.y = this.edges.topLeft.y + this.padding + (textMeasure.actualBoundingBoxAscent);
        break;
    }

    ctx.fillText(this.content,
      startPoint.x,
      startPoint.y);
  }

  /**
   * Renders the borders of this cell
   * @param ctx Drawing context
   * @private
   */
  private _renderBorders(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.border.color;
    ctx.lineWidth = this.border.width;
    ctx.closePath();

    // Bottom border
    if(!this._lastOfRow) {
      ctx.beginPath();
      ctx.moveTo(this.edges.topRight.x, this.edges.topRight.y);
      ctx.moveTo(this.edges.bottomRight.x, this.edges.bottomRight.y);
      ctx.moveTo(this.edges.bottomLeft.x, this.edges.bottomLeft.y);
      ctx.lineTo(this.edges.bottomRight.x, this.edges.bottomRight.y);
      ctx.stroke();
      ctx.closePath();
    }

    // Right border
    if(!this._lastOfCol) {
      ctx.beginPath();
      ctx.moveTo(this.edges.topRight.x, this.edges.topRight.y);
      ctx.lineTo(this.edges.bottomRight.x, this.edges.bottomRight.y);
      ctx.stroke();
      ctx.closePath();
    }
  }

  /**
   * Formats the text font string
   * @private
   */
  private _formatFontString(): string {
    return `${ this.bold ? 'bold' : '' } ${ this.fontSize }px ${ this.fontName } ${ this.italic ? 'italic' : '' }`;
  }

  /**
   * Converts this cell into a json string
   */
  toJson(): string {
    return JSON.stringify(this);
  }
}