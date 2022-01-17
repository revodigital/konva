import { Text } from '../../shapes/Text';

export const EDITING_START = 'text-editingstart'

interface EditingStart {
  textNode: Text;
  textArea: HTMLTextAreaElement;
}