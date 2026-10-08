# 日本株研究用・最小バックテスト（未検証MVP）
実資金・注文・証券口座接続なし。Python標準ライブラリのみ。

## 使い方
`cd research/stocks && python -m unittest -v && python backtest.py adjusted_prices.csv`

入力CSV: `date,ticker,close`（日付はYYYY-MM-DD、closeは分割調整済み終値）。
入力データは利用規約を確認して各自用意し、GitHubへコミットしない。
**実データは未取得、実成績も未算出。**

## 重要な制限
- 現段階は動作検証用。全銘柄の共通営業日だけを使い、欠損や上場廃止を適切に扱えない。
- 株式分割調整は入力側の責任。配当・税金・流動性・スプレッドは未反映（税金は後述の`after_tax_summary`で別枠の簡易推定のみ）。
- 売買コストは片道20bpの仮定。シグナル翌観測日終値約定という仮定は現実の執行を保証しない。
- 生存者バイアス対策・再現可能なデータ取得は未実装。
- この結果から投資優位性を主張したり、実運用へ移行したりしてはならない。

## Phase 2: robustness audit（2026-10-08、`ROBUSTNESS_AUDIT.md`参照）
`backtest.run()`に`lot_size`（単元株、既定`None`=従来どおり分数株）を追加。
独立したbuy-and-holdベースライン・キャッシュベースライン（`baselines.py`）、
期間分割検証・感度分析（`time_split.py`）、月次リターン・最大ドローダウン持続期間・
最悪月（`metrics.py`）、生株価・equity curveを含まないコンパクトJSONレポートCLI
（`report.py`）を追加。詳細・既知の限界・Mac実行コマンドは`ROBUSTNESS_AUDIT.md`を参照。

## Phase 3: SBI S株（1株単位）モデルとlotサイズ比較（2026-10-08、`PHASE3_SKABU_COMPARISON.md`参照）
SBI証券S株（単元未満株、1株単位・公式情報で確認した約定タイミング・手数料ルールに基づく）
モデルを`skabu_model.py`に追加。既存の分数株モデル・100株モデルと、同一パラメータ・
buy-and-hold基準との比較CLI（`skabu_report.py`）を追加。日中の始値データが無いため
前場・後場始値約定パターンは非対応と明記。詳細・公式情報の出典・既知の限界・
Mac実行コマンドは`PHASE3_SKABU_COMPARISON.md`を参照。
