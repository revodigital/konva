/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabrielecavallo
 * File: table.ts
 * Project: pamela 
 * Committed last: 2022/11/25 @ 1256
 * ---
 * Description:
 */

import {Table} from '../../src/shapes/Table';
import {Stage} from '../../src/Stage';
import {Layer} from '../../src/Layer';
import {TEST_ELEMENT_ID} from '../global/global-defs';
import {HorizontalAlignment} from '../../src/configuration/Alignment';
import {Row} from '../../src/shapes/Row';
import {Verse} from '../../src/shapes/Verse';
import {LineDash} from '../../src/configuration/LineDash';

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
        width: 600,
        height: 300,
        x: 20,
        y: 30,
        externalBorder: {
          borderWidth: 2,
          bordered: true,
          borderColor: 'black',
          borderDash: LineDash.SOLID
        },
        internalBorder: {
          borderWidth: 3,
          bordered: true,
          borderColor: 'black'
        },
        headerText: {
          fontSize: 30,
          bold: true
        },
        headerFill: 'orange',
        header: [
          {
            width: 'auto',
            text: 'First column',
          },
          {
            width: 'auto',
            text: 'Second column',
          }
        ],
        rows: [
          {
            height: 'auto',
            data: ['first cell'],
            textAlign: HorizontalAlignment.Right,
            padding: 10,
            fontSize: 20,
            fill: 'white'
          },
          {
            height: 'auto',
            data: ['second cell'],
            textAlign: HorizontalAlignment.Right,
            padding: 10,
            fontSize: 20,
            fill: 'white'
          }
        ]
      });

      l.add(m);

      s.add(l);
      l.draw();
      m.addRow(new Row({
        height: 'auto',
        data: ['ciao'],
      }), 0, Verse.After);
      m.popRow(true);
      m.autoBackground('red', 'orange');
      l.draw();
    });
  });
  //
  // it('Should correctly draw a dynamic table', () => {
  //   cy.document().get('#root').then((root) => {
  //     expect(root).to.not.be.undefined;
  //
  //     const s = new Stage({
  //       container: root.get()[0] as any,
  //       width: 800,
  //       height: 800
  //     });
  //
  //     const l = new Layer();
  //     const m = new Table({
  //       headerHeight: 20,
  //       width: 600,
  //       height: 300,
  //       x: 20,
  //       y: 30,
  //       headerFill: 'orange',
  //       header: [
  //         {
  //           width: 30,
  //           text: 'First column',
  //         },
  //         {
  //           width: 'auto',
  //           text: 'Second column',
  //         }
  //       ],
  //       rows: [
  //         {
  //           height: 80,
  //           data: ['first cell'],
  //           textAlign: HorizontalAlignment.Right,
  //           padding: 10,
  //           fontSize: 20,
  //           fill: 'white'
  //         },
  //         {
  //           height: 'auto',
  //           data: ['second cell'],
  //           textAlign: HorizontalAlignment.Right,
  //           padding: 10,
  //           fontSize: 20,
  //           fill: 'white'
  //         }
  //       ]
  //     });
  //
  //     l.add(m);
  //
  //     s.add(l);
  //     l.draw();
  //   });
  // })
});