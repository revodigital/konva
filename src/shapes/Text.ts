/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: Text.ts
 * Project: pamela
 * Committed last: 2021/12/6 @ 159
 * ---
 * Description:
 */

import { Util }               from '../Util';
import { Factory }            from '../Factory';
import { Shape, ShapeConfig } from '../Shape';
import { Pamela }             from '../Global';
import {
  getNumberValidator,
  getStringValidator,
  getNumberOrAutoValidator,
  getBooleanValidator,
}                             from '../Validators';
import { _registerNode }      from '../Global';

import { GetSet }           from '../types';
import { KonvaEventObject } from '../Node';
import {
  Size2D
}                           from '../common/Size2D';
import { cli }              from 'cypress';
import {
  eventIsExit,
  eventIsNewLine,
  eventAddsText,
  eventRemovesText,
  removeSlice,
  isDeleteForward,
  isSimplePushPop,
  popBefore,
  popAfter, cursorIsAtEndOfInput, cursorIsAtStartOfInput, rangeOf, pixel
} from './utils';

/**
 * Minimum font size
 */
export const MIN_FONT_SIZE = 6;

export function stringToArray(string: string) {
  // we need to use `Array.from` because it can split unicode string correctly
  // we also can use some regexp magic from lodash:
  // https://github.com/lodash/lodash/blob/fb1f99d9d90ad177560d771bc5953a435b2dc119/lodash.toarray/index.js#L256
  // but I decided it is too much code for that small fix
  return Array.from(string);
}

/**
 * Represents how textbox boundaries should grow
 * and witch of them should remain fixed
 */
export enum GrowMode {
  /**
   * Fixed height and dynamic width
   */
  GrowWidth,
  /**
   * Fixed width and dynamic height
   */
  GrowHeight
}

export interface TextConfig extends ShapeConfig {
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: string;
  fontVariant?: string;
  textDecoration?: string;
  align?: string;
  verticalAlign?: string;
  padding?: number;
  lineHeight?: number;
  letterSpacing?: number;
  wrap?: string;
  ellipsis?: boolean;

  /**
   * Indicates if this text is editable or not
   * (using inline textarea)
   */
  editable?: boolean;

  /**
   * Indicates if boundaries of this text can increase when in editing mode.
   * If it is disabled, font size will became dynamic. This means that text overflowing fixed
   * boundaries will cause font size decrease until 6px.
   */
  lockSize?: boolean;
  autoFontSize?: boolean;

  /**
   * Enables / disables spellcheck while editing text
   */
  spellcheckOnEdit?: boolean;

  /**
   * If set to true, new line will be added using Shift + Enter shortcut,
   * otherwise it will be impossible to create custom line breaks.
   */
  enableNewLine?: boolean;

  /**
   * When this option is true, font size will be also recalculated to make text fit the container boundaries.
   * This calculation is triggered at every input
   */
  expandToFit?: boolean;

  /**
   * Represents how textbox boundaries should grow while in
   * editing mode
   * and witch of them should remain fixed
   */
  growPolicy?: GrowMode;
}

// constants
var AUTO = 'auto',
  //CANVAS = 'canvas',
  CENTER = 'center',
  JUSTIFY = 'justify',
  CHANGE_KONVA = 'Change.konva',
  CONTEXT_2D = '2d',
  DASH = '-',
  LEFT = 'left',
  TEXT = 'text',
  TEXT_UPPER = 'Text',
  TOP = 'top',
  BOTTOM = 'bottom',
  MIDDLE = 'middle',
  NORMAL = 'normal',
  PX_SPACE = 'px ',
  SPACE = ' ',
  RIGHT = 'right',
  WORD = 'word',
  CHAR = 'char',
  NONE = 'none',
  ELLIPSIS = '…',
  ATTR_CHANGE_LIST = [
    'fontFamily',
    'fontSize',
    'fontStyle',
    'fontVariant',
    'padding',
    'align',
    'verticalAlign',
    'lineHeight',
    'text',
    'width',
    'height',
    'wrap',
    'ellipsis',
    'letterSpacing',
  ],
  // cached variables
  attrChangeListLen = ATTR_CHANGE_LIST.length;

function normalizeFontFamily(fontFamily: string) {
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

var dummyContext;

function getDummyContext() {
  if (dummyContext) {
    return dummyContext;
  }
  dummyContext = Util.createCanvasElement().getContext(CONTEXT_2D);
  return dummyContext;
}

function _fillFunc(context) {
  context.fillText(this._partialText, this._partialTextX, this._partialTextY);
}

function _strokeFunc(context) {
  context.strokeText(this._partialText, this._partialTextX, this._partialTextY);
}

function checkDefaultFill(config) {
  config = config || {};

  // set default color to black
  if (
    !config.fillLinearGradientColorStops &&
    !config.fillRadialGradientColorStops &&
    !config.fillPatternImage
  ) {
    config.fill = config.fill || 'black';
  }
  return config;
}

/**
 * Text constructor
 * @constructor
 * @memberof Konva
 * @augments Pamela.Shape
 * @param {Object} config
 * @param {String} [config.fontFamily] default is Arial
 * @param {Number} [config.fontSize] in pixels.  Default is 12
 * @param {String} [config.fontStyle] can be 'normal', 'bold', 'italic' or even 'italic bold'.  Default is 'normal'
 * @param {String} [config.fontVariant] can be normal or small-caps.  Default is normal
 * @param {String} [config.textDecoration] can be line-through, underline or empty string. Default is empty string.
 * @param {String} config.text
 * @param {String} [config.align] can be left, center, or right
 * @param {String} [config.verticalAlign] can be top, middle or bottom
 * @param {Number} [config.padding]
 * @param {Number} [config.lineHeight] default is 1
 * @param {String} [config.wrap] can be "word", "char", or "none". Default is word
 * @param {Boolean} [config.ellipsis] can be true or false. Default is false. if Konva.Text config is set to wrap="none" and ellipsis=true, then it will add "..." to the end
 * @@shapeParams
 * @@nodeParams
 * @example
 * var text = new Konva.Text({
 *   x: 10,
 *   y: 15,
 *   text: 'Simple Text',
 *   fontSize: 30,
 *   fontFamily: 'Calibri',
 *   fill: 'green'
 * });
 */
export class Text extends Shape<TextConfig> {
  textArr: Array<{ text: string; width: number }>;
  _partialText: string;
  _partialTextX = 0;
  _partialTextY = 0;
  _inputBlocked = false;
  _editing = false;
  _textArea: HTMLTextAreaElement;

  textWidth: number;
  textHeight: number;

  editable: GetSet<boolean, this>;
  lockSize: GetSet<boolean, this>;
  autoFontSize: GetSet<boolean, this>;
  spellcheckOnEdit: GetSet<boolean, this>;
  enableNewLine: GetSet<boolean, this>;
  expandToFit: GetSet<boolean, this>;
  growPolicy: GetSet<GrowMode, this>;

  /**
   * Creates a new Text shape
   */
  constructor(config?: TextConfig) {
    super(checkDefaultFill(config));
    // update text data for certain attr changes
    for (var n = 0; n < attrChangeListLen; n++) {
      this.on(ATTR_CHANGE_LIST[n] + CHANGE_KONVA, this._setTextData);
    }
    this._setTextData();

    // Editing listeners
    this.on('dblclick', (e) => this._onEditingStart(e));

    this._textArea = undefined;

    if (!this.growPolicy())
      this.growPolicy(GrowMode.GrowWidth);

    if(this.lockSize() === undefined)
      this.lockSize(false);

    if (this.expandToFit() === undefined)
      this.expandToFit(true);

    if (this.expandToFit()) this.fitContainer();
  }

  /**
   * Called when user starts editing this text
   * @param event Event fired
   */
  private _onEditingStart(event: KonvaEventObject<MouseEvent>): void {
    if (!this.editable()) return;

    // Create text area
    // create textarea and style it
    this._textArea = document.createElement('textarea');
    this._textArea.style.visibility = 'hidden';
    document.body.appendChild(this._textArea);

    this.hide();
    this._showTextArea();
    this._editing = true;
    this._inputBlocked = false;

    // at first lets find position of text node relative to the stage:
    var textPosition = this.absolutePosition();

    // so position of textarea will be the sum of positions above:
    var areaPosition = {
      x: this.getStage().container().offsetLeft + textPosition.x + 2,
      y: this.getStage().container().offsetTop + textPosition.y + 2,
    };

    // apply many styles to match text on canvas as close as possible
    // remember that text rendering on canvas and on the textarea can be different
    // and sometimes it is hard to make it 100% the same. But we will try...
    this._textArea.value = this.text();
    this._textArea.style.position = 'absolute';
    this._textArea.style.top = areaPosition.y + 'px';
    this._textArea.style.left = areaPosition.x + 'px';
    this._textArea.style.width = pixel(this.getPaddedWidth());
    this._textArea.style.height = pixel(this.getPaddedHeight());
    this._textArea.style.fontSize = pixel(this.fontSize());
    this._textArea.style.border = 'none';
    this._textArea.style.padding = pixel(this.padding());
    this._textArea.style.margin = '0px';
    this._textArea.style.overflow = 'hidden';
    this._textArea.style.background = 'none';
    this._textArea.style.outline = 'none';
    this._textArea.style.resize = 'none';
    this._textArea.style.lineHeight = this.lineHeight().toString();
    this._textArea.style.fontFamily = this.fontFamily();
    this._textArea.style.transformOrigin = 'left top';

    this._textArea.style.textAlign = this.align();
    // Justify also needs whiteSpace = normal to work
    if(this.align() === 'justify') {
      this._textArea.style.whiteSpace = 'normal';

    }
    this._textArea.style.color = this.fill();
    let rotation = this.rotation();
    let transform = '';
    if (rotation) {
      transform += 'rotateZ(' + rotation + 'deg)';

    }

    // var px = 0;
    // // also we need to slightly move this._textArea on firefox
    // // because it jumps a bit
    // var isFirefox =
    //   navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    // if (isFirefox) {
    //   px += 2 + Math.round(this.fontSize() / 20);
    // }
    // transform += 'translateY(-' + px + 'px)';
    this._textArea.style.transform = transform;
    this._textArea.spellcheck = this.spellcheckOnEdit() || false;
    // Set text area height
    // Focus this text area
    this._textArea.focus();

    // Event listener for keydown events
    this._textArea.addEventListener('keydown', (e) => this._onInputKeyDown(e));
  }

  getPaddedWidth(): number {
    return this.width() - (this.padding() * 2)
  }

  getPaddedHeight(): number {
    return this.height() - (this.padding() * 2);
  }

  /**
   * Basic event dispatcher (based on event type or key, calls other event managers
   * for specific behaviors)
   * @param e
   */
  private _onInputKeyDown(e: KeyboardEvent): void {
    const tmp = this.text();

    // Handle specifically new line
    if (eventIsNewLine(e))
      this._onNewLine(e);

    // In case of add text when input is blocked, block event and replace original text
    if (eventAddsText(e, this._textArea) && this._inputBlocked) {
      e.preventDefault();
      e.stopImmediatePropagation();
      this._textArea.value = tmp;
      this.text(tmp);
      return;
    } else if (eventAddsText(e, this._textArea) && !this._inputBlocked)
      this._onAddText(e);
    else if (eventRemovesText(e, this._textArea))
      this._onRemoveText(e);

    // Check for exiting events
    else if (eventIsExit(e))
      this._onExitInput(e);

    // Stop propagation from other listeners
    e.stopImmediatePropagation();
  }

  /**
   * Calculates font size to make text fit into the given rectangle.
   * @param size Rectangle size
   * @returns true is it can be contained, false otherwise.
   */
  canFitRect(size: Size2D): boolean {
    const newFontSize = Math.floor(Math.sqrt((size.getWidth() * size.getHeight()) / this.text().length));

    if (newFontSize < MIN_FONT_SIZE) return false;
    this.fontSize(newFontSize);
    return true;
  }

  /**
   * Called when user presses something to exit editing mode
   * (enter or outside press) Closes editing mode and saves edited text
   * @param e
   */
  private _onExitInput(e: KeyboardEvent): void {
    this.text(this._textArea.value);
    this._hideTextArea();
    this._onEditingEnd(this);
  }

  /**
   * Sets text area font size
   * @param ft
   * @private
   */
  private _setTextAreaFontSize(ft: number): void {
    this._textArea.style.fontSize = `${ ft }px`;
  }

  /**
   * Called when an input removes some text from the editor
   * @param e
   */
  private _onRemoveText(e: KeyboardEvent): void {
    // Check if text can be resized to fit container
    if (this.expandToFit() === true) {
      const f = this.fitContainer();
      this._setTextAreaFontSize(f);
    }

    // Resize if dimensions are not locked
    if (this.lockSize() === false) {
      // Resize height
      if (this.growPolicy() === GrowMode.GrowHeight) {
        this.height(this.measureTextHeight());
        this._resizeTextAreaHeight(this.height());
      } else {
        // Resize width
        this.width(this.getTextWidth() + (this.padding() * 2));
        this._resizeTextAreaWidth(this.width());
      }
    }

    // Update text
    this.text(this._textArea.value);
  }

  /**
   * Called when new line is inserted
   * @param e
   */
  private _onNewLine(e: KeyboardEvent): void {
    if (this.enableNewLine() === true) return;

    // Block new line event
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }

  /**
   * Called when there is a new input char (not an exit one) that
   * adds new text into the container
   * @param e
   */
  private _onAddText(e: KeyboardEvent): void {
    let scale = this.getAbsoluteScale().x;

    // Apply current height and width using also scale
    this._resizeTextAreaWidth(this.width() * scale);

    // Let size grow if allowed
    if (this.lockSize() === false) {
      // Let height grow if allowed
      if (this.measureTextHeight() + (this.fontSize() * this.lineHeight()) > this.height() && this.growPolicy() === GrowMode.GrowHeight) {
        // Resize height of shape and also of text area
        this.height(this.measureTextHeight() + (this.fontSize() * this.lineHeight()));
        this._resizeTextAreaHeight(this.height());
      }

      // Check for grow width
      if (rangeOf(this.width() - (this.fontSize() * this.lineHeight()) - (this.padding() * 2),
        this.width() - (this.padding() * 2),
        this.getTextWidth()) && this.growPolicy() === GrowMode.GrowWidth) {
        this.width(this.width() + (this.fontSize() * this.lineHeight()));
        this._resizeTextAreaWidth(this.width());
      }
    }

    // Check for possibility of font decrease when in lockSize mode
    if (!this._decreaseFontSizeToFit())
      // Block only add-text actions
      this._inputBlocked = true;

    // Sync current text. If it is removed, all calculations of text height will be incorrect
    this.text(this._textArea.value + e.key);
  }

  /**
   * Decreases font size to make text fit container
   * @private
   */
  private _decreaseFontSizeToFit(): boolean {
    if (this.lockSize() === false) return true;

    while (this.measureTextHeight() + (this.fontSize() * this.lineHeight()) > this.height()) {
      if (this.fontSize() < 7) return false;

      this.fontSize(this.fontSize() - 1);
      this._textArea.style.fontSize = `${ this.fontSize() }px`;
    }
    return true;
  }

  /**
   * Calculates a new fontsize to perfectly fit container size
   * (shape width and height)
   */
  public fitContainer(): number {
    let ft = this.fontSize();
    let ftr = this._fontSizeFits(ft);
    // Check if current fontsize can fit
    while (ftr !== 0) {
      // Increment or decrement font size
      if (ftr === -1)
        ft++;
      else ft--;
      // Update ftr
      this.fontSize(ft);
      ftr = this._fontSizeFits(ft);
    }

    return ft;
  }

  /**
   * Checks if a fontsize can be contained into this shape
   * @param fontSize
   * @returns 0 when this fontsize fits leaving no space free
   * @returns -1 when this fontsize leaves free space (al least fot 1 row)
   * @returns 1 when this fontsize exceeds space
   * @private
   */
  private _fontSizeFits(fontSize: number): -1 | 1 | 0 {
    const h = this.measureTextHeightByFontSize(fontSize);

    if (h <= this.height() && h > this.height() - (this.fontSize() * this.lineHeight())) return 0;
    else if (h > this.height()) return 1;
    else return -1;
  }

  /**
   * Get width of a specific line
   * @param index
   */
  getLineWidth(index: number): number {
    return this.textArr[index].width;
  }

  /**
   * Get text of a specific line
   * @param index
   */
  getLineText(index: number): string {
    return this.textArr[index].text;
  }

  /**
   * Measures current text height based
   * on fontsize, lineHeight and padding
   */
  measureTextHeight(): number {
    return (this.fontSize() * this.textArr.length * this.lineHeight()) +
           this.padding() * 2;
  }

  /**
   * Measures text height based on a specific fontsize specified as parameter
   * @param fontSize
   */
  measureTextHeightByFontSize(fontSize: number): number {
    return (fontSize * this.textArr.length * this.lineHeight()) +
           this.padding() * 2;
  }

  /**
   * Hides text editing area
   */
  private _hideTextArea(): void {
    this._textArea.style.visibility = 'hidden';
  }

  /**
   * Shows text editing area
   */
  private _showTextArea(): void {
    this._textArea.style.visibility = 'visible';
  }

  /**
   * Resizes text area width
   * @param newWidth New width to set
   */
  private _resizeTextAreaWidth(newWidth: number): void {
    if (!newWidth) {
      // set width for placeholder
      newWidth = this._textArea.placeholder.length * this.fontSize();
    }
    // some extra fixes on different browsers
    var isSafari = /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent
    );
    var isFirefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isSafari || isFirefox) {
      newWidth = Math.ceil(newWidth);
    }

    this._textArea.style.width = pixel(newWidth - (this.padding() * 2));
  }

  private _resizeTextAreaHeight(newHeight: number): void {
    if (!newHeight) {
      // set width for placeholder
      newHeight = this._textArea.placeholder.length * this.fontSize();
    }
    // some extra fixes on different browsers
    var isSafari = /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent
    );
    var isFirefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isSafari || isFirefox) {
      newHeight = Math.ceil(newHeight);
    }

    this._textArea.style.height = pixel(newHeight - (this.padding() * 2));
  }

  /**
   * Called when text editing ends
   * @param me Pointer to this
   */
  private _onEditingEnd(me: Text): void {
    // Set status variables
    this._editing = false;
    me.show();

    // Remove text area
    this._textArea.parentNode.removeChild(this._textArea);
  }

  /**
   * Drawing function
   * @param context
   */
  _sceneFunc(context) {
    var textArr = this.textArr,
      textArrLen = textArr.length;

    if (!this.text()) {
      return;
    }

    var padding = this.padding(),
      fontSize = this.fontSize(),
      lineHeightPx = this.lineHeight() * fontSize,
      verticalAlign = this.verticalAlign(),
      alignY = 0,
      align = this.align(),
      totalWidth = this.getWidth(),
      letterSpacing = this.letterSpacing(),
      fill = this.fill(),
      textDecoration = this.textDecoration(),
      shouldUnderline = textDecoration.indexOf('underline') !== -1,
      shouldLineThrough = textDecoration.indexOf('line-through') !== -1,
      n;

    var translateY = 0;
    var translateY = lineHeightPx / 2;

    var lineTranslateX = 0;
    var lineTranslateY = 0;

    context.setAttr('font', this._getContextFont());

    context.setAttr('textBaseline', MIDDLE);

    context.setAttr('textAlign', LEFT);

    // handle vertical alignment
    if (verticalAlign === MIDDLE) {
      alignY = (this.getHeight() - textArrLen * lineHeightPx - padding * 2) / 2;
    } else if (verticalAlign === BOTTOM) {
      alignY = this.getHeight() - textArrLen * lineHeightPx - padding * 2;
    }

    context.translate(padding, alignY + padding);

    // draw text lines
    for (n = 0; n < textArrLen; n++) {
      var lineTranslateX = 0;
      var lineTranslateY = 0;
      var obj = textArr[n],
        text = obj.text,
        width = obj.width,
        lastLine = n !== textArrLen - 1,
        spacesNumber,
        oneWord,
        lineWidth;

      // horizontal alignment
      context.save();
      if (align === RIGHT) {
        lineTranslateX += totalWidth - width - padding * 2;
      } else if (align === CENTER) {
        lineTranslateX += (totalWidth - width - padding * 2) / 2;
      }

      if (shouldUnderline) {
        context.save();
        context.beginPath();

        context.moveTo(
          lineTranslateX,
          translateY + lineTranslateY + Math.round(fontSize / 2)
        );
        spacesNumber = text.split(' ').length - 1;
        oneWord = spacesNumber === 0;
        lineWidth =
          align === JUSTIFY && lastLine && !oneWord
          ? totalWidth - padding * 2
          : width;
        context.lineTo(
          lineTranslateX + Math.round(lineWidth),
          translateY + lineTranslateY + Math.round(fontSize / 2)
        );

        // I have no idea what is real ratio
        // just /15 looks good enough
        context.lineWidth = fontSize / 15;
        context.strokeStyle = fill;
        context.stroke();
        context.restore();
      }
      if (shouldLineThrough) {
        context.save();
        context.beginPath();
        context.moveTo(lineTranslateX, translateY + lineTranslateY);
        spacesNumber = text.split(' ').length - 1;
        oneWord = spacesNumber === 0;
        lineWidth =
          align === JUSTIFY && lastLine && !oneWord
          ? totalWidth - padding * 2
          : width;
        context.lineTo(
          lineTranslateX + Math.round(lineWidth),
          translateY + lineTranslateY
        );
        context.lineWidth = fontSize / 15;
        context.strokeStyle = fill;
        context.stroke();
        context.restore();
      }
      if (letterSpacing !== 0 || align === JUSTIFY) {
        //   var words = text.split(' ');
        spacesNumber = text.split(' ').length - 1;
        var array = stringToArray(text);
        for (var li = 0; li < array.length; li++) {
          var letter = array[li];
          // skip justify for the last line
          if (letter === ' ' && n !== textArrLen - 1 && align === JUSTIFY) {
            lineTranslateX += (totalWidth - padding * 2 - width) / spacesNumber;
            // context.translate(
            //   Math.floor((totalWidth - padding * 2 - width) / spacesNumber),
            //   0
            // );
          }
          this._partialTextX = lineTranslateX;
          this._partialTextY = translateY + lineTranslateY;
          this._partialText = letter;
          context.fillStrokeShape(this);
          lineTranslateX += this.measureSize(letter).width + letterSpacing;
        }
      } else {
        this._partialTextX = lineTranslateX;
        this._partialTextY = translateY + lineTranslateY;
        this._partialText = text;

        context.fillStrokeShape(this);
      }
      context.restore();
      if (textArrLen > 1) {
        translateY += lineHeightPx;
      }
    }
  }

  _hitFunc(context) {
    var width = this.getWidth(),
      height = this.getHeight();

    context.beginPath();
    context.rect(0, 0, width, height);
    context.closePath();
    context.fillStrokeShape(this);
  }

  /**
   * Sets text of this shape
   * @param text
   */
  setText(text) {
    var str = Util._isString(text)
              ? text
              : text === null || text === undefined
                ? ''
                : text + '';
    this._setAttr(TEXT, str);
    return this;
  }

  getWidth() {
    var isAuto = this.attrs.width === AUTO || this.attrs.width === undefined;
    return isAuto ? this.getTextWidth() + this.padding() * 2 : this.attrs.width;
  }

  getHeight() {
    var isAuto = this.attrs.height === AUTO || this.attrs.height === undefined;
    return isAuto
           ? this.fontSize() * this.textArr.length * this.lineHeight() +
             this.padding() * 2
           : this.attrs.height;
  }

  /**
   * get pure text width without padding
   * @method
   * @name Pamela.Text#getTextWidth
   * @returns {Number}
   */
  getTextWidth() {
    return this.textWidth;
  }

  getTextHeight() {
    Util.warn(
      'text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height.'
    );
    return this.textHeight;
  }

  /**
   * measure string with the font of current text shape.
   * That method can't handle multiline text.
   * @method
   * @name Pamela.Text#measureSize
   * @param {String} [text] text to measure
   * @returns {Object} { width , height} of measured text
   */
  measureSize(text) {
    var _context = getDummyContext(),
      fontSize = this.fontSize(),
      metrics;

    _context.save();
    _context.font = this._getContextFont();

    metrics = _context.measureText(text);
    _context.restore();
    return {
      width: metrics.width,
      height: fontSize,
    };
  }

  _getContextFont() {
    return (
      this.fontStyle() +
      SPACE +
      this.fontVariant() +
      SPACE +
      (this.fontSize() + PX_SPACE) +
      // wrap font family into " so font families with spaces works ok
      normalizeFontFamily(this.fontFamily())
    );
  }

  _addTextLine(line) {
    if (this.align() === JUSTIFY) {
      line = line.trim();
    }
    var width = this._getTextWidth(line);
    return this.textArr.push({ text: line, width: width });
  }

  _getTextWidth(text) {
    var letterSpacing = this.letterSpacing();
    var length = text.length;
    return (
      getDummyContext().measureText(text).width +
      (length ? letterSpacing * (length - 1) : 0)
    );
  }

  _setTextData() {
    var lines = this.text().split('\n'),
      fontSize = +this.fontSize(),
      textWidth = 0,
      lineHeightPx = this.lineHeight() * fontSize,
      width = this.attrs.width,
      height = this.attrs.height,
      fixedWidth = width !== AUTO && width !== undefined,
      fixedHeight = height !== AUTO && height !== undefined,
      padding = this.padding(),
      maxWidth = width - padding * 2,
      maxHeightPx = height - padding * 2,
      currentHeightPx = 0,
      wrap = this.wrap(),
      // align = this.align(),
      shouldWrap = wrap !== NONE,
      wrapAtWord = wrap !== CHAR && shouldWrap,
      shouldAddEllipsis = this.ellipsis();

    this.textArr = [];
    getDummyContext().font = this._getContextFont();
    var additionalWidth = shouldAddEllipsis ? this._getTextWidth(ELLIPSIS) : 0;
    for (var i = 0, max = lines.length; i < max; ++i) {
      var line = lines[i];

      var lineWidth = this._getTextWidth(line);
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
              substrWidth = this._getTextWidth(substr) + additionalWidth;
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
                matchWidth = this._getTextWidth(match);
              }
            }
            // if (align === 'right') {
            match = match.trimRight();
            // }
            this._addTextLine(match);
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
                    this._getTextWidth(lastLine.text + ELLIPSIS) < maxWidth;
                  if (!haveSpace) {
                    lastLine.text = lastLine.text.slice(
                      0,
                      lastLine.text.length - 3
                    );
                  }

                  this.textArr.splice(this.textArr.length - 1, 1);
                  this._addTextLine(lastLine.text + ELLIPSIS);
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
              lineWidth = this._getTextWidth(line);
              if (lineWidth <= maxWidth) {
                // if it does, add the line and break out of the loop
                this._addTextLine(line);
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
        this._addTextLine(line);
        currentHeightPx += lineHeightPx;
        textWidth = Math.max(textWidth, lineWidth);
      }
      // if element height is fixed, abort if adding one more line would overflow
      if (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx) {
        break;
      }
    }
    this.textHeight = fontSize;
    // var maxTextWidth = 0;
    // for(var j = 0; j < this.textArr.length; j++) {
    //     maxTextWidth = Math.max(maxTextWidth, this.textArr[j].width);
    // }
    this.textWidth = textWidth;
  }

  // for text we can't disable stroke scaling
  // if we do, the result will be unexpected
  getStrokeScaleEnabled() {
    return true;
  }

  fontFamily: GetSet<string, this>;
  fontSize: GetSet<number, this>;
  fontStyle: GetSet<string, this>;
  fontVariant: GetSet<string, this>;
  align: GetSet<string, this>;
  letterSpacing: GetSet<number, this>;
  verticalAlign: GetSet<string, this>;
  padding: GetSet<number, this>;
  lineHeight: GetSet<number, this>;
  textDecoration: GetSet<string, this>;
  text: GetSet<string, this>;
  wrap: GetSet<string, this>;
  ellipsis: GetSet<boolean, this>;
}

Text.prototype._fillFunc = _fillFunc;
Text.prototype._strokeFunc = _strokeFunc;
Text.prototype.className = TEXT_UPPER;
Text.prototype._attrsAffectingSize = [
  'text',
  'fontSize',
  'padding',
  'wrap',
  'lineHeight',
  'letterSpacing',
];
_registerNode(Text);

/**
 * get/set width of text area, which includes padding.
 * @name Pamela.Text#width
 * @method
 * @param {Number} width
 * @returns {Number}
 * @example
 * // get width
 * var width = text.width();
 *
 * // set width
 * text.width(20);
 *
 * // set to auto
 * text.width('auto');
 * text.width() // will return calculated width, and not "auto"
 */
Factory.overWriteSetter(Text, 'width', getNumberOrAutoValidator());

/**
 * get/set the height of the text area, which takes into account multi-line text, line heights, and padding.
 * @name Pamela.Text#height
 * @method
 * @param {Number} height
 * @returns {Number}
 * @example
 * // get height
 * var height = text.height();
 *
 * // set height
 * text.height(20);
 *
 * // set to auto
 * text.height('auto');
 * text.height() // will return calculated height, and not "auto"
 */

Factory.overWriteSetter(Text, 'height', getNumberOrAutoValidator());

/**
 * get/set font family
 * @name Pamela.Text#fontFamily
 * @method
 * @param {String} fontFamily
 * @returns {String}
 * @example
 * // get font family
 * var fontFamily = text.fontFamily();
 *
 * // set font family
 * text.fontFamily('Arial');
 */
Factory.addGetterSetter(Text, 'fontFamily', 'Arial');

/**
 * get/set font size in pixels
 * @name Pamela.Text#fontSize
 * @method
 * @param {Number} fontSize
 * @returns {Number}
 * @example
 * // get font size
 * var fontSize = text.fontSize();
 *
 * // set font size to 22px
 * text.fontSize(22);
 */
Factory.addGetterSetter(Text, 'fontSize', 12, getNumberValidator());

/**
 * get/set font style.  Can be 'normal', 'italic', or 'bold' or even 'italic bold'.  'normal' is the default.
 * @name Pamela.Text#fontStyle
 * @method
 * @param {String} fontStyle
 * @returns {String}
 * @example
 * // get font style
 * var fontStyle = text.fontStyle();
 *
 * // set font style
 * text.fontStyle('bold');
 */

Factory.addGetterSetter(Text, 'fontStyle', NORMAL);

/**
 * get/set font variant.  Can be 'normal' or 'small-caps'.  'normal' is the default.
 * @name Pamela.Text#fontVariant
 * @method
 * @param {String} fontVariant
 * @returns {String}
 * @example
 * // get font variant
 * var fontVariant = text.fontVariant();
 *
 * // set font variant
 * text.fontVariant('small-caps');
 */

Factory.addGetterSetter(Text, 'fontVariant', NORMAL);

/**
 * get/set padding
 * @name Pamela.Text#padding
 * @method
 * @param {Number} padding
 * @returns {Number}
 * @example
 * // get padding
 * var padding = text.padding();
 *
 * // set padding to 10 pixels
 * text.padding(10);
 */

Factory.addGetterSetter(Text, 'padding', 0, getNumberValidator());

/**
 * get/set horizontal align of text.  Can be 'left', 'center', 'right' or 'justify'
 * @name Pamela.Text#align
 * @method
 * @param {String} align
 * @returns {String}
 * @example
 * // get text align
 * var align = text.align();
 *
 * // center text
 * text.align('center');
 *
 * // align text to right
 * text.align('right');
 */

Factory.addGetterSetter(Text, 'align', LEFT);

/**
 * get/set vertical align of text.  Can be 'top', 'middle', 'bottom'.
 * @name Pamela.Text#verticalAlign
 * @method
 * @param {String} verticalAlign
 * @returns {String}
 * @example
 * // get text vertical align
 * var verticalAlign = text.verticalAlign();
 *
 * // center text
 * text.verticalAlign('middle');
 */

Factory.addGetterSetter(Text, 'verticalAlign', TOP);

/**
 * get/set line height.  The default is 1.
 * @name Pamela.Text#lineHeight
 * @method
 * @param {Number} lineHeight
 * @returns {Number}
 * @example
 * // get line height
 * var lineHeight = text.lineHeight();
 *
 * // set the line height
 * text.lineHeight(2);
 */

Factory.addGetterSetter(Text, 'lineHeight', 1, getNumberValidator());

/**
 * get/set wrap.  Can be "word", "char", or "none". Default is "word".
 * In "word" wrapping any word still can be wrapped if it can't be placed in the required width
 * without breaks.
 * @name Pamela.Text#wrap
 * @method
 * @param {String} wrap
 * @returns {String}
 * @example
 * // get wrap
 * var wrap = text.wrap();
 *
 * // set wrap
 * text.wrap('word');
 */

Factory.addGetterSetter(Text, 'wrap', WORD);

/**
 * get/set ellipsis. Can be true or false. Default is false. If ellipses is true,
 * Konva will add "..." at the end of the text if it doesn't have enough space to write characters.
 * That is possible only when you limit both width and height of the text
 * @name Pamela.Text#ellipsis
 * @method
 * @param {Boolean} ellipsis
 * @returns {Boolean}
 * @example
 * // get ellipsis param, returns true or false
 * var ellipsis = text.ellipsis();
 *
 * // set ellipsis
 * text.ellipsis(true);
 */

Factory.addGetterSetter(Text, 'ellipsis', false, getBooleanValidator());

/**
 * set letter spacing property. Default value is 0.
 * @name Pamela.Text#letterSpacing
 * @method
 * @param {Number} letterSpacing
 */

Factory.addGetterSetter(Text, 'letterSpacing', 0, getNumberValidator());

/**
 * get/set text
 * @name Pamela.Text#text
 * @method
 * @param {String} text
 * @returns {String}
 * @example
 * // get text
 * var text = text.text();
 *
 * // set text
 * text.text('Hello world!');
 */

Factory.addGetterSetter(Text, 'text', '', getStringValidator());

/**
 * get/set text decoration of a text.  Possible values are 'underline', 'line-through' or combination of these values separated by space
 * @name Pamela.Text#textDecoration
 * @method
 * @param {String} textDecoration
 * @returns {String}
 * @example
 * // get text decoration
 * var textDecoration = text.textDecoration();
 *
 * // underline text
 * text.textDecoration('underline');
 *
 * // strike text
 * text.textDecoration('line-through');
 *
 * // underline and strike text
 * text.textDecoration('underline line-through');
 */

Factory.addGetterSetter(Text, 'textDecoration', '');

/**
 * Enable/disable editing possibility to this text
 */
Factory.addGetterSetter(Text, 'editable', false);

/**
 * Enable/disable boundaries lock
 */
Factory.addGetterSetter(Text, 'lockSize', false);

/**
 * Enable/disable auto font size
 */
Factory.addGetterSetter(Text, 'autoFontSize', false);

/**
 * Enable/disable spell checking on editing text area
 */
Factory.addGetterSetter(Text, 'spellcheckOnEdit', false);

/**
 * Enable / disable new line insert
 */
Factory.addGetterSetter(Text, 'enableNewLine', false);

/**
 * Enable / disable automatic fontsize grow to fit container
 */
Factory.addGetterSetter(Text, 'expandToFit', false);

Factory.addGetterSetter(Text, 'growPolicy', GrowMode.GrowHeight);