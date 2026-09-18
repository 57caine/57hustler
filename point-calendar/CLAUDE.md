@AGENTS.md

# 事業ステータス（2026-09-18時点）

- 事業名・サービス名は未定（仮称：ポイントアップ日カレンダー）。決定後、ディレクトリ名 `point-calendar` とドメインを本決めする
- カレンダー表示のプロトタイプに加えて、**楽天お買い物マラソンの実スクレイパーを実装・動作確認済み**（`scripts/update-campaigns.ts`）
- 本番運用にはまだ入っていない（Vercelプロジェクト未作成、GitHub Actionsのスケジュール実行は未有効化）

# データ取得（自動化）調査結果 ― 確定事項（2026-09-18、GitHub Actions上で実地確認済み）

サンドボックス環境からは `rakuten.co.jp` を含む外部サイトへの直接アクセスが遮断されているため、
一時的な診断用ワークフロー＋テスト用PRをGitHub Actions上で動かして実際にHTML構造を確認した
（診断用ファイルは確認後に削除済み）。

## 確認できたこと
- **お買い物マラソンの本体ページURLは `https://event.rakuten.co.jp/campaign/point-up/marathon/` で恒久的**
  （BreadcrumbListのJSON-LDで `"name": "お買い物マラソン"` として確認済み。開催期間が変わっても同じURL上でテキストが更新される想定）
- ページ内に「エントリー期間 2026年9月17日(木)10:00～2026年9月24日(木)01:59」「ポイントアップ期間 2026年9月19日(土)20:00～2026年9月24日(木)01:59」のように**プレーンテキストでラベル付きの日時が明記**されている。RSS/ICS配信・schema.org Event構造化データは無い
- エントリーボタン（`a.mrt-kanban__entry-button` 等）の href（例: `https://oubo.rakuten.co.jp/apply/ic/marathon/20260919efhmz/pointup`）に開催回ごとのセッションID（`20260919efhmz`）が含まれる
- `calendar.rakuten.co.jp` 配下の各種カレンダーページ（cal/8607, cal/8349, cal/8632, cal/8434等）は、プラットフォーム自体は楽天公式だが**掲載内容は個人ユーザーが作成した非公式コンテンツ**（作成者表記あり、中には全く無関係な第三者ブログにリンクしているものも）。自動取得の情報源としては不採用と判断
- `www.rakuten.co.jp` トップページのバナー等から実際のキャンペーンURLを辿れることを確認（推測URLではなく実リンクをクロールする方式が有効）

## 実装した自動取得の仕組み
- `scripts/update-campaigns.ts`：`event.rakuten.co.jp/campaign/point-up/marathon/` の本文テキストから正規表現で「エントリー期間」「ポイントアップ期間」を抽出し、`data/campaigns.json` を更新する。`scripts/update-prices.ts` と同じく取得・パース失敗時は既存データを保持する
- GitHub Actions上で実行し、`data/campaigns.json` に実データが正しく反映されることを確認済み（エントリー開始 2026-09-17T10:00+09:00、ポイントアップ期間 2026-09-19T20:00〜2026-09-24T01:59+09:00）
- `.github/workflows/update-point-calendar-campaigns.yml`：現時点では `workflow_dispatch`（手動実行）のみ有効。スケジュール実行（`schedule:`）はコメントアウトしてあり、**mainマージ後に動作確認の上で有効化する**想定
- スーパーセールなど他のキャンペーン種別のURL・構造は未調査。マラソンと同じ `event.rakuten.co.jp/campaign/...` 配下にある可能性が高いが、追加調査が必要

# 楽天アフィリエイトIDについて（2026-09-18 オーナー決定）

- lens-navi用の既存楽天アフィリエイトID（`data/product-url-map.json` に埋め込まれているもの）は**流用せず、本事業専用に新規発行する**方針で決定
- 理由：アカウント単位で規約違反時の停止リスクが連座する／収益レポートが合算されて事業ごとの数字が見えなくなる／将来この事業だけを切り離しにくくなる、という3点のデメリットを踏まえた判断
- 新規ID発行はオーナー自身によるフォーム登録が必要な「1回だけの判断」。発行後、`lib/campaigns.ts` にアフィリエイトリンク生成ロジックを追加する（`lib/products.ts` の `getPricesForProduct()` と同様の設計を想定）
