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

import { Shape, ShapeConfig }  from '../Shape';
import { GetSet }              from '../types';
import { Factory }             from '../Factory';
import { Context }             from '../Context';
import { Image }               from './Image';
import * as JsBarcode          from 'jsbarcode';
import { _registerNode }       from '../Global';
import {
  INVALID_CDECS
}                              from '../events/barcode/InvalidCodeOrSpecification';
import { Text }                from './Text';
import { HorizontalAlignment } from '../configuration/Alignment';
import { PointRectangle2D }    from '../common/PointRectangle2D';
import { callbackify }         from 'util';

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

  _imageBuffer: CanvasImageSource;
  _resizing: boolean;

  // Internal props cache
  props_cache: BarcodeCache;

  _getInternalCache(): BarcodeCache {
    return {
      code: this.code(),
      encoding: this.encoding(),
      showContent: this.displayValue(),
    };
  }

  _writeCache() {
    this.props_cache = this._getInternalCache();
  }

  _cacheChanged(): boolean {
    const temp = this._getInternalCache();
    return (this.props_cache.code !== temp.code || this.props_cache.showContent !== temp.showContent || this.props_cache.encoding !== temp.encoding);
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

    this._resizing = false;
    this._writeCache();

    this.on('transformend', (event) => {
// Delete cache after transform
      this._imageBuffer = undefined;
      //this._resizing = false;
      this.draw();
    });
  }

  async _sceneFunc(context: Context): Promise<void> {
    // Reload cache if encoding or code has changed
    if (this._cacheChanged() || !this._imageBuffer) {
      this._imageBuffer = undefined;

      this._loadBarcodeImage().then(({ image, link }) => {
        // Draw barcode only if there is an image
        if (image) {
          this._imageBuffer = image.image();
          this._writeCache();

          this._requestDraw();
        } else {
          // Fire error event
          if (this.getStage()) this.getStage().fire(INVALID_CDECS,
            {
              image: image,
              barcode: this,
              code: this.code(),
              encoding: this.encoding(),
              generatedUrl: link
            });
        }
      });
    }

    // Draw borders and background
    context._context.fillStyle = this.backgroundColor();
    context.fillRect(0, 0, this.width(), this.height());
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
    context.strokeShape(this);

    // Draw barcode image
    if (this._imageBuffer && !this._resizing) {
      // Draw the image
      context.drawImage(this._imageBuffer,
        0,
        0,
        this.width(),
        this.height() - (this.displayValue() ? this.contentFontSize() : 0));
    }

    if (this.displayValue()) {
      context._context.fillStyle = this.fill() || 'black';
      context._context.font = `${ this.contentFontSize() }px Arial`;
      context._context.textAlign = 'center';
      const textW = context.measureText(this.code());
      context._context.fillText(this.code(),
        this.width() / 2,
        this.height() - 2,
        this.width());
    }
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

Factory.addGetterSetter(Barcode, 'placeHolder');

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
_registerNode(Barcode);