/*
 * Copyright (c) 2022-2022. Revo Digital 
 * ---
 * Author: gabrielecavallo
 * File: Builder.ts
 * Project: pamela 
 * Committed last: 2022/11/25 @ 1256
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