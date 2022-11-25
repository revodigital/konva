/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabrielecavallo
 * File: TextUtils.ts
 * Project: pamela 
 * Committed last: 2022/11/25 @ 1256
 * ---
 * Description:
 */

export const normalizeFontFamily = (fontFamily: string) => {
  return fontFamily
    .split(',')
    .map((family) => {
      family = family.trim();
      const hasSpace = family.indexOf(' ') >= 0;
      const hasQuotes = family.indexOf('"') >= 0 || family.indexOf('\'') >= 0;
      if (hasSpace && !hasQuotes) {
        family = `"${ family }"`;
      }
      return family;
    })
    .join(', ');
}