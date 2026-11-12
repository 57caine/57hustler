/**
 * ビルド前後チェック
 *   npm run validate                … ソースチェック（prebuild で自動実行）
 *   npm run validate -- --dist      … ビルド後のHTMLチェック（postbuild で自動実行）
 *   npm run validate:online         … 実際にリンク先へアクセスしてリンク切れを確認
 *   JARVIS_ENV=production           … ダミー案件・計測ID未設定をエラー扱いにする
 *
 * 終了コード: エラーが1件でもあれば 1（ビルドが止まる）
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadAffiliates, ASP_RULES, AFFILIATE_HOSTS, type AffiliateProgram } from '../src/lib/affiliates.ts';
import { loadCampaigns, referencedProgramIds, type Campaign } from '../src/lib/campaigns.ts';
import { findNgWords, loadNgWords, PR_LABEL, PR_MARKER_ATTR } from '../src/lib/compliance.ts';
import { p } from '../src/lib/paths.ts';
import { c, hasFlag, loadEnv, walk } from './lib/cli.ts';

loadEnv();
const PROD = process.env.JARVIS_ENV === 'production';
const STALE_DAYS = 30;

type Issue = { level: 'error' | 'warn'; where: string; message: string };
const issues: Issue[] = [];
const err = (where: string, message: string) => issues.push({ level: 'error', where, message });
const warn = (where: string, message: string) => issues.push({ level: 'warn', where, message });
const rel = (f: string) => path.relative(p(), f);

// ---------- 1. 案件マスター ----------
function checkPrograms(programs: AffiliateProgram[]) {
  const ids = new Set<string>();
  for (const pr of programs) {
    const where = `affiliates.json#${pr.id}`;
    if (ids.has(pr.id)) err(where, 'IDが重複しています');
    ids.add(pr.id);
    for (const key of ['id', 'name', 'asp', 'status', 'url'] as const) if (!pr[key]) err(where, `必須項目 ${key} がありません`);
    if (!pr.specs) err(where, 'specs がありません（比較表の値）');

    let url: URL | null = null;
    try { url = new URL(pr.url); } catch { err(where, `URLの形式が不正です: ${pr.url}`); }
    if (url) {
      if (url.protocol !== 'https:') err(where, 'https ではありません');
      const rule = ASP_RULES[pr.asp];
      if (!rule) err(where, `未知のASP: ${pr.asp}`);
      else if (rule.hosts.length && !rule.hosts.includes(url.hostname)) {
        err(where, `${rule.label}のリンクではありません（ホスト ${url.hostname}）。トップページ直リンク＝報酬ゼロの可能性`);
      } else for (const m of rule.mustInclude ?? []) if (!pr.url.includes(m)) err(where, `${rule.label}の必須パラメータ ${m} がありません`);
    }

    if (pr.dummy) (PROD ? err : warn)(where, 'ダミー案件です。本番前に実際のASPリンクへ差し替えてください');
    if (/DUMMY|XXXX/i.test(pr.url) && !pr.dummy) err(where, 'URLにダミー文字列が残っています');

    if (!pr.verifiedAt) warn(where, 'verifiedAt（情報確認日）が未設定です');
    else {
      const days = (Date.now() - new Date(pr.verifiedAt).getTime()) / 86400000;
      if (days > STALE_DAYS) warn(where, `情報確認から${Math.floor(days)}日経過。料金・特典を公式サイトで再確認してください`);
    }
  }
}

// ---------- 2. キャンペーンMD ----------
function checkCampaigns(campaigns: Campaign[], programs: AffiliateProgram[]) {
  const ngWords = loadNgWords();
  const slugs = new Set<string>();
  for (const cp of campaigns) {
    const where = rel(cp.file);
    if (slugs.has(cp.slug)) err(where, `slug "${cp.slug}" が重複しています`);
    slugs.add(cp.slug);
    if (!/^[a-z0-9-]+$/.test(cp.slug)) err(where, 'slug は半角英小文字・数字・ハイフンのみ');
    for (const key of ['title', 'description', 'publishedAt'] as const) if (!cp[key]) err(where, `必須項目 ${key} がありません`);
    if (!cp.hero?.headline || !cp.hero?.ctaLabel || !cp.hero?.primaryProgramId) err(where, 'hero.headline / ctaLabel / primaryProgramId は必須です');
    if (cp.hero?.ctaLabel && /^(こちら|クリック|詳しくはこちら)$/.test(cp.hero.ctaLabel)) err(where, 'CTAラベルが「こちら」等だけになっています（design-system.md 4章）');
    if ((cp.description ?? '').length > 120) warn(where, `description が${cp.description.length}字です（120字以内推奨）`);

    if (cp.status === 'published') {
      for (const id of referencedProgramIds(cp)) {
        const pr = programs.find((x) => x.id === id);
        if (!pr) err(where, `案件ID "${id}" が affiliates.json にありません`);
        else if (pr.status !== 'active') err(where, `案件ID "${id}" が status=${pr.status} です`);
      }
      for (const col of cp.comparison?.columns ?? []) {
        for (const id of cp.comparison!.programIds) {
          const pr = programs.find((x) => x.id === id);
          if (pr && !(col.key in pr.specs)) warn(where, `比較表の列 ${col.key} が ${id} の specs にありません（「—」表示になります）`);
        }
      }
    }

    // NGワード：本文＋frontmatterの全テキスト
    const text = fs.readFileSync(cp.file, 'utf8');
    for (const hit of findNgWords(text, cp.compliance?.regulatedCategory ?? 'none', ngWords)) {
      (hit.level === 'error' ? err : warn)(where, `NGワード「${hit.word}」(${hit.reason}) … ${hit.context}`);
    }
  }
}

// ---------- 3. リンク直書き検出 ----------
function checkHardcodedLinks() {
  const files = [...walk(p('src'), ['.astro', '.ts', '.tsx', '.md', '.mdx']), ...walk(p('content'), ['.md', '.mdx'])];
  for (const f of files) {
    if (f.endsWith(path.join('lib', 'affiliates.ts'))) continue; // ホスト定義そのもの
    const text = fs.readFileSync(f, 'utf8');
    for (const host of AFFILIATE_HOSTS) {
      if (text.includes(host)) err(rel(f), `アフィリエイトリンク（${host}）が直書きされています。affiliates.json に登録し AffiliateButton を使ってください`);
    }
    if (/amazon\.co\.jp\/[^\s"')]*tag=/.test(text)) err(rel(f), 'Amazonアソシエイトリンクが直書きされています');
  }
}

// ---------- 4. ビルド後HTML ----------
function checkDist() {
  const dist = p('dist');
  const htmlFiles = walk(dist, ['.html']);
  if (!htmlFiles.length) return err('dist', 'ビルド成果物がありません（先に astro build）');
  const gaOn = !!process.env.PUBLIC_GA4_ID && !process.env.PUBLIC_GA4_ID.includes('XXXX');
  if (PROD && !gaOn) err('.env', 'PUBLIC_GA4_ID が未設定です（本番では計測必須）');

  for (const f of htmlFiles) {
    const where = rel(f);
    const html = fs.readFileSync(f, 'utf8');
    if (!html.includes(PR_MARKER_ATTR) || !html.includes(PR_LABEL)) err(where, `PR表記（${PR_LABEL}）がありません`);
    if (/"@type"\s*:\s*"Product"/.test(html)) err(where, 'schema.org/Product が出力されています（禁止）');

    const anchors = html.match(/<a\b[^>]*>/g) ?? [];
    for (const a of anchors) {
      const href = a.match(/href="([^"]*)"/)?.[1] ?? '';
      const relAttr = a.match(/rel="([^"]*)"/)?.[1] ?? '';
      const isAff = AFFILIATE_HOSTS.some((h) => href.includes(h)) || /amazon\.co\.jp.*tag=/.test(href);
      if (isAff && !/\bsponsored\b/.test(relAttr)) err(where, `rel="sponsored" がないアフィリエイトリンク: ${href.slice(0, 80)}`);
      if (/\bsponsored\b/.test(relAttr) && !/data-affiliate-id=/.test(a)) err(where, `計測属性(data-affiliate-id)がないリンク: ${href.slice(0, 80)}`);
      if (href === '#' || href === '') err(where, 'href="#" のリンクがあります（報酬が発生しないリンク）');
    }
    if (/rel="[^"]*sponsored/.test(html) && !html.includes("'affiliate_click'")) err(where, 'クリック計測スクリプトがありません');
    if (gaOn && !html.includes(process.env.PUBLIC_GA4_ID!)) err(where, 'GA4タグが出力されていません');
  }
  console.log(`  HTML ${htmlFiles.length}件をチェック`);
}

// ---------- 5. オンライン疎通（任意） ----------
async function checkOnline(programs: AffiliateProgram[]) {
  for (const pr of programs.filter((x) => x.status === 'active' && !x.dummy)) {
    try {
      const res = await fetch(pr.url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0 (link-check)' } });
      if (res.status >= 400) err(`affiliates.json#${pr.id}`, `リンク先が HTTP ${res.status}`);
      else console.log(`  ${c.green('OK')} ${pr.id} → ${res.url.slice(0, 80)}`);
    } catch (e) {
      warn(`affiliates.json#${pr.id}`, `接続できませんでした（${(e as Error).message}）`);
    }
  }
}

// ---------- 実行 ----------
const master = loadAffiliates();
const campaigns = loadCampaigns({ includeDrafts: true });
console.log(c.bold(`JARVIS validate（${PROD ? 'production' : 'development'}）`));

if (hasFlag('dist')) checkDist();
else {
  checkPrograms(master.programs);
  checkCampaigns(campaigns, master.programs);
  checkHardcodedLinks();
  console.log(`  案件 ${master.programs.length}件 / キャンペーン ${campaigns.length}件をチェック`);
}
if (hasFlag('online')) await checkOnline(master.programs);

const errors = issues.filter((i) => i.level === 'error');
const warns = issues.filter((i) => i.level === 'warn');
for (const i of warns) console.log(`${c.yellow('WARN ')} ${i.where}: ${i.message}`);
for (const i of errors) console.log(`${c.red('ERROR')} ${i.where}: ${i.message}`);
console.log(errors.length ? c.red(`✗ エラー ${errors.length}件 / 警告 ${warns.length}件`) : c.green(`✓ エラーなし（警告 ${warns.length}件）`));
if (hasFlag('json')) fs.writeFileSync(p('output', 'validate-result.json'), JSON.stringify(issues, null, 2));
process.exitCode = errors.length ? 1 : 0;
