/*
 * Copyright (c) 2022. Revo Digital
 * ---
 * Author: gabriele
 * File: tablebuilder.test.ts
 * Project: complex-shapes-dev
 * Committed last: 2022/3/16 @ 1852
 * ---
 * Description:
 */

import { TableBuilder }  from '../src/builders/TableBuilder';
import { ColumnBuilder } from '../lib/builders/ColumnBuilder';
import { RowBuilder }    from '../lib/builders/RowBuilder';
import { matrixRepeat }  from '../src/common/Matrix2D';

it('Should correctly populate this entire table', () => {
  const builder = new TableBuilder({
    width: 100,
    height: 100
  });

  builder.addRow({
    row: RowBuilder.withCells(100, {
      bold: true,
      fill: 'red'
    })
  });

  const data = matrixRepeat('test', 100, 100);
  builder.populateContent(data, true);

  builder.build();
  builder.buildContent();
});

it('should correctly generate this table', () => {
  const builder = new TableBuilder({
    width: 100,
    height: 100
  });

  builder.addColumn({
    column: ColumnBuilder.withCells(100, {
      fill: 'blue'
    })
  });

  builder.addColumn({
    column: ColumnBuilder.withCells(100, {
      fill: 'red'
    })
  });

  expect(builder.buildContent()).toBeDefined();
  expect(builder.getColumnsCount()).toEqual(2);
  expect(builder.getRowsCount()).toEqual(100);
  expect(builder.firstRow()).toBeDefined();
  expect(builder.lastRow()).toBeDefined();
  expect(builder.getRow(5)).toBeDefined();

  expect(builder.firstRow()?.first()).toBeDefined();
});

it('Should correctly create a 200x200 table', () => {
  const builder = TableBuilder.withCells(200, 200, { fill: 'red' });

  const table = builder.build();

  expect(table.cells()).toBeDefined();

  table.populateContent(matrixRepeat('hello', 200, 200));

  expect(table.cells()[1][0].content).toEqual('hello');
});

it('Should correctly populate this existing table', () => {
  const table = TableBuilder.withCells(100, 100, {
    width: 100,
    height: 100
  }, { autoWidth: true, autoHeight: true, fill: 'white' }).build();

  expect(table).toBeDefined();
  expect(table.getRowsCount()).toEqual(100);
  expect(table.getColumnsCount()).toEqual(100);

  table.populateContent(matrixRepeat('content', 10, 10), false);

  for (let i = 1; i <= 10; i++) {
    expect(table.cells()[i]).toBeDefined();
    for (let x = 0; x < 10; x++)
      expect(table.cells()[i][x].content).toEqual('content');
  }
});

it('Should correctly load this table from the JSON', () => {
  const table = TableBuilder.withCells(20, 20, {
    width: 100,
    height: 200,
    fill: 'white',
    stroke: 'black'
  }).build();

  const tableJson = table.toJSON();

  const loadTable = TableBuilder.fromJSON(tableJson);
  expect(loadTable.getRowsCount()).toEqual(20);
  expect(loadTable.getColumnsCount()).toEqual(20);

  const t = loadTable.build();
  expect(loadTable.build()).toBeDefined();
  expect(t.width()).toEqual(100);
  expect(t.height()).toEqual(200);
  expect(t.fill()).toEqual('white');
});