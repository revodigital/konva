/*
 * Copyright (c) 2022-2022. Revo Digital
 * ---
 * Author: gabriele
 * File: matrix.test.ts
 * Project: complex-shapes-dev
 * Committed last: 2022/3/16 @ 1742
 * ---
 * Description:
 */

import { arrayRepeat, Matrix2D, matrixRepeat } from '../src/common/Matrix2D';

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