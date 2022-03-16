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

  expect(table.cells()[0][0]).toHaveProperty('content', 'hello');
});