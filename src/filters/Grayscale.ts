/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabriele
 * File: Grayscale.ts
 * Project: pamela 
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { Filter } from '../Node';

/**
 * Grayscale Filter
 * @function
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Grayscale]);
 */
export const Grayscale: Filter = function (imageData) {
  var data = imageData.data,
    len = data.length,
    i,
    brightness;

  for (i = 0; i < len; i += 4) {
    brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
    // red
    data[i] = brightness;
    // green
    data[i + 1] = brightness;
    // blue
    data[i + 2] = brightness;
  }
};
