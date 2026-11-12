/**
 * 公開中LPから X / Threads 用の誘導投稿案を複数パターン生成する（APIは呼ばない・無料）
 *   npm run social                                   … 全公開LP
 *   npm run social -- --slug sample-campaign         … 1件だけ
 *   npm run social -- --trends "ボーナス,大掃除"      … 追加のトレンド切り口
 *   npm run social -- --per 8                        … 1LPあたりの最大パターン数
 * 出力: output/social/{日付}/{slug}.json と .md
 *
 * ・リンク先はアフィリエイトURLではなく自サイトのLP（UTM付き）。計測でき、ASP規約上も安全
 * ・全投稿に #PR を付与（ステマ規制）
 * ・NGワードを含む投稿は除外
 */
import fs from 'node:fs';
import { loadCampaigns, type Campaign } from '../src/lib/campaigns.ts';
import { getProgram } from '../src/lib/affiliates.ts';
import { findNgWords } from '../src/lib/compliance.ts';
import { p } from '../src/lib/paths.ts';
import { c, getArg, loadEnv, today, writeFile } from './lib/cli.ts';

loadEnv();
const SITE = (process.env.SITE_URL ?? 'https://example.com').replace(/\/$/, '');
const DATE = today();
const PER = Number(getArg('per', '6'));

type Platform = 'x' | 'threads';
interface Post {
  id: string;
  platform: Platform;
  pattern: string;
  angle?: string;
  text: string;
  url: string;
  length: number;
  limit: number;
}

/** X の文字数（全角=2, 半角=1, URL=23 として 280 以内） */
function xWeight(text: string) {
  const urls = text.match(/https?:\/\/\S+/g) ?? [];
  let rest = text;
  for (const u of urls) rest = rest.replace(u, '');
  let n = urls.length * 23;
  for (const ch of rest) n += /[\u0000-ჿ -‍‐-‟′-‷]/.test(ch) ? 1 : 2;
  return n;
}

function utm(slug: string, platform: Platform, content: string) {
  const q = new URLSearchParams({ utm_source: platform, utm_medium: 'social', utm_campaign: slug, utm_content: content });
  return `${SITE}/lp/${slug}/?${q}`;
}

function loadTrends(category?: string): string[] {
  const file = p('config', 'trends.json');
  const extra = (getArg('trends') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!fs.existsSync(file)) return extra;
  const json = JSON.parse(fs.readFileSync(file, 'utf8')) as { angles: { label: string; from: string; to: string; categories: string[] }[] };
  const active = json.angles
    .filter((a) => a.from <= DATE && DATE <= a.to)
    .filter((a) => !a.categories.length || (category && a.categories.includes(category)))
    .map((a) => a.label);
  return [...extra, ...active];
}

function hashtags(category?: string): string[] {
  const file = p('config', 'trends.json');
  if (!fs.existsSync(file) || !category) return [];
  return (JSON.parse(fs.readFileSync(file, 'utf8')).hashtags?.[category] ?? []) as string[];
}

/** 比較表から「事実ベースの数字」を1つ取り出す（推測値は使わない） */
function factHook(cp: Campaign): string | null {
  const col = cp.comparison?.columns.find((x) => x.type === 'number');
  if (!col || !cp.comparison) return null;
  const rows = cp.comparison.programIds.map(getProgram).filter((x) => typeof x.specs[col.key] === 'number');
  if (rows.length < 2) return null;
  const values = rows.map((x) => x.specs[col.key] as number);
  const min = Math.min(...values), max = Math.max(...values);
  if (min === max) return null;
  return `${col.label}は${min.toLocaleString('ja-JP')}${col.unit ?? ''}〜${max.toLocaleString('ja-JP')}${col.unit ?? ''}と、${rows.length}社でかなり差がありました`;
}

function buildPosts(cp: Campaign): Post[] {
  const pains = cp.pains ?? [];
  const benefits = cp.benefits ?? [];
  const angles = [...loadTrends(cp.category), ...(cp.socialAngles ?? [])];
  const tags = hashtags(cp.category).map((t) => `#${t}`).join(' ');
  const fact = factHook(cp);
  const top = cp.ranking?.[0] ? getProgram(cp.ranking[0].programId) : null;
  const count = cp.comparison?.programIds.length ?? cp.ranking?.length ?? 0;

  type Draft = { pattern: string; angle?: string; body: string };
  const drafts: Draft[] = [];
  if (pains[0]) drafts.push({ pattern: 'empathy', body: `「${pains[0]}」\nそんな人ほど、選び方を変えるだけで続けやすくなります。\n${benefits[0] ?? ''}\n比較してまとめました👇` });
  if (fact) drafts.push({ pattern: 'fact', body: `${cp.target.persona}向けに${count}社を比べたら、${fact}。\n自分の使い方に合わせて選ぶのが大事です。` });
  if (benefits.length >= 2) drafts.push({ pattern: 'benefit-list', body: `${cp.title.split('｜')[0]}\n\n${benefits.slice(0, 3).map((b) => `・${b}`).join('\n')}\n\n詳しい比較はこちら` });
  if (pains[1]) drafts.push({ pattern: 'question', body: `${pains[1]}…という経験ありませんか？\n失敗しにくい選び方のポイントを3つにまとめました。` });
  if (top && cp.ranking?.[0]) drafts.push({ pattern: 'conclusion', body: `迷ったら結論から。\n${cp.ranking[0].catchcopy}のは「${top.name}」でした。\n理由と他社との違いはこちら` });
  for (const angle of angles) drafts.push({ pattern: 'trend', angle, body: `${angle}人へ。\n${cp.target.situation ?? pains[0] ?? ''}という状況でも始めやすいサービスを比較しました。` });

  const posts: Post[] = [];
  drafts.slice(0, PER).forEach((d, i) => {
    for (const platform of ['x', 'threads'] as Platform[]) {
      const id = `${cp.slug}-${DATE}-${platform}-${String(i + 1).padStart(2, '0')}`;
      const url = utm(cp.slug, platform, `${d.pattern}-${i + 1}`);
      const tagLine = platform === 'x' ? ['#PR', ...tags.split(' ').slice(0, 2)].filter(Boolean).join(' ') : ['#PR', tags].filter(Boolean).join(' ');
      let text = `${d.body.trim()}\n\n${url}\n${tagLine}`;
      const limit = platform === 'x' ? 280 : 500;
      let length = platform === 'x' ? xWeight(text) : [...text].length;
      if (length > limit) { text = `${d.body.trim().split('\n')[0]}\n\n${url}\n#PR`; length = platform === 'x' ? xWeight(text) : [...text].length; }
      if (length > limit) { console.log(c.yellow(`  skip ${id}: 文字数超過 ${length}/${limit}`)); continue; }
      const ng = findNgWords(text, cp.compliance?.regulatedCategory ?? 'none').filter((h) => h.level === 'error');
      if (ng.length) { console.log(c.yellow(`  skip ${id}: NGワード ${ng.map((h) => h.word).join(',')}`)); continue; }
      posts.push({ id, platform, pattern: d.pattern, angle: d.angle, text, url, length, limit });
    }
  });
  return posts;
}

const slug = getArg('slug');
const campaigns = loadCampaigns().filter((cp) => !slug || cp.slug === slug);
if (!campaigns.length) { console.error(c.red('対象のLP（status: published）がありません')); process.exit(1); }

const outDir = p('output', 'social', DATE);
for (const cp of campaigns) {
  const posts = buildPosts(cp);
  writeFile(`${outDir}/${cp.slug}.json`, JSON.stringify({ campaign: cp.slug, generatedAt: new Date().toISOString(), status: 'draft', posts }, null, 2));
  const md = [
    `# SNS投稿案：${cp.title}`,
    `生成日：${DATE}　／　状態：下書き（投稿前に人が確認）`,
    '',
    ...posts.map((x) => `## ${x.id}（${x.platform === 'x' ? 'X' : 'Threads'}・${x.pattern}${x.angle ? `・${x.angle}` : ''}）\n文字数 ${x.length}/${x.limit}\n\n\`\`\`\n${x.text}\n\`\`\`\n`),
  ].join('\n');
  writeFile(`${outDir}/${cp.slug}.md`, md);
  console.log(`${c.green('✓')} ${cp.slug}: ${posts.length}件 → output/social/${DATE}/${cp.slug}.{json,md}`);
}
