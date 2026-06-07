/**
 * note記事 週次自動生成スクリプト（占いマガジン版）
 *
 * Claude API で今週の12星座詳細占い記事を生成する。
 * 出力: note-drafts/YYYY-MM-DD.md
 *
 * GitHub Actions で週1回実行 → オーナーがnoteにコピーして公開するだけ
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

async function generateArticle(): Promise<string> {
  const client = new Anthropic();

  const today = new Date();
  const dateStr = today.toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  // 今週の日付範囲
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1); // 月曜
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // 日曜

  const weekRange = `${weekStart.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}〜${weekEnd.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}`;

  const prompt = `あなたは人気占い師・ライターです。
今週（${weekRange}）の12星座詳細週間占い記事をnote用に書いてください。

【記事の要件】
- 文字数: 2000〜3000字
- 読者層: 20〜40代女性・スピリチュアルに興味がある
- トーン: 温かみがあり・具体的・背中を押してくれる
- 構成:
  1. タイトル: 今週のテーマを反映した、読者が「私のことだ」と感じるもの（例:「運命の扉が開く1週間」「変化を恐れないで」等）
  2. 今週全体の星の動き（3〜4行）: 惑星の動きを踏まえた今週のエネルギー解説
  3. 12星座それぞれの週間運勢:
     - 各星座2〜4行
     - 恋愛・仕事・金運のどれかにフォーカス（毎週変える）
     - ラッキーデー・ラッキーカラー・ラッキーアイテム
  4. 今週の開運アクション（全星座共通・3つ）
  5. まとめ + CTA: 「毎日の運勢はThreadsで発信中。フォローして毎朝チェック → @westin_lab」

- マークダウン形式（## 見出し、**太字**、絵文字を適度に使用）
- 数字（〇〇日、〇〇時など）は具体的に書く
- 「なんとなく」「かもしれない」より「この日に行動を」「〇〇を手放して」等の具体的アドバイス

記事本文のみ出力してください（前置き・解説は不要）。`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    system: 'あなたは人気占い師・スピリチュアルライターです。読者の心に響く、保存されやすいnote記事を書きます。毎週一貫したトーンと世界観を維持します。',
    messages: [{ role: 'user', content: prompt }],
  });

  return (message.content[0] as { type: string; text: string }).text;
}

async function main() {
  console.log('=== note占い記事生成開始 ===');

  console.log('Claude API で記事生成中...');
  const article = await generateArticle();

  const date = new Date().toISOString().split('T')[0];
  const outputDir = path.join(process.cwd(), 'note-drafts');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const outputPath = path.join(outputDir, `${date}.md`);
  const header = `---
生成日: ${date}
ジャンル: 週間占い
ステータス: 下書き（未公開）
公開手順: このファイルの内容をnote.comにコピーして公開
Threads連携: @westin_lab でフォロー誘導あり
---

`;
  fs.writeFileSync(outputPath, header + article, 'utf-8');

  console.log(`\n✓ 記事を保存しました: ${outputPath}`);
  console.log('次のステップ: note.com にログインしてコピー&ペーストで公開してください');
}

main().catch(e => { console.error(e); process.exit(1); });
