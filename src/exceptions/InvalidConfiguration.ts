/*
 * Copyright (c) 2021-2021. Revo Digital
 * ---
 * Author: gabriele
 * File: invalidconfiguration.ts
 * Project: pamela
 * Committed last: 2021/12/14 @ 1741
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