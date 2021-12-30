/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: TextMeasurement.ts
 * Project: pamela
 * Committed last: 2021/12/30 @ 1355
 * ---
 * Description:
 */

import { Size2D }              from './common/Size2D';
import { normalizeFontFamily } from './TextUtils';
import { Context }                                   from './Context';
import {
  AUTO,
  CHAR,
  DASH,
  ELLIPSIS,
  JUSTIFY,
  NONE,
  TextConfig
} from './shapes/Text';

const
  PX_SPACE = 'px ',
  SPACE = ' ';

export interface TextMetrics {
  maxWidth: number;
  height: number;
  linesCount: number;
  charsCount: number;
  emptyLines: number;

  lines: LineMetric[];
}

export interface LineMetric {
  width: number;
  text: string;
}

export class TextMetricsHelper implements TextMetrics{
  charsCount: number;
  emptyLines: number;
  height: number;
  lines: LineMetric[];
  linesCount: number;
  maxWidth: number;

  toSize(): Size2D {
    return Size2D.fromBounds(this.maxWidth, this.height);
  }

  static construct(metrics: TextMetrics) {
    let t = new TextMetricsHelper();
    t.charsCount = metrics.charsCount;
    t.emptyLines = metrics.emptyLines;
    t.height = metrics.height;
    t.lines = metrics.lines;
    t.linesCount = metrics.linesCount;
    t.maxWidth = metrics.maxWidth;

    return t;
  }

  /**
   * Returns complete text of this measure
   * */
  getCompleteText(): string {
    let txt = "";
    for(const l of this.lines)
      txt += l.text;

    return txt;
  }
}

/**
 * Separated ecosistem for performing measurements, based on text configurations
 */
export class TextMeasurementHelper {
  text: string;
  size: Size2D;
  padding: number;
  lineHeight: number;
  wrap: string;
  ellipsis: boolean;
  fontStyle: string;
  fontVariant: string;
  fontSize: number;
  fontFamily: string;
  letterSpacing: number;
  align: string;

  private textArr: LineMetric[];
  private measureContext: CanvasRenderingContext2D;

  constructor(config: TextConfig, context: CanvasRenderingContext2D) {
    this.textArr = [];
    this.measureContext = context;

    // Copy all
    this.text = config.text;
    this.padding = config.padding;
    this.lineHeight = config.lineHeight;
    this.wrap = config.wrap;
    this.ellipsis = config.ellipsis;
    this.fontStyle = config.fontStyle;
    this.fontVariant = config.fontVariant;
    this.fontSize = config.fontSize;
    this.fontFamily = config.fontFamily;
    this.letterSpacing = config.letterSpacing;
  }

  private getFontInfo() {
    return (
      this.fontStyle +
      SPACE +
      this.fontVariant +
      SPACE +
      (this.fontSize + PX_SPACE) +
      // wrap font family into " so font families with spaces works ok
      normalizeFontFamily(this.fontFamily)
    );
  }

  /**
   * Measures text width (single line)
   * @param text Text to measure
   */
  getTextWidth(text): number {
    var letterSpacing = this.letterSpacing;
    var length = text.length;
    return (
      this.measureContext.measureText(text).width +
      (length ? letterSpacing * (length - 1) : 0)
    );
  }

  /**
   * Measures complex text metrics, splitting on multiple lines to make space
   * fit correctly. Returns metrics measurement
   * @param size Box size to apply
   */
  measureComplexText(size: Size2D): TextMetrics {
    // Empty measurement text array
    this.textArr = [];
    // Extract configuration parameters
    var lines = this.text.split('\n'),
      fontSize = +this.fontSize,
      textWidth = 0,
      lineHeightPx = this.lineHeight * fontSize,
      width = size.getWidth() as any,
      height = size.getHeight() as any,
      fixedWidth = width !== AUTO && width !== undefined,
      fixedHeight = height !== AUTO && height !== undefined,
      padding = this.padding,
      maxWidth = width - padding * 2,
      maxHeightPx = height - padding * 2,
      currentHeightPx = 0,
      wrap = this.wrap,
      // align = this.align(),
      shouldWrap = wrap !== NONE,
      wrapAtWord = wrap !== CHAR && shouldWrap,
      shouldAddEllipsis = this.ellipsis;

    this.measureContext.font = this.getFontInfo();
    var additionalWidth = shouldAddEllipsis ? this.getTextWidth(ELLIPSIS) : 0;
    for (var i = 0, max = lines.length; i < max; ++i) {
      var line = lines[i];

      var lineWidth = this.getTextWidth(line);
      if (fixedWidth && lineWidth > maxWidth) {
        /*
         * if width is fixed and line does not fit entirely
         * break the line into multiple fitting lines
         */
        while (line.length > 0) {
          /*
           * use binary search to find the longest substring that
           * that would fit in the specified width
           */
          var low = 0,
            high = line.length,
            match = '',
            matchWidth = 0;
          while (low < high) {
            var mid = (low + high) >>> 1,
              substr = line.slice(0, mid + 1),
              substrWidth = this.getTextWidth(substr) + additionalWidth;
            if (substrWidth <= maxWidth) {
              low = mid + 1;
              match = substr;
              matchWidth = substrWidth;
            } else {
              high = mid;
            }
          }
          /*
           * 'low' is now the index of the substring end
           * 'match' is the substring
           * 'matchWidth' is the substring width in px
           */
          if (match) {
            // a fitting substring was found
            if (wrapAtWord) {
              // try to find a space or dash where wrapping could be done
              var wrapIndex;
              var nextChar = line[match.length];
              var nextIsSpaceOrDash = nextChar === SPACE || nextChar === DASH;
              if (nextIsSpaceOrDash && matchWidth <= maxWidth) {
                wrapIndex = match.length;
              } else {
                wrapIndex =
                  Math.max(match.lastIndexOf(SPACE), match.lastIndexOf(DASH)) +
                  1;
              }
              if (wrapIndex > 0) {
                // re-cut the substring found at the space/dash position
                low = wrapIndex;
                match = match.slice(0, low);
                matchWidth = this.getTextWidth(match);
              }
            }
            match = match.trimRight();

            // Add text line to array
            this._addTxtLineToArr(match);
            textWidth = Math.max(textWidth, matchWidth);
            currentHeightPx += lineHeightPx;
            if (
              !shouldWrap ||
              (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx)
            ) {
              var lastLine = this.textArr[this.textArr.length - 1];
              if (lastLine) {
                if (shouldAddEllipsis) {
                  var haveSpace =
                    this.getTextWidth(lastLine.text + ELLIPSIS) < maxWidth;
                  if (!haveSpace) {
                    lastLine.text = lastLine.text.slice(
                      0,
                      lastLine.text.length - 3
                    );
                  }

                  this.textArr.splice(this.textArr.length - 1, 1);
                  this._addTxtLineToArr(lastLine.text + ELLIPSIS);
                }
              }

              /*
               * stop wrapping if wrapping is disabled or if adding
               * one more line would overflow the fixed height
               */
              break;
            }
            line = line.slice(low);
            line = line.trimLeft();
            if (line.length > 0) {
              // Check if the remaining text would fit on one line
              lineWidth = this.getTextWidth(line);
              if (lineWidth <= maxWidth) {
                // if it does, add the line and break out of the loop
                this._addTxtLineToArr(line);
                currentHeightPx += lineHeightPx;
                textWidth = Math.max(textWidth, lineWidth);
                break;
              }
            }
          } else {
            // not even one character could fit in the element, abort
            break;
          }
        }
      } else {
        // element width is automatically adjusted to max line width
        this._addTxtLineToArr(line);
        currentHeightPx += lineHeightPx;
        textWidth = Math.max(textWidth, lineWidth);
      }
      // if element height is fixed, abort if adding one more line would overflow
      if (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx) {
        break;
      }
    }

    // Return various useful metrics
    return {
      lines: this.textArr,
      maxWidth: textWidth,
      height: currentHeightPx + (this.fontSize * this.lineHeight),
      linesCount: this.textArr.length,
      charsCount: this.text.length,
      emptyLines: 0,
    }
  }

  /**
   * Add a text line into a metrics array, calculating its width
   * @param line
   */
  private _addTxtLineToArr(line: string) {
    if (this.align === JUSTIFY) {
      line = line.trim();
    }
    var width = this.getTextWidth(line);
    return this.textArr.push({ text: line, width: width });
  }

}

