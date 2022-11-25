/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabrielecavallo
 * File: factory.ts
 * Project: pamela 
 * Committed last: 2022/11/25 @ 1256
 * ---
 * Description:
 */

import {Factory} from '../../src/Factory';

describe('Factory methods testings', () => {

  it('Shouold correctly add a new getter / setter to the object', () => {
    class MyClass {
      num: number;
    }

    Factory.addGetterSetter<number>(MyClass, 'num', 0);

    expect(new MyClass()).to.have.property('setNum');
  });
})