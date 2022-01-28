/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabriele
 * File: InvalidPercentage.ts
 * Project: pamela 
 * Committed last: 2022/1/26 @ 97
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