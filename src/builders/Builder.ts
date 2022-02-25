/*
 * Copyright (c) 2022. Revo Digital
 * ---
 * Author: gabriele
 * File: Builder.ts
 * Project: complex-shapes-dev
 * Committed last: 2022/2/23 @ 1637
 * ---
 * Description:
 */

/**
 * Represents a builder
 */
export interface Builder<T> {
  /**
   * Contructs this object
   */
  build(): T;
}