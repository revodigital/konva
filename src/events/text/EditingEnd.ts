/*
 * Copyright (c) 2022-2022. Revo Digital 
 * ---
 * Author: gabriele
 * File: EditingEnd.ts
 * Project: pamela 
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { Text } from '../../shapes/Text';

/**
 * Event type triggered when editing finishes
 */
export const EDITING_END = 'text-editingend';

export interface EditingEnd {
  node: Text;
}