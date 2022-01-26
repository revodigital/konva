/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabriele
 * File: Global.ts
 * Project: pamela 
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */
import { DragButton } from './Node';

var PI_OVER_180 = Math.PI / 180;

/**
 * @namespace Pamela
 */

function detectBrowser() {
  return (
    typeof window !== 'undefined' &&
    // browser case
    ({}.toString.call(window) === '[object Window]' ||
     // electron case
     {}.toString.call(window) === '[object global]')
  );
}

declare const WorkerGlobalScope: any;

export const glob: any =
  typeof global !== 'undefined'
  ? global
  : typeof window !== 'undefined'
    ? window
    : typeof WorkerGlobalScope !== 'undefined'
      // eslint-disable-next-line no-restricted-globals
      ? self
      : {};

export const Pamela = {
  _global: glob,
  version: '@@version',
  isBrowser: detectBrowser(),
  isUnminified: /param/.test(function (param: any) {}.toString()),
  dblClickWindow: 400,
  getAngle(angle: number) {
    return Pamela.angleDeg ? angle * PI_OVER_180 : angle;
  },
  enableTrace: false,
  pointerEventsEnabled: true,
  /**
   * Should Konva automatically update canvas on any changes. Default is true.
   * @property autoDrawEnabled
   * @default true
   * @name autoDrawEnabled
   * @memberof Konva
   * @example
   * Konva.autoDrawEnabled = true;
   */
  autoDrawEnabled: true,
  /**
   * Should we enable hit detection while dragging? For performance reasons, by default it is false.
   * But on some rare cases you want to see hit graph and check intersections. Just set it to true.
   * @property hitOnDragEnabled
   * @default false
   * @name hitOnDragEnabled
   * @memberof Konva
   * @example
   * Konva.hitOnDragEnabled = true;
   */
  hitOnDragEnabled: false,
  /**
   * Should we capture touch events and bind them to the touchstart target? That is how it works on DOM elements.
   * The case: we touchstart on div1, then touchmove out of that element into another element div2.
   * DOM will continue trigger touchmove events on div1 (not div2). Because events are "captured" into initial target.
   * By default Konva do not do that and will trigger touchmove on another element, while pointer is moving.
   * @property capturePointerEventsEnabled
   * @default false
   * @name capturePointerEventsEnabled
   * @memberof Konva
   * @example
   * Konva.capturePointerEventsEnabled = true;
   */
  capturePointerEventsEnabled: false,

  _mouseListenClick: false,
  _touchListenClick: false,
  _pointerListenClick: false,
  _mouseInDblClickWindow: false,
  _touchInDblClickWindow: false,
  _pointerInDblClickWindow: false,
  _mouseDblClickPointerId: null,
  _touchDblClickPointerId: null,
  _pointerDblClickPointerId: null,

  /**
   * Global pixel ratio configuration. KonvaJS automatically detect pixel ratio of current device.
   * But you may override such property, if you want to use your value. Set this value before any components initializations.
   * @property pixelRatio
   * @default undefined
   * @name pixelRatio
   * @memberof Konva
   * @example
   * // before any Konva code:
   * Konva.pixelRatio = 1;
   */
  pixelRatio: (typeof window !== 'undefined' && window.devicePixelRatio) || 1,

  /**
   * Drag distance property. If you start to drag a node you may want to wait until pointer is moved to some distance from start point,
   * only then start dragging. Default is 3px.
   * @property dragDistance
   * @default 0
   * @memberof Konva
   * @example
   * Konva.dragDistance = 10;
   */
  dragDistance: 3,
  /**
   * Use degree values for angle properties. You may set this property to false if you want to use radian values.
   * @property angleDeg
   * @default true
   * @memberof Konva
   * @example
   * node.rotation(45); // 45 degrees
   * Konva.angleDeg = false;
   * node.rotation(Math.PI / 2); // PI/2 radian
   */
  angleDeg: true,
  /**
   * Show different warnings about errors or wrong API usage
   * @property showWarnings
   * @default true
   * @memberof Konva
   * @example
   * Konva.showWarnings = false;
   */
  showWarnings: true,

  /**
   * Configure what mouse buttons can be used for drag and drop.
   * Default value is [0] - only left mouse button.
   * @property dragButtons
   * @default true
   * @memberof Konva
   * @example
   * // enable left and right mouse buttons
   * Konva.dragButtons = [0, 2];
   */
  dragButtons: [{ button: 0 }, { button: 2 }] as DragButton[],

  /**
   * returns whether or not drag and drop is currently active
   * @method
   * @memberof Konva
   */
  isDragging() {
    return Pamela['DD'].isDragging;
  },
  /**
   * returns whether or not a drag and drop operation is ready, but may
   *  not necessarily have started
   * @method
   * @memberof Konva
   */
  isDragReady() {
    return !!Pamela['DD'].node;
  },
  // user agent
  document: glob.document,
  // insert Konva into global namespace (window)
  // it is required for npm packages
  _injectGlobal(Konva) {
    glob.Konva = Konva;
  },
};

export const _registerNode = (NodeClass: any) => {
  Pamela[NodeClass.prototype.getClassName()] = NodeClass;
};

Pamela._injectGlobal(Pamela);
