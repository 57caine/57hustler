@AGENTS.md

# プロジェクトルール（抜け漏れ防止）

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
| lens-navi（コンタクト） | `/`（ルート） | `claude/bold-brahmagupta-uc9Mu` |
| school-navi（プログラミングスクール） | `school-navi/` | 同上 |
| shikaku-navi（資格） | `shikaku-navi/` | 同上 |

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
