/*
 * Copyright (c) 2021-2022. Revo Digital
 * ---
 * Author: gabriele
 * File: Barcode.ts
 * Project: pamela
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { Shape, ShapeConfig }    from '../Shape';
import { GetSet }                from '../types';
import { Factory }               from '../Factory';
import { Context, SceneContext } from '../Context';
import { Image }                 from './Image';
import * as JsBarcode            from 'jsbarcode';
import { _registerNode }         from '../Global';
import {
  INVALID_CDECS
}                                from '../events/barcode/InvalidCodeOrSpecification';
import { PointRectangle2D }      from '../common/PointRectangle2D';

export interface BarcodeConfig extends ShapeConfig {
  /**
   * Code to generate barcode
   */
  code?: string;

  /**
   * Indicates if the background should be transparent
   */
  transparentBackground?: boolean;

  /**
   * Indicates width of code line
   * Default is 1
   */
  codeLineWidth?: number;

  /**
   * Encoding of generated barcode
   */
  encoding?: string;

  /**
   * Indicates if the content of barcode should be visible
   * or not
   */
  showContent?: boolean;

  /**
   * Placeholder text used when no code is provided
   */
  placeHolder?: string;

  /**
   * Enable / disable value rendering
   */
  displayValue?: boolean;

  /**
   * Barcode background color (default is transparent). Fill is used for barcode color
   */
  backgroundColor?: string;

  /**
   * Content font size
   */
  contentFontSize?: number;
}

interface BarcodeCache {
  code: string;
  encoding: string;
  showContent: boolean;
  backgroundColor: string;
  fill: string;
}

/**
 * Pamela shape to draw a Barcode into the stage.
 * Just specify the **code**, the **encoding** and some **boundaries**,
 * pamela will do the rest. Supported specifications are:
 *
 * -    CODE128
 *         CODE128 (automatic mode switching)
 *         CODE128 A/B/C (force mode)
 * -    EAN
 *         EAN-13
 *         EAN-8
 *         EAN-5
 *         EAN-2
 *         UPC (A)
 *         UPC (E)
 *  -   CODE39
 *  -   ITF
 *         ITF
 *         ITF-14
 *  -   MSI
 *         MSI10
 *         MSI11
 *         MSI1010
 *         MSI1110
 *   -  Pharmacode
 *   -  Codabar
 *
 *   The library used to generate barcode images is:
 *   https://www.npmjs.com/package/jsbarcode
 */
export class Barcode extends Shape<BarcodeConfig> {
  code: GetSet<string, this>;
  transparentBackground: GetSet<boolean, this>;
  codeLineWidth: GetSet<number, this>;
  encoding: GetSet<string, this>;
  placeHolder: GetSet<string, this>;
  displayValue: GetSet<boolean, this>;
  backgroundColor: GetSet<string, this>;
  contentFontSize: GetSet<number, this>;

  /**
   * Message to visualize when an invalid code is given to this shape.
   * Leave empty to hide the message
   */
  invalidCodeMessage!: string;

  /**
   * Font size of the invalid code message, when displayed
   */
  invalidCodeMessageFontSize!: number;

  /**
   * Font of the invalid code message
   */
  invalidCodeMessageFont!: string;

  _imageBuffer: CanvasImageSource;

  // Internal props cache
  props_cache: BarcodeCache;
  _errored: boolean;

  /**
   * Calculaes internal cache
   */
  _getInternalCache(): BarcodeCache {
    return {
      code: this.code(),
      encoding: this.encoding(),
      showContent: this.displayValue(),
      backgroundColor: this.backgroundColor(),
      fill: this.fill()
    };
  }

  /**
   * Writes the cache for this shape
   */
  _writeCache() {
    this.props_cache = this._getInternalCache();
  }

  /**
   * Checks if cache has changed
   */
  _cacheChanged(): boolean {
    const temp = this._getInternalCache();
    return (this.props_cache.code !== temp.code ||
            this.props_cache.showContent !== temp.showContent ||
            this.props_cache.encoding !== temp.encoding ||
            this.props_cache.backgroundColor !== temp.backgroundColor ||
            this.props_cache.fill !== temp.fill);
  }

  _initFunc(config?: BarcodeConfig) {
    super._initFunc(config);
    // Apply default values
    if (!this.placeHolder()) this.placeHolder('test-code');
    if (!this.code()) this.code(this.placeHolder());
    if (!this.encoding()) this.encoding('CODE39');
    if (!this.codeLineWidth()) this.codeLineWidth(1);
    if (!this.displayValue()) this.displayValue(false);
    if (!this.backgroundColor()) this.backgroundColor('transparent');
    if (this.contentFontSize() === undefined) this.contentFontSize(15);
    if (!this.fill()) this.fill('black');

    this._errored = false;
    this._writeCache();
  }

  async _sceneFunc(context: SceneContext): Promise<void> {
    // Reload cache if encoding or code has changed
    if (this._cacheChanged() || !this._imageBuffer) {
      this._imageBuffer = undefined;

      this._loadBarcodeImage().then(({ image, link }) => {
        // Draw barcode only if there is an image
        if (image) {
          this._imageBuffer = image.image();
          this._writeCache();
          this._errored = false;
          this._requestDraw();
        } else {
          // Fire error event
          if (this.getStage()) {
            this.getStage().fire(INVALID_CDECS,
              {
                image: image,
                barcode: this,
                code: this.code(),
                encoding: this.encoding(),
                generatedUrl: link
              });
          }

          this._errored = true;
          this._requestDraw();
        }
      });
    }

    // Draw borders and background
    context._context.fillStyle = this.backgroundColor();
    context.fillRect(0, 0, this.width(), this.height());

    // Draw barcode image
    if (this._imageBuffer) {
      // Draw the image
      context.drawImage(this._imageBuffer,
        0,
        0,
        this.width(),
        this.height() - (this.displayValue() ? (this.contentFontSize() + 3) : 0));

      const scale = this.width() / (this._imageBuffer.width as number);
      // Invalidate cache when scale is too high
      if (scale >= 2) {
        this._imageBuffer = undefined;
        this.codeLineWidth(this.codeLineWidth() + 1);
      }
    }

    // Draw error message
    if (this._errored) {
      this._drawErrorMessage(context);
    }

    if (this.displayValue()) {
      context._context.fillStyle = this.fill() || 'black';
      context._context.font = `${ this.contentFontSize() }px Arial`;
      context._context.textAlign = 'center';
      const textW = context.measureText(this.code());
      context._context.fillText(this.code().toUpperCase(),
        this.width() / 2,
        this.height() - 5,
        this.width());
    }

    // Draw borders
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

  _hitFunc(context) {
    var width = this.width(),
      height = this.height();

    context.beginPath();
    context.rect(0, 0, width, height);
    context.closePath();
    context.fillStrokeShape(this);
  }

  /**
   * Load the barcode image from the calculated link
   */
  async _loadBarcodeImage(): Promise<{ image: Image, link: string }> {
    return new Promise((resolve) => {
      const barcodeImageUrl = this._generateBarCodeUrl(this.code(),
        this.encoding());

      // Generate image only if barcode is correct
      if (!barcodeImageUrl) {
        resolve({ image: undefined, link: undefined });
        return;
      }

      // Load my image
      Image.fromURL(barcodeImageUrl, (image: Image) => {
        resolve({ image: image, link: barcodeImageUrl });
      });
    });
  }

  /**
   * Generates the barcode url starting from code and encoding
   * @param code Code to use
   * @param encoding Encoding
   * @returns A data url with the barcode
   */
  _generateBarCodeUrl(code: string, encoding: string): string | undefined {
    let canvas = document.createElement('canvas');
    const backgroundColor = this.transparentBackground() ? '#00000000' : this.backgroundColor() as string;
    try {
      JsBarcode(canvas,
        code,
        {
          format: encoding,
          margin: 0,
          width: this.codeLineWidth(),
          height: this.height() - this.contentFontSize(),
          displayValue: false,
          background: backgroundColor,
          lineColor: this.fill() || 'black'
        });
      return canvas.toDataURL('image/png');
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Draws the error message when this barcode receives an invalid
   * code or encoding
   * @param context
   */
  _drawErrorMessage(context: SceneContext): void {
    // Render error message using properties
    context._context.fillStyle = 'red';
    context._context.font = `${ this.invalidCodeMessageFontSize }px ${ this.invalidCodeMessageFont }`;
    context._context.textAlign = 'center';
    context.fillText(this.invalidCodeMessage,
      this.width() / 2,
      this.height() / 2);
  }

  getSelfRect(): { x: number; width: number; y: number; height: number } {
    return {
      x: 0,
      y: 0,
      width: this.width(),
      height: this.height()
    };
  }
}

/**
 * Get / set the code
 */
Factory.addGetterSetter(Barcode, 'code');

/**
 * Get / set transparentBackground
 */
Factory.addGetterSetter(Barcode, 'transparentBackground');

/**
 * Get / set codeLineWidth
 */
Factory.addGetterSetter(Barcode, 'codeLineWidth');

/**
 * Get / set encoding
 */
Factory.addGetterSetter(Barcode, 'encoding');

/**
 * Get / set placeholder
 */
Factory.addGetterSetter(Barcode, 'placeHolder');

/**
 * Get / set display value
 */
Factory.addGetterSetter(Barcode, 'displayValue');

/**
 * Get / set background color
 */
Factory.addGetterSetter(Barcode, 'backgroundColor');

/**
 * Get / set content font size
 */
Factory.addGetterSetter(Barcode, 'contentFontSize');

Barcode.prototype.className = 'Barcode';
Barcode.prototype.invalidCodeMessage = 'Invalid code';
Barcode.prototype.invalidCodeMessageFont = 'Arial';
Barcode.prototype.invalidCodeMessageFontSize = 20;

_registerNode(Barcode);