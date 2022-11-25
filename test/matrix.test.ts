/*
 * Copyright (c) 2022-2022. Revo Digital 
 * ---
 * Author: gabrielecavallo
 * File: matrix.test.ts
 * Project: pamela 
 * Committed last: 2022/11/25 @ 1256
 * ---
 * Description:
 */

import {arrayRepeat, Matrix2D, matrixRepeat} from '../src/common/Matrix2D';
import {matrixOf} from '../lib/common/Matrix2D';

it('Should correctly map this matrix', () => {
  const matrix = new Matrix2D<number>([[5, 3], [3, 5]]);

  const result = matrix.map(it => it.toFixed(2));

  expect(result).toBeDefined();
  expect(result.firstRow()).toEqual(['5.00', '3.00']);
  expect(result.lastRow()).toEqual(['3.00', '5.00']);
});

it('Should correctly return an empty matrix', () => {
  const matrix = new Matrix2D<number>([]);

  const result = matrix.map(it => it + 5);

  expect(result).toBeDefined();
  expect(result.length()).toEqual(0);
});

it('Should correctly generate an matrix', () => {
  const matrix = matrixRepeat('test', 20, 20);

  expect(matrix.getRowsCount()).toEqual(20);
  expect(matrix.getColumnsCount()).toEqual(20);
  expect((matrix.firstRow() as any)[0]).toEqual('test');
});

it('Should correctly generate an array', () => {
  const array = arrayRepeat(10, 200);
  expect(array.length).toEqual(200);
  expect(array[0]).toEqual(10);
  expect(array[199]).toEqual(10);
});

it('Should correctly remove this row', () => {
  const matrix = matrixRepeat(2, 20, 30);
  const start = matrix.getRowsCount();
  matrix.removeRow(matrix.lastRowIndex() - 2);
  const end = matrix.getRowsCount();

  expect(matrix).toBeDefined();
  expect(start).toBeGreaterThan(end);
  expect(start - end).toEqual(1);

  // Check that every row has the same width
  const width = matrix.firstRow().length;

  for (let i = 0; i < matrix.getRowsCount(); i++)
    expect(matrix.getRow(i).length).toEqual(width);
});

it('Should correctly remove this column', () => {
  const matrix = matrixRepeat(2, 100, 100);

  const b = matrix.getColumnsCount();
  matrix.removeColumn(matrix.lastColumnIndex() - 2);
  const a = matrix.getColumnsCount();

  expect(b).toBeGreaterThan(a);
  expect(b - a).toEqual(1);

  const height = matrix.firstColumn().length;

  for (let i = 0; i < matrix.getColumnsCount(); i++)
    expect(matrix.getColumn(i).length).toEqual(height);
});

it('Should correctly remove column', () => {
  const matrix = matrixOf([[2, 3], [2, 3]]);

  const b = matrix.getColumnsCount();
  matrix.removeColumn(matrix.lastColumnIndex());
  const a = matrix.getColumnsCount();

  expect(b).toBeGreaterThan(a);
  expect(b - a).toEqual(1);

  const height = matrix.firstColumn().length;

  for (let i = 0; i < matrix.getColumnsCount(); i++) {
    expect(matrix.getColumn(i).length).toEqual(height);
    expect(matrix.getColumn(i)[0]).toEqual(2);
  }
});

it('Should correctly count rows where', () => {
  const matrix = matrixOf([[2, 3], [2, 5], [3, 4]]);

  // Count the number of rows where 3 is included
  const count = matrix.countRowsWhere(it => it.includes(3));

  expect(matrix).toBeDefined();
  expect(count).toEqual(2);

  matrix.removeColumn(matrix.lastColumnIndex());

  expect(matrix.countRowsWhere(it => it.includes(3))).toEqual(1);
});

it('Should correctly count columns where', () => {
  const matrix = matrixOf([[2, 3], [2, 5], [3, 4]]);

  expect(matrix.countColumnsWhere(it => it.includes(4))).toEqual(1);

  matrix.removeColumn(matrix.lastColumnIndex());
  expect(matrix.countColumnsWhere(it => it.includes(4))).toEqual(0);
});

it('Should find any row', () => {
  const matrix = matrixOf([[2, 3], [2, 5], [3, 4]]);

  expect(matrix.anyRow(it => it.includes(3))).toEqual(true);
  expect(matrix.anyRow(it => it.includes(10))).toEqual(false);
});

it('Should find any column', () => {
  const matrix = matrixOf([[8, 3], [2, -22], [0, 7]]);

  expect(matrix.anyColumn(it => it.includes(3))).toEqual(true);
  expect(matrix.anyColumn(it => it.includes(10))).toEqual(false);
});