# レポートCSVの置き場所

`npm run metrics` はこのフォルダのCSVを読み込みます。ファイル名の先頭で種類を判定します。

| 先頭 | 中身 | 取得方法 |
|---|---|---|
| `ga4-pages*.csv` | ページ別のセッション・エンゲージメント・affiliate_click数 | GA4「探索」→ 行=ページパス、値=セッション/エンゲージのあったセッション数/平均エンゲージメント時間/イベント数(affiliate_click) → CSVエクスポート |
| `ga4-clicks*.csv` | クリック位置別（placement×案件）の affiliate_click 数 | GA4「探索」→ 行=ページパス・カスタムディメンション placement・program_id、値=イベント数 |
| `asp*.csv` | ASPの成果レポート（案件別のクリック・発生・承認・報酬） | 各ASP管理画面の成果レポートをCSVでダウンロード |

列名は英語・日本語どちらでも読めます（例：`sessions` / `セッション`）。対応表は `scripts/analyze-metrics.ts` の `ALIASES` を参照。
`sample-` で始まるファイルは動作確認用のダミーです。実データを置いたら `--no-sample` で除外できます。
GA4で placement / program_id を使うには、GA4管理画面でイベントパラメータをカスタムディメンションに登録します（1回だけの設定）。
