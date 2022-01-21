/**
 * Event triggered when text auto-resizes or changes its font size
 */

export const CHANGED = "changed";

export interface ChangedEvent {
  node: Text;
}