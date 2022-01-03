/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: BorderOptions.ts
 * Project: complexshapestest
 * Committed last: 2021/10/22 @ 2154
 * ---
 * Description: Implements the BorderOptions class
 */

import { LineDashConfiguration } from './LineDash';
import { Factory }               from '../Factory';
import { BorderOptions }         from '../../lib/configuration/BorderOptions';
import { LineCap }               from './LineCap';

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
  topLeft: number;
  topRight: number;
  bottomLeft: number;
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
 * Construct a border radius with every corner with the same
 * radius
 * @param val
 */
export const borderRadiusAll = (val: number): BorderRadius => {
  return {
    topLeft: val,
    topRight: val,
    bottomLeft: val,
    bottomRight: val,
  };
};

/**
 * Create a symmetric border radius
 * @param top Value for topLeft and topRight
 * @param bottom Value for bottomLeft and bottomRight
 */
export const borderRadiusSym = (top: number, bottom: number): BorderRadius => {
  return {
    topLeft: top, topRight: top,
    bottomRight: bottom,
    bottomLeft: bottom
  };
};

/**
 * Adds border configuration to class
 * @param cls
 */
export const addBorderConfigToClass = (cls: any) => {
  for (let i of BORDER_OPTIONS) {
    Factory.addGetterSetter(cls, i);
  }
};
