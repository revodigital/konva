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

import { PointRectangle2D }                       from '../common/PointRectangle2D';
import { HorizontalAlignment, VerticalAlignment } from '../configuration/Alignment';
import { ITextConfiguration, TextConfiguration }  from '../configuration/TextConfiguration';
import { BorderConfig }                           from '../configuration/BorderOptions';
import { Point2D }                                from '../common/Point2D';
import { SceneContext }                           from '../Context';

/**
 * Defines the configuration properties of a single cell
 */
export interface ICell extends ITextConfiguration {
  content?: string;
  edges: PointRectangle2D;
  fill?: string;
  border?: BorderConfig;
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
  edges: PointRectangle2D;

  /**
   * Cell fill color
   */
  fill: string;

  /**
   * Indicates if this cell should have some borders
   */
  border: BorderConfig;

  private _lastOfCol: boolean;
  private _lastOfRow: boolean;
  private _tableExternalBorder: BorderConfig;

  /**
   * Creates a new instance of a Cell class, for drawing a Cell into a table.
   * @param options Configuration following ICell interface.
   * @param lastOfColumn Indicates if this cell is the last of the column
   * @param lastOfRow Indicates if this cell is the last of the row
   * @param tableExternalBorder The table external border informations
   */
  constructor(options: ICell, lastOfColumn: boolean, lastOfRow: boolean, tableExternalBorder: BorderConfig) {
    super(options);
    this.content = options.content || '';
    this.edges = options.edges;
    this.fill = options.fill || 'gray';
    this.border = options.border;
    this._lastOfCol = lastOfColumn;
    this._lastOfRow = lastOfRow;
    this._tableExternalBorder = tableExternalBorder;
  }

  /**
   * Renders this cell
   * @param ctx The drawing context
   */
  _render(ctx: SceneContext): void {
    if(this.edges.getWidth() === 0 || this.edges.getHeight() === 0) return;

    if (this.fill !== 'transparent') {
      let space: number = 0;
      if(this.border) {
        space = this.border.borderWidth || 0;
        space /= 2;
      }

      ctx._context.fillStyle = this.fill;
      ctx.fillRect(this.edges.topLeft.x + space,
        this.edges.topLeft.y + space,
        this.edges.getWidth() - space,
        this.edges.getHeight() - space);
    }

    if (this.border && this.border.bordered) this._renderBorders(ctx);
    this._renderText(ctx);
  }

  /**
   * Renders the cell text
   * @param ctx Drawing context
   * @private
   */
  private _renderText(ctx: SceneContext): void {
    // Set fill style
    ctx._context.fillStyle = this.textColor;
    // Format font configuration string
    ctx._context.font = this._formatFontString();

    // Calculate rectangle center
    const center = this.edges.getCenter();
    const textMeasure = ctx.measureText(this.content);
    let startPoint = new Point2D(0, 0);

    // Set horizontal position
    switch (this.textAlign) {
      case HorizontalAlignment.Center:
        ctx._context.textAlign = 'center';
        startPoint.x = center.x;
        break;
      case HorizontalAlignment.Left:
        ctx._context.textAlign = 'start';
        startPoint.x = this.edges.topLeft.x + this.padding;
        break;
      case HorizontalAlignment.Right:
        ctx._context.textAlign = 'end';
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
  private _renderBorders(ctx: SceneContext): void {
    if(!this.border) return;
    if(!this.border.bordered) return;
    if(this.border.borderWidth === 0) return;

    ctx._context.lineCap = this.border.borderCap;
    ctx._context.strokeStyle = this.border.borderColor;
    ctx._context.lineWidth = this.border.borderWidth;

    if(this.border.borderDash)
      ctx.setLineDash(this.border.borderDash);
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