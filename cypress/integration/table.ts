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

import { Table } from '../../src/shapes/Table';
import { Stage } from '../../src/Stage';
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
  it('Should correctly instantiate this table', () => {
    const s = new Table({
      header: [
        {
          width: 40
        }
      ],
      rows: [
        {
          height: 30,
          data: [],
        }
      ]
    });

    expect(s.rows().length).to.be.eq(1);
    expect(s.header().length).to.be.eq(1);
  });

  it('Should correctly draw this table', () => {
    cy.document().get('#root').then((root) => {
      expect(root).to.not.be.undefined;

      const s = new Stage({
        container: root.get()[0] as any,
        width: 300,
        height: 300
      });

      const l = new Layer();
      const m = new Table({
        header: [
          {
            width: 40
          }
        ],
        rows: [
          {
            height: 30,
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