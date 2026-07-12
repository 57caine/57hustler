/**
 * 公開前検品システム
 * note記事・Threads投稿文をルールに照らして検品する。
 * 使い方: npx ts-node scripts/content-check.ts --input path/to/text.txt
 *         npx ts-node scripts/content-check.ts --text "チェックしたいテキスト"
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

function loadJson<T>(p: string): T | null {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), p), 'utf-8')) as T; }
  catch { return null; }
}

interface Rule { name: string; ng: string; ok: string; }
interface HistoryEntry { date: string; text: string; }

async function check(text: string, rules: Rule[], recentPosts: string[]): Promise<{
  ok: boolean;
  issues: { severity: 'high' | 'medium' | 'low'; rule: string; detail: string; suggestion: string }[];
  verdict: string;
}> {
  const client = new Anthropic();
  const rulesText = rules.map(r => `- 【${r.name}】NG: ${r.ng} / OK: ${r.ok}`).join('\n');
  const recentText = recentPosts.slice(0, 10).map(p => `「${p.slice(0, 50)}」`).join('\n');

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: `以下の投稿テキストを検品してください。

【検品対象テキスト】
${text}

【夜中のおじさんルール】
${rulesText}

【共通チェック項目】
- 現代の実在人物の名前を使っていないか
- 未確認情報を「〜だ」と断言していないか（「とも言われています」が必要）
- ですます調になっているか
- 重複・類似表現が直近投稿と被っていないか

【直近投稿（重複チェック用）】
${recentText || '（履歴なし）'}

以下のJSONのみ出力：
{
  "ok": true/false,
  "issues": [
    {
      "severity": "high/medium/low",
      "rule": "違反ルール名",
      "detail": "問題の詳細",
      "suggestion": "修正提案"
    }
  ],
  "verdict": "OK/NG＋一言（30字以内）"
}`,
    }],
  });

  const raw = (msg.content[0] as { type: string; text: string }).text;
  return JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as {
    ok: boolean;
    issues: { severity: 'high' | 'medium' | 'low'; rule: string; detail: string; suggestion: string }[];
    verdict: string;
  };
}

async function main() {
  const args = process.argv.slice(2);
  let inputText = '';

  const inputIdx = args.indexOf('--input');
  const textIdx  = args.indexOf('--text');

  if (inputIdx !== -1 && args[inputIdx + 1]) {
    inputText = fs.readFileSync(args[inputIdx + 1], 'utf-8');
  } else if (textIdx !== -1 && args[textIdx + 1]) {
    inputText = args[textIdx + 1];
  } else {
    inputText = fs.readFileSync('/dev/stdin', 'utf-8');
  }

  if (!inputText.trim()) {
    console.error('エラー: 入力テキストがありません。');
    process.exit(1);
  }

  const rulesData    = loadJson<{ rules: Rule[] }>('data/yonaka-rules.json');
  const historyData  = loadJson<{ posts: HistoryEntry[] }>('data/yonaka-post-history.json');
  const rules        = rulesData?.rules ?? [];
  const recentPosts  = (historyData?.posts ?? []).slice(0, 20).map(p => p.text);

  console.log('=== 公開前検品 ===');
  console.log(`ルール: ${rules.length}件 / 直近投稿: ${recentPosts.length}件`);
  console.log('Claude で検品中...\n');

  const result = await check(inputText, rules, recentPosts);

  const SEVERITY_ICON = { high: '🔴', medium: '🟡', low: '🔵' };

  console.log(`判定: ${result.ok ? '✅ OK' : '❌ NG'}`);
  console.log(`結果: ${result.verdict}\n`);

  if (result.issues.length === 0) {
    console.log('問題なし。公開可能です。');
  } else {
    console.log(`問題 ${result.issues.length}件:`);
    result.issues.forEach(issue => {
      console.log(`\n${SEVERITY_ICON[issue.severity]} [${issue.severity.toUpperCase()}] ${issue.rule}`);
      console.log(`  問題: ${issue.detail}`);
      console.log(`  提案: ${issue.suggestion}`);
    });
  }

  process.exit(result.ok ? 0 : 1);
}

main().catch(e => { console.error(e); process.exit(1); });
