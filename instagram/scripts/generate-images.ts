/**
 * Instagram投稿用画像生成スクリプト
 * 使い方: npx ts-node instagram/scripts/generate-images.ts [--type=fortune|swipe]
 *
 * Playwrightで instagram/templates/ のHTMLを1080×1080pxのPNGに変換する。
 * コンテンツはAnthropicAPIで生成し、{{PLACEHOLDER}}を置換してから描画する。
 */

import Anthropic from '@anthropic-ai/sdk';
import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const POST_TYPE: 'fortune' | 'swipe' = process.argv.includes('--type=swipe') ? 'swipe' : 'fortune';
const DRY_RUN = process.argv.includes('--dry-run');

const ROOT = process.cwd();
const OUTPUT_DIR   = path.join(ROOT, 'instagram/output');
const TEMPLATE_DIR = path.join(ROOT, 'instagram/templates');
const NETA_BANK    = path.join(ROOT, 'data/neta-bank.json');

// 九星データ
const KYUSEI: Record<number, { name: string; element: string; direction: string; color: string; keywords: string[] }> = {
  1: { name: '一白水星', element: '水', direction: '北',  color: '白・黒', keywords: ['知恵', '流れ', '柔軟', '人脈'] },
  2: { name: '二黒土星', element: '土', direction: '南西', color: '黄・茶', keywords: ['継続', '忍耐', '家庭', '蓄積'] },
  3: { name: '三碧木星', element: '木', direction: '東',  color: '碧・緑', keywords: ['行動', '発展', '革新', '音'] },
  4: { name: '四緑木星', element: '木', direction: '東南', color: '緑',    keywords: ['信用', '縁', '旅', '商売'] },
  5: { name: '五黄土星', element: '土', direction: '中央', color: '黄',    keywords: ['帝王', '変革', '中心', '強力'] },
  6: { name: '六白金星', element: '金', direction: '北西', color: '白・金', keywords: ['権威', '決断', '正義', '指導'] },
  7: { name: '七赤金星', element: '金', direction: '西',  color: '赤・白', keywords: ['喜び', '口', '金運', '交際'] },
  8: { name: '八白土星', element: '土', direction: '東北', color: '白・黄', keywords: ['変革', '山', '相続', '蓄積'] },
  9: { name: '九紫火星', element: '火', direction: '南',  color: '紫・赤', keywords: ['明晰', '礼節', '名誉', '学問'] },
};

function getDailyStar(): number {
  const jstStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  const diff = Math.round((new Date(jstStr).getTime() - new Date('2024-01-06').getTime()) / 86400000);
  return ((1 - 1 - diff % 9 + 900) % 9) + 1;
}

function getJstDate(): string {
  return new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: 'Asia/Tokyo' });
}

function getJstDateSlug(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
}

function pickUnusedTopic(): { id: string; category: string; hook: string } {
  const bank = JSON.parse(fs.readFileSync(NETA_BANK, 'utf-8')) as {
    swipe_topics: Array<{ id: string; category: string; hook: string; used: boolean }>;
  };
  const unused = bank.swipe_topics.filter(t => !t.used);
  if (unused.length === 0) {
    // 全て使い切ったらリセット
    bank.swipe_topics.forEach(t => { t.used = false; });
    fs.writeFileSync(NETA_BANK, JSON.stringify(bank, null, 2), 'utf-8');
    return bank.swipe_topics[0];
  }
  const topic = unused[Math.floor(Math.random() * unused.length)];
  bank.swipe_topics.find(t => t.id === topic.id)!.used = true;
  fs.writeFileSync(NETA_BANK, JSON.stringify(bank, null, 2), 'utf-8');
  return topic;
}

async function generateFortuneContent(client: Anthropic): Promise<{
  date: string; starName: string; fortuneText: string; advice: string; caption: string;
}> {
  const starNum = getDailyStar();
  const star = KYUSEI[starNum];
  const dateStr = getJstDate();

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: '30歳まで鳴かず飛ばず、九星気学の吉方位参拝で人生が逆転した、親しみやすいおじさんです。ですます調で丁寧に語りかけます。「〜ですよ」は使いません。',
    messages: [{
      role: 'user',
      content: `以下のデータで今日の運勢カード用テキストをJSON形式で出力してください。

【今日の日付】${dateStr}
【今日の星】${star.name}
【属性】${star.element}・${star.direction}方位・ラッキーカラー:${star.color}
【キーワード】${star.keywords.join('・')}

以下のキーを持つJSONのみ出力（前置き不要）：
{
  "fortuneText": "全体運を2〜3文で。具体的なアクションを含む。80文字以内。",
  "advice": "今日の行動アドバイスを1文で。30文字以内。",
  "caption": "Instagram投稿用キャプション。150文字以内。ハッシュタグ不要。"
}`,
    }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text;
  const json = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as {
    fortuneText: string; advice: string; caption: string;
  };

  return {
    date: dateStr,
    starName: star.name,
    fortuneText: json.fortuneText,
    advice: json.advice,
    caption: json.caption,
  };
}

interface SwipeCard { sectionLabel: string; content: string; point: string; }
interface SwipeContent { category: string; hook: string; cards: SwipeCard[]; caption: string; }

async function generateSwipeContent(
  client: Anthropic,
  topic: { category: string; hook: string },
): Promise<SwipeContent> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1200,
    system: '「夜中のおじさん」として知的好奇心を刺激するInstagramスワイプ投稿を書きます。ですます調、怪しい表現は避ける。',
    messages: [{
      role: 'user',
      content: `カテゴリ「${topic.category}」、テーマ「${topic.hook}」でInstagramスワイプ投稿を作成してください。

以下のJSONのみ出力（前置き不要）：
{
  "cards": [
    {
      "sectionLabel": "FACT 01",
      "content": "驚きの事実を2〜3文で。100文字以内。",
      "point": "1行の要点。40文字以内。"
    },
    {
      "sectionLabel": "MYSTERY 02",
      "content": "さらに深い謎・背景を2〜3文で。100文字以内。",
      "point": "1行の要点。40文字以内。"
    },
    {
      "sectionLabel": "CONNECTION 03",
      "content": "現代・日常との意外なつながり。2〜3文。100文字以内。",
      "point": "1行の要点。40文字以内。"
    }
  ],
  "caption": "Instagram投稿用キャプション。200文字以内。ハッシュタグ不要。"
}`,
    }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text;
  const json = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as {
    cards: SwipeCard[]; caption: string;
  };

  return { category: topic.category, hook: topic.hook, cards: json.cards, caption: json.caption };
}

async function renderHtml(html: string, vars: Record<string, string>, outputPath: string): Promise<void> {
  let rendered = html;
  for (const [k, v] of Object.entries(vars)) {
    rendered = rendered.split(`{{${k}}}`).join(v);
  }

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1080 });
    await page.setContent(rendered, { waitUntil: 'networkidle' });
    await page.screenshot({ path: outputPath, clip: { x: 0, y: 0, width: 1080, height: 1080 } });
    console.log(`  生成: ${path.basename(outputPath)}`);
  } finally {
    await browser.close();
  }
}

function loadTemplate(name: string): string {
  return fs.readFileSync(path.join(TEMPLATE_DIR, name), 'utf-8');
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const dateSlug = getJstDateSlug();
  const client = new Anthropic();

  if (POST_TYPE === 'fortune') {
    console.log('=== fortune-card 生成 ===');
    const content = await generateFortuneContent(client);
    console.log(`星: ${content.starName} / 運勢: ${content.fortuneText.slice(0, 30)}...`);

    if (!DRY_RUN) {
      const template = loadTemplate('fortune-card.html');
      const outputPath = path.join(OUTPUT_DIR, `fortune-${dateSlug}.png`);
      await renderHtml(template, {
        DATE:         content.date,
        STAR_NAME:    content.starName,
        FORTUNE_TEXT: content.fortuneText,
        ADVICE:       content.advice,
      }, outputPath);
    }

    // キャプションを一時ファイルに保存（post-instagram.tsが読む）
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `fortune-${dateSlug}.caption.txt`),
      content.caption,
      'utf-8',
    );
    console.log('✓ fortune-card 完了');

  } else {
    console.log('=== swipe 生成 ===');
    const topic = pickUnusedTopic();
    console.log(`トピック: [${topic.category}] ${topic.hook}`);

    const content = await generateSwipeContent(client, topic);
    const total = content.cards.length + 2; // cover + cards + end

    if (!DRY_RUN) {
      // 表紙
      const coverTpl = loadTemplate('swipe-cover.html');
      await renderHtml(coverTpl, {
        CATEGORY: content.category,
        HOOK:     content.hook,
      }, path.join(OUTPUT_DIR, `swipe-${dateSlug}-0-cover.png`));

      // 本文カード
      const bodyTpl = loadTemplate('swipe-body.html');
      for (let i = 0; i < content.cards.length; i++) {
        const card = content.cards[i];
        await renderHtml(bodyTpl, {
          CARD_NUM:      String(i + 2),
          TOTAL:         String(total),
          SECTION_LABEL: card.sectionLabel,
          CONTENT:       card.content,
          POINT:         card.point,
        }, path.join(OUTPUT_DIR, `swipe-${dateSlug}-${i + 1}-body.png`));
      }

      // 締め
      const endTpl = loadTemplate('swipe-end.html');
      await renderHtml(endTpl, {}, path.join(OUTPUT_DIR, `swipe-${dateSlug}-${total - 1}-end.png`));
    }

    fs.writeFileSync(
      path.join(OUTPUT_DIR, `swipe-${dateSlug}.caption.txt`),
      content.caption,
      'utf-8',
    );
    console.log(`✓ swipe 完了（${total}枚）`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
