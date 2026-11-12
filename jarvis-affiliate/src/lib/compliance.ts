import fs from 'node:fs';
import { p } from './paths.ts';

export interface NgWord {
  word: string;
  level: 'error' | 'warn';
  reason: string;
  categories: string[];
}

/** PR表記の文言（LpLayout・SNS投稿・バリデーションの3か所で共通利用） */
export const PR_LABEL = '本ページはプロモーション（広告）を含みます';
export const PR_MARKER_ATTR = 'data-pr-label';

/** config/compliance-rules.md 末尾の ```json ng-words ブロックを読み込む */
export function loadNgWords(): NgWord[] {
  const md = fs.readFileSync(p('config', 'compliance-rules.md'), 'utf8');
  const m = md.match(/```json ng-words\s*\n([\s\S]*?)```/);
  if (!m) throw new Error('[compliance] compliance-rules.md に ```json ng-words ブロックがありません');
  return JSON.parse(m[1]) as NgWord[];
}

export interface NgHit {
  word: string;
  level: 'error' | 'warn';
  reason: string;
  context: string;
}

export function findNgWords(text: string, category = 'none', words = loadNgWords()): NgHit[] {
  const hits: NgHit[] = [];
  for (const w of words) {
    if (w.categories.length && !w.categories.includes(category)) continue;
    let idx = text.indexOf(w.word);
    while (idx !== -1) {
      const context = text.slice(Math.max(0, idx - 15), idx + w.word.length + 15).replace(/\s+/g, ' ');
      hits.push({ word: w.word, level: w.level, reason: w.reason, context });
      idx = text.indexOf(w.word, idx + w.word.length);
    }
  }
  return hits;
}
