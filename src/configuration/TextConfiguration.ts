/*
 * Copyright (c) 2021-2021. Revo Digital
 * ---
 * Author: gabriele
 * File: TextConfiguration.ts
 * Project: pamela
 * Committed last: 2021/12/17 @ 942
 * ---
 * Description:
 */

import { HorizontalAlignment, VerticalAlignment } from './Alignment';

/**
 * Represents all the configurations that a cell text should have
 */
export interface ITextConfiguration {
  /**
   * Numeric font size
   */
  fontSize?: number;

  /**
   * Font fill color, name
   */
  textColor?: string;

  /**
   * Font family name
   */
  fontName?: string;

  /**
   * Activate or disable bold
   */
  bold?: boolean;

  /**
   * Activate or disable italic
   */
  italic?: boolean;

  /**
   * Text alignment
   */
  textAlign?: HorizontalAlignment;

  /**
   * The text vertical alignment
   */
  verticalAlign?: VerticalAlignment;

  /**
   * Cell text padding
   */
  padding?: number;
}

/**
 * Represents a class for adding text options capability
 */
export abstract class TextConfiguration implements ITextConfiguration {
  fontSize: number;

  textColor: string;

  fontName: string;

  bold: boolean;

  italic: boolean;

  textAlign: HorizontalAlignment;

  verticalAlign: VerticalAlignment;

  padding: number;

  /**
   * Creates a new CellTextOptions and extracts the informations
   * @param options The options for the text
   * @protected
   */
  protected constructor(options: ITextConfiguration) {
    this.fontSize = options.fontSize || 12;
    this.textColor = options.textColor || "black";
    this.bold = options.bold || false;
    this.italic = options.italic || false;
    this.fontName = options.fontName || "arial";
    this.textAlign = options.textAlign || HorizontalAlignment.Center;
    this.padding = options.padding || 0;
    this.verticalAlign = options.verticalAlign || VerticalAlignment.Center;
  }

  /**
   * Returns the default text options
   */
  static getDefaultOptions(): ITextConfiguration {
    return {
      textAlign: HorizontalAlignment.Center,
      bold: false,
      fontName: 'arial',
      italic: false,
      textColor: 'black',
      fontSize: 10,
      padding: 0,
    }
  }
}
