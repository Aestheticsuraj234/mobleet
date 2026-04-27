import type { LanguageId } from '@/lib/problems';

export type CodeEditorProps = {
  value: string;
  onValueChange: (text: string) => void;
  language: LanguageId;
  /** Visual height of the editor area (px) */
  minHeight?: number;
};
