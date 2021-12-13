/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: test1.ts
 * Project: pamela
 * Committed last: 2021/12/13 @ 1655
 * ---
 * Description:
 */

import {Stage}             from '../../src/Stage';
import { TEST_ELEMENT_ID } from '../global/global-defs';

before(() => {
  const el = document.createElement("div");
  el.id = TEST_ELEMENT_ID;

  document.body.appendChild(el);
});

it('Should find this test', () => {
  const s = new Stage({
    container: TEST_ELEMENT_ID,
  });

  expect(s.container().id).to.be.eq(TEST_ELEMENT_ID);
});