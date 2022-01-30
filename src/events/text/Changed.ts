/*
 * Copyright (c) 2022-2022. Revo Digital
 * ---
 * Author: gabriele
 * File: Changed.ts
 * Project: pamela
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

/**
 * Event triggered when text auto-resizes or changes its font size
 */
export const CHANGED = "changed";

export interface ChangedEvent {
  node: Text;
}