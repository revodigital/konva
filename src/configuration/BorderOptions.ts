/*
 * Copyright (c) 2021-2022. Revo Digital
 * ---
 * Author: gabriele
 * File: BorderOptions.ts
 * Project: pamela
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { LineDashConfiguration } from './LineDash';
import { Factory }               from '../Factory';
import { LineCap }               from './LineCap';
import { Context }               from '../Context';

/**
 * Represents the options of a border
 */
export interface BorderConfig {
  /**
   * The width of the border. 1 is default
   */
  borderWidth?: number;

  /**
   * Border color (html format or name)
   */
  borderColor?: string;

  /**
   * Border visibility
   */
  bordered?: boolean;

  /**
   * Border radius
   */
  borderRadius?: BorderRadius;

  /**
   * Border dash configuration
   */
  borderDash?: LineDashConfiguration;

  /**
   * Border cap
   */
  borderCap?: LineCap;
}

/**
 * Represents a complete border radius
 * (all 4 corners)
 */
export interface BorderRadius {
  /**
   * Top left corner radius
   */
  topLeft: number;

  /**
   * Top right corner radius
   */
  topRight: number;

  /**
   * Bottom left corner radius
   */
  bottomLeft: number;

  /**
   * Bottom right corner radius
   */
  bottomRight: number;
}

export const BORDER_OPTIONS = [
  'borderWidth',
  'borderColor',
  'bordered',
  'borderRadius',
  'borderDash',
  'borderCap',
];

/**
 * Border radius useful functions
 */
export const BorderRadiusUtils = {
  /**
   * Construct a border radius with every corner with the same
   * radius
   * @param val
   */
  all(val: number): BorderRadius {
    return {
      topLeft: val,
      topRight: val,
      bottomLeft: val,
      bottomRight: val,
    };
  },

  /**
   * Create a symmetric border radius
   * @param top Value for topLeft and topRight
   * @param bottom Value for bottomLeft and bottomRight
   */
  sym(top: number, bottom: number): BorderRadius {
    return {
      topLeft: top, topRight: top,
      bottomRight: bottom,
      bottomLeft: bottom
    };
  },

  /**
   * Create a diagonal border radius
   * @param tlbr Corner radius for topLeft and bottomRight
   * @param trbl Corner radius for topRight and bottomLeft
   */
  dg(tlbr: number, trbl: number): BorderRadius {
    return {
      topLeft: tlbr,
      bottomRight: tlbr,
      topRight: trbl,
      bottomLeft: trbl
    }
  },

  /**
   * Shortcut for creating rectangular border radius
   */
  squared(): BorderRadius {
    return BorderRadiusUtils.all(0);
  }
}

/**
 * Adds border configuration to class
 * @param cls
 */
export const addBorderConfigToClass = (cls: any) => {
  for (let i of BORDER_OPTIONS) {
    Factory.addGetterSetter(cls, i);
  }
};

/**
 * Applies a border configuration to this context
 * @param border
 * @param ctx
 */
export const applyBorderConfig = (border: BorderConfig, ctx: Context) => {
  if(!border) return;

  ctx._context.lineCap = border.borderCap;
  ctx._context.strokeStyle = border.borderColor;
  ctx._context.lineWidth = border.borderWidth;

  if (border.borderDash)
    ctx.setLineDash(border.borderDash);
}