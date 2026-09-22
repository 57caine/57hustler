@AGENTS.md

# 完了の定義（Definition of Done）―全作業に適用

以下を満たさない限り「完了しました」「反映されました」と報告してはならない。

1. **本番URLに実際にcurl/fetchして**、期待する内容が返ってきていることを自分で確認する
2. 「mainにpushした」「ビルドが成功した」は完了ではなく**途中経過**として報告する
3. 複数ページ・複数カテゴリーに関わる修正は、代表1件だけでなく**対象全件を機械的にチェック**する
4. 確認結果（fetchしたURLと実際のレスポンスの一部）を報告に含める
5. このルールに従えない場合は「確認できていません」と正直に報告する
6. ワークフローファイルでcheckout・pushするブランチが明示的に指定されている場合、それが **main** であることを毎回確認する。main以外のブランチが指定されているワークフローは、理由が明確でない限り不具合として扱う
7. 「本番ブランチ」に関する記述をCLAUDE.mdに残す場合、実際にVercelのProduction Branch設定と一致していることを確認してから記載する。憶測で記載しない

# プロジェクトルール（抜け漏れ防止）

## 構造化データ（JSON-LD）ルール（2026-07-29対応）

- **schema.org/Product の JSON-LD は出力禁止**（`app/product/[slug]/page.tsx` から削除済み）
- 理由：当サイトはアフィリエイト紹介のみで直販ではなく、`offers`・`review`・`aggregateRating` を継続的に正確に保守できないため、Google Search Consoleで「商品スニペット」エラーが発生した
- 商品カード（画像・商品名・価格表・リンク）はそのまま残してよい。構造化データのみ除去する
- 今後、商品カードを新規実装・改修する際も `'@type': 'Product'` は追加しない
- `BreadcrumbList`・`FAQPage`・`Article`・`Organization` の JSON-LD は引き続き使用可
- GSCの「商品スニペット」問題は次回Googlebotクロール時（通常数日〜数週間）に自動解消される見込み

## GA4 affiliate_clickイベント計測ルール（2026-07-28実装）

- lens-navi.jp・school.lens-navi.jp の全アフィリエイトリンクに `rel="sponsored"` を必須属性として付与する
- `rel="sponsored"` が付いたリンクのクリック時に GA4イベント `affiliate_click` を自動送信する
- イベントパラメータ: `affiliate_platform`（rakuten/a8）, `link_url`, `link_text`, `page_path`, `category`
- 実装ファイル: `components/AffiliateClickTracker.tsx`（lens-navi）/ `school-navi/components/AffiliateClickTracker.tsx`（school-navi）
- 今後追加するアフィリエイトリンクにも必ず `rel="noopener noreferrer nofollow sponsored"` を付けること（sponsored必須）
- GA4で確認: `affiliate_click` がカスタムイベントとして認識される（GA4管理画面 > レポート > リアルタイム）
- lens-navi GA4 Property ID: 520238223（測定ID: G-HQG2DVFTZG）
- school-navi GA4 Property ID: 539527147（測定ID: G-CPMBND5884）

## 収益化提案の大原則

- **オーナーは手を動かさない。自動化が前提。オーナーの役割は判断のみ。**
- アカウント作成・手動投稿・手動申請など「人手が必要な作業」を前提とする提案はしない
- 提案する施策はすべて「一度設定すれば自動で回る」仕組みであること
- 自動化できない初期設定は「1回だけの判断」として明示する

## アフィリエイトリンクの絶対ルール

### lens-navi（コンタクトレンズ）
- **必ず商品個別ページに遷移させること。ショップトップへの遷移は収益ゼロ。**
- A8.netショップのリンク生成ルール:
  ```
  最終URL = store.url（A8ベース）+ "&a8ejpredirect=" + encodeURIComponent(商品個別URL)
  ```
- 商品個別URLは `data/product-url-map.json` で管理
- A8ベースURLは `data/products.json` の stores[].url で管理
- `lib/products.ts` の `getPricesForProduct()` でこの組み合わせを行う
- Amazon: `product-url-map.json` のURL + `?tag=57plot-22`（アソシエイトID固定）
- 楽天: `product-url-map.json` の楽天アフィリエイトURL（hb.afl.rakuten.co.jp形式）

### school-navi / shikaku-navi
- **`affiliate_url` が `#` のときは官公式URLへ遷移しているが、アフィリエイト収益は発生しない**
- A8.netにスクール・資格スクールのプログラムを登録後、`scripts/fetch-school-links.ts` を実行すること
- 新スクール・講座を追加するときは必ず `official_url` を設定し、A8リンク取得後に `affiliate_url` を更新する
- `affiliate_url` に `#` 以外が設定されていても、`nofollow` は維持すること（rel="noopener noreferrer nofollow"）

### 全サイト共通
- **すべてのショップリンク・スクールリンクには必ずアフィリエイトタグを入れる**
- アフィリエイトリンクなしで外部に遷移するボタン・リンクは作らない
- 利益が発生しないリンクを本番に出すことは禁止
- **比較表からの遷移先は必ず商品個別ページ（アフィリエイトリンクつき）であること**
  - lens-navi: A8ベースURL + `&a8ejpredirect=` + 商品個別URL（`product-url-map.json`で管理）
  - ショップトップへ飛ぶリンクは収益ゼロなので絶対に出さない
- **比較表に表示する金額と遷移先の商品ページの金額は必ず一致させること**
  - 金額ズレは信頼損失・離脱の直接原因。ズレが起きたらスクレイピング設定を即修正する
  - ランダム変動・ハードコード・推定値は一切禁止。必ず実スクレイピングで取得した値を使う

### 楽天リンクとA8リンクの併記（lens-navi コラム記事）
- **A8提携済みショップ（22社）への言及箇所に楽天リンクがある場合、その直下に対応するA8リンクも必ず併記する**
- 楽天のみ・A8のみの片方だけの設置は禁止
- A8コードの対応表（`px.a8.net/svt/ejp?a8mat=` の後ろの識別子）:
  - レンズゼロ: `4B4176+5ZIYJE+76W+NV1XD`
  - アットレンズ: `4B4176+6D7XGA+20YY+TSBE9`
  - 24Lens: `4B4176+61WOYI+2GRU+HY7W1`
  - レンズクイック: `4B4176+6GSIB6+20YY+ZTFR6`
  - レンズモード: `4B8454+FEAMIQ+76W+65U41`
  - レンズファイン: `4B4176+6FLNVE+2GRU+1TJE9T`
  - レンズアップ: `4B4176+5YXIXM+2GRU+NY9O1`
  - レンズオン: `4B4176+5YC43M+2GRU+63WO1`
  - ふぁみーるコンタクト: `4B4176+5NMAFU+1PQI+5ZU29`
  - ティアラコンタクト: `4B4176+6CMHUI+2WGA+NUMHT`
  - レンズマルシェ: `4B4176+5LTZMI+2WGA+TTDZ5`
  - レンズボンバー: `4B4176+5L8K0Q+2WGA+BXYE9`
  - アットスタイル: `4B4176+5K1OT6+20YY+C0YF5`
  - アイライフコンタクト: `4B4176+5JG97E+PI2+5ZEMP`
  - クリアコンタクト: `4B4176+5KN4EY+PI2+HV7V5`
  - AREDZ: `4B4176+5IUTLM+2WGA+5YJRM`
  - 湘南コンタクト: `4B4176+5X584A+PI2+C33KY`
  - チャームカラー: `4B4176+6F07HU+1PQI+NVP2P`
  - OLENS: `4B4176+60PTQY+4XSA+5Z6WX`
  - モアコン: `4B4176+5XQNQ2+3S0E+639IP`

## 商品紹介・アフィリエイトリンク実装の品質基準

商品紹介セクション・カードを実装する際は、以下を必須とする。

1. **各商品には商品名を個別に明記すること**（例：「BoboVR S3 Pro」「メガネスタイル フレームCF5043」など）。「楽天市場で見る」「こちらから購入」のみのラベルで商品が特定できないリンク・ボタンは不可
2. **1商品 = 1リンクを原則とする**。複数商品をまとめて1つの汎用ボタンに集約しない
3. **可能な場合は商品画像も表示する**
4. **実装後、本番URLをfetchして「商品名が個別のテキストとして実際にレンダリングされているか」を確認してから完了報告する**。ビルドが通る・404にならないことは完了の条件を満たさない
5. **指示内容と実装が異なる可能性がある場合**（既存の共通コンポーネントを流用した等）は、その旨を報告に明記する

## 価格データの正確性ルール

- `scripts/update-prices.ts` は **Playwrightで実際のショップURLをスクレイピング** して価格を取得する
- ランダム変動（simulatePriceUpdate等）は絶対に使わない
- 取得失敗時は既存価格を保持する（タイムスタンプのみ更新）
- 価格変動が±40%を超えた場合は異常値として既存価格を保持する
- スクレイピング対象URLは `data/product-url-map.json` で管理
- Amazon・楽天はスクレイピング対象外（既存価格を保持）
- 比較表の価格と遷移先ページの価格を一致させることが最優先

## クロール頻度

- GitHub Actions で1日3回自動実行（6:00 / 14:00 / 22:00 JST）
- `.github/workflows/update-prices.yml` で設定
- GitHub無料枠: パブリックリポジトリは無制限、プライベートは月2000分
  - 1回10分 × 3回/日 × 30日 = 900分/月（プライベートでも余裕あり）
- 手動実行: GitHub Actions の `workflow_dispatch` で随時実行可能

## 作業前の確認ルール（二度手間防止）

- **既存の設定・登録状況を必ずコードで確認してから手順を案内する**
- A8.net / Amazon Associates / 楽天アフィリエイトの登録状況は会話履歴・コードから確認
- 「登録してください」と言う前に `grep -r "a8\|affiliate\|px.a8"` で確認
- 新機能追加前に関連ファイルを読んで現状把握してから作業開始
- **以前の会話で決定・実装した内容は CLAUDE.md に記録しておき、次回も踏まえた提案を行う**

## 比較表のソート機能

- `components/PriceTable.tsx`（lens-navi）：**全列にソートあり**（ショップ名・商品価格・送料・合計・処方箋）
- `school-navi/app/compare/CompareTable.tsx`：受講料・評価・スクール名でソート、カテゴリフィルター付き
- **新しい比較表を追加する際はすべての列にソート機能を実装すること**
- ソートなしの比較表を本番に出すことは禁止

## サイト構成メモ

| サイト | ディレクトリ | 本番ブランチ |
|--------|------------|------------|
| lens-navi（コンタクト） | `/`（ルート） | `main` |
| school-navi（プログラミングスクール） | `school-navi/` | `main` |
| shikaku-navi（資格） | `shikaku-navi/` | `main` |

## データファイル構成（lens-navi）

| ファイル | 役割 |
|---------|------|
| `data/products.json` | 商品・ブランド・カテゴリ・ショップ定義（A8ベースURL含む） |
| `data/prices.json` | 各ショップの価格データ（自動スクレイピングで更新） |
| `data/product-url-map.json` | ショップ×商品の個別URL（アフィリエイトリダイレクト先） |

## product-url-map.json の管理ルール

- 全24ストア × 55商品のマッピングを目標とする
- A8ストアは全て `product-url-map.json` に登録する（登録がないとショップトップ遷移になる）
- Amazon/楽天は既存のURLに `?tag=57plot-22` が含まれているか確認すること
- URL形式:
  - PIDシステム（lensup/lenson/lens24/lensfine）: `/products/os/pid/{PID}/`
  - GCシステム（lenszero/lensmode）: `/goods/index/gc/{GC}/`
  - 商品コードシステム（at-lens/lensquick/at-style）: `/item/{CODE}.html`

## カラースキーム

- メインカラー: `sky-600`（CTAボタン・ロゴ・アイコン）
- ヒーロー: `bg-gradient-to-br from-sky-500 to-blue-600`
- `slate-800` / `slate-900` / `gray-800` はCTAボタン・ヘッダー・フッターに使わない

## スクリプト一覧

| スクリプト | 役割 |
|-----------|------|
| `scripts/fetch-a8-links.ts` | A8.netからコンタクトレンズストアのアフィリエイトURL自動取得 |
| `scripts/fetch-school-links.ts` | A8.netからスクール・資格のアフィリエイトURL自動取得 |
| `scripts/update-prices.ts` | Playwrightで各ショップの実価格をスクレイピング |
| `scripts/generate-lens-navi-column.ts` | lens-naviコラム自動生成（Claude Haiku 4.5）。生成後、`column-compliance-check.ts`による公開前チェックを経て公開判定 |
| `scripts/column-compliance-check.ts` | コラムの公開前チェック（校正）。生成本体とは独立したAPI呼び出しで、裏付けのない数値・誇張表現・無出典の統計/実績記載をチェック。lens-navi専用ではなく汎用実装（school-navi等への横展開を想定） |

## コラム自動生成の公開前チェック（校正）ルール（2026-09-22実装）

- **対象範囲**: 現在はlens-naviのみ。school-navi等への横展開は未実装（要望あり次第対応）
- 生成（`generate-lens-navi-column.ts`／Claude Haiku 4.5）→ **公開前チェック（`column-compliance-check.ts`／同じくHaiku 4.5、独立したAPI呼び出し）** → 判定、の3段階
  - チェックはコストを抑えるため生成と同じ軽量モデル（Haiku 4.5）を使用。現行ラインナップで最も軽量なため、これより軽くする余地は現状ない
- チェック観点は以下の3点のみ（景品表示法の優良誤認・有利誤認リスク）:
  1. 裏付けのない具体的な数値（例:「ブランド数500以上」「満足度98%」）
  2. 「必ず」「絶対」等の断定的な誇張表現
  3. 出典が明示されていない統計・実績の記載
- **問題なし**: 従来通り`lib/columns.tsx`等に書き込み、自動公開（挙動は変更なし）
- **問題あり**: `lib/columns.tsx`等への書き込みをスキップ（=本番に出ない）。指摘箇所・理由・修正案を`data/column-review-queue.json`に記録
- レビューは今のところ人がGitHub上で`data/column-review-queue.json`を直接確認する運用（ダッシュボード等のUIは未実装）。問題なしと判断したら、`column`フィールドの内容を手動で該当ファイルに反映する
- ワークフロー（`.github/workflows/generate-lens-navi-column.yml`）の「Compliance check summary」ステップで、レビュー待ちが発生した場合はActionsログに`::warning::`として表示される

## CEOダッシュボード「改善レビュー」「アナリティクス」強化（2026-09-22実装）

- **常時最新データ表示**: `column-review`・`analytics`ページとも、`public/`配下のビルド時固定ファイルではなく`https://raw.githubusercontent.com/57caine/57hustler/main/data/*.json`を都度fetchする方式に変更。Vercelのデプロイが止まっていてもデータ自体は日次GitHub Actionsで更新され続けるため、ページ側は常に最新値を表示できる
- **改善レビューのステータス管理**: `data/column-review.json`の各項目に`status`（未対応/様子見/対応済み）・`priority`（high/medium/low）・`business`（事業名）・`source`（auto-ga4/manual）フィールドを追加。ダッシュボード上のセレクトボックスから直接変更可能（`/api/column-review/update`がGitHub Contents APIで`data/column-review.json`と`ceo-dashboard/public/column-review.json`の両方を書き換え）
- **事業ごとの分類**: 現状、自動検知（GA4ベース）はlens-naviのみ対応。school-navi・henkutsu・雑草おじさん・夜中のおじさん等、他事業の課題は「＋課題を手動追加」フォーム（`/api/column-review/add`）から手動登録する運用。自動検知の対象を広げる場合は別途対応が必要
- **優先度の並べ替え**: 各ステータスのセクション内で「優先度順」「セッション数順」を切り替え可能
- **再生成時の上書き防止**: `scripts/fetch-ga4-analytics.ts`は日次で`data/column-review.json`を再生成するが、既存の`status`（対応済み）・`priority`（手動設定分）・`source: 'manual'`の項目は再生成時も引き継がれる（`existingStatuses`/`existingPriorities`/`manualArticles`として読み込み、上書きしない）
- **前提条件**: `/api/column-review/*`・既存の`/api/memo/*`はいずれも`GITHUB_TOKEN`環境変数（GitHub Contents APIへの書き込み権限を持つトークン）が必要。Vercel側で未設定の場合、保存操作は失敗する

## Vercel Ignored Build Step（vercel.json ignoreCommand）ルール（2026-09-22対応）

- このリポジトリは実質6つの独立したVercelプロジェクトが同居するmonorepo。各プロジェクトのvercel.jsonに`ignoreCommand`を設定し、無関係な変更でのビルド発生を防いでいる
- lens-navi本体（ルートの`vercel.json`）以外の5プロジェクト（school-navi/shikaku-navi/shop-navi/yonaka-uranai/ceo-dashboard）は、いずれも自分のディレクトリ配下の差分のみを見る設計（例: `git diff --quiet HEAD^ HEAD -- ceo-dashboard`）のため、ルート直下の`data/*.json`の変更では反応しない
- **lens-navi本体だけは`.`（全体）を起点にしており、`data/`配下でlens-navi自身が使わないファイル（雑草ストック・仕組み名鑑・GA4・メモ・morning-brief等、自動bot生成の約26ファイル）の変更でも毎回フルビルドが発生していた**（2026-09-22発見・修正）
  - 原因調査で判明: **gitのpathspecは`':!data'`のようにディレクトリ全体を除外すると、後から`'data/prices.json'`のように個別ファイルを追加指定しても再度含めることができない**（除外が常に優先される）。そのため「dataを除外して一部だけ再度含める」形の指定はできず、**lens-naviが実際に使うファイルだけを個別に除外リストから外す（＝使わないファイルを1つずつ`:!`で列挙する）方式**で実装している
  - lens-navi本体が実際に使う`data/`配下のファイルは4つのみ: `prices.json`・`product-url-map.json`・`products.json`・`unsplash-cache.json`（`app/`・`components/`・`lib/`からの参照を`grep`で確認済み）
  - **今後`data/`配下に新しい自動生成ファイルを追加する場合、lens-navi本体が使わないファイルなら、ルート`vercel.json`のignoreCommandに`':!data/新ファイル名'`を追加すること**。追加を忘れると、そのファイルの更新のたびに不要なlens-naviビルドが発生し、Vercelの同時ビルド枠（On-Demand Concurrent Builds設定次第では特に1枠のみ）を圧迫し、他プロジェクト（CEOダッシュボード等）のデプロイがBlocked状態で滞留する原因になる
- 変更前後で実際の過去コミット5件（雑草ストック更新／価格更新／仕組み名鑑更新／GA4データ更新／トップページ刷新マージ）に対しignoreCommandを実行し、意図通りの判定（無視すべきものは無視、ビルドすべきものはビルド）になることを確認済み

## 完成前チェック（必須）

成果物を「完成」として提示する前に、必ずchecklist.mdの全項目を確認すること。
1つでも該当するものがあれば、提示せずに先に修正し、再度全項目を確認する。
チェック済みである旨を報告に含めること。ユーザーから指摘される前に
自分で差し戻す姿勢を徹底する。

## 実装後の反対監査ルール

コンテンツを新規作成・大幅改修した際は、実装完了後に別の視点で以下を意図的に疑って検査する（自己評価だけで済ませない）。

1. 実在しない商品名・サービス名・企業名が使われていないか
2. 裏付けのない具体的数値・統計・調査結果が使われていないか
3. 元の記事テーマと無関係な内容にすり替わっていないか（コピー&ペースト事故等）
4. 未実装のプレースホルダーがそのまま本番表示されていないか
5. rel="sponsored"等の品質基準が守られているか

検査結果は「問題なし」で終わらせず、疑って探した上で「見つからなかった」と明記する。
