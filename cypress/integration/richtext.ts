/*
 * Copyright (c) 2022. Revo Digital
 * ---
 * Author: gabriele
 * File: richtext.ts
 * Project: pamela
 * Committed last: 2022/1/4 @ 1818
 * ---
 * Description:
 */

import { TEST_ELEMENT_ID } from '../global/global-defs';
import { Stage }           from '../../src/Stage';
import { Layer }           from '../../src/Layer';
import { Transformer }     from '../../src/shapes/Transformer';
import { RichText }        from '../../src/shapes/RichText';

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
    const text = new RichText({
      x: 20,
      y: 10,
      markdownContent: `This is a **bold** text. Now it is *italic* and here we have a simple text.  \n# Just a simple title  \nUsin __markdown__ is very simple with this shape  \n<span style="color:blue">some *blue* text</span>. `,
      padding: 30,
      fontSize: 30,
      borderColor: 'red',
      borderWidth: 2
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