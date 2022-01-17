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

import { Shape, ShapeConfig }          from '../Shape';
import { GetSet }                      from '../types';
import { Factory }                     from '../Factory';
import { _registerNode }               from '../Global';
import { SceneContext }                from '../Context';
import { Marked }                      from '@ts-stack/markdown';
import { drawHTML, Options }           from 'next-rasterizehtml';
import { Size2D }                      from '../common/Size2D';
import { HAlign, HorizontalAlignment } from '../configuration/Alignment';
import { GrowPolicy }                  from './Text';

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
  lockSize?: boolean;

  /**
   * Base text color
   */
  textColor?: string;

  /**
   * Base font size
   */
  fontSize?: number;

  /**
   * Font family
   */
  fontFamily?: string;

  /**
   * font decoration
   */
  fontDecoration?: string;

  /**
   * Font style
   */
  fontStyle?: string;

  /**
   * Font variant
   */
  fontVariant?: string;

  /**
   * Text horizontal alignment
   */
  horizontalAlignment?: HorizontalAlignment;

  /**
   * Represents how textbox boundaries should grow while in
   * editing mode
   * and witch of them should remain fixed
   */
  growPolicy?: GrowPolicy;
}

/**
 * Shape to render a rich markdown or html text into a stage
 */
export class RichText extends Shape<RichTextConfig> {
  markdownContent: GetSet<string, this>;
  htmlContent: GetSet<string, this>;
  lockSize: GetSet<boolean, this>;
  growPolicy: GetSet<GrowPolicy, this>;
  padding: GetSet<number, this>;
  textColor: GetSet<string, this>;
  fontSize: GetSet<number, this>;
  fontStyle: GetSet<string, this>;
  fontVariant: GetSet<string, this>;
  fontFamily: GetSet<string, this>;
  fontDecoration: GetSet<string, this>;
  sourceType: GetSet<RichTextSource, this>;
  horizontalAlignment: GetSet<HorizontalAlignment, this>;

  private _lastContent = '';
  private _initialX = 0;
  private _image: HTMLImageElement = undefined;
  private _resizing: boolean;

  _initFunc(config?: RichTextConfig) {
    super._initFunc(config);

    if (this.lockSize() === undefined) this.lockSize(false);

    // By default is RichTextSource.Markdown
    if (this.sourceType() === undefined) this.sourceType(RichTextSource.Markdown);

    if (this.growPolicy() === undefined) this.growPolicy(GrowPolicy.GrowHeight);
    this._resizing = false;

    this.on('transformstart', (e) => this._onStartResize());
    this.on('transformend', (e) => this._onEndResize());
  }

  private _onStartResize() {
    this._resizing = true;
  }

  private _onEndResize() {
    this._resizing = false;
    this.draw();
  }

  /**
   * Formats the document for rendering function.
   * Selects the correct source, parses the contents and
   * adds formatting options like fontsize, colors and padding.
   *
   * @param fontSize Font size to apply. If not supplied, will be used shape one.
   * @returns the document ready for rendering
   */
  private _formatDocument(fontSize: number = this.fontSize()): string {
    // Parse markdown, if it is selected source
    if (this.sourceType() === RichTextSource.Markdown)
      this.htmlContent(Marked.parse(this.markdownContent()));

    // Format complete document, adding formatting options
    const doc = `
    <div id="document" style="
    color: ${ this.textColor() || 'black' };
    margin: ${ this.padding() || 0 }px; 
    font-family: ${ this.fontFamily() || 'arial' };
    font-variant: ${ this.fontVariant() || '' }};
    text-align: ${ HAlign.toHtmlTextAlign(this.horizontalAlignment()) || 'left' };
    text-decoration: ${ this.fontDecoration() || '' };
    background-color: ${ this.fill() || 'transparent' }; 
    font-size: ${ fontSize || 12 }px
    ">${ this.htmlContent() }</div>
    `;

    return doc;
  }

  _hitFunc(context) {
    var width = this.width(),
      height = this.height();

    context.beginPath();
    context.rect(0, 0, width, height);
    context.closePath();
    context.fillStrokeShape(this);
    context.drawRectBorders(this);
  }

  async _sceneFunc(context: SceneContext) {
    // Draw background
    if (this.hasFill() || this.hasStroke()) {
      context.beginPath();
      context.rect(0, 0, this.width(), this.height());
      context.closePath();
      context.fillStrokeShape(this);
      context.drawRectBorders(this);
    }

    if (this._resizing) return;

    // Format rendering html document
    const doc = this._formatDocument();

    // Check cached document
    if (this._lastContent !== doc) {
      this._lastContent = doc;
      // Draw html into null canvas, get the image and draw
      let options: Options;

      if (this.growPolicy() === GrowPolicy.GrowHeight) options = {
        width: this.width(),
      };
      else options = { height: this.height() };

      // it as shape body
      const result = await drawHTML(doc,
        null,
        options);

      // Resize if needed
      if (result.image.width > this.width())
        this.width(result.image.width);
      if (result.image.height > this.height())
        this.height(result.image.height);

      // Request new drawing
      this._requestDraw();

      // Save image into cache
      if (result.errors.length === 0) {
        this._image = result.image;
      }
    }

    if (this._image) {
      context.drawImage(this._image, 0, 0);
    }

    // Draw rectangular borders
    context.drawRectBorders(this);
  }

  /**
   * Calculates a new fontsize for this text, to make it
   * fit entirely shape boundaries. If fontsize <= 6, then it
   * will be resized using fontsize of 6px.
   */
  async fitContent(onlyDecrease: boolean = false): Promise<number> {
    // Font size
    let ft = this.fontSize() || 12;
    const options: Options = {
      width: this.width() - 3,
    };
    // Current image
    let img = await this._getDocumentImage(this._formatDocument(ft), options);
    // Error check. Img will be undefined if there were errors reading the document
    if (!img) return;
    const selfRect = this.getSizeRect();
    let textRect: Size2D = Size2D.fromBounds(img.width, img.height);
    // Minimum font size
    const MIN = 6;

    if (textRect.overflows(selfRect)) {
      // Decrease font size to make all fit
      while (ft > MIN && textRect.overflows(selfRect)) {
        ft--;

        // Recalculate image
        img = await this._getDocumentImage(this._formatDocument(ft), options);
        // Recalculate text rect
        textRect = Size2D.fromBounds(img.width, img.height);
      }
      // Resize if needed
      if (textRect.overflows(selfRect) && ft === 6)
        this._onResize(selfRect, textRect);
    } else if (!onlyDecrease) {
      // Increase font size
      while (textRect.canBeContainedBy(selfRect)) {
        ft++;

        // Recalculate image
        img = await this._getDocumentImage(this._formatDocument(ft), options);
        // Recalculate text rect
        textRect = Size2D.fromBounds(img.width, img.height);
      }

      ft--;
    }

    // Update font size
    this.fontSize(ft);
    this._requestDraw();

    return ft;
  }

  private async _getDocumentImage(doc: string, options?: Options): Promise<HTMLImageElement> {
    return (await drawHTML(doc,
      null,
      options)).image;
  }

  private _onResize(oldRect: Size2D, newRect: Size2D): void {
    this.width(newRect.getWidth());
    this.height(newRect.getHeight());
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
Factory.addGetterSetter(RichText, 'lockSize');

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

/**
 * Get / set font family
 */
Factory.addGetterSetter(RichText, 'fontFamily');

/**
 * Get / set font decoration
 */
Factory.addGetterSetter(RichText, 'fontDecoration');

/**
 * Get / set font style
 */
Factory.addGetterSetter(RichText, 'fontStyle');

/**
 * Get / set font variant
 */
Factory.addGetterSetter(RichText, 'fontVariant');

/**
 * Get / set horizontal alignment
 */
Factory.addGetterSetter(RichText, 'horizontalAlignment');

/**
 * Get / set grow policy
 */
Factory.addGetterSetter(RichText, 'growPolicy');


RichText.prototype.className = 'RichText';
_registerNode(RichText);