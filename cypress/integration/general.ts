/*
 * Copyright (c) 2021-2022. Revo Digital
 * ---
 * Author: gabriele
 * File: general.ts
 * Project: pamela
 * Committed last: 2022/1/26 @ 98
 * ---
 * Description:
 */

import { Stage }           from '../../src/Stage';
import { TEST_ELEMENT_ID } from '../global/global-defs';
import { Layer }           from '../../src/Layer';
import { Rect }            from '../../src/shapes/Rect';

before(() => {
  const el = document.createElement('div');
  el.id = TEST_ELEMENT_ID;

  document.body.appendChild(el);
});

it('Should find this test', () => {
  const s = new Stage({
    container: TEST_ELEMENT_ID,
  });

  expect(s.container().id).to.be.eq(TEST_ELEMENT_ID);
});

describe('Main tests', () => {
  it('Should create a new stage', () => {
    cy.visit('/home.html');

    cy.document().get('#root').then((root) => {
      expect(root).to.not.be.undefined;

      const s = new Stage({
        container: root.get()[0] as any,
        width: 300,
        height: 300
      });

      const l = new Layer();
      l.add(new Rect({
        fill: 'red',
        width: 200,
        height: 200,
        draggable: true
      }));

      s.add(l);
      l.draw();
    });
  });

  it('', () => {

    cy.document().get('#root').then((root) => {
      expect(root).to.not.be.undefined;

      const s = new Stage({
        container: root.get()[0] as any,
        width: 300,
        height: 300
      });

      const l = new Layer();
      const m = new MyShape({
        number: 54,
      });

      console.log(m.number());
      l.add(m);

      s.add(l);
      l.draw();
    });
  });
});