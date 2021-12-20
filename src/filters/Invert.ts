/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: Invert.ts
 * Project: pamela
 * Committed last: 2021/12/5 @ 141
 * ---
 * Description:
 */

import { Filter } from '../Node';
/**
 * Invert Filter
 * @function
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Invert]);
 */
export const Invert: Filter = function (imageData) {
  var data = imageData.data,
    len = data.length,
    i;

  for (i = 0; i < len; i += 4) {
    // red
    data[i] = 255 - data[i];
    // green
    data[i + 1] = 255 - data[i + 1];
    // blue
    data[i + 2] = 255 - data[i + 2];
  }
};
