/**
 * コンテンツ転用工場
 * note記事1本から4媒体向けコンテンツを生成する。
 * 使い方: npx ts-node scripts/content-repurpose.ts --input path/to/article.txt
 *         npx ts-node scripts/content-repurpose.ts --text "記事本文..."
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

const LOG_PATH = path.join(process.cwd(), 'data', 'content-repurpose-log.json');

interface LogEntry {
  date: string;
  sourceTitle: string;
  sourceText: string;
  outputs: { threads: string; instagram: string; x: string; notePromo: string };
}

function loadLog(): LogEntry[] {
  try {
    if (!fs.existsSync(LOG_PATH)) return [];
    return (JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8')) as { entries: LogEntry[] }).entries ?? [];
  } catch { return []; }
}

function saveLog(entries: LogEntry[]): void {
  fs.writeFileSync(LOG_PATH, JSON.stringify({ entries: entries.slice(0, 100) }, null, 2), 'utf-8');
}

async function repurpose(text: string, title: string): Promise<{
  threads: string; instagram: string; x: string; notePromo: string;
}> {
  const client = new Anthropic();
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1200,
    messages: [{
      role: 'user',
      content: `以下のnote記事を4媒体向けに転用してください。

【記事タイトル】${title}
【記事本文】
${text.slice(0, 2000)}

以下のJSONのみ出力：
{
  "threads": "Threads投稿文（夜中のおじさん文体・ですます調・3〜5文・500字以内・改行あり）",
  "instagram": "Instagram投稿キャプション（短め・2〜3文・絵文字1〜2個・ハッシュタグなし）",
  "x": "X（Twitter）投稿文（140字以内・要点だけ・ハッシュタグなし）",
  "notePromo": "note誘導文（「この話、もう少し深いところまで書いた。」パターン・50字以内）"
}`,
    }],
  });
  const raw = (msg.content[0] as { type: string; text: string }).text;
  return JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as {
    threads: string; instagram: string; x: string; notePromo: string;
  };
}

async function main() {
  const args = process.argv.slice(2);
  let inputText = '';
  let title = 'untitled';

  const inputIdx = args.indexOf('--input');
  const textIdx  = args.indexOf('--text');
  const titleIdx = args.indexOf('--title');

  if (inputIdx !== -1 && args[inputIdx + 1]) {
    const filePath = args[inputIdx + 1];
    inputText = fs.readFileSync(filePath, 'utf-8');
    title = path.basename(filePath, path.extname(filePath));
  } else if (textIdx !== -1 && args[textIdx + 1]) {
    inputText = args[textIdx + 1];
  } else {
    // stdin
    inputText = fs.readFileSync('/dev/stdin', 'utf-8');
  }

  if (titleIdx !== -1 && args[titleIdx + 1]) {
    title = args[titleIdx + 1];
  }

  if (!inputText.trim()) {
    console.error('エラー: 入力テキストがありません。--input <file> か --text <text> を指定してください。');
    process.exit(1);
  }

  console.log(`=== コンテンツ転用開始: ${title} ===`);
  console.log('Claude で4媒体向けコンテンツを生成中...');

  const outputs = await repurpose(inputText, title);

  console.log('\n--- Threads（夜中のおじさん）---');
  console.log(outputs.threads);
  console.log(`（${outputs.threads.length}字）`);

  console.log('\n--- Instagram ---');
  console.log(outputs.instagram);
  console.log(`（${outputs.instagram.length}字）`);

  console.log('\n--- X（Twitter）---');
  console.log(outputs.x);
  console.log(`（${outputs.x.length}字）`);

  console.log('\n--- note誘導文 ---');
  console.log(outputs.notePromo);
  console.log(`（${outputs.notePromo.length}字）`);

  // 転用台帳に記録
  const log = loadLog();
  const entry: LogEntry = {
    date: new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' }),
    sourceTitle: title,
    sourceText: inputText.slice(0, 200),
    outputs,
  };
  saveLog([entry, ...log]);
  console.log(`\n✓ 転用台帳に記録しました: ${LOG_PATH}`);
}

main().catch(e => { console.error(e); process.exit(1); });
