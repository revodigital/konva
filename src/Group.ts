/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: Group.ts
 * Project: pamela
 * Committed last: 2021/12/5 @ 141
 * ---
 * Description:
 */

import { Util } from './Util';
import { Container } from './Container';
import { _registerNode } from './Global';
import { Node } from './Node';
import { Shape } from './Shape';

/**
 * Group constructor.  Groups are used to contain shapes or other groups.
 * @constructor
 * @memberof Konva
 * @augments Konva.Container
 * @param {Object} config
 * @@nodeParams
 * @@containerParams
 * @example
 * var group = new Konva.Group();
 */
export class Group extends Container<Group | Shape> {
  _validateAdd(child: Node) {
    var type = child.getType();
    if (type !== 'Group' && type !== 'Shape') {
      Util.throw('You may only add groups and shapes to groups.');
    }
  }
}

Group.prototype.nodeType = 'Group';
_registerNode(Group);
