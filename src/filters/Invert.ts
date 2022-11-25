/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabrielecavallo
 * File: Invert.ts
 * Project: pamela
 * Committed last: 2022/11/25 @ 1256
 * ---
 * Description:
 */

import {Filter} from '../Node';

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
