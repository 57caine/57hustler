# JARVIS-Affiliate 引き継ぎメモ（2026-11-13時点）

## 何を作ったか
アフィリエイトLPの量産・ASPリンク注入・SNS投稿案・数値改善を、設定ファイル（Markdown / JSON）の更新だけで回す基盤。
- リポジトリ：57caine/57hustler の `jarvis-affiliate/` フォルダ（Astro + Tailwind、静的HTML出力）
- ブランチ：`claude/jarvis-affiliate-setup-m0vzj4`（push済み・PR未作成・mainには未マージ）
- 本番公開：していない（Vercel / Cloudflare のプロジェクト未作成）
- ルールの詳細：`jarvis-affiliate/CLAUDE.md`

## 中身
| 部分 | 内容 |
|---|---|
| LP自動生成 | `content/campaigns/*.md`（訴求・比較・ランキング・FAQ）＋`config/affiliates.json`（案件・リンク・報酬）→ `/lp/{slug}/` |
| リンク注入 | `AffiliateButton.astro` だけがリンクを出す。rel="sponsored"・GA4 `affiliate_click` 計測を自動付与。直書きはビルドで止まる |
| 自動チェック | `scripts/validate-links.ts`：NGワード（`config/compliance-rules.md` で管理）・リンク直書き・PR表記・Product構造化データ禁止・ダミー案件。ビルド前後に自動実行 |
| SNS投稿案 | `scripts/generate-social-posts.ts`：X / Threads 用を複数パターン生成。全件 #PR・リンク先はLP（UTM付き）。自動投稿はしない |
| 改善提案 | `scripts/analyze-metrics.ts`：GA4・ASPのCSV（`data/reports/`）からLPの診断と書き換え案を出す |
| 運用コンソール | `/jarvis/`：今日の判断・LP一覧・案件マスター・投稿案・改善案・チェック結果を1画面に。本番ビルドでは生成しない |
| コマンド | `/new-lp`（LP作成）・`/check-compliance`（監査）・`/daily-growth`（日次の数値確認＋投稿案） |

## 経緯・オーナーの反応
- 最初にサンプルLPのプレビューを見せたところ「イメージと違う」→ 削除
- オーナーのイメージは「LP単体ではなく、JARVISとして全体を一覧で操作できる管理画面」→ 運用コンソールを追加
- コンソールのプレビュー（サンプルデータ）：https://claude.ai/artifact/Xxt45nxBzkeEvGciphomJz（オーナー専用リンク）
- コンソールへの感想はまだもらっていない

## 現在の状態
- サンプル案件3件（「サンプル英会話A/B/C」・架空・`dummy: true`）のみ。実在の案件・数値は入っていない
- `npm run build` はエラー0件（警告3件＝ダミーリンクの3件）。`npm run build:prod` はダミーがあるため意図どおり止まる
- ルートの lens-navi 本体のビルド・tsconfig・ESLint からは除外済み（lens-navi の本番には影響しない）

## オーナーの判断待ち
1. コンソールがイメージに合っているか（足す・削る欄）
2. 最初に扱う実テーマと案件、ASPで発行済みのリンク
3. 公開先（Cloudflare Pages / Vercel）とドメイン（課金の可能性あり）
4. GA4の計測ID（新規作成か既存流用か）
5. PRを作ってmainにマージするか

## 守るルール（抜粋）
- オーナーは手を動かさない。判断だけしてもらう
- 数値・口コミを創作しない。ダミーのまま本番公開しない
- 自動投稿・有料API・新規課金はしない
- schema.org/Product は出さない。全アフィリエイトリンクに rel="sponsored"

## 手元での動かし方
```bash
cd jarvis-affiliate
npm install
npm run dev   # http://localhost:4321/jarvis/（コンソール） /lp/sample-campaign/（LP）
```
