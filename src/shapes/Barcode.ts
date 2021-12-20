/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: Barcode.ts
 * Project: pamela
 * Committed last: 2021/12/20 @ 1034
 * ---
 * Description:
 */

import { Shape, ShapeConfig } from '../Shape';
import { ITextConfiguration } from '../configuration/TextConfiguration';
import { GetSet }             from '../types';
import { Factory }            from '../Factory';
import { Context }            from '../Context';
import {
  InvalidBarcodeConfiguration
}                             from '../exceptions/InvalidBarcodeConfiguration';
import { BarcodeLayout }      from '../layout/BarcodeLayout';
import { Image }              from './Image';
import * as JsBarcode         from 'jsbarcode';
import { _registerNode }      from '../Global';

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
   */
  codeLineWidth: number;

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
   * Text formatting for content
   */
  contentOptions?: ITextConfiguration;
  /**
   * Placeholder text used when no code is provided
   */
  placeHolder: string;

  /**
   * Placeholder text configuration
   */
  placeHolderOptions?: ITextConfiguration;
}

export class Barcode extends Shape<BarcodeConfig> {
  code: GetSet<string, this>;
  transparentBackground: GetSet<boolean, this>;
  codeLineWidth?: GetSet<number, this>;
  encoding?: GetSet<string, this>;
  showContent?: GetSet<boolean, this>;
  contentOptions?: GetSet<ITextConfiguration, this>;
  placeHolder: GetSet<string, this>;
  placeHolderOptions?: GetSet<ITextConfiguration, this>;

  _imageBuffer: CanvasImageSource;
  _oldCode: string;
  _oldEncoding: string;


  async _sceneFunc(context: Context): Promise<void> {
    if (!this.height()) return;

    // Calculate layout
    const layout = new BarcodeLayout({
      width: this.width() || 50,
      height: this.height() || 50
    });

    // Check if there is a code to render
    if (!this.code()) this._renderPlaceholder(layout, context._context);
    else if (this.code() && this.encoding()) {
      // Check cache presence
      if (!this._imageBuffer)
        await this._loadBarcodeImage();

      if (this._oldEncoding !== this.encoding() || this._oldCode !== this.code())
        await this._loadBarcodeImage();

      context.drawImage(this._imageBuffer, 0, 0);
    } else throw new InvalidBarcodeConfiguration('invalid barcode options');
  }

  /**
   * Renders the placeholder
   * @param ctx The drawing context
   * @param layout The barcode layout
   */
  _renderPlaceholder(layout: BarcodeLayout, ctx: CanvasRenderingContext2D): void {
    const center = layout.getCenter();
    const textMeasure = ctx.measureText(this.placeHolder());

    ctx.textAlign = 'center';
    ctx.fillText(this.placeHolder(),
      center.x,
      center.y + (textMeasure.actualBoundingBoxAscent / 2));
  }

  async _loadBarcodeImage(): Promise<void> {
    return new Promise((resolve) => {
      const barcodeImageUrl = this._generateBarCodeUrl(this.code(),
        this.encoding());
      Image.fromURL(barcodeImageUrl, (image: Image) => {
        this._imageBuffer = image.image();
        this._oldCode = this.code();
        this._oldEncoding = this.encoding();
        this.width(image.width());
        this.height(image.height());
        resolve();
      });
    });
  }

  _generateBarCodeUrl(code: string, encoding: string): string {
    let canvas = document.createElement('canvas');
    const backgroundColor = this.transparentBackground() ? '#00000000' : this.fill() as string;
    JsBarcode(canvas,
      code,
      {
        format: encoding,
        margin: 0,
        width: this.codeLineWidth(),
        height: this.height(),
        displayValue: false,
        background: backgroundColor
      });
    return canvas.toDataURL('image/png');
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

Factory.addGetterSetter(Barcode, 'code');

Factory.addGetterSetter(Barcode, 'transparentBackground');

Factory.addGetterSetter(Barcode, 'codeLineWidth');

Factory.addGetterSetter(Barcode, 'encoding');

Factory.addGetterSetter(Barcode, 'showContent');

Factory.addGetterSetter(Barcode, 'contentOptions');

Factory.addGetterSetter(Barcode, 'placeHolder');

Factory.addGetterSetter(Barcode, 'placeHolder');

Factory.addGetterSetter(Barcode, 'placeHolderOptions');

Barcode.prototype.className = 'Barcode';
_registerNode(Barcode);