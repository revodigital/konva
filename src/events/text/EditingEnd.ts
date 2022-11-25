/*
 * Copyright (c) 2022-2022. Revo Digital 
 * ---
 * Author: gabrielecavallo
 * File: EditingEnd.ts
 * Project: pamela 
 * Committed last: 2022/11/25 @ 1256
 * ---
 * Description:
 */

import {Text} from '../../shapes/Text';

/**
 * Event type triggered when editing finishes
 */
export const EDITING_END = 'text-editingend';

export interface EditingEnd {
  node: Text;
}