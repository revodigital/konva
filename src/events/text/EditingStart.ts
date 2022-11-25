/*
 * Copyright (c) 2022-2022. Revo Digital 
 * ---
 * Author: gabrielecavallo
 * File: EditingStart.ts
 * Project: pamela
 * Committed last: 2022/11/25 @ 1256
 * ---
 * Description:
 */

import {Text} from '../../shapes/Text';

/**
 * Event type triggered when editing starts
 */
export const EDITING_START = 'text-editingstart'

interface EditingStart {
  textNode: Text;
  textArea: HTMLTextAreaElement;
}