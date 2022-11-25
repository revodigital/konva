/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabrielecavallo
 * File: Alignment.ts
 * Project: pamela 
 * Committed last: 2022/11/25 @ 1256
 * ---
 * Description:
 */

/**
 * Represents an horizontal alignment
 */
export enum HorizontalAlignment {
  /**
   * Align text center
   */
  Center = "center",
  /**
   * Align text left
   */
  Left = "left",
  /**
   * Align text right
   */
  Right = "right",
  /**
   * Align text using justify alghorithm
   */
  Justify = "justify"
}

/**
 * Represents a vertical alignment
 */
export enum VerticalAlignment {
  Center,
  Top,
  Bottom,
}

export const HAlign = {
  toHtmlTextAlign(h: HorizontalAlignment): string {
    switch (h) {
      case HorizontalAlignment.Center:
        return 'center';
      case HorizontalAlignment.Left:
        return 'left';
      case HorizontalAlignment.Right:
        return 'right';
    }
  }
}

export const VAlign = {
  toHtmlVertAlign(v: VerticalAlignment): string {
    switch (v) {
      case VerticalAlignment.Bottom:
        return 'bottom';
      case VerticalAlignment.Center:
        return 'baseline';
      case VerticalAlignment.Top:
        return 'top';
    }
  }
}