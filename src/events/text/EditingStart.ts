/*
 * Copyright (c) 2022-2022. Revo Digital 
 * ---
 * Author: gabriele
 * File: EditingStart.ts
 * Project: pamela 
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { Text } from '../../shapes/Text';

/**
 * Event type triggered when editing starts
 */
export const EDITING_START = 'text-editingstart'

interface EditingStart {
  textNode: Text;
  textArea: HTMLTextAreaElement;
}