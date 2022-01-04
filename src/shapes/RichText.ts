/*
 * Copyright (c) 2022. Revo Digital
 * ---
 * Author: gabriele
 * File: RichText.ts
 * Project: pamela
 * Committed last: 2022/1/4 @ 1739
 * ---
 * Description:
 */

import { Shape, ShapeConfig }    from '../Shape';
import { GetSet }                from '../types';
import { Factory }               from '../Factory';
import { _registerNode }         from '../Global';
import { SceneContext }          from '../Context';
import { Marked }                from '@ts-stack/markdown';
import { drawHTML }              from 'next-rasterizehtml';
import {
  addBorderConfigToClass,
  BorderRadius, borderRadiusAll
} from '../configuration/BorderOptions';
import { LineDashConfiguration } from '../configuration/LineDash';
import { LineCap }               from '../configuration/LineCap';
import { Text }                  from './Text';

export interface RichTextConfig extends ShapeConfig {
  /**
   * Markdown content of this rich text
   */
  markdownContent?: string;

  /**
   * Document padding
   */
  padding?: number;

  /**
   * Indicates if resizing of this shape during rendering is allowed or not
   */
  allowResize?: boolean;

  /**
   * Base text color
   */
  textColor?: string;

  /**
   * Background color
   */
  backgroundColor?: string;

  /**
   * Base font size
   */
  fontSize?: number;

  /**
   * The width of the border. 1 is default
   */
  borderWidth?: number;

  /**
   * Border color (html format or name)
   */
  borderColor?: string;

  /**
   * Border visibility
   */
  bordered?: boolean;

  /**
   * Border radius
   */
  borderRadius?: BorderRadius;

  /**
   * Border dash configuration
   */
  borderDash?: LineDashConfiguration;
}

/**
 * Shape to rendere a rich markdown text into a stage
 */
export class RichText extends Shape<RichTextConfig> {
  markdownContent: GetSet<string, this>;
  allowResize: GetSet<boolean, this>;
  padding: GetSet<number, this>;
  backgroundColor: GetSet<string, this>;
  textColor: GetSet<string, this>;
  fontSize: GetSet<number, this>;
  bordered: GetSet<boolean, this>;
  borderRadius: GetSet<BorderRadius, this>;
  borderWidth: GetSet<number, this>;
  borderColor: GetSet<string, this>;
  borderDash: GetSet<LineDashConfiguration, this>;
  borderCap: GetSet<LineCap, this>;

  _initFunc(config?: RichTextConfig) {
    super._initFunc(config);

    if (this.allowResize() === undefined) this.allowResize(true);
  }

  _sceneFunc(context: SceneContext) {
    // Draw background if any
    this._drawBackground(context);

    // Parse markdown
    const parsed = Marked.parse(this.markdownContent());
    const doc = `
    <div id="document" style="
    color: ${ this.textColor() || 'black' }; 
    margin: ${ this.padding() || 0 }px; 
    background-color: ${ this.backgroundColor() }; 
    font-size: ${ this.fontSize() }px
    ">${ parsed }</div>
    `;
    console.log(doc);

    drawHTML(doc,
      null,
      !this.allowResize() ? {
        width: this.width(),
        height: this.height()
      } : {}).then((result) => {
      // Nothing
      if (result.errors.length === 0) {
        // Resize height and width
        this.width(result.image.width);
        this.height(result.image.height);
        context.drawImage(result.image, this.x(), this.y());
        this._drawBorders(context);
      }
    });
    // Render it to canvas
    context.fillStrokeShape(this);
  }

  private _drawBackground(context: SceneContext) {
    if (!this.backgroundColor()) return;

    context._context.fillStyle = this.backgroundColor();
    context.fillRect(0, 0, this.width(), this.height());
  }

  private _drawBorders(context: SceneContext) {
    // Check if borders are enabled
    if (!this.bordered()) return;

    context._context.lineWidth = this.borderWidth() || 1;
    context._context.lineCap = this.borderCap() || LineCap.Butt;
    context._context.strokeStyle = this.borderColor() || 'black';
    if (this.borderDash())
      context.setLineDash(this.borderDash());
    context.roundRect(this.x(),
      this.y(),
      this.width(),
      this.height(),
      this.borderRadius() || borderRadiusAll(0));
  }
}

Factory.addGetterSetter(RichText, 'markdownContent');

Factory.addGetterSetter(RichText, 'padding');

Factory.addGetterSetter(RichText, 'allowResize');

Factory.addGetterSetter(RichText, 'backgroundColor');

Factory.addGetterSetter(RichText, 'textColor');

Factory.addGetterSetter(RichText, 'fontSize');

RichText.prototype.className = 'RichText';

// Add border configuration
addBorderConfigToClass(RichText);

_registerNode(RichText);