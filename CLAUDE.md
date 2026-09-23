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
- **前提条件**: `/api/column-review/*`は`GITHUB_TOKEN`環境変数（GitHub Contents APIへの書き込み権限を持つトークン）が必要。Vercel側で未設定の場合、保存操作は失敗する

## CEOダッシュボードをナビゲーション2タブに縮小（2026-09-23対応）

オーナー指示により、上部ナビゲーションを「改善レビュー」「アナリティクス」の2つのみに絞った。
それ以外のページ・機能（ダッシュ/夜中/FX/社員/レポート/棚卸し/仕組み/評価/henkutsu/メモ）は
**ページ・APIルートごと完全削除**した（非表示ではなく削除。オーナーから両方の選択肢を提示され、
孤立ルートがURL直打ちで残る余地をなくすため削除を選択）。

- 削除したルート: `app/yonaka` `app/fx`（+`journal`/`risk`） `app/office` `app/reports` `app/audit`
  `app/systems` `app/evaluation` `app/henkutsu` `app/memo`
- 削除したAPIルート: `app/api/fx-data` `app/api/generate` `app/api/henkutsu/approve` `app/api/memo/*`
- ルート`/`（旧ダッシュボードトップ）は`redirect('/column-review')`に置き換え。サイトを直接開いた場合も
  改善レビューが表示される
- `components/Nav.tsx`のリンクを`改善レビュー`・`アナリティクス`の2件のみに変更
- 残す2ページ（`column-review`・`analytics`）およびそのAPIルート（`api/column-review/*`）は無変更
- **これらのページが読んでいたdata/*.jsonを更新する既存の自動化ワークフロー（morning-brief.yml等）は
  今回停止していない**。ページ側で表示されなくなるだけで、データ自体は引き続き生成され続ける
  （無害だが、恒久的に不要と判断すれば別途ワークフロー停止も検討可）
- ビルド確認（`route (app)`一覧が`/`・`/analytics`・`/column-review`・`api/column-review/*`のみになることを確認）、
  Playwrightで実レンダリング確認（ナビが2タブのみ・削除ルートが404・ルートが`/column-review`へリダイレクト
  されることを確認済み）

## Vercel Ignored Build Step（vercel.json ignoreCommand）ルール（2026-09-22対応）

- このリポジトリは実質6つの独立したVercelプロジェクトが同居するmonorepo。各プロジェクトのvercel.jsonに`ignoreCommand`を設定し、無関係な変更でのビルド発生を防いでいる
- lens-navi本体（ルートの`vercel.json`）以外の5プロジェクト（school-navi/shikaku-navi/shop-navi/yonaka-uranai/ceo-dashboard）は、いずれも自分のディレクトリ配下の差分のみを見る設計（例: `git diff --quiet HEAD^ HEAD -- ceo-dashboard`）のため、ルート直下の`data/*.json`の変更では反応しない
- **lens-navi本体だけは`.`（全体）を起点にしており、`data/`配下でlens-navi自身が使わないファイル（雑草ストック・仕組み名鑑・GA4・メモ・morning-brief等、自動bot生成の約26ファイル）の変更でも毎回フルビルドが発生していた**（2026-09-22発見・修正）
  - 原因調査で判明: **gitのpathspecは`':!data'`のようにディレクトリ全体を除外すると、後から`'data/prices.json'`のように個別ファイルを追加指定しても再度含めることができない**（除外が常に優先される）。そのため「dataを除外して一部だけ再度含める」形の指定はできず、**lens-naviが実際に使うファイルだけを個別に除外リストから外す（＝使わないファイルを1つずつ`:!`で列挙する）方式**で実装している
  - lens-navi本体が実際に使う`data/`配下のファイルは4つのみ: `prices.json`・`product-url-map.json`・`products.json`・`unsplash-cache.json`（`app/`・`components/`・`lib/`からの参照を`grep`で確認済み）
  - **今後`data/`配下に新しい自動生成ファイルを追加する場合、lens-navi本体が使わないファイルなら、ルート`vercel.json`のignoreCommandに`':!data/新ファイル名'`を追加すること**。追加を忘れると、そのファイルの更新のたびに不要なlens-naviビルドが発生し、Vercelの同時ビルド枠（On-Demand Concurrent Builds設定次第では特に1枠のみ）を圧迫し、他プロジェクト（CEOダッシュボード等）のデプロイがBlocked状態で滞留する原因になる
- 変更前後で実際の過去コミット5件（雑草ストック更新／価格更新／仕組み名鑑更新／GA4データ更新／トップページ刷新マージ）に対しignoreCommandを実行し、意図通りの判定（無視すべきものは無視、ビルドすべきものはビルド）になることを確認済み
- **CEOダッシュボード専用の追加対応（2026-09-22）**: `fetch-ga4-analytics.yml`が書き込む`ceo-dashboard/public/ga4-analytics.json`・`ceo-dashboard/public/column-review.json`の2ファイルは、`column-review`・`analytics`ページがGitHub raw経由の取得に切り替わったことで実際には使われなくなっている（上記参照）。この2ファイルの更新だけでceo-dashboardの不要ビルドが発生しないよう、`ceo-dashboard/vercel.json`のignoreCommandにも個別除外を追加した

### 【最重要】`HEAD^` はVercelのシャロークローン環境で信頼できない（2026-09-23発見・全6プロジェクト修正）

CEOダッシュボードのデプロイが何度pushしても「Blocked」のまま更新されない問題を、Vercel API（`v6/deployments`）で
直接デプロイ履歴を調査して根本原因を特定した。

- **症状**: `data/`ファイル除外や自動コミット停止などの輻輳対策を行った後も、ceo-dashboardの実コード変更
  （`ceo-dashboard/vercel.json`自体の変更を含む）が反映されなかった
- **原因**: Vercel API上の実際のデプロイ記録を確認したところ、該当コミットは
  `"errorMessage": "The deployment was canceled because the Ignored Build Step command returned exit code 0."`
  として**Vercel側でスキップされていた**。ところが同じコミットに対して**ローカルで同じ`git diff --quiet HEAD^ HEAD`を
  実行すると`exit 1`（差分あり＝ビルドすべき）が返る**——つまりVercel側とローカル側で判定結果が食い違っていた
  - 原因は**マージコミット**。このセッションの全pushは`git merge --no-edit`で作られたマージコミットであり、
    Vercelのビルド環境はシャロークローン（浅い履歴）でこのコマンドを実行するため、マージコミットに対する
    `HEAD^`の解決がローカルのフル履歴環境と異なる結果になり、実際には差分があるのに「差分なし」と誤判定していた
  - この結果、**mainへの通常のマージコミットpushによる本番反映が、該当ディレクトリに変更があっても
    構造的に機能しない状態**になっていた（CEOダッシュボードに限らず、理論上は他5プロジェクトも同じ設計のため
    同様のリスクがあった）
- **対処**: 全6プロジェクトのvercel.jsonで、`HEAD^`を**Vercelが公式に提供する`$VERCEL_GIT_PREVIOUS_SHA`
  環境変数**（実際に最後にデプロイされたコミットのSHA）に置き換えた:
  `git diff --quiet "${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}" HEAD -- ...`
  （`VERCEL_GIT_PREVIOUS_SHA`が未設定の場合＝初回デプロイ等のみ`HEAD^`にフォールバック）
- ローカルで実際に問題が起きたコミット（`d4bdb00`）に対し、`VERCEL_GIT_PREVIOUS_SHA`をその親コミットのSHAに
  設定した状態で新しいignoreCommandを実行し、`exit 1`（正しくビルド対象と判定）になることを確認済み

### 続報: `VERCEL_GIT_PREVIOUS_SHA`だけでも不十分だった（同日・追加修正）

上記の修正をデプロイしたところ、**今度はデプロイが`ERROR`状態**になった。Vercel APIでエラー内容を確認すると
`Command failed with exit code 128: ... fatal: bad object <SHA>`。

- 原因: `VERCEL_GIT_PREVIOUS_SHA`（最後に成功したデプロイのコミットSHA）自体は正しいが、CEOダッシュボードは
  ずっと同じ古いデプロイ（`dpl_F9gg...`）で止まっていたため、このSHAが**非常に古いコミット**を指しており、
  **Vercelのシャロークローンがそこまで履歴を持っていなかった**（`fatal: bad object`）
- ignoreCommandのシェルコマンド自体がエラー終了すると、Vercelは「ビルドを続行」ではなく**デプロイ全体をERROR扱い**にする
  （非ゼロ終了コードなら常にビルドが進むわけではない）
- **最終対処**: `git diff`の結果を明示的に判定し、**「差分なし」と確実に判定できた場合のみskip、それ以外
  （差分あり・コマンドエラー含む）は常にbuildする**安全側フォールバックに変更:
  ```
  git diff --quiet "${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}" HEAD -- <対象パス>; [ "$?" = "0" ] && exit 0 || exit 1
  ```
  - `git diff --quiet`の終了コードが`0`（差分なし）のときだけ明示的に`exit 0`（skip）
  - `1`（差分あり）でも`128`等（bad object等のgitエラー）でも`exit 1`（build）に倒す
- ローカルで3パターン（差分なし／差分あり／存在しないSHA指定によるbad objectエラー）すべてで
  意図通りの終了コードになることを確認済み
- **今後、ignoreCommandを新規作成・変更する際は`HEAD^`を直接使わず、`"${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}"`を
  使い、かつ`git diff`の終了コードを上記パターンで明示判定すること**。`HEAD^`単体はマージコミット＋
  シャロークローンの組み合わせで信頼できず、`VERCEL_GIT_PREVIOUS_SHA`単体も参照先コミットがシャロークローンの
  深度外だと`fatal: bad object`でデプロイごとERROR化するリスクがある

### 続報2: 「Ignored Build Step command returned exit code 0」は実際のignoreCommand結果とは限らない（2026-09-23発見）

上記のignoreCommand修正を全6プロジェクトにデプロイした後、CEOダッシュボードのナビ2タブ化コミット
（`ceo-dashboard/`配下で3599行削除という明確な差分を持つコミット）が、何度pushしても同じ
`"The deployment was canceled because the Ignored Build Step command returned exit code 0."`
というエラーでキャンセルされ続ける事象が発生した。ローカルで同じコマンドを正しい引数
（実際のコミットSHAを明示的に代入）で再現しても`exit 1`（ビルドすべき）が返り、矛盾していた。

- **原因**: このエラーメッセージは、Vercel側の同時ビルド枠が1（On-Demand Concurrent Builds: Disabled）の
  環境で、**後続のpushが先行のビルド中（またはビルド開始直後の）デプロイを横取り（supersede）してキャンセルした
  場合にも同じ文言で表示される**、ということが判明した。Vercel API（`v13/deployments/{id}`）の
  `buildSkipped`フィールドで確認したところ、キャンセルされたデプロイの多くが`buildSkipped: false`
  （＝ignoreCommandによる本当のスキップではなく、実際にビルドが開始された後でキャンセルされた）だった
  - 本セッションでの調査自体（検証用ワークフローの追加・削除を繰り返しpush）が、皮肉にも同じ問題を
    自ら再発させていた。1つのpushをした後、結果を確認しようとしてすぐ次のpush（検証ワークフローの追加等）を
    行うと、それ自体が前のデプロイをキューから追い出してキャンセルしてしまう
- **教訓・今後の対応**:
  1. **本番へのpushは連続させず、1つのデプロイが`READY`または確実に`CANCELED`（ignoreCommandによる
     意図的なスキップ）で完結するまで、新たなpushを行わない**。目安として数分単位で間隔を空ける
  2. デプロイ状態の確認そのものにpush（新規コミット）を使わない。確認用のGitHub Actions
     ワークフローファイルは一度pushしたら`workflow_dispatch`で繰り返し再実行し、内容を使い回す
     （ワークフローファイルの中身を毎回書き換えてpushし直すと、その一時調査push自体が本番デプロイの
     キューを再度動かしてしまい、確認したい対象のデプロイを横取りしてしまう）
  3. Vercel API（`v6/deployments`）の`errorMessage`だけで「ignoreCommandがおかしい」と判断せず、
     `v13/deployments/{id}`の`buildSkipped`・`buildingAt`フィールドまで確認すること。
     `buildSkipped: false`かつ`buildingAt`が設定されていれば、それはignoreCommandの問題ではなく
     キュー詰まり（同時ビルド枠不足＋連続push）が原因である可能性が高い
- この事象を機に、CEOダッシュボードのナビ2タブ化コミットは、pushを完全に止めて1つのデプロイが
  完了するのを待つことで正常に本番反映された（`dpl_F3PZU8MWrdQVZbZGMLes977aoRji`で確認）

## 自動コミットワークフローの一時停止（2026-09-22、オーナー承認済み）

CEOダッシュボードのVercel Production デプロイが「Blocked」状態のまま滞留する問題の調査で、
高頻度の自動コミットがVercelの同時ビルド枠（On-Demand Concurrent Builds: Disabled）を
圧迫していることが一因と判明。以下2つを一時停止した（`on:`トリガーをコメントアウトし
`workflow_dispatch`のみ残す形。再開時はコメントを外すだけで復元可能）。

| ワークフロー | 停止内容 | 理由 |
|---|---|---|
| `update-index.yml`（仕組み名鑑自動更新） | `push`トリガー（scripts/・.github/workflows/への全push）を停止 | 事業運用に無関係な内部ドキュメント。開発セッション中は特に高頻度に発火していた |
| `zassou-stock.yml`（雑草ストック更新） | `schedule`（1日3回）を停止 | 雑草おじさん事業の投稿ネタ在庫生成。既存在庫が尽きる前に再開を検討すること |

**停止していないもの**: `update-prices.yml`（価格・アフィリエイトリンク自動更新、1日3回）は収益直結のため対象外。
その他、実投稿処理そのもの（Threads/X/Instagram投稿系ワークフロー）も事業運用に必要なため停止していない。

なお、lens-navi本体・CEOダッシュボードとも上記のignoreCommand修正により、これらの自動コミットで
不要なVercelビルドは既に発生しなくなっているため、輻輳対策としての「停止」の必要性自体は
低下している。今回の停止は主にGitHub Actions実行分・コミット数削減が目的。

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
