# JARVIS-Affiliate 行動規範（このディレクトリ配下の作業すべてに適用）

アフィリエイトLPの量産・ASPリンク注入・SNS集客・計測改善を半自動で回す基盤です。
**オーナーはMarkdown / JSONを更新して指示するだけ。コードの修正はエージェントが行う。**

## 0. 最優先ルール

1. **オーナーは手を動かさない。オーナーの役割は判断のみ。** 判断が必要な事項は「判断してほしいこと」として1か所にまとめて聞く
2. **リンクは `config/affiliates.json` にだけ書く。** LP本文・コンポーネントへのURL直書きは禁止（`validate-links.ts` が検出してビルドを止める）
3. **アフィリエイトリンクは `AffiliateButton.astro` 経由でのみ出力する。** rel=`noopener noreferrer nofollow sponsored` と計測属性が自動で付く
4. **PR表記は消さない。** `LpLayout.astro` 上部のバナー、ボタン横の「PR」、SNS投稿の `#PR` は必須
5. **数値・実績・口コミを創作しない。** 料金・特典は公式サイトで確認した値だけを `affiliates.json` の `specs` に入れ、`verifiedAt` を更新する。分からない値は空欄（「—」表示）にする
6. **`schema.org/Product` の構造化データは出力しない。** 使えるのは Article / BreadcrumbList / FAQPage / Organization
7. **SNSへの自動投稿・有料APIの呼び出し・新規課金はしない。** 投稿案の生成まで。投稿するかどうかはオーナー判断
8. **ダミー案件（`dummy: true`）のまま本番公開しない。** `npm run build:prod` がエラーで止める

## 1. ファイルの役割

| ファイル | 役割 | 誰が触るか |
|---|---|---|
| `content/campaigns/*.md` | LP1本分の設計図（ターゲット・悩み・訴求・比較列・ランキング・FAQ） | オーナーのメモ → エージェントが整形 |
| `config/affiliates.json` | 案件マスター（リンク・報酬・比較用スペック） | エージェント（オーナーはASPのリンクを渡すだけ） |
| `config/compliance-rules.md` | 法規制チェックリスト＋NGワード定義 | NGワード追加はここだけ |
| `config/design-system.md` | 配色・構成・CTAのルール | デザイン変更時 |
| `config/trends.json` | SNS投稿の時期ネタ | `/daily-growth` で更新 |
| `data/reports/*.csv` | GA4・ASPのレポート | オーナーがCSVを置く |
| `output/` | 生成物（SNS投稿案・分析レポート）。Gitには入れない | 自動 |

## 2. 新しいLPを作るとき

`/new-lp` の手順書（`.claude/commands/new-lp.md`）に従う。要点：

- `content/campaigns/_template.md` をコピーして作る。`slug` は半角英小文字とハイフン
- 最初は `status: draft` で作り、`npm run validate` と `npm run build` が通ってから `published` にする
- ランキング1位は「報酬単価」ではなく「ターゲットの悩みに一番合う案件」で選ぶ。報酬で順位を決める場合はオーナーに確認する

## 3. コピーライティングのルール

- `config/design-system.md` の「CVRを高めるLP構成」の順序を崩さない
- 見出しは「誰の・どんな悩みが・どうなるか」。CTAは「行動＋得られるもの」
- 「絶対」「必ず」「No.1」「最安」等は `compliance-rules.md` のNGワードに従う（出典なしで使わない）
- 薬機法の対象カテゴリ（化粧品・健康食品・医療機器）は `compliance.regulatedCategory` を必ず設定する

## 4. 完了の定義

以下を満たすまで「完了」と報告しない。

1. `npm run validate` がエラー0件
2. `npm run build` が成功し、postbuild の HTML チェックもエラー0件
3. 生成されたHTML（`dist/lp/{slug}/index.html`）に、案件名が個別のテキストとして出ていることを確認
4. 本番に公開した場合は、本番URLを実際に取得して確認する（取得できない場合は「確認できていません」と報告）
5. 警告（WARN）が残っている場合は、件数と内容を報告に書く

## 5. コマンド早見表

```bash
npm install            # 初回のみ
npm run dev            # http://localhost:4321/lp/sample-campaign/ で確認
npm run validate       # ソースチェック（NGワード・リンク直書き・案件の整合性）
npm run build          # 検証 → ビルド → HTMLチェック
npm run build:prod     # 本番用（ダミー案件・GA4未設定をエラーにする）
npm run validate:online # リンク先に実際にアクセスしてリンク切れ確認
npm run social         # SNS投稿案を output/social/{日付}/ に生成
npm run metrics        # data/reports/*.csv から改善提案を output/reports/ に生成
```

## 6. デプロイ

静的HTML（`dist/`）を出力するので、Cloudflare Pages / Vercel のどちらでもそのまま公開できる。

- ビルドコマンド：`npm run build:prod`　出力ディレクトリ：`dist`　ルートディレクトリ：`jarvis-affiliate`
- 環境変数：`.env.example` の `SITE_URL` `JARVIS_ENV=production` `PUBLIC_GA4_ID` などを管理画面に設定
- 新しいホスティング契約・独自ドメイン取得は課金を伴うため、オーナー判断事項
