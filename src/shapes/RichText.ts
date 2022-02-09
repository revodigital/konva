/*
 * Copyright (c) 2022-2022. Revo Digital
 * ---
 * Author: gabriele
 * File: RichText.ts
 * Project: pamela
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { Shape, ShapeConfig }  from '../Shape';
import { GetSet }              from '../types';
import { Factory }             from '../Factory';
import { _registerNode }       from '../Global';
import { SceneContext }        from '../Context';
import { Marked }              from '@ts-stack/markdown';
import { drawHTML, Options }   from 'next-rasterizehtml';
import { Size2D, sizeOf }      from '../common/Size2D';
import { HorizontalAlignment } from '../configuration/Alignment';
import { GrowPolicy }          from './Text';
import { RichTextMetrics }     from '../TextMeasurement';
import { PointRectangle2D }    from '../common/PointRectangle2D';

export const UNLIMITED = 300000;

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

  /**
   * Text background color
   */
  backgroundColor?: string;

  /**
   * Specifies additional css to style the generated html document
   */
  style?: string;
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
  fontSize: GetSet<number, this>;
  fontStyle: GetSet<string, this>;
  fontVariant: GetSet<string, this>;
  fontFamily: GetSet<string, this>;
  fontDecoration: GetSet<string, this>;
  sourceType: GetSet<RichTextSource, this>;
  horizontalAlignment: GetSet<HorizontalAlignment, this>;
  backgroundColor: GetSet<string, this>;
  style: GetSet<string, this>;

  private _lastContent = '';
  private _lastSize: Size2D;
  private _image: HTMLImageElement = undefined;
  private _resizing: boolean;

  _initFunc(config?: RichTextConfig) {
    super._initFunc(config);

    if (this.lockSize() === undefined) this.lockSize(false);

    // By default is RichTextSource.Markdown
    if (this.sourceType() === undefined) this.sourceType(RichTextSource.Markdown);

    if (this.growPolicy() === undefined) this.growPolicy(GrowPolicy.GrowHeight);
    if (this.padding() === undefined) this.padding(0);

    this._resizing = false;
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
    <style>
    p {
        margin: 0;
        padding: 0;
    }
</style>
    <div id="document" style="
    ${ this.style() };
    color: ${ this.fill() || 'black' };
    font-family: ${ this.fontFamily() || 'arial' };
    padding: 0;
    font-variant: ${ this.fontVariant() || '' }};
    text-align: left;
    text-decoration: ${ this.fontDecoration() || '' };
    background-color: ${ this.backgroundColor() || 'transparent' }; 
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
  }

  private _drawBackground(context: SceneContext) {
    context._context.fillStyle = this.backgroundColor();
    context.fillRect(0, 0, this.width(), this.height());
  }

  async _sceneFunc(context: SceneContext) {
    // Draw background
    if (this._resizing) {
      this._drawBackground(context);
      return;
    }

    // Format rendering html document
    const doc = this._formatDocument();

    // Check cached document
    if (this._lastContent !== doc || !this._lastSize.equalsTo(this.getSizeRect())) {
      this._lastContent = doc;
      this._lastSize = this.getSizeRect();
      this._image = undefined;

      if (!this.lockSize())
        this._loadFreeImage(doc);
      else
        this._loadFittedImage(doc);
    }

    // Draw background
    this._drawBackground(context);

    if (this._image && !this._resizing) {
      context.beginPath();
      context.rect(this.padding(),
        this.padding(),
        this.width() - this.padding(),
        this.height() - this.padding());
      context.clip();
      context.drawImage(this._image,
        this.padding() - 6,
        this.padding() - 8);
    }

    // Draw shape borders
    context.closePath();
    const edges = PointRectangle2D.calculateFromStart(this.width(),
      this.height());
    context.beginPath();
    context.moveTo(edges.topLeft.x, edges.topLeft.y);
    context.lineTo(edges.topRight.x, edges.topRight.y);
    context.lineTo(edges.bottomRight.x, edges.bottomRight.y);
    context.lineTo(edges.bottomLeft.x, edges.bottomLeft.y);
    context.lineTo(edges.topLeft.x, edges.topLeft.y);
    context.strokeShape(this);
    context.closePath();
  }

  private _loadFreeImage(doc: string) {
    // Draw html into null canvas, get the image and draw
    this._resizing = true;
    // Calculate only 1 time the image and request dra

    // Resize richtext
    if (this.growPolicy() === GrowPolicy.GrowWidth) {
      const size = this.measureMultiStyleTextSize(doc,
        sizeOf(UNLIMITED, this.height()));
      if (size.overflowsWidth(this.getSizeRect()))
        this.width(size.getWidth());
    } else {
      const size = this.measureMultiStyleTextSize(doc,
        sizeOf(this.width(), UNLIMITED));
      if (size.overflowsHeight(this.getSizeRect()))
        this.height(size.getHeight());
    }

    // it as shape body
    drawHTML(doc,
      null,
      {
        width: this.width() - this.padding(),
        height: this.height() - this.padding()
      }).then(result => {
      // Save image into cache
      if (result.errors.length === 0) {
        this._resizing = false;
        this._image = result.image;
        this._requestDraw();
      }
    });
  }

  /**
   * Sets the content of a richtext and re-draws it
   * @param source Content to set
   * @param type Source type (Html or markdown are supported)
   */
  public setContent(source: string, type: RichTextSource) {
    if (type === RichTextSource.Markdown) this.markdownContent(source);
    else this.htmlContent(source);
    this.sourceType(type);

    // Invalidate cache
    this._image = undefined;
    this.draw();
  }

  private _loadFittedImage(doc: string) {
    // Make content fit
    this._image = undefined;
    let value = this.fitContent();
    this.fontSize(value);

    drawHTML(this._formatDocument(value),
      null,
      { width: this.width(), height: this.height() }).then((result) => {
      // Save image into cache
      if (result.errors.length === 0) {
        this._image = result.image;
        this._requestDraw();
      }
    });
  }

  /**
   * Calculates a new fontsize for this text, to make it
   * fit entirely shape boundaries. If fontsize <= 6, then it
   * will be resized using fontsize of 6px.
   */
  fitContent(): number {
    // Font size
    let ft = this.fontSize() || 12;
    this._resizing = true;

    const selfRect = this.getSizeRect();
    let textRect: Size2D = this.measureMultiStyleTextSize(this._formatDocument(
      ft), sizeOf(this.width(), UNLIMITED));
    // Minimum font size
    const MIN = 6;
    const MAX = 50;
    let canGrow = true;
    let canShrink = true;

    // Decrease font size to make all fit
    while (ft > MIN && (textRect.overflows(selfRect) || textRect.canBeContainedBy(
      selfRect))) {

      if (textRect.overflows(selfRect) && canShrink) {
        ft--;
        canShrink = false;
      } else if (textRect.canBeContainedBy(selfRect) && canGrow) {
        ft++;
        canGrow = false;
      } else if (textRect.canBeContainedBy(selfRect) && !canGrow) break;
      else if (textRect.overflows(selfRect) && !canShrink) break;

      // Recalculate text rect
      textRect = this.measureMultiStyleTextSize(this._formatDocument(ft),
        sizeOf(this.width() - 10, UNLIMITED));
    }

    this._resizing = false;
    return ft;
  }

  private async _getDocumentImage(doc: string, options?: Options): Promise<HTMLImageElement> {
    return (await drawHTML(doc,
      null,
      options)).image;
  }

  /**
   * Measures a multistyle text using dom element
   * @param doc Document to measure
   */
  public measureMultiStyleText(doc: string, size: Size2D): RichTextMetrics {
    let element = document.createElement('div');
    if (size.getWidth() !== UNLIMITED)
      element.style.width = size.getWidth() + 'px';

    if (size.getHeight() !== UNLIMITED)
      element.style.height = size.getHeight() + 'px';
    element.innerHTML = doc;
    document.body.append(element);

    const mes = {
      width: element.offsetWidth,
      height: element.offsetHeight + 30,
    };

    document.body.removeChild(element);

    return mes;
  }

  public measureMultiStyleTextSize(doc: string, size: Size2D): Size2D {
    return Size2D.fromSize(this.measureMultiStyleText(doc, size));
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

/**
 * Get / set background color
 */
Factory.addGetterSetter(RichText, 'backgroundColor');

/**
 * Get / set document css style
 */
Factory.addGetterSetter(RichText, 'style');

RichText.prototype.className = 'RichText';
_registerNode(RichText);