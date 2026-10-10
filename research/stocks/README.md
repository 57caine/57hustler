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

## Phase 4: 執行リアリズム・アウトオブサンプル検証（2026-10-08、`PHASE4_EXECUTION_REALISM.md`参照）
約定タイミングの前提を明示チェックする`execution_timing.py`（S-Kabu想定ウィンドウの
確認・取引暦の異常ギャップ検知）、Phase 2の期間分割にあった「ウォームアップ消費」問題を
修正した`walk_forward.py`、Phase 3の比較が分数株ベースラインのみを使っていた不整合を
修正した`skabu_model.py`のlot別ベースライン、約定失敗・1営業日遅延・コスト悪化・
流動性・集中度・配当/コーポレートアクションの不確実性を感度分析として扱う
`phase4_report.py`を追加。生株価・equity curveを含まないコンパクトJSONレポートCLI。
詳細・既知の限界・Mac実行コマンドは`PHASE4_EXECUTION_REALISM.md`を参照。

## Phase 5: 非偏向ユニバース・真のアウトオブサンプル検証（2026-10-09、`PHASE5_UNBIASED_VALIDATION.md`参照）
Phase 4の独立監査で発見・修正した実バグ（`rebalance_log`が3箇所のコンパクト出力に
漏れていた）と、「承認済み」と「実証済み」を混同しない明示フラグの追加。
現在のローカルデータには銘柄選定のpoint-in-time情報が無いため生存者バイアスは
解消不能と明記した上で、将来データが与えられた場合に備えたスキーマ・検証・
ユニバース構築（`universe.py`、合成フィクスチャのみ）を追加。パラメータを事前登録し
ハッシュで固定した上で、単一runのスライスではない真の時系列development/holdoutテストを
行う`preregistration.py`、1株buy-and-hold基準・集中度・turnover・コストを比較する
CLI（`phase5_report.py`、戦略パラメータのCLIフラグは意図的に非公開）を追加。
`data_required`・`bias_unresolved`・`oos_status`・`readiness_for_real_trading: false`の
明示フラグ付き。詳細・未解決の課題・Mac実行コマンドは`PHASE5_UNBIASED_VALIDATION.md`を参照。

## 実データ検証への移行可否チェック（2026-10-09、`DATA_READINESS_REPORT.md`参照）
`DATA_EXECUTION_GATE.md`に基づき、実データ検証へ移行できる状態かを確認（新規コードは
追加していない）。結論：このクラウド実行環境はJ-Quants・Stooq・Yahoo Finance等の
金融データ系ホストへの通信を全てブロックしており、実データ取得はオーナー自身のMac上
でしか行えない（Phase 1からの結論と同じ）。半導体・水関連を中心とした研究対象10銘柄の
候補選定（既存10銘柄が実質この構成だったことを確認・記録、購入推奨ではない）も含む。
詳細は`DATA_READINESS_REPORT.md`を参照。

## Phase 5追加検証：ウォームアップ修正とOOS固定期間の買いっぱなし比較（2026-10-09）
オーナーの実データ実行で判明した`preregistration.py`のバグ（検証期間が
lookback+3日未満だと必ず失敗する）を修正。開発期間末尾のlookback日分をウォームアップに
使い、ウォームアップ中の損益・取引はOOS成績から除外する（除外ロジック自体は合成データで
直接検証済み）。さらに`holdout_protocol_report()`に日付指定モード（`holdout_start`/
`holdout_end`）を追加し、固定OOS期間（既定: 2025-12-19〜2026-06-30）での戦略と
買いっぱなし比較を行う`oos_window_comparison.py`を新規追加。買いっぱなし側は戦略と
同一期間・同一初期資金・同一銘柄・同一コストで比較し、取引コスト・株数制約（単元株/分数株）・
銘柄選択バイアスを`known_constraints`として明示。既存テストはすべて維持し、新規23件を
追加（計225件）。詳細・Mac実行コマンドは`PHASE5_UNBIASED_VALIDATION.md`の
「Real-data follow-up fix」「Fixed-window OOS comparison」セクションを参照。

## Phase 6: 銘柄選択バイアスの低減・再現性検証（2026-10-09、`PHASE6_REPRODUCIBILITY_AUDIT.md`参照）
現行10銘柄の選定日・選定基準をリポジトリ全履歴・PRコメントから調査した結果、
**選定日・選定基準は不明（このリポジトリからは検証不能）**と確定（Phase 2時点の記載と
矛盾しない追加確認）。`universe.py`に複数の日付（リバランス日）にわたってPoint-in-Time
ユニバースを構築する`point_in_time_universe_series()`を追加（まだ`backtest.run()`への
統合は未実装、将来課題と明記）。J-Quants Freeで取得可能/不可能なデータを整理する
`data_availability.py`を新規追加し、過去の上場廃止銘柄リストが取得不可能である以上、
現在のティッカーリストを完全な歴史的ユニバースとして扱ってはならないことをコードで
強制（`assert_no_delisted_ticker_fabrication()`）。`bias_unresolved=true`は変更なし。
OOS期間の再利用を防ぐ`oos_ledger.py`＋`oos_ledger.json`を新規追加し、2025-12-19〜
2026-06-30を「reserved」（予約済み・実結果未報告）として記録。将来の新規データでの
時系列検証プロトコル（パラメータは事前登録済みハッシュで固定、過去成績を見て調整しない）を
設計・実装。既存テストは全件維持し、新規39件を追加（計264件）。詳細・未解決バイアス・
Mac実行コマンドは`PHASE6_REPRODUCIBILITY_AUDIT.md`を参照。
