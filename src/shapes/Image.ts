/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabriele
 * File: Image.ts
 * Project: pamela 
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { Util }               from '../Util';
import { Factory }            from '../Factory';
import { Shape, ShapeConfig } from '../Shape';
import { getNumberValidator } from '../Validators';
import { _registerNode }      from '../Global';

import { GetSet, IRect } from '../types';
import { Context }       from '../Context';

export interface ImageConfig extends ShapeConfig {
  image: CanvasImageSource | undefined;
  crop?: IRect;
  src?: string;
}

/**
 * Image constructor
 * @constructor
 * @memberof Pamela
 * @augments Pamela.Shape
 * @param {Object} config
 * @param {Image} config.image
 * @param {Object} [config.crop]
 * @@shapeParams
 * @@nodeParams
 * @example
 * var imageObj = new Image();
 * imageObj.onload = function() {
 *   var image = new Pamela.Image({
 *     x: 200,
 *     y: 50,
 *     image: imageObj,
 *     width: 100,
 *     height: 100
 *   });
 * };
 * imageObj.src = '/path/to/image.jpg'
 */
export class Image extends Shape<ImageConfig> {
  constructor(attrs: ImageConfig) {
    super(attrs);
    this.on('imageChange.konva', () => {
      this._setImageLoad();
    });

    this._setImageLoad();
  }

  _setImageLoad() {
    const image = this.image() as any;
    // check is image is already loaded
    if (image && image.complete) {
      return;
    }
    // check is video is already loaded
    if (image && image.readyState === 4) {
      return;
    }
    if (image && image['addEventListener']) {
      image['addEventListener']('load', () => {
        this._requestDraw();
      });
    }
  }

  _useBufferCanvas() {
    return super._useBufferCanvas(true);
  }

  _sceneFunc(context: Context) {
    const width = this.getWidth();
    const height = this.getHeight();
    const image = this.attrs.image;
    let params;

    if (image) {
      const cropWidth = this.attrs.cropWidth;
      const cropHeight = this.attrs.cropHeight;
      if (cropWidth && cropHeight) {
        params = [
          image,
          this.cropX(),
          this.cropY(),
          cropWidth,
          cropHeight,
          0,
          0,
          width,
          height,
        ];
      } else {
        params = [image, 0, 0, width, height];
      }
    }

    if (this.hasFill() || this.hasStroke()) {
      context.beginPath();
      context.rect(0, 0, width, height);
      context.closePath();
      context.fillStrokeShape(this);
    }

    if (image) {
      context.drawImage.apply(context, params);
    }
  }

  /**
   * Function called when we have to detect hit boundaries.
   * It should draw a rectangle with specific size of this
   * shape using its fill color.
   * @param context
   */
  _hitFunc(context) {
    var width = this.width(),
      height = this.height();

    context.beginPath();
    context.rect(0, 0, width, height);
    context.closePath();
    context.fillStrokeShape(this);
  }

  getWidth() {
    return this.attrs.width ?? this.image()?.width;
  }

  getHeight() {
    return this.attrs.height ?? this.image()?.height;
  }

  /**
   * load image from given url and create `Pamela.Image` instance
   * @method
   * @memberof Pamela.Image
   * @param {String} url image source
   * @param {Function} callback with Pamela.Image instance as first argument
   * @param {String} cors Cross origin permissions to download this image. By default it is `Anonymous`
   * @example
   *  Pamela.Image.fromURL(imageURL, image => {
   *    // image is Pamela.Image instance
   *    layer.add(image);
   *    layer.draw();
   *  });
   */
  static fromURL(url: string, callback: (image: Image) => void, cors?: string) {
    var img = Util.createImageElement();
    img.onload = function () {
      var image = new Image({
        image: img,
        src: url,
      });
      callback(image);
    };
    img.crossOrigin = cors;
    img.src = url;
  }

  image: GetSet<CanvasImageSource | undefined, this>;
  crop: GetSet<IRect, this>;
  cropX: GetSet<number, this>;
  cropY: GetSet<number, this>;
  cropWidth: GetSet<number, this>;
  cropHeight: GetSet<number, this>;
  src: GetSet<string, this>;
}

Image.prototype.className = 'Image';
_registerNode(Image);
/**
 * get/set image source. It can be image, canvas or video element
 * @name Pamela.Image#image
 * @method
 * @param {Object} image source
 * @returns {Object}
 * @example
 * // get value
 * var image = shape.image();
 *
 * // set value
 * shape.image(img);
 */
Factory.addGetterSetter(Image, 'image');

Factory.addComponentsGetterSetter(Image, 'crop', ['x', 'y', 'width', 'height']);
/**
 * get/set crop
 * @method
 * @name Pamela.Image#crop
 * @param {Object} crop
 * @param {Number} crop.x
 * @param {Number} crop.y
 * @param {Number} crop.width
 * @param {Number} crop.height
 * @returns {Object}
 * @example
 * // get crop
 * var crop = image.crop();
 *
 * // set crop
 * image.crop({
 *   x: 20,
 *   y: 20,
 *   width: 20,
 *   height: 20
 * });
 */

Factory.addGetterSetter(Image, 'cropX', 0, getNumberValidator());
/**
 * get/set crop x
 * @method
 * @name Pamela.Image#cropX
 * @param {Number} x
 * @returns {Number}
 * @example
 * // get crop x
 * var cropX = image.cropX();
 *
 * // set crop x
 * image.cropX(20);
 */

Factory.addGetterSetter(Image, 'cropY', 0, getNumberValidator());
/**
 * get/set crop y
 * @name Pamela.Image#cropY
 * @method
 * @param {Number} y
 * @returns {Number}
 * @example
 * // get crop y
 * var cropY = image.cropY();
 *
 * // set crop y
 * image.cropY(20);
 */

Factory.addGetterSetter(Image, 'cropWidth', 0, getNumberValidator());
/**
 * get/set crop width
 * @name Pamela.Image#cropWidth
 * @method
 * @param {Number} width
 * @returns {Number}
 * @example
 * // get crop width
 * var cropWidth = image.cropWidth();
 *
 * // set crop width
 * image.cropWidth(20);
 */

Factory.addGetterSetter(Image, 'cropHeight', 0, getNumberValidator());

/**
 * get/set crop height
 * @name Pamela.Image#cropHeight
 * @method
 * @param {Number} height
 * @returns {Number}
 * @example
 * // get crop height
 * var cropHeight = image.cropHeight();
 *
 * // set crop height
 * image.cropHeight(20);
 */

/**
 * Get / set image source
 */
Factory.addGetterSetter(Image, 'src');
