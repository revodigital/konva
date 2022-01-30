/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabriele
 * File: InvalidConfiguration.ts
 * Project: pamela 
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */


import { ColumnRowLayoutConfiguration } from '../layout/ColumnRowLayoutConfiguration';

/**
 * Invalid configuration exception. Thrown when the layout is not correct
 * or contains ambiguous informations.
 */
export class InvalidConfiguration extends Error {
  config: ColumnRowLayoutConfiguration;

  /**
   * Creates a new InvalidConfiguration
   * @param config The configuration that contains errors
   */
  constructor(config: ColumnRowLayoutConfiguration) {
    super(`InvalidConfiguration: Layout configuration ${JSON.stringify(config)} is not valid or contains ambiguous informations`);
    this.config = config;
    this.name = 'InvalidConfiguration';
  }

  toString(): string {
    return `InvalidConfiguration. Config: ${JSON.stringify(this.config)}`
  }

  message: string;
  name: string;
}