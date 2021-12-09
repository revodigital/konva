/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: borderoptions.ts
 * Project: complexshapestest
 * Committed last: 2021/10/22 @ 2154
 * ---
 * Description: Implements the BorderOptions class
 */

/**
 * Represents the options of a border
 */
export interface IBorderOptions {
  width: number;
  color: string;
  visible: boolean;
}

/**
 * Represents the border options
 */
export class BorderOptions implements IBorderOptions {
  /**
   * Indicates if this border is visible or not
   */
  visible: boolean;

  /**
   * The width of the border. 1 is default
   */
  width: number;

  /**
   * The color of the border
   */
  color: string;

  /**
   * Creates a new BorderOptions class
   * @param options The border options
   */
  constructor(options: IBorderOptions) {
    this.visible = options.visible;
    this.color = options.color;
    this.width = options.width;
  }

  /**
   * Returns the default border
   */
  static getDefaultBorder(): IBorderOptions {
    return {visible: true, color: 'black', width: 1};
  }
}