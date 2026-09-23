/**
 * lib/columns.tsx / lib/eye-columns.tsx / lib/karakon-columns.tsx の
 * コンテンツマップ（Record<string, ReactNode>）から、スラッグ指定で
 * 該当記事のJSXブロックを丸ごと抜き出す・置き換えるためのユーティリティ。
 *
 * 単純な正規表現ではJSX内のカッコ（.map(...)等）を誤って途中で
 * 区切ってしまうため、文字列・テンプレートリテラル・コメントを
 * スキップしながら丸カッコの対応を1文字ずつ数える方式にしている。
 */
import * as fs from 'fs';
import * as path from 'path';

const CANDIDATE_FILES = [
  { file: 'lib/columns.tsx', exportName: 'columnContent' },
  { file: 'lib/eye-columns.tsx', exportName: 'eyeColumnContent' },
  { file: 'lib/karakon-columns.tsx', exportName: 'karakonColumnContent' },
];

export interface LocatedBlock {
  filePath: string;
  absPath: string;
  exportName: string;
  /** '(' の直後（ブロック本体の開始位置） */
  blockStart: number;
  /** 対応する ')' の位置（この文字自体は含まない） */
  blockEnd: number;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * openIndex は開き丸カッコ '(' のインデックス。
 * 対応する閉じ丸カッコのインデックスを返す（文字列・テンプレートリテラル・コメントは中身を無視する）。
 */
function findMatchingParen(src: string, openIndex: number): number {
  let depth = 0;
  let i = openIndex;
  for (; i < src.length; i++) {
    const c = src[i];

    if (c === '(') {
      depth++;
      continue;
    }
    if (c === ')') {
      depth--;
      if (depth === 0) return i;
      continue;
    }
    if (c === '\'' || c === '"' || c === '`') {
      const quote = c;
      i++;
      while (i < src.length) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === quote) break;
        // テンプレートリテラル内の ${...} は丸カッコを含みうるが、
        // ここでは中身の丸カッコバランスに影響しないため単純にスキップでよい
        i++;
      }
      continue;
    }
    if (c === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i++;
      continue;
    }
  }
  throw new Error(`対応する閉じカッコが見つかりません（開始位置: ${openIndex}）`);
}

export function locateColumnContentBlock(slug: string, repoRoot: string): LocatedBlock | null {
  const keyPattern = new RegExp(`(^|\\n)\\s*['"]${escapeRegExp(slug)}['"]\\s*:\\s*\\(`);

  for (const candidate of CANDIDATE_FILES) {
    const absPath = path.join(repoRoot, candidate.file);
    if (!fs.existsSync(absPath)) continue;
    const src = fs.readFileSync(absPath, 'utf-8');
    const match = keyPattern.exec(src);
    if (!match) continue;

    const openParenIndex = match.index + match[0].length - 1;
    const blockStart = openParenIndex + 1;
    const blockEnd = findMatchingParen(src, openParenIndex);

    return {
      filePath: candidate.file,
      absPath,
      exportName: candidate.exportName,
      blockStart,
      blockEnd,
    };
  }

  return null;
}

export function readBlockSource(block: LocatedBlock): string {
  const src = fs.readFileSync(block.absPath, 'utf-8');
  return src.slice(block.blockStart, block.blockEnd).trim();
}

/** ファイル冒頭〜コンテンツマップ宣言直前までを返す（import・ヘルパー関数定義の把握用） */
export function readFilePreamble(block: LocatedBlock): string {
  const src = fs.readFileSync(block.absPath, 'utf-8');
  const exportIdx = src.indexOf(`export const ${block.exportName}`);
  return exportIdx === -1 ? src.slice(0, 2000) : src.slice(0, exportIdx);
}

/**
 * ブロック本体を新しい内容に置き換えてファイルへ書き込む。
 * 呼び出し側は newSource が `<article` で始まり `</article>` で終わることを
 * 事前に検証しておくこと（このモジュールでは検証しない）。
 */
export function replaceBlockSource(block: LocatedBlock, newSource: string): void {
  const src = fs.readFileSync(block.absPath, 'utf-8');
  const updated = src.slice(0, block.blockStart) + '\n      ' + newSource.trim() + '\n    ' + src.slice(block.blockEnd);
  fs.writeFileSync(block.absPath, updated, 'utf-8');
}
