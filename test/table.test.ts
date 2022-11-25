/*
 * Copyright (c) 2022. Revo Digital
 * ---
 * Author: gabrielecavallo
 * File: table.test.ts
 * Project: pamela
 * Committed last: 2022/11/25 @ 1256
 * ---
 * Description:
 */

import {TableBuilder} from '../src/builders/TableBuilder';
import {RowBuilder} from '../lib/builders/RowBuilder';
import Pamela from '../lib';
import {Table} from '../src/shapes/Table';

it('should correctly return only the content of this table', () => {
  const table = new TableBuilder();
  table.addRow({
    row: RowBuilder.withCells(100, {
      bold: true,
      content: 'hello',
    }).autoWidth().autoHeight()
  });

  const onlyContent = table.buildContent();
  expect(table.buildContent()).toBeDefined();
  expect(onlyContent.getRowsCount()).toEqual(1);
  expect(onlyContent.getColumnsCount()).toEqual(100);

  onlyContent.forEachRow(row => {
    row.forEach(cell => expect(cell).toEqual('hello'));
  });
});

it('The table should be correctly stored into JSON', () => {
  const table = TableBuilder.withCells(20, 20, {
    width: 100, height: 100,
  }).build();

  const json = table.toJSON();
  const table2 = Pamela.Node.create(json) as Table;

  expect(json).toBeDefined();
  expect(table2).toBeDefined();
  expect(table2.getColumnsCount()).toEqual(20);
  expect(table2.getRowsCount()).toEqual(20);
});