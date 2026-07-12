/**
 * マニュアル総点検システム
 * data/manuals/・.github/workflows/・scripts/ の整合性を点検する。
 * 出力: data/manual-audit-YYYY-MM.json
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

interface Issue {
  file: string;
  severity: 'high' | 'medium' | 'low';
  type: string;
  detail: string;
  suggestion: string;
}

function readFiles(dir: string, exts: string[]): { file: string; content: string }[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => exts.some(ext => f.endsWith(ext)))
    .map(f => ({
      file: path.join(dir, f).replace(process.cwd() + '/', ''),
      content: fs.readFileSync(path.join(dir, f), 'utf-8').slice(0, 3000),
    }));
}

async function auditFile(file: string, content: string, allFiles: string[]): Promise<Issue[]> {
  const client = new Anthropic();
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: `以下のファイルを点検してください。

ファイル: ${file}
内容（先頭3000字）:
${content}

存在するファイル一覧:
${allFiles.join('\n')}

点検観点：
1. 古い情報・終了したサービスへの参照
2. 存在しないファイル・パスへの参照
3. 手順の抜け・矛盾
4. 同じ内容の二重管理

問題があれば以下のJSONで出力。なければ空配列：
[
  {
    "severity": "high/medium/low",
    "type": "問題の種類",
    "detail": "具体的な問題",
    "suggestion": "修正提案"
  }
]`,
    }],
  });
  const raw = (msg.content[0] as { type: string; text: string }).text;
  const issues = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as Omit<Issue, 'file'>[];
  return issues.map(i => ({ ...i, file }));
}

async function main() {
  console.log('=== マニュアル総点検開始 ===');

  const targets = [
    ...readFiles(path.join(process.cwd(), 'data', 'manuals'), ['.md', '.txt', '.json']),
    ...readFiles(path.join(process.cwd(), '.github', 'workflows'), ['.yml']),
    ...readFiles(path.join(process.cwd(), 'scripts'), ['.ts']),
  ];

  const allFiles = [
    ...fs.existsSync(path.join(process.cwd(), 'scripts'))
      ? fs.readdirSync(path.join(process.cwd(), 'scripts')).map(f => `scripts/${f}`)
      : [],
    ...fs.existsSync(path.join(process.cwd(), 'data'))
      ? fs.readdirSync(path.join(process.cwd(), 'data')).map(f => `data/${f}`)
      : [],
  ];

  console.log(`点検対象: ${targets.length}ファイル`);

  const allIssues: Issue[] = [];
  for (const target of targets) {
    console.log(`  点検中: ${target.file}`);
    try {
      const issues = await auditFile(target.file, target.content, allFiles);
      allIssues.push(...issues);
      if (issues.length > 0) {
        console.log(`    → ${issues.length}件の問題`);
      }
    } catch (e) {
      console.warn(`    → スキップ: ${(e as Error).message}`);
    }
  }

  const high   = allIssues.filter(i => i.severity === 'high');
  const medium = allIssues.filter(i => i.severity === 'medium');
  const low    = allIssues.filter(i => i.severity === 'low');

  const ym = new Date().toISOString().slice(0, 7);
  const result = {
    month: ym,
    generatedAt: new Date().toISOString(),
    summary: { total: allIssues.length, high: high.length, medium: medium.length, low: low.length },
    issues: { high, medium, low },
  };

  const outPath = path.join(process.cwd(), 'data', `manual-audit-${ym}.json`);
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`\n✓ 点検完了: ${outPath}`);
  console.log(`  高: ${high.length}件 / 中: ${medium.length}件 / 低: ${low.length}件`);
}

main().catch(e => { console.error(e); process.exit(1); });
