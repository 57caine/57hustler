# JARVIS-Affiliate 引き継ぎメモ

---

## ⚠ JARVIS 2.0 状態追記（2026-11-14 Issue #209）

**これは文書引継ぎのみ。コード実装・実データ照合・非公開実験は実施していない（NOT RUN）。**

| 項目 | 内容 |
|---|---|
| 本 Issue | #209（JARVIS 既存基盤への仕様組み込み） |
| 親 Issue | **#207**（唯一の CEO 経営再構築マスター台帳）。経営判断・案件選定・実験採択は #207 で行う |
| 仕様書 | `jarvis-affiliate/JARVIS-2.0-SPEC.md`（本 Issue の文書成果物、2026-11-14 初版） |
| 元ブランチ | `claude/jarvis-affiliate-setup-m0vzj4`（上書き・削除・rebase 禁止） |
| 本番公開状態 | **未公開**（Vercel/Cloudflare プロジェクト未作成。変更なし） |

### 今回追加・変更した内容

Claude Codeが仕様書・CLAUDE・HANDOFFの3文書を編集。`.claude/commands/`の2文書はClaudeの保護で未適用だったため、Codexがオーナーの依頼済み範囲で補完し、ゲート基準・重複排除・非公開検証案もレビュー修正した。保護設定は変更していない。

確認した元head: `8a84302d59cffec82b904f39159e62b962fe41ba`。文書差分のレビューのみ。validate/build/拒否テスト/実データ照合/本番確認はNOT RUN。

1. `JARVIS-2.0-SPEC.md` 新規作成（需要・採算ゲートスキーマ、ASP 照合スキーマ、状態機械、CEO 連携フォーマット、承認ゲートスキーマ、拒否テスト計画）
2. `CLAUDE.md` に「JARVIS 2.0 ゲート」セクションを追加。§2 の「ビルド成功 → `published`」という旧手順を無効化（取り消し線＋修正注記）
3. `HANDOFF.md` に本セクションを追加
4. `.claude/commands/new-lp.md` のステップ 5b・6 を修正（需要・採算ゲート確認と明示承認が必要な手順に変更）
5. `.claude/commands/daily-growth.md` の §2 にデータ品質ルールを追加

### 変更していない内容

- `jarvis-affiliate/` 配下のコード・設定ファイル（コード実装は未実施）
- ルートの `lens-navi`・`school-navi` 等の本番コード
- GitHub Actions ワークフロー
- SNS 投稿設定
- 本番環境・GA4・ASP の設定

### 責任境界と予約連携注意事項

- **楽旅くん担当の権限拡大ではない。** 本 Issue #209 の作業は `jarvis-affiliate/` 内の仕様・指示に限定。楽旅くん専用実行者は本件をスキップし、スキップ理由を残すこと
- **予約連携（`rakutabi/`）の接続失敗後の停止記録がある。** 本件ラベルだけで起動・受領済みとは扱わない。予約設定を広げない
- **#207 の監査を本件で複製しない。** 事業別監査・3 ページ選定・経営順位の判断は #207 で行い、JARVIS は証拠（ゲート結果・照合済み数値・欠測理由）を供給する

### オーナーの判断待ち（#209 追加分）

6. 需要・採算ゲートに合格する実案件の選定（#207 で判断）
7. 採算ゲート合格後の公開承認（#207の明示判断と対象SHAの照合。approvals.jsonは未実装の保存形式案）
8. 本Issue内の次工程として拒否テスト・照合処理の実装順序を確認（重複Issueを作らない）

---

## 以下は 2026-11-13 時点の引き継ぎ内容（履歴として保持）

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

