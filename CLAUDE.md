@AGENTS.md

# プロジェクトルール（抜け漏れ防止）

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
- Amazon: `product-url-map.json` のURL + `?tag=アソシエイトID`
- 楽天: `product-url-map.json` のURL + 楽天アフィリエイトパラメータ

### school-navi / shikaku-navi
- `affiliate_url` が `#` のときは `official_url` にフォールバック（実装済み）
- 新しいスクール・講座を追加するときは必ず `official_url` を設定すること

## 作業前の確認ルール（二度手間防止）

- **既存の設定・登録状況を必ずコードで確認してから手順を案内する**
- A8.net / Amazon Associates / 楽天アフィリエイトの登録状況は会話履歴・コードから確認
- 「登録してください」と言う前に `grep -r "a8\|affiliate\|px.a8"` で確認
- 新機能追加前に関連ファイルを読んで現状把握してから作業開始

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
| `data/prices.json` | 各ショップの価格データ |
| `data/product-url-map.json` | ショップ×商品の個別URL |

## カラースキーム

- メインカラー: `sky-600`（CTAボタン・ロゴ・アイコン）
- ヒーロー: `bg-gradient-to-br from-sky-500 to-blue-600`
- `slate-800` / `slate-900` / `gray-800` はCTAボタン・ヘッダー・フッターに使わない
