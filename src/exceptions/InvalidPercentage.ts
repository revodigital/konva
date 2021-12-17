/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: InvalidPercentage.ts
 * Project: pamela
 * Committed last: 2021/12/15 @ 955
 * ---
 * Description:
 */

export class InvalidPercentage extends Error {
  public percSum: number;

  constructor(percSum: number, message?: string) {
    super(`InvalidPercentage: Percentage sum ${ percSum } is above 100 maximum. This will lead to drawing overflow. ${ message }`);
    this.percSum = percSum;
    this.name = 'InvalidPercentage';
  }
}