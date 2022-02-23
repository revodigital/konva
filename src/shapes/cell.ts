/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabriele
 * File: cell.ts
 * Project: pamela 
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { PointRectangle2D } from '../common/PointRectangle2D';
import {
  HorizontalAlignment,
  VerticalAlignment
}                           from '../configuration/Alignment';
import {
  ITextConfiguration
}                           from '../configuration/TextConfiguration';
import {
  applyBorderConfig,
  BorderConfig
}                           from '../configuration/BorderOptions';
import { SceneContext }     from '../Context';

export interface CellConfig extends ITextConfiguration {
  content?: string;
  fill?: string;
  visible?: boolean;
  leftBorder?: BorderConfig;
  rightBorder?: BorderConfig;
  bottomBorder?: BorderConfig;
  topBorder?: BorderConfig;
  width?: number;
  height?: number;
}

/**
 * Provides a low-level api for rendering table cells. After you specify a rectangle
 * containing all the points of the cell, you can add a configuration to the cell.
 * Column and Row unify more cells. The configuration of a single cell respects the
 * configuration of a Column or a Row.
 */
export class Cell implements CellConfig {
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

  visible: boolean;
  width: number;
  height: number;
  bold: boolean;
  italic: boolean;
  fontName: string;
  fontSize: number;
  textAlign: HorizontalAlignment;
  textColor: string;
  verticalAlign: VerticalAlignment;
  padding: number;

  leftBorder: BorderConfig;
  rightBorder: BorderConfig;
  bottomBorder: BorderConfig;
  topBorder: BorderConfig;

  /**
   * Creates a new instance of a Cell class, for drawing a Cell into a table.
   * @param options Configuration following ICell interface.
   */
  constructor(options: CellConfig, edges: PointRectangle2D) {
    this.content = options.content || '';
    this.fill = options.fill || 'gray';
    this.visible = options.visible;
    this.bottomBorder = options.bottomBorder;
    this.topBorder = options.topBorder;
    this.leftBorder = options.leftBorder;
    this.rightBorder = options.rightBorder;
    this.bold = options.bold;
    this.italic = options.italic;
    this.fontName = options.fontName;
    this.fontSize = options.fontSize;
    this.textAlign = options.textAlign;
    this.textColor = options.textColor;
    this.verticalAlign = options.verticalAlign;
    this.padding = options.padding;
    this.edges = edges;
  }

  /**
   * Renders this cell
   * @param ctx The drawing context
   */
  _render(ctx: SceneContext): void {
    if (this.edges.getWidth() === 0 || this.edges.getHeight() === 0) return;

    if (this.fill !== 'transparent') {
      let space: number = 0;
      if (this.border) {
        space = this.border.borderWidth || 0;
        space /= 2;
      }

      ctx._context.fillStyle = this.fill;
      ctx.fillRect(this.edges.topLeft.x,
        this.edges.topLeft.y,
        this.edges.getWidth(),
        this.edges.getHeight());
    }

    this._renderBorders(ctx);
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
    let startPoint = this.edges.topLeft;

    const padding = this.padding || 0;
    const fontSize = this.fontSize || 13;

    // Set horizontal position
    switch (this.textAlign) {
      case HorizontalAlignment.Center:
        ctx._context.textAlign = 'center';
        startPoint.x = center.x;
        break;
      case HorizontalAlignment.Left:
        ctx._context.textAlign = 'start';
        startPoint.x = this.edges.topLeft.x + padding;
        break;
      case HorizontalAlignment.Right:
        ctx._context.textAlign = 'end';
        startPoint.x = this.edges.topRight.x - padding;
        break;
    }

    // Set vertical position
    switch (this.verticalAlign) {
      case VerticalAlignment.Center:
        startPoint.y = center.y + (textMeasure.actualBoundingBoxAscent / 2);
        break;
      case VerticalAlignment.Bottom:
        startPoint.y = this.edges.bottomRight.y - padding - fontSize;
        break;
      case VerticalAlignment.Top:
        startPoint.y = this.edges.topLeft.y + padding + fontSize;
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
    const edges = this.edges;

    // Bottom border
    if (this.topBorder && this.topBorder.bordered) {
      // Apply border configruration
      applyBorderConfig(this.topBorder, ctx);
      ctx.strokeLineBetween(edges.topLeft, edges.topRight);
    }

    if (this.rightBorder && this.rightBorder.bordered) {
      applyBorderConfig(this.rightBorder, ctx);
      ctx.strokeLineBetween(edges.topRight, edges.bottomRight);
    }

    if (this.bottomBorder && this.bottomBorder.bordered) {
      applyBorderConfig(this.bottomBorder, ctx);
      ctx.strokeLineBetween(edges.bottomRight, edges.bottomLeft);
    }

    if (this.leftBorder && this.leftBorder.bordered) {
      applyBorderConfig(this.leftBorder, ctx);
      ctx.strokeLineBetween(edges.bottomLeft, edges.topLeft);
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