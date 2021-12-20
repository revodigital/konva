/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: factory.ts
 * Project: pamela
 * Committed last: 2021/12/14 @ 1715
 * ---
 * Description:
 */

import { Factory } from '../../src/Factory';

describe('Factory methods testings', () => {

  it('Shouold correctly add a new getter / setter to the object', () => {
    class MyClass {
      num: number;
    }

    Factory.addGetterSetter<number>(MyClass, 'num', 0);

    expect(new MyClass()).to.have.property('setNum');
  });
})