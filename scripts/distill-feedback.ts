/**
 * フィードバック蒸留システム
 * data/yonaka-feedback.json を読み込み、確定ルール集に蒸留する。
 * 出力: data/yonaka-rules.json
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

interface Feedback { date: string; original: string; issue: string; correction: string | null; addedBy: string; }
interface Rule { name: string; reason: string; ng: string; ok: string; addedDate: string; }

function loadJson<T>(p: string): T | null {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), p), 'utf-8')) as T; }
  catch { return null; }
}

async function distill(feedbacks: Feedback[], existingRules: Rule[]): Promise<Rule[]> {
  if (feedbacks.length === 0) { console.log('フィードバックなし。スキップ。'); return existingRules; }

  const client = new Anthropic();
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `「夜中のおじさん」Threads投稿の修正フィードバックを確定ルール集に蒸留してください。

【既存ルール（統合対象）】
${JSON.stringify(existingRules, null, 2)}

【新しいフィードバック】
${feedbacks.map(f => `日付: ${f.date}\n問題: ${f.issue}\n元文: ${f.original}\n修正: ${f.correction ?? 'なし'}`).join('\n\n')}

以下のJSONのみ出力（重複は統合、矛盾は新しい方を優先）：
[
  {
    "name": "ルール名（10字以内）",
    "reason": "なぜそのルールが必要か",
    "ng": "NGの具体例",
    "ok": "OKの具体例",
    "addedDate": "YYYY-MM-DD"
  }
]`,
    }],
  });

  const raw = (msg.content[0] as { type: string; text: string }).text;
  return JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as Rule[];
}

async function main() {
  console.log('=== フィードバック蒸留開始 ===');

  const feedbackData = loadJson<{ feedbacks: Feedback[] }>('data/yonaka-feedback.json');
  const rulesData    = loadJson<{ lastUpdated: string; rules: Rule[] }>('data/yonaka-rules.json');

  const feedbacks     = feedbackData?.feedbacks ?? [];
  const existingRules = rulesData?.rules ?? [];

  console.log(`フィードバック: ${feedbacks.length}件 / 既存ルール: ${existingRules.length}件`);

  const newRules = await distill(feedbacks, existingRules);

  const out = {
    lastUpdated: new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' }),
    rules: newRules,
  };

  const outPath = path.join(process.cwd(), 'data', 'yonaka-rules.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf-8');
  console.log(`✓ ルール集を更新しました: ${outPath}`);
  console.log(`  ルール数: ${newRules.length}件`);
  newRules.forEach(r => console.log(`  - ${r.name}`));
}

main().catch(e => { console.error(e); process.exit(1); });
