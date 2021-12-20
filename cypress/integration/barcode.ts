/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: barcode.ts
 * Project: pamela
 * Committed last: 2021/12/20 @ 1114
 * ---
 * Description:
 */

import { TEST_ELEMENT_ID } from '../global/global-defs';
import { Stage }           from '../../src/Stage';
import { Layer }           from '../../src/Layer';
import { Barcode }         from '../../src/shapes/Barcode';

before(() => {
  const el = document.createElement('div');
  el.id = TEST_ELEMENT_ID;

  document.body.appendChild(el);
  cy.visit('/home.html');
});

describe('All barcode-related tests', () => {
  it('Should correctly store all props', () => {
    const barcConf = {
      width: 20,
      code: '35jfkdsl fa',
      encoding: 'CODE39',
      placeHolder: 'mimmo',
      codeLineWidth: 2
    };

    const b = new Barcode(barcConf);

    expect(b.width()).to.be.eq(barcConf.width);
    expect(b.code()).to.be.eq(barcConf.code);
    expect(b.encoding()).to.be.eq(barcConf.encoding);
    expect(b.placeHolder()).to.be.eq(barcConf.placeHolder);
    expect(b.codeLineWidth()).to.be.eq(barcConf.codeLineWidth);

    b.placeHolder("mimmo");
    expect(b.placeHolder()).to.be.eq("mimmo");
  });

  it('Should correctly load this barcode', () => {
    cy.document().get('#root').then((root) => {
      expect(root).not.to.be.undefined;
      const s = new Stage({
        container: root.get()[0] as any,
        width: 800,
        height: 800,
      });

      const l = new Layer();
      l.add(new Barcode({
        code: 'djksljfdsa',
        encoding: 'CODE39',
        placeHolder: 'ciao',
        height: 200,
        codeLineWidth: 2,
      }));

      s.add(l);
      l.draw();
    });
  });
});