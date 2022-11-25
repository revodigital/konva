/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabrielecavallo
 * File: InvalidBarcodeConfiguration.ts
 * Project: pamela 
 * Committed last: 2022/11/25 @ 1256
 * ---
 * Description:
 */

/**
 * Exception thrown when a barcode receives an invalid configuration
 */
export class InvalidBarcodeConfiguration extends Error {
  public message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }

  toString() {
    return `InvalidBarcodeConfiguration ${this.message}`;
  }
}

