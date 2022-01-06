/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: Alignment.ts
 * Project: complexshapestest
 * Committed last: 2021/10/18 @ 1643
 * ---
 * Description: Defines the enum Alignment
 */

/**
 * Represents an horizontal alignment
 */
export enum HorizontalAlignment {
  Center,
  Left,
  Right,
  None
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