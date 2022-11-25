/*
 * Copyright (c) 2022-2022. Revo Digital
 * ---
 * Author: gabrielecavallo
 * File: LineDash.ts
 * Project: pamela
 * Committed last: 2022/11/25 @ 1256
 * ---
 * Description:
 */

export type LineDashConfiguration = number[];

/**
 * Some default patterns for line dash configuration
 */
export const LineDash = {
  /**
   * Continuous line
   */
  SOLID: [],
  /**
   * Dashed line with 10 px gap
   */
  DASHED: [10, 10],
  /**
   * Dashed line with 20px dashes and 5px gap
   */
  DASHED2: [20, 5],

  /**
   * Dotted line with dots of 1px
   */
  DOTTED: [1, 1],

  /**
   * Dashed and dotted line
   */
  DASH_DOT: [15, 3, 3, 3],

  /**
   * 1 dash and 3 dots
   */
  DASH_TRIPLEDOT: [20, 3, 3, 3, 3, 3, 3, 3],

  /**
   * Une dot and 3 dashes
   */
  DOT_DASHED: [12, 3, 3],
}

/**
 * Create a dotted line with specific dot size (pixel) and
 * gap
 * @param dotSize width of dots
 * @param gap Space between dots
 */
export const dottedLineOf = (dotSize: number, gap: number) : LineDashConfiguration => {
  return [dotSize, gap];
}

/**
 * Create a dashed line with dash size and gap
 * @param dashsize
 * @param gap
 */
export const dashedLineOf = (dashsize: number, gap = 5) => {
  return [dashsize, gap];
}