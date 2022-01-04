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

import { Shape, ShapeConfig } from '../Shape';
import { GetSet }             from '../types';
import { Factory }            from '../Factory';
import { _registerNode }      from '../Global';
import { SceneContext }       from '../Context';
import { Marked }             from '@ts-stack/markdown';
import { drawHTML }           from 'next-rasterizehtml';

/**
 * Represents the type of a rich text source
 */
export enum RichTextSource {
  Html,
  Markdown
}

export interface RichTextConfig extends ShapeConfig {
  /**
   * Markdown content of this rich text
   */
  markdownContent?: string;

  /**
   * Html source content or the markdownContent translated into
   * html, when it is provided
   */
  htmlContent?: string;

  /**
   * Indicates if the source of this shape is markdown or html
   */
  sourceType?: RichTextSource;

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
}

/**
 * Shape to rendere a rich markdown text into a stage
 */
export class RichText extends Shape<RichTextConfig> {
  markdownContent: GetSet<string, this>;
  htmlContent: GetSet<string, this>;
  allowResize: GetSet<boolean, this>;
  padding: GetSet<number, this>;
  backgroundColor: GetSet<string, this>;
  textColor: GetSet<string, this>;
  fontSize: GetSet<number, this>;
  sourceType?: GetSet<RichTextSource, this>;

  _initFunc(config?: RichTextConfig) {
    super._initFunc(config);

    if (this.allowResize() === undefined) this.allowResize(true);

    // By default is RichTextSource.Markdown
    if (this.sourceType() === undefined) this.sourceType(RichTextSource.Markdown);
  }

  getSelfRect(): { x: number; width: number; y: number; height: number } {
    return {
      x: 0,
      y: 0,
      width: this.width(),
      height: this.height()
    };
  }

  _sceneFunc(context: SceneContext) {
    // Draw background if any
    this._drawBackground(context);

    // Parse markdown, if it is selected source
    if (this.sourceType() === RichTextSource.Markdown)
      this.htmlContent(Marked.parse(this.markdownContent()));

    // Format complete document, adding formatting options
    const doc = `
    <div id="document" style="
    color: ${ this.textColor() || 'black' };
    margin: ${ this.padding() || 0 }px; 
    background-color: ${ this.backgroundColor() || 'transparent' }; 
    font-size: ${ this.fontSize() }px
    ">${ this.htmlContent() }</div>
    `;

    // Draw html into null canvas, get the image and draw
    // it as shape body
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
}

/**
 * Get / set the markdown content of this shape
 */
Factory.addGetterSetter(RichText, 'markdownContent');

/**
 * Get / set the padding
 */
Factory.addGetterSetter(RichText, 'padding');

/**
 * Enable / disable resizing to effective text boundaries
 */
Factory.addGetterSetter(RichText, 'allowResize');

/**
 * Get / set background color
 */
Factory.addGetterSetter(RichText, 'backgroundColor');

/**
 * Get / set text color
 */
Factory.addGetterSetter(RichText, 'textColor');

/**
 * Get / set font size
 */
Factory.addGetterSetter(RichText, 'fontSize');

/**
 * Get / set source type
 */
Factory.addGetterSetter(RichText, 'sourceType');

/**
 * Get / set html content
 */
Factory.addGetterSetter(RichText, 'htmlContent');

RichText.prototype.className = 'RichText';
_registerNode(RichText);