/*
 * Copyright (c) 2021-2021. Revo Digital
 * ---
 * Author: gabriele
 * File: utils.ts
 * Project: pamela
 * Committed last: 2021/12/9 @ 1823
 * ---
 * Description:
 */

import { Verse } from './Verse';

/**
 * Changes the sign of the given value
 * @param num A number to change sign to
 */
export const negate = (num: number): number => {
  return (-1) * num;
};

/**
 * Compares two arrays and returns true if they are equal, false otherwise
 * @param a
 * @param b
 */
export function isEqual<T>(a: Array<T>, b: Array<T>): boolean {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}

/**
 * Inserts an element into an array specificating the position, the shifting verse and the object to add
 * @param a
 * @param object
 * @param startIndex
 * @param verse
 */
export function insertToArray<T>(a: Array<T>, object: T, startIndex: number, verse: Verse): Array<T> {
  // Check errors
  if (startIndex < 0) throw new Error('Invalid addRow startIndex. ');

  // Simple push
  if (startIndex === (a.length - 1) && verse === Verse.After) {
    a.push(object);
    return a;
  }

  if (startIndex === 0 && verse === Verse.Before) {
    const temp = a;
    a = [object];
    a.push(...temp);
    return a;
  }

  const temp_after = a.slice(startIndex + 1);
  const temp_before = a.slice(0, startIndex);
  const currItem = a[startIndex];

  switch (verse) {
    case Verse.After:
      a = [...temp_before];
      a.push(currItem);
      a.push(object);
      a.push(...temp_after);
      break;
    case Verse.Before:
      a = [...temp_before];
      a.push(object);
      a.push(currItem);
      a.push(...temp_after);
      break;
  }
  return a;
}

/**
 * Converts to upper initial letter
 * @param txt
 */
export const toInitialUpper = (txt: string): string => {
  try {
    if (txt.length >= 1)
      return `${ txt[0].toUpperCase() }${ txt.slice(1) }`;
    else return '';
  } catch (e) {
    return '';
  }
};

/**
 * Checks if an event is a printable character
 * @param e
 */
export const eventIsPrintableChar = (e: KeyboardEvent): boolean => {
  return e.key !== undefined && e.key.length === 1;
}

/**
 * Checks if an event is an exit char for an input text area
 * @param e
 */
export const eventIsExit = (e: KeyboardEvent): boolean => {
  return (e.code === 'Enter' && !e.shiftKey) || e.keyCode === 27;
}

export const eventIsNewLine = (e: KeyboardEvent): boolean => {
  return (e.code === 'Enter' && e.shiftKey);
}