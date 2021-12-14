/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: Gabri
 * File: invalidconfiguration.ts
 * Project: complex-shapes-dev
 * Committed last: 2021/10/20 @ 1725
 * ---
 * Description:
 */


import { ColumnRowLayoutConfiguration } from './columnrowlayoutconfiguration';

/**
 * Invalid configuration exception. Thrown when the layout is not correct
 * or contains ambiguous informations.
 */
export class Invalidconfiguration extends Error {
  config: ColumnRowLayoutConfiguration;

  /**
   * Creates a new InvalidConfiguration
   * @param config The configuration that contains errors
   */
  constructor(config: ColumnRowLayoutConfiguration) {
    super(`Invalidconfiguration: Layout configuration ${JSON.stringify(config)} is not valid or contains ambiguous informations`);
    this.config = config;
    this.name = 'Invalidconfiguration';
  }

  toString(): string {
    return `InvalidConfiguration. Config: ${JSON.stringify(this.config)}`
  }

  message: string;
  name: string;
}