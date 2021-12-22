/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: text.ts
 * Project: pamela
 * Committed last: 2021/12/22 @ 821
 * ---
 * Description:
 */

import { TEST_ELEMENT_ID } from '../global/global-defs';
import { Stage }           from '../../src/Stage';
import { Layer }           from '../../src/Layer';
import { Text }            from '../../src/shapes/Text';
import { Rect }            from '../../src/shapes/Rect';
import { Transformer }     from '../../src/shapes/Transformer';

before(() => {
  const el = document.createElement('div');
  el.id = TEST_ELEMENT_ID;

  document.body.appendChild(el);
  cy.visit('/home.html');
});

it('Should make this text write', () => {
  cy.document().get('#root').then((root) => {
    expect(root).to.not.be.undefined;

    const s = new Stage({
      container: root.get()[0] as any,
      width: 800,
      height: 800
    });

    const l = new Layer();
    const text = new Text({
      draggable: true,
      text: 'hellow',
      width: 100,
      height: 100,
      editable: true,
      fontSize: 15,
      lockSize: true
    });
    l.add(text);

    l.add(new Rect({
      x: 200,
      width: 200,
      height: 200,
      fill: 'red'
    }));

    const t = new Transformer({
      nodes: [text]
    });

    l.add(t);
    s.add(l);
    l.draw();
  });
});