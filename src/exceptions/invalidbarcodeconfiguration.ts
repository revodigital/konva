/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: invalidbarcodeconfiguration.ts
 * Project: complexshapestest
 * Committed last: 2021/10/29 @ 1646
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

