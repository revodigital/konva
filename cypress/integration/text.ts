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

import { TEST_ELEMENT_ID }  from '../global/global-defs';
import { Stage }            from '../../src/Stage';
import { Layer }            from '../../src/Layer';
import { GrowPolicy, Text } from '../../src/shapes/Text';
import { Transformer }      from '../../src/shapes/Transformer';
import { borderRadiusAll }  from '../../src/configuration/BorderOptions';
import { LineDash }         from '../../src/configuration/LineDash';

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
      expandToFit: true,
      padding: 20,
      fontSize: 20,
      growPolicy: GrowPolicy.GrowHeight,
    });
    l.add(text);

    const t = new Transformer({
      nodes: [text]
    });

    l.add(t);
    s.add(l);
    l.draw();
  });
});

it('Should correctly store border options', () => {
  const text = new Text({
    bordered: true,
    borderRadius: borderRadiusAll(4),
    borderDash: LineDash.DASHED
  });

  expect(text.bordered()).to.eq(true);
  expect(text.borderRadius()).to.have.property('topLeft', 4);
  expect(text.borderRadius()).to.have.property('topRight', 4);
  expect(text.borderRadius()).to.have.property('bottomLeft', 4);
  expect(text.borderRadius()).to.have.property('bottomRight', 4);
  expect(text.borderDash()).to.eq(LineDash.DASHED);
});

it('Should draw a text with a red border of 2 px, dashed', () => {
  cy.document().get('#root').then((root) => {
    expect(root).to.not.be.undefined;

    const s = new Stage({
      container: root.get()[0] as any,
      width: 800,
      height: 800
    });

    const l = new Layer();
    l.add(new Text({
      x: 10,
      y: 10,
      width: 200,
      height: 200,
      editable: false,
      bordered: true,
      fontSize: 20,
      borderWidth: 2,
      borderColor: 'red',
      text: 'hello',
      padding: 20,
      borderDash: LineDash.DASHED
    }));

    s.add(l);
  });
})