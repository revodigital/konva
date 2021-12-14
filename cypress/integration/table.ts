/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: table.ts
 * Project: pamela
 * Committed last: 2021/12/14 @ 1321
 * ---
 * Description:
 */

import { Table }           from '../../src/shapes/Table';
import { Stage }           from '../../src/Stage';
import { Layer }           from '../../src/Layer';
import { MyShape }         from '../../src/shapes/Testme';
import { TEST_ELEMENT_ID } from '../global/global-defs';

before(() => {
  const el = document.createElement('div');
  el.id = TEST_ELEMENT_ID;

  document.body.appendChild(el);
  cy.visit('/home.html');
});

describe('All tests about tables', () => {
  it('Should correctly instantiate this table and store properties', () => {
    const s = new Table({
      headerHeight: 'auto',
      width: 200,
      height: 300,
      header: [
        {
          width: 'auto'
        }
      ],
      rows: [
        {
          height: 'auto',
          data: [],
        }
      ]
    });

    expect(s.rows().length).to.be.eq(1);
    expect(s.header().length).to.be.eq(1);
    expect(s.height()).to.be.eq(300);
    expect(s.width()).to.be.eq(200);
  });

  it('Should correctly draw this table', () => {
    cy.document().get('#root').then((root) => {
      expect(root).to.not.be.undefined;

      const s = new Stage({
        container: root.get()[0] as any,
        width: 800,
        height: 800
      });

      const l = new Layer();
      const m = new Table({
        headerHeight: 'auto',
        width: 300,
        height: 300,
        x: 20,
        y: 30,
        header: [
          {
            width: 'auto',
            text: 'ciao'
          }
        ],
        rows: [
          {
            height: 'auto',
            data: [],
          }
        ]
      });

      l.add(m);

      s.add(l);
      l.draw();
    });
  });
});