/**
 * 改善レビュー課題の自動修正案 生成スクリプト（Tier B限定）
 *
 * 「改善レビュー」で未対応になっているlens-naviコラムのうち、機械的に
 * 安全と判断できる構造上の課題（H2見出し不足・CTAボタン不足）のみを対象に、
 * 既存の事実・既存のアフィリエイトリンクのみを使った修正案をClaudeに作らせる。
 *
 * このスクリプト自体はmainへ直接pushしない。ワークフロー側（
 * .github/workflows/auto-fix-column-review.yml）が本スクリプトの結果を見て、
 * 変更をブランチにコミットしPRを作成する。
 *
 * 安全装置:
 *   1. 対象は scripts/lib/column-fix-eligibility.ts の Tier B 判定のみ
 *   2. 新しい数値・統計・効果効能の主張の追加を明示的に禁止
 *   3. 既存のアフィリエイトリンク・ヘルパー関数以外の新規リンク追加を禁止
 *   4. 生成後に `tsc --noEmit` でコンパイル可否を確認（失敗時は変更を破棄）
 *   5. 生成後に column-compliance-check.ts で公開前チェックを実行（不合格時は変更を破棄）
 *   6. 1回の実行で処理するのは1件のみ（AUTO_FIX_MAX_ITEMSで変更可、既定1）
 *
 * 出力: 環境変数 AUTO_FIX_MANIFEST_PATH（既定 /tmp/auto-fix-manifest.json）に
 *   処理結果を書き出す。ワークフロー側はこれを読んでPR作成・ステータス更新を行う。
 */
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { checkColumnCompliance } from './column-compliance-check';
import {
  selectEligibleItems,
  evaluateEligibility,
  type FlaggedArticle,
  type FixKind,
} from './lib/column-fix-eligibility';
import {
  locateColumnContentBlock,
  readBlockSource,
  readFilePreamble,
  replaceBlockSource,
} from './lib/column-content-locator';

const ROOT = path.join(__dirname, '..');
const REVIEW_PATHS = [
  path.join(ROOT, 'data', 'column-review.json'),
  path.join(ROOT, 'ceo-dashboard', 'public', 'column-review.json'),
];
const MANIFEST_PATH = process.env.AUTO_FIX_MANIFEST_PATH ?? '/tmp/auto-fix-manifest.json';
const MAX_ITEMS = parseInt(process.env.AUTO_FIX_MAX_ITEMS ?? '1', 10);
const MODEL = 'claude-haiku-4-5-20251001';

const FIX_KIND_LABEL: Record<FixKind, string> = {
  add_h2_structure: 'H2見出しの追加・再構成（記事が3個未満のH2しか持たないため、スキャン読みしやすい構造に改善）',
  add_cta: 'CTAボタンの追加（既存のアフィリエイトリンクを使い、クリック導線を増やす）',
};

interface Manifest {
  processedAt: string;
  results: Array<
    | { slug: string; outcome: 'pr_ready'; filePath: string; branch: string; prTitle: string; prBody: string; summary: string }
    | { slug: string; outcome: 'blocked'; reason: string }
    | { slug: string; outcome: 'no_eligible_items' }
  >;
}

interface DraftFixResult {
  new_article_jsx: string;
  summary: string;
}

async function draftFix(
  client: Anthropic,
  article: FlaggedArticle,
  fixKinds: FixKind[],
  currentJsx: string,
  filePreamble: string,
): Promise<DraftFixResult | null> {
  const systemPrompt = `あなたはアフィリエイトサイト（lens-navi）の既存コラム記事を、指定された構造上の課題に限定して修正するエンジニアです。

【絶対に守るルール】
1. 修正してよいのは指定された構造上の課題のみです。それ以外の文章・主張・数値は一切変更しないでください
2. 新しい数値・統計・効果効能の主張を追加することは絶対に禁止です（景品表示法の優良誤認・有利誤認リスクのため）
3. 新しいアフィリエイトリンクを追加してはいけません。CTAボタンを追加する場合は、渡されたファイル冒頭のコード（プリアンブル）に既に定義されているヘルパー関数（例: AffiliateBtnR）と、記事内に既に存在するキーワード・リンク先のみを使ってください
4. 出力は有効なTSX（React/JSX）でなければいけません。渡された記事は <article ...> で始まり </article> で終わる1つのJSX式です。出力もこの形式（<articleで始まりで</article>で終わる）を厳守してください
5. 既存の見出し・段落・表・FAQ等の内容は基本的にそのまま残し、指定された課題の修正に必要な最小限の追加・並べ替えのみを行ってください
6. 修正内容に自信が持てない場合、無理に修正を作らず new_article_jsx を空文字列で返してください（その場合は自動修正を見送ります）`;

  const userPrompt = `記事タイトル: ${article.title}

【今回修正してよい課題】
${fixKinds.map(k => `- ${FIX_KIND_LABEL[k]}`).join('\n')}

【このファイルで利用可能なヘルパー関数・import（プリアンブル、参考情報。ここに定義されているもの以外の新規importは行わないこと）】
\`\`\`tsx
${filePreamble.slice(-3000)}
\`\`\`

【現在の記事JSX（この内容をベースに、上記の課題のみを修正してください）】
\`\`\`tsx
${currentJsx}
\`\`\`

修正後の記事全体のJSXと、何をどう直したか・なぜ直したかの日本語の説明（PRの説明文に使います。100〜200文字程度）を報告してください。`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8192,
    system: systemPrompt,
    tools: [{
      name: 'report_fix',
      description: '修正後の記事JSXと変更理由を報告する',
      input_schema: {
        type: 'object' as const,
        properties: {
          new_article_jsx: {
            type: 'string',
            description: '修正後の記事全体のJSX。<articleで始まり</articleで終わること。安全な修正が作れない場合は空文字列',
          },
          summary: {
            type: 'string',
            description: '何をどう直したか・なぜ直したかの日本語説明（PR説明文用、100〜200文字程度）',
          },
        },
        required: ['new_article_jsx', 'summary'],
      },
    }],
    tool_choice: { type: 'tool', name: 'report_fix' },
    messages: [{ role: 'user', content: userPrompt }],
  });

  const toolBlock = response.content.find(b => b.type === 'tool_use');
  if (!toolBlock || toolBlock.type !== 'tool_use') return null;
  const result = toolBlock.input as DraftFixResult;
  if (!result.new_article_jsx || !result.new_article_jsx.trim()) return null;
  return result;
}

function isStructurallyValid(jsx: string, originalJsx: string): { ok: boolean; reason?: string } {
  const trimmed = jsx.trim();
  if (!trimmed.startsWith('<article')) return { ok: false, reason: '<articleで始まっていない' };
  if (!trimmed.endsWith('</article>')) return { ok: false, reason: '</article>で終わっていない' };
  if (trimmed.length < originalJsx.length * 0.5) {
    return { ok: false, reason: `内容が元の50%未満に縮小している（元${originalJsx.length}字→${trimmed.length}字）。誤って内容を削った可能性がある` };
  }
  if (originalJsx.includes('sponsored') && !trimmed.includes('sponsored')) {
    return { ok: false, reason: '既存のアフィリエイトリンク（rel="sponsored"）が失われている' };
  }
  return { ok: true };
}

function tscCheckPasses(): { ok: boolean; output?: string } {
  try {
    execSync('npx tsc --noEmit -p tsconfig.json', { cwd: ROOT, stdio: 'pipe', maxBuffer: 20 * 1024 * 1024 });
    return { ok: true };
  } catch (e) {
    const err = e as { stdout?: Buffer; stderr?: Buffer };
    const output = `${err.stdout?.toString() ?? ''}\n${err.stderr?.toString() ?? ''}`.slice(0, 4000);
    return { ok: false, output };
  }
}

function loadReview(): { data: { flaggedArticles: FlaggedArticle[] }; raw: unknown } {
  const raw = JSON.parse(fs.readFileSync(REVIEW_PATHS[0], 'utf-8'));
  return { data: raw, raw };
}

function writeBlockedNote(slug: string, reason: string): void {
  for (const rp of REVIEW_PATHS) {
    if (!fs.existsSync(rp)) continue;
    const data = JSON.parse(fs.readFileSync(rp, 'utf-8'));
    const article = (data.flaggedArticles ?? []).find((a: FlaggedArticle) => a.slug === slug);
    if (!article) continue;
    article.autoFixNote = { at: new Date().toISOString(), reason };
    fs.writeFileSync(rp, JSON.stringify(data, null, 2), 'utf-8');
  }
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  const client = new Anthropic({ apiKey });

  const { data } = loadReview();
  const eligible = selectEligibleItems(data.flaggedArticles, MAX_ITEMS);

  const manifest: Manifest = { processedAt: new Date().toISOString(), results: [] };

  if (eligible.length === 0) {
    manifest.results.push({ slug: '(none)', outcome: 'no_eligible_items' });
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
    console.log('自動修正の対象となる課題はありませんでした（Tier B条件を満たすものなし）');
    return;
  }

  for (const article of eligible) {
    const { fixKinds } = evaluateEligibility(article);
    console.log(`処理中: ${article.slug} (${fixKinds.join(', ')})`);

    const block = locateColumnContentBlock(article.slug, ROOT);
    if (!block) {
      const reason = `記事本文（lib/*.tsx内のコンテンツマップ）が見つかりませんでした`;
      console.warn(`✗ ${article.slug}: ${reason}`);
      writeBlockedNote(article.slug, reason);
      manifest.results.push({ slug: article.slug, outcome: 'blocked', reason });
      continue;
    }

    const currentJsx = readBlockSource(block);
    const preamble = readFilePreamble(block);

    const draft = await draftFix(client, article, fixKinds, currentJsx, preamble);
    if (!draft) {
      const reason = 'Claudeが安全な修正案を生成できませんでした（自信が持てないため見送り、または応答形式が不正）';
      console.warn(`✗ ${article.slug}: ${reason}`);
      writeBlockedNote(article.slug, reason);
      manifest.results.push({ slug: article.slug, outcome: 'blocked', reason });
      continue;
    }

    const structCheck = isStructurallyValid(draft.new_article_jsx, currentJsx);
    if (!structCheck.ok) {
      const reason = `構造チェックに失敗: ${structCheck.reason}`;
      console.warn(`✗ ${article.slug}: ${reason}`);
      writeBlockedNote(article.slug, reason);
      manifest.results.push({ slug: article.slug, outcome: 'blocked', reason });
      continue;
    }

    // ファイルへ適用してからtscチェック（失敗時は元に戻す）
    const originalFileContent = fs.readFileSync(block.absPath, 'utf-8');
    replaceBlockSource(block, draft.new_article_jsx);

    const tsc = tscCheckPasses();
    if (!tsc.ok) {
      fs.writeFileSync(block.absPath, originalFileContent, 'utf-8');
      const reason = `TypeScriptのコンパイルチェックに失敗したため変更を破棄しました: ${tsc.output?.slice(0, 500)}`;
      console.warn(`✗ ${article.slug}: ${reason}`);
      writeBlockedNote(article.slug, reason);
      manifest.results.push({ slug: article.slug, outcome: 'blocked', reason });
      continue;
    }

    const compliance = await checkColumnCompliance(article.title, draft.new_article_jsx, apiKey);
    if (!compliance.passed) {
      fs.writeFileSync(block.absPath, originalFileContent, 'utf-8');
      const findingsText = compliance.findings.map(f => `[${f.issue_type}] ${f.quote} — ${f.reason}`).join(' / ');
      const reason = `公開前チェック（景品表示法リスク）で指摘があったため変更を破棄しました: ${findingsText}`;
      console.warn(`✗ ${article.slug}: ${reason}`);
      writeBlockedNote(article.slug, reason);
      manifest.results.push({ slug: article.slug, outcome: 'blocked', reason });
      continue;
    }

    // ここまで到達したらファイルへの変更はそのまま残す（ワークフロー側がブランチへコミットする）
    const today = new Date().toISOString().slice(0, 10);
    const branch = `auto-fix/${article.slug}-${today}`;
    const prTitle = `改善レビュー自動修正: ${article.title}`;
    const prBody = [
      `## 検知した課題`,
      `- 記事: [\`${article.slug}\`](https://lens-navi.jp${article.path})`,
      `- フラグ: ${article.flagLabels.join(' / ')}`,
      `- 原因候補: ${article.causes.join(' / ') || '(記録なし)'}`,
      ``,
      `## 今回の修正内容`,
      draft.summary,
      ``,
      `## 適用した修正種別`,
      ...fixKinds.map(k => `- ${FIX_KIND_LABEL[k]}`),
      ``,
      `## 実施した安全チェック`,
      `- ✅ TypeScriptコンパイルチェック（\`tsc --noEmit\`）通過`,
      `- ✅ 公開前コンプライアンスチェック（景品表示法リスク）通過`,
      `- 新規の数値主張・新規アフィリエイトリンクの追加なし（既存の事実・既存リンクのみを使用するようAIに指示済み）`,
      ``,
      `## レビューのお願い`,
      `内容を確認し、問題なければマージしてください。マージ後、CEOダッシュボードの改善レビュー該当項目は自動的に「対応済み」に更新されます。`,
      ``,
      `---`,
      `このPRはCEOダッシュボード「改善レビュー」の自動修正機能により作成されました。`,
    ].join('\n');

    console.log(`✓ ${article.slug}: PR作成準備完了`);
    manifest.results.push({
      slug: article.slug,
      outcome: 'pr_ready',
      filePath: block.filePath,
      branch,
      prTitle,
      prBody,
      summary: draft.summary,
    });

    // 1回の実行でPR作成対象にするのは1件のみ（ブランチ・PRの粒度を記事1件=1PRに保つため）
    break;
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`マニフェスト出力: ${MANIFEST_PATH}`);
}

main().catch(e => { console.error(e); process.exit(1); });
