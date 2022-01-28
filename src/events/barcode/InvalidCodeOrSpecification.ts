/*
 * Copyright (c) 2022-2022. Revo Digital 
 * ---
 * Author: gabriele
 * File: InvalidCodeOrSpecification.ts
 * Project: pamela 
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { Barcode } from '../../shapes/Barcode';

/**
 * Data passed when this event is triggered
 */
export interface InvalidCodeOrSpecification {
  barcode: Barcode;
  code: string;
  encoding: string;
  generatedUrl: string;
  image: CanvasImageSource;
}

/**
 * Event name triggered when a barcode has an invalid code or
 * specification.
 */
export const INVALID_CDECS = 'barcode-invalidcdec';