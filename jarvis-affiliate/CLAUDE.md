# JARVIS-Affiliate 行動規範（このディレクトリ配下の作業すべてに適用）

アフィリエイトLPの量産・ASPリンク注入・SNS集客・計測改善を半自動で回す基盤です。
**オーナーは判断のみ。Markdown / JSON・コードの更新とデータ取得はエージェントが行う。**

---

## ⚠ JARVIS 2.0 ゲート（2026-11-14 Issue #209 追記）

**以下の項目は §2「新しいLPを作るとき」の旧手順より優先する。コード実装は未実施（NOT RUN）。仕様の詳細は `JARVIS-2.0-SPEC.md` を参照。**

1. **ビルド成功だけで `published` にしない。** 需要・予測採算・品質を確認し、#207の対象/範囲/SHAが一致する明示公開承認を確認するまで `status: draft` を維持する
2. **需要根拠と仮説が揃うまで新規量産しない。** 予測採算のみで量産しない。公開実験と量産の条件は仕様書§1-3で分離する
3. **架空口コミ・根拠なし数値で採算ゲートを通過させない。** 費用・工数が未取得の場合は `forecast_profit: null` で「利益未算出」と明記する
4. **Sample / demo データからゲート通過・承認を生成できない。** `--no-sample` フラグなしの `npm run metrics` 出力はゲート判定に使わない
5. **欠測フィールドは `null` と `0` を区別する。** `Number('')=0` 相当の変換は禁止。欠測は `null`、取得済みゼロは `0`
6. **#207 が唯一の経営意思決定台帳。** 量産承認・実験採択は JARVIS 側から出さず #207 に委ねる。`ceo-agent-state` の他担当状態を変更しない
7. **承認記録は権限境界そのものではない。** 一般の GO・ラベル・AI 自己申告 `approved=true` を包括承認にしない。仕様/SHA/範囲変更は再審査

---

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
| `data/reports/*.csv` | GA4・ASPのレポート | エージェントが既存無料・権限済み経路から取得。欠測は理由を記録 |
| `output/` | 生成物（SNS投稿案・分析レポート）。Gitには入れない | 自動 |

## 2. 新しいLPを作るとき

`/new-lp` の手順書（`.claude/commands/new-lp.md`）に従う。要点：

- `content/campaigns/_template.md` をコピーして作る。`slug` は半角英小文字とハイフン
- ~~最初は `status: draft` で作り、`npm run validate` と `npm run build` が通ってから `published` にする~~  
  **（2026-11-14 Issue #209 修正）** ビルド成功だけで `published` に変更しない。需要・採算ゲート確認と明示的な公開承認が必要。詳細は上記「JARVIS 2.0 ゲート」セクションおよび `/new-lp` 手順書ステップ 5b・6 を参照
- ランキング1位は「報酬単価」ではなく「ターゲットの悩みに一番合う案件」で選ぶ。報酬で順位を決める場合はオーナーに確認する

## 3. コピーライティングのルール

- `config/design-system.md` の「CVRを高めるLP構成」の順序を崩さない
- 見出しは「誰の・どんな悩みが・どうなるか」。CTAは「行動＋得られるもの」
- 「絶対」「必ず」「No.1」「最安」等は `compliance-rules.md` のNGワードに従う（出典なしで使わない）
- 薬機法の対象カテゴリ（化粧品・健康食品・医療機器）は `compliance.regulatedCategory` を必ず設定する

## 4. 完了の定義

文書のみの変更は差分・参照・矛盾を確認し、ビルド/実データ照合/本番確認は未実施と報告する。draftがビルド対象外ならHTML検証未実施とし、検証のためpublishedに変えない。以下はLPコード変更時に適用し、今回の公開許可ではない。

以下を満たすまで「完了」と報告しない。

1. `npm run validate` がエラー0件
2. `npm run build` が成功し、postbuild の HTML チェックもエラー0件
3. 生成されたHTML（`dist/lp/{slug}/index.html`）に、案件名が個別のテキストとして出ていることを確認
4. 本番に公開した場合は、本番URLを実際に取得して確認する（取得できない場合は「確認できていません」と報告）
5. 警告（WARN）が残っている場合は、件数と内容を報告に書く

## 5. 運用コンソール（/jarvis/）

- `npm run dev` で `http://localhost:4321/jarvis/` を開くと、LP一覧・案件マスター・SNS投稿案・改善提案・チェック結果・「今日の判断」が1画面で見られる
- データはビルド時に `config/` `content/` `output/` から読む。`npm run refresh`（`npm run dev` 実行時は自動）で最新化
- 報酬単価などの内部情報を含むため、本番ビルド（`JARVIS_ENV=production`）では生成しない。noindex
- 画面からは書き換えない（表示とコマンドのコピーのみ）。変更はコマンド経由でエージェントが行う

## 6. コマンド早見表

```bash
npm install            # 初回のみ
npm run dev            # http://localhost:4321/lp/sample-campaign/ で確認
npm run validate       # ソースチェック（NGワード・リンク直書き・案件の整合性）
npm run build          # 検証 → ビルド → HTMLチェック
npm run build:prod     # 本番用（ダミー案件・GA4未設定をエラーにする）
npm run validate:online # リンク先に実際にアクセスしてリンク切れ確認
npm run social         # SNS投稿案を output/social/{日付}/ に生成
npm run metrics        # data/reports/*.csv から改善提案を output/reports/ に生成
npm run refresh        # チェック・分析・投稿案をまとめて更新（コンソールの表示データ）
```

## 7. デプロイ

静的HTML（`dist/`）を出力するので、Cloudflare Pages / Vercel のどちらでもそのまま公開できる。

- ビルドコマンド：`npm run build:prod`　出力ディレクトリ：`dist`　ルートディレクトリ：`jarvis-affiliate`
- 環境変数：`.env.example` の `SITE_URL` `JARVIS_ENV=production` `PUBLIC_GA4_ID` などを管理画面に設定
- 新しいホスティング契約・独自ドメイン取得は課金を伴うため、オーナー判断事項

