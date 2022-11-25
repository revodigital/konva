/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabrielecavallo
 * File: _CoreInternals.ts
 * Project: pamela 
 * Committed last: 2022/11/25 @ 1256
 * ---
 * Description:
 */

// what is core parts of Konva?
import {Pamela as Global} from './Global';

import {Transform, Util} from './Util';
import {Node} from './Node';
import {Container} from './Container';

import {Stage, stages} from './Stage';

import {Layer} from './Layer';
import {FastLayer} from './FastLayer';

import {Group} from './Group';

import {DD} from './DragAndDrop';

import {Shape, shapes} from './Shape';

import {Animation} from './Animation';
import {Easings, Tween} from './Tween';

import {Context} from './Context';
import {Canvas} from './Canvas';

export const Pamela = Util._assign(Global, {
  Util,
  Transform,
  Node,
  Container,
  Stage,
  stages,
  Layer,
  FastLayer,
  Group,
  DD,
  Shape,
  shapes,
  Animation,
  Tween,
  Easings,
  Context,
  Canvas,
});

export default Pamela;
