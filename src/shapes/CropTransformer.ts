/*
 * Copyright (c) 2022. Revo Digital
 * ---
 * Author: gabriele
 * File: CropTransformer.ts
 * Project: complex-shapes-dev
 * Committed last: 2022/2/13 @ 1125
 * ---
 * Description:
 */

import { Box, Transformer, TransformerConfig } from './Transformer';
import { _registerNode }                       from '../Global';
import { GetSet }                              from '../types';
import { Size2D }                              from '../common/Size2D';
import { Factory }                             from '../Factory';
import { LineDash }                            from '../configuration/LineDash';
import { KonvaEventObject }                    from '../Node';
import { Image }                               from './Image';

export interface CropTransformerConfig extends TransformerConfig {
  initialSize: Size2D;
}

export class CropTransformer extends Transformer {
  initialSize: GetSet<Size2D, this>;

  constructor(config?: CropTransformerConfig) {
    super(config);
    this.on('transform', this.onTransform);
    this.initFunc();
  }

  initFunc() {
    this.anchorCornerRadius(20);
    this.rotateEnabled(false);
    this.anchorStroke('red');
    this.borderDash(LineDash.DASHED);
    this.borderStroke('red');
    this.borderStrokeWidth(2);

    this.boundBoxFunc((oldBound, newBound): Box => {
      // Contruct helpers
      const initial = this.initialSize();

      return {
        x: newBound.x,
        y: newBound.y,
        width: newBound.width < initial.getWidth() ? newBound.width : initial.getWidth() - 1,
        height: newBound.height < initial.getHeight() ? newBound.height : initial.getHeight() - 1,
        rotation: 0,
      };
    });
  }

  onTransform(e: KonvaEventObject<MouseEvent>) {
    console.log(e);

    if (!(e.target instanceof Image)) throw new Error(
      'Invalid target for image crop transformer');

    const target = e.target as Image;
    target.cropX(0);
    target.cropY(0);
    target.cropHeight(this.height());
    target.cropWidth(this.width());
    target.scale({ x: 1, y: 1 });
    e.evt.preventDefault();
    e.evt.stopImmediatePropagation();
    e.evt.stopPropagation();
  }
}

Factory.addGetterSetter(CropTransformer, 'initialSize');
_registerNode(CropTransformer);