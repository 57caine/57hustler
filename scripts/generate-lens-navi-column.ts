/**
 * lens-navi コラム自動生成スクリプト
 *
 * 使い方:
 *   npx ts-node scripts/generate-lens-navi-column.ts --section vr
 *   npx ts-node scripts/generate-lens-navi-column.ts --section contact
 *   npx ts-node scripts/generate-lens-navi-column.ts --update --slug vr-shiryoku-warui
 *
 * 環境変数:
 *   ANTHROPIC_API_KEY: Claude API キー
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

// ---- 型定義 ----

type Section = 'contact' | 'eye-care' | 'lasik' | 'megane' | 'vr' | 'karakon' | 'eye-goods';

interface ContentLogEntry {
  slug: string;
  title: string;
  section: Section;
  publishedAt: string;
}

interface ContentLog {
  lastUpdated: string;
  columns: ContentLogEntry[];
}

interface GeneratedColumn {
  slug: string;
  title: string;
  description: string;
  section: Section;
  readingTime: number;
  keywords: string[];
  faqs: Array<{ q: string; a: string }>;
  content: string;
}

// ---- Markdown → JSX 変換 ----

function markdownToJSX(text: string): string {
  const lines = text.split('\n');
  const out: string[] = [];
  let inUl = false;

  const flush = () => { if (inUl) { out.push('      </ul>'); inUl = false; } };
  const escape = (s: string) =>
    s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
     .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer nofollow" className="text-sky-600 hover:underline">$1</a>');

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('## ')) {
      flush();
      out.push(`      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">${escape(line.slice(3))}</h2>`);
    } else if (line.startsWith('### ')) {
      flush();
      out.push(`      <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">${escape(line.slice(4))}</h3>`);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inUl) { out.push('      <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">'); inUl = true; }
      out.push(`        <li>${escape(line.slice(2))}</li>`);
    } else if (line.trim() === '') {
      flush();
    } else {
      flush();
      out.push(`      <p className="text-gray-700 mb-4">${escape(line)}</p>`);
    }
  }
  flush();
  return out.join('\n');
}

// ---- セクション別キーワードプール ----

const SECTION_TOPICS: Record<Section, string[]> = {
  vr: [
    'Meta Quest 3 レビュー・使用感',
    'Ray-Ban Meta スマートグラス 実用性',
    'Apple Vision Pro 日本購入ガイド',
    'VR フィットネス・エクササイズ おすすめアプリ',
    'メタバース 仮想オフィス・リモートワーク活用',
    'VR 映画・動画視聴 おすすめサービス2026',
    'XRヘッドセット 法人導入事例',
    'VR 子ども・教育活用 安全な使い方',
    'スマートグラス AR ナビ・翻訳機能',
    'VR ハプティクス 次世代触覚デバイス',
  ],
  contact: [
    'コンタクトレンズ 花粉症シーズン対策',
    '乱視用コンタクト 選び方・おすすめ2026',
    'コンタクト 使い捨て vs 継続使用 コスト比較',
    '遠近両用コンタクト 老眼対応 おすすめ',
    'コンタクト スポーツ・水泳 使い方',
    'カラコン ナチュラル系おすすめ2026',
    'コンタクト 敏感眼 シリコーンハイドロゲル選び方',
    '子ども・高校生 コンタクト 初めての選び方',
    'コンタクト 度数が変わるサイン・定期検査の重要性',
    'コンタクト 保存液・ケア用品 選び方2026',
  ],
  'eye-care': [
    '目の充血 原因・即効対策',
    '眼精疲労 ストレッチ・マッサージ完全ガイド',
    '飛蚊症 原因・受診タイミング',
    '緑内障 早期発見・検査方法',
    'ドライアイ 目薬選び方・人工涙液比較',
    '目の紫外線対策 サングラス・UV目薬',
    'ホットアイマスク 効果・おすすめ製品2026',
    'ルテイン サプリ 目の健康・黄斑変性予防',
    '近視進行抑制 子ども アトロピン・オルソケラトロジー',
    'スマホ老眼 予防・進行を遅らせる方法',
  ],
  lasik: [
    'レーシック 術後1年 視力変化・安定性',
    'ICL 費用・メリット・デメリット2026年最新',
    'オルソケラトロジー 夜間装用で近視矯正',
    'レーシック 後悔しないための術前チェックリスト',
    'SMILE スマイル手術 レーシックとの違い',
    '老眼手術 多焦点眼内レンズ 費用・適応',
    '視力矯正 ドライアイリスク 対策と術後ケア',
    'レーシック クリニック選び方・比較ポイント',
    '角膜厚さ 適応検査 レーシック受けられるか確認方法',
    'レーシック 保険適用・医療費控除活用方法',
  ],
  megane: [
    'メガネ 顔型別おすすめフレーム2026',
    'ブルーライトカット眼鏡 夜間使用の効果',
    'サングラス 偏光レンズ vs 普通レンズ 釣り・ドライブ',
    'メガネ 軽量フレーム チタン・TR90素材比較',
    'スポーツ眼鏡 おすすめ・ズレ防止フレーム',
    'リーディンググラス 老眼鏡 選び方・おすすめ2026',
    'メガネ 鼻パッド 痛い・ズレ解決策',
    'オンラインメガネ 通販 おすすめショップ比較',
    'メガネ 子ども用 選び方・強化プラスチックレンズ',
    'グレアレンズ 眩しさ対策 夜間運転に最適なレンズ',
  ],
  karakon: [
    'カラコン 度あり 近視・乱視対応 選び方2026',
    'カラコン 長時間装用 乾燥しにくい おすすめ',
    'カラコン ナチュラル系 職場OK バレない選び方',
    '韓国カラコン 日本正規品 安全な通販',
    'カラコン 高校生・大学生 初めての選び方',
    'カラコン ハーフ系 ブラウン グレー おすすめ',
    'カラコン UVカット 機能性 比較2026',
    'カラコン 乱視用 度あり おすすめブランド',
    'カラコン 着色直径 サイズ別 効果の違い',
    'カラコン ケア用品 正しい洗浄方法',
  ],
  'eye-goods': [
    'ホットアイマスク おすすめランキング2026 蒸気・電熱・使い捨て比較',
    'PC眼精疲労 おすすめグッズ モニターライト ブルーライトカット',
    'まつ毛美容液 おすすめランキング2026 成分・効果・選び方',
    'アイローラー 目の疲れ むくみ 解消グッズ',
    '目の紫外線対策 サングラス UVカットグッズ2026',
    'スマホ老眼 対策グッズ 拡大鏡 老眼鏡 おすすめ',
    'ルテイン サプリ おすすめランキング2026 目の健康維持',
    'アイクリーム 目元ケア 選び方・おすすめ2026',
    'スマートアイウェア 機能性グッズ 最新2026',
    '目のストレッチ ツボ押しグッズ おすすめ',
  ],
};

const SECTION_AFFILIATE_KEYWORDS: Record<Section, { amzn: string; rakuten: string }> = {
  vr: { amzn: 'VRゴーグル スマートグラス', rakuten: 'VRゴーグル' },
  contact: { amzn: 'コンタクトレンズ ワンデー', rakuten: 'コンタクトレンズ' },
  'eye-care': { amzn: '目薬 ドライアイ', rakuten: '目薬' },
  lasik: { amzn: '目のサプリ ルテイン', rakuten: 'アイケア サプリ' },
  megane: { amzn: 'メガネ ブルーライトカット', rakuten: 'メガネ フレーム' },
  karakon: { amzn: 'カラコン ワンデー おすすめ', rakuten: 'カラコン 日本製 ワンデー' },
  'eye-goods': { amzn: 'ホットアイマスク アイケアグッズ', rakuten: 'ホットアイマスク アイケア' },
};

// ---- 重複チェック ----

function loadContentLog(): ContentLog {
  const logPath = path.join(__dirname, '../data/lens-navi-content-log.json');
  return JSON.parse(fs.readFileSync(logPath, 'utf-8')) as ContentLog;
}

function isSlugUsed(slug: string, log: ContentLog): boolean {
  return log.columns.some(c => c.slug === slug);
}

function isTitleSimilar(title: string, log: ContentLog): boolean {
  const normalize = (s: string) => s.replace(/[【】・〜]/g, '').toLowerCase();
  const normalizedNew = normalize(title);
  return log.columns.some(c => {
    const existing = normalize(c.title);
    const overlap = normalizedNew.split('').filter(ch => existing.includes(ch)).length;
    return overlap / normalizedNew.length > 0.7;
  });
}

function appendToLog(entry: ContentLogEntry, log: ContentLog): void {
  const logPath = path.join(__dirname, '../data/lens-navi-content-log.json');
  log.columns.push(entry);
  log.lastUpdated = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2), 'utf-8');
}

// ---- Claude API 呼び出し ----

async function generateColumn(
  client: Anthropic,
  section: Section,
  topicHint: string,
  log: ContentLog,
): Promise<GeneratedColumn | null> {
  const aff = SECTION_AFFILIATE_KEYWORDS[section];
  const existingSlugs = log.columns.filter(c => c.section === section).map(c => c.slug).join(', ');

  const systemPrompt = `あなたはSEOとアフィリエイトに強いコンテンツライターです。
日本語で2000文字以上のブログ記事を書いてください。

品質基準:
- H2/H3見出しを使って構造化
- 具体的なデータ・数値を含む
- FAQ 5問以上（Q&A形式）
- アフィリエイトCTA（Amazon・楽天リンク）を自然に組み込む
- 事実のみ記述、推測・誇張禁止
- 既存記事との内容重複を避ける

既存スラッグ（重複禁止）: ${existingSlugs || 'なし'}`;

  const userPrompt = `セクション: ${section}
トピック: ${topicHint}

以下のJSON形式で記事を出力してください:
{
  "slug": "kebab-case-slug-in-japanese-romaji",
  "title": "記事タイトル（日本語・SEOキーワード含む）",
  "description": "SEOメタディスクリプション（120文字以内）",
  "readingTime": 8,
  "keywords": ["キーワード1", "キーワード2", "キーワード3"],
  "faqs": [
    {"q": "質問1？", "a": "回答1（100文字以上）"},
    {"q": "質問2？", "a": "回答2"},
    {"q": "質問3？", "a": "回答3"},
    {"q": "質問4？", "a": "回答4"},
    {"q": "質問5？", "a": "回答5"}
  ],
  "content": "## 見出し1\\n本文...\\n\\n## 見出し2\\n..."
}

アフィリエイトリンクはcontent内に以下の形式で含めてください:
Amazon: https://www.amazon.co.jp/s?k=${encodeURIComponent(aff.amzn)}&tag=hustle-digger-22
楽天: https://hb.afl.rakuten.co.jp/ichiba/5567171b.a80702dc.5567171c.a1d1b6fc/?pc=${encodeURIComponent('https://search.rakuten.co.jp/search/mall/' + aff.rakuten + '/')}`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    messages: [
      { role: 'user', content: userPrompt },
    ],
    system: systemPrompt,
  });

  const rawText = response.content[0].type === 'text' ? response.content[0].text : '';

  // JSON抽出
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('Failed to extract JSON from response');
    return null;
  }

  // LLMが文字列内に生の改行・制御文字を出力することがあるため修正する
  function sanitizeJson(text: string): string {
    let result = '';
    let inString = false;
    let escape = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (escape) {
        result += ch;
        escape = false;
      } else if (ch === '\\' && inString) {
        result += ch;
        escape = true;
      } else if (ch === '"') {
        result += ch;
        inString = !inString;
      } else if (inString && (ch === '\n' || ch === '\r' || ch === '\t')) {
        result += ch === '\n' ? '\\n' : ch === '\r' ? '\\r' : '\\t';
      } else {
        result += ch;
      }
    }
    return result;
  }

  try {
    const sanitized = sanitizeJson(jsonMatch[0]);
    const parsed = JSON.parse(sanitized) as GeneratedColumn;
    parsed.section = section;

    if (isSlugUsed(parsed.slug, log)) {
      console.warn(`Slug already used: ${parsed.slug}. Skipping.`);
      return null;
    }
    if (isTitleSimilar(parsed.title, log)) {
      console.warn(`Title too similar to existing: ${parsed.title}. Skipping.`);
      return null;
    }

    return parsed;
  } catch (e) {
    console.error('JSON parse error:', e);
    console.error('Raw JSON snippet:', jsonMatch[0].slice(0, 200));
    return null;
  }
}

// ---- ファイル出力 ----

function buildColumnEntryCode(col: GeneratedColumn): string {
  const faqsCode = col.faqs.map(f =>
    `    { q: ${JSON.stringify(f.q)}, a: ${JSON.stringify(f.a)} }`,
  ).join(',\n');

  return `  {
    slug: ${JSON.stringify(col.slug)},
    title: ${JSON.stringify(col.title)},
    description: ${JSON.stringify(col.description)},
    section: ${JSON.stringify(col.section)},
    category: ${JSON.stringify(col.section)},
    readingTime: ${col.readingTime},
    publishedAt: ${JSON.stringify(new Date().toISOString().slice(0, 10))},
    keywords: ${JSON.stringify(col.keywords)},
    faqs: [
${faqsCode}
    ],
  }`;
}

function buildColumnContentCode(col: GeneratedColumn): string {
  const jsxBody = markdownToJSX(col.content);

  return `  ${JSON.stringify(col.slug)}: (
    <article className="prose prose-sm max-w-none">
${jsxBody}
    </article>
  )`;
}

function appendEntry(src: string, entryCode: string): string {
  // ]; はファイル内に1つだけ存在（配列の終端）
  return src.replace(/^(\];)$/m, `  ${entryCode},\n$1`);
}

function appendContent(src: string, contentCode: string): string {
  // ファイル末尾の }; （コンテンツオブジェクトの終端）の直前に挿入
  const lastBrace = src.lastIndexOf('\n};');
  if (lastBrace === -1) return src;
  return src.slice(0, lastBrace) + '\n  ' + contentCode + ',\n};' + src.slice(lastBrace + '\n};'.length);
}

function appendToEyeColumns(col: GeneratedColumn): void {
  const filePath = path.join(__dirname, '../lib/eye-columns.tsx');
  let src = fs.readFileSync(filePath, 'utf-8');
  src = appendEntry(src, buildColumnEntryCode(col));
  src = appendContent(src, buildColumnContentCode(col));
  fs.writeFileSync(filePath, src, 'utf-8');
  console.log(`✓ Added to eye-columns.tsx: ${col.slug}`);
}

function appendToColumns(col: GeneratedColumn): void {
  const filePath = path.join(__dirname, '../lib/columns.tsx');
  let src = fs.readFileSync(filePath, 'utf-8');
  src = appendEntry(src, buildColumnEntryCode(col));
  src = appendContent(src, buildColumnContentCode(col));
  fs.writeFileSync(filePath, src, 'utf-8');
  console.log(`✓ Added to columns.tsx: ${col.slug}`);
}

function appendToKarakonColumns(col: GeneratedColumn): void {
  const filePath = path.join(__dirname, '../lib/karakon-columns.tsx');
  let src = fs.readFileSync(filePath, 'utf-8');
  src = appendEntry(src, buildColumnEntryCode(col));
  src = appendContent(src, buildColumnContentCode(col));
  fs.writeFileSync(filePath, src, 'utf-8');
  console.log(`✓ Added to karakon-columns.tsx: ${col.slug}`);
}

// ---- メイン ----

async function main() {
  const args = process.argv.slice(2);
  const sectionArg = args[args.indexOf('--section') + 1] as Section | undefined;
  const isUpdate = args.includes('--update');
  const slugArg = isUpdate ? args[args.indexOf('--slug') + 1] : undefined;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });
  const log = loadContentLog();

  if (isUpdate && slugArg) {
    // 既存コラム更新モード
    const existing = log.columns.find(c => c.slug === slugArg);
    if (!existing) {
      console.error(`Slug not found: ${slugArg}`);
      process.exit(1);
    }
    console.log(`Updating column: ${slugArg}`);
    const updated = await generateColumn(client, existing.section, `${existing.title}（最新情報でアップデート）`, {
      ...log,
      columns: log.columns.filter(c => c.slug !== slugArg),
    });
    if (updated) {
      updated.slug = slugArg;
      if (['vr', 'eye-care', 'lasik', 'megane', 'eye-goods'].includes(existing.section)) {
        appendToEyeColumns(updated);
      } else if (existing.section === 'karakon') {
        appendToKarakonColumns(updated);
      } else {
        appendToColumns(updated);
      }
      console.log(`✓ Updated: ${slugArg}`);
    }
    return;
  }

  // 新規生成モード
  const targetSection: Section = sectionArg ?? 'contact';
  const topicPool = SECTION_TOPICS[targetSection];

  // 未使用トピックを優先
  const usedTitles = log.columns.filter(c => c.section === targetSection).map(c => c.title);
  const unusedTopics = topicPool.filter(t =>
    !usedTitles.some(u => u.includes(t.split(' ')[0])),
  );
  const topic = unusedTopics[0] ?? topicPool[Math.floor(topicPool.length / 2)];

  console.log(`Generating: section=${targetSection}, topic=${topic}`);
  const col = await generateColumn(client, targetSection, topic, log);

  if (!col) {
    console.error('Generation failed or duplicate detected');
    process.exit(1);
  }

  if (['vr', 'eye-care', 'lasik', 'megane', 'eye-goods'].includes(targetSection)) {
    appendToEyeColumns(col);
  } else if (targetSection === 'karakon') {
    appendToKarakonColumns(col);
  } else {
    appendToColumns(col);
  }

  appendToLog({
    slug: col.slug,
    title: col.title,
    section: targetSection,
    publishedAt: new Date().toISOString().slice(0, 10),
  }, log);

  console.log(`✓ Generated and logged: ${col.slug}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
