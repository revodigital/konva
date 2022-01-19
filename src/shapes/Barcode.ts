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
import {
  INVALID_CDECS, InvalidCodeOrSpecification
}                             from '../events/barcode/InvalidCodeOrSpecification';

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
}

export class Barcode extends Shape<BarcodeConfig> {
  code: GetSet<string, this>;
  transparentBackground: GetSet<boolean, this>;
  codeLineWidth: GetSet<number, this>;
  encoding: GetSet<string, this>;
  showContent: GetSet<boolean, this>;
  placeHolder: GetSet<string, this>;
  displayValue: GetSet<boolean, this>;

  _imageBuffer: CanvasImageSource;
  _oldCode: string;
  _oldEncoding: string;
  _oldDS: boolean;
  _resizing: boolean;

  _initFunc(config?: BarcodeConfig) {
    super._initFunc(config);
    this._oldCode = this.code();
    this._oldEncoding = this.encoding();
    // Apply default values
    if (!this.placeHolder()) this.placeHolder('test-code');
    if (!this.code()) this.code(this.placeHolder());
    if (!this.encoding()) this.encoding('CODE39');
    if (!this.codeLineWidth()) this.codeLineWidth(1);
    if (!this.displayValue()) this.displayValue(false);


    this._oldDS = this.displayValue();
    this._resizing = false;

    // Add event listeners
    this.on('transformstart', () => {
      this._resizing = true;
    });
    this.on('transformend', (event) => {
      // Delete cache after transform
      this._imageBuffer = undefined;
      this._resizing = false;
      this.draw();
    });
  }

  async _sceneFunc(context: Context): Promise<void> {
    // Reload cache if encoding or code has changed
    // TODO: Use better chaching pattern
    if (this._oldEncoding !== this.encoding() || this._oldCode !== this.code() || !this._imageBuffer) {
      this._imageBuffer = undefined;
      this._loadBarcodeImage().then(({ image, link }) => {
        this._resizing = true;
        this._oldCode = this.code();
        this._oldEncoding = this.encoding();
        this._oldDS = this.displayValue();
        // Draw barcode only if there is an image
        if (image) {
          this.width(image.width());
          this.height(image.height());
          this._imageBuffer = image.image();
          this._resizing = false;
          this.draw();
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

    context.fillStrokeShape(this);

    // Draw barcode image
    if (this._imageBuffer && !this._resizing) {
      context.drawImage(this._imageBuffer, 0, 0);
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
    const backgroundColor = this.transparentBackground() ? '#00000000' : this.fill() as string;
    try {
      JsBarcode(canvas,
        code,
        {
          format: encoding,
          margin: 0,
          width: this.codeLineWidth(),
          height: this.height(),
          displayValue: this.displayValue(),
          background: backgroundColor
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

Factory.addGetterSetter(Barcode, 'code');

Factory.addGetterSetter(Barcode, 'transparentBackground');

Factory.addGetterSetter(Barcode, 'codeLineWidth');

Factory.addGetterSetter(Barcode, 'encoding');

Factory.addGetterSetter(Barcode, 'showContent');

Factory.addGetterSetter(Barcode, 'placeHolder');

Factory.addGetterSetter(Barcode, 'displayValue');

Barcode.prototype.className = 'Barcode';
_registerNode(Barcode);