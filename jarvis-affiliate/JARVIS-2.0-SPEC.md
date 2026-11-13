# JARVIS 2.0 仕様書（2026-11-14 初版）

> **文書引継ぎのみ。コード実装・実データ照合・非公開実験は実施していない（NOT RUN）。**  
> 文書引継ぎ完了 ≠ 実装完了 ≠ 公開・収益実証完了

## 位置付けと権限境界

| 項目 | 内容 |
|---|---|
| 親 Issue | **#207**（唯一の CEO 経営再構築マスター台帳）。経営意思決定・実験採択・案件選定は #207 で行う |
| 本 Issue | **#209**（JARVIS 既存基盤への仕様組み込み）。仕様・指示の引継ぎ、既存資産の読取、ローカル検証、Draft PR まで |
| 本書の禁止事項 | 本番公開・新規課金・workflow 変更・main push・SNS 投稿設定変更・#207 の監査複製 |
| 元ブランチ | `claude/jarvis-affiliate-setup-m0vzj4`（着手時に最新 head SHA を記録すること） |

#207 との責任境界: JARVIS は証拠（ゲート結果・照合済み数値・欠測理由）を供給し、#207 がそれをもとに経営判断を行う。JARVIS 側から量産承認・実験採択を出さない。

---

## §1. 案件ゲート（需要・採算）

### 1-1. 案件マスタースキーマ（`config/affiliates.json` の各 `program` への追加フィールド）

**※スキーマ定義のみ。コード実装未実施。**

```json
{
  "gate": {
    "demand": {
      "target": "string（誰が・どんな状況で）",
      "intent": "string（購入意図・顧客課題）",
      "evidence_url": "string（一次根拠 URL）",
      "evidence_checked_at": "YYYY-MM-DD",
      "search_volume_source": "string | null（出典がない場合は null）",
      "competitive_diff": "string（既存無料代替との差）",
      "organic_channel": "string（既存無料集客経路）",
      "result": "pass | fail | insufficient_data",
      "reason": "string",
      "missing": "string（不足情報の具体的な記述）",
      "next_action": "string"
    },
    "profitability": {
      "forecast": {
        "sessions": "number | null",
        "sessions_source": "string（出典・期間・仮定を必ず記述）",
        "send_rate": "number | null（0–1）",
        "send_rate_source": "string",
        "asp_occurrence_rate": "number | null（0–1）",
        "asp_occurrence_rate_source": "string",
        "confirmation_rate": "number | null（0–1）",
        "confirmation_rate_source": "string",
        "reward_per_cv": "number | null（円）",
        "reward_per_cv_source": "string",
        "direct_cost": "number | null（円）",
        "operation_cost": "number | null（円）",
        "cost_note": "string（未取得の場合は「費用未取得のため利益未算出」と明記）",
        "labor_rate": "number | null（円/h。工数換算する場合のみ。直接利益とは別列）",
        "forecast_profit": "number | null（費用未取得なら必ず null）",
        "note": "string（幅・仮定の説明）"
      },
      "actual": {
        "period_start": "YYYY-MM-DD | null",
        "period_end": "YYYY-MM-DD | null",
        "confirmed_reward": "number | null（円）",
        "sessions": "number | null",
        "asp_clicks": "number | null",
        "confirmed_cvs": "number | null",
        "cost": "number | null（円）",
        "profit": "number | null（confirmed_reward − cost。どちらか null なら null）",
        "source_ref": "string（ASP 画面の CSV ファイル名または ID）",
        "reconciliation_status": "matched | unmatched | unattributed | pending | not_run",
        "note": "string"
      },
      "result": "pass | fail | insufficient_data",
      "reason": "string",
      "missing": "string",
      "next_action": "string"
    },
    "asp_contract": {
      "program_id": "string",
      "campaign_id": "string | null",
      "prohibited_expressions": ["string"],
      "regulated_category": "null | cosmetics | health_food | medical_device | finance | other",
      "status": "not_applied | pending | approved | rejected",
      "applied_at": "YYYY-MM-DD | null",
      "approved_at": "YYYY-MM-DD | null"
    }
  }
}
```

### 1-2. 採算計算式

採算は「予測」と「実績」を必ず分離して保持する。

```
予測利益 = 対象訪問数 × 送客率 × ASP発生率 × 確定率 × 報酬単価
         − 追加直接費 − 運用費
```

- 各率・単価には必ず出典・期間・仮定・幅を付ける
- 費用・工数が未取得なら `forecast_profit: null`（「費用未取得のため利益未算出」と明記）
- 工数換算利益は `labor_rate` を別記し、直接利益と合算しない
- 根拠のない率・架空口コミ・見かけの報酬単価で合格にしない

### 1-3. ゲート合格条件

| ゲート | pass | fail | insufficient_data |
|---|---|---|---|
| 需要 | 対象顧客・購入意図・課題に対応する一次根拠と確認日、競合との差、到達可能な無料集客経路、反証条件を確認。単にURLがあるだけでは pass にしない | 根拠なし数値のみ、架空口コミ | 根拠 URL 未取得 |
| 採算予測 | 各入力の出典・仮定・幅と費用/工数が揃い、#207で事前固定した最低利益・費用上限を満たす。値が揃うだけでは pass にしない | 出典なし率・架空単価で合格扱い | 費用・工数未取得 |
| 採算実績 | 確定報酬照合済み、費用/工数を確認し、事前固定した採算基準・観測分母・再現性条件を満たす（赤字を照合しただけでは pass にしない） | 発生≠確定を混同 | 照合未実施（`not_run`） |
| ASP 契約 | `approved`、禁止表現確認済み | `rejected`、規制カテゴリ未確認 | `pending` / `not_applied` |

**予測採算だけでは量産しない。需要根拠・仮説・予測採算・品質が揃えば公開実験の判断資料にはできるが、実験公開には別途明示承認が必要。量産は確定報酬・実績採算・再現性の合格と量産承認を必要とする。今回の公開は禁止。**

---

## §2. ASP 確定報酬照合スキーマ

**※スキーマ定義のみ。コード実装・実データ配置・照合実行は未実施（NOT RUN）。**

### 2-1. 照合レコード最小項目

```json
{
  "business_id": "string（例: jarvis-affiliate）",
  "experiment_id": "string | null",
  "campaign_id": "string | null",
  "program_id": "string",
  "asp": "a8 | moshimo | rakuten | other",
  "source": "csv_manual | api",
  "source_record_id": "string（重複排除キー。同一レコードの再取込は同じ最新状態に更新。古いスナップショットで巻き戻さない）",
  "period_start": "YYYY-MM-DD",
  "period_end": "YYYY-MM-DD",
  "timezone": "Asia/Tokyo",
  "cohort_basis": "occurrence_date | confirmation_date（発生日か確定日かを明示）",
  "fetched_at": "YYYY-MM-DDTHH:mm:ssZ",
  "source_updated_at": "YYYY-MM-DDTHH:mm:ssZ | null（原本の状態更新時刻）",
  "source_ref": "string（CSV ファイル名または ASP 管理画面 URL）",
  "status": "pending | confirmed | rejected | cancelled",
  "amount": "number | null（円。null = 未取得。0 = 取得済みでゼロ）",
  "currency": "JPY",
  "attribution_level": "program | campaign | lp（帰属可能な粒度のみ）",
  "data_quality": {
    "null_fields": ["string（null の列名リスト）"],
    "zero_substituted": "boolean（欠測を 0 に変換した場合は true）",
    "invalid_values": ["string（不正値の説明）"],
    "is_sample": "boolean（demo/sample データは true）",
    "diagnosis": "ok | warn | error | demo（error と demo は集計停止）"
  }
}
```

### 2-2. 照合ルール

**GA4 と ASP の区別**  
GA4 の `sessions` / `affiliate_click` イベントと、ASP の「クリック」「発生」「保留」「確定」「否認」「取消」は必ず別列に保持する。汎用「報酬額」を確定報酬と決めつけず、ASP 別の列定義を明示する。

**null / 未取得 / 0 の区別**  
- `null`: 未取得（取得を試みていない、または取得不能）
- `0`: 取得済みでゼロ
- 欠測フィールドを `0` に変換しない（`Number('')=0` 相当の扱い禁止）
- `data_quality.zero_substituted: true` のレコードは `diagnosis: error` として集計停止

**現在の `analyze-metrics.ts` の既知問題（NOT RUN: 修正未実施）**  
- `num()` 関数（L46）が非有限値を `0` に変換する。欠測と `0` を区別できていない  
- `campaign` 列欠落時に `program_id` で LP に帰属する処理（L109）は、案件が複数 LP に紐付く場合に二重計上し得る  
- `approvalRate` の分母が `conversions`（発生）であり保留コホートの定義が不明確  
これらは §6 の拒否テスト R-01 / R-07 / R-08 で検証すべき対象。

**同一期間・タイムゾーン・コホートのみ比較**  
発生月と確定月を加算して二重売上にしない。`cohort_basis` が異なるレコードを混在させない。

**再取込・重複 CSV**  
安定キーはASP/アカウント・媒体スコープ/source_record_idを組み合わせる。同一成果の発生→確定→取消は同じキーで最新状態へ更新し、重複CSV・期間重複・再取込で増やさない。原本の更新時刻を保持し、古いスナップショットで巻き戻さない。同時刻で矛盾・ID欠落・重複排除不能なら隔離し、採算判定を保留する。

**帰属ルール**  
`program_id` のみで複数 LP に配賦しない。帰属不能なら `attribution_level: "program"` で `unattributed` に 1 件だけ計上し、LP 別 EPC / RPS は「未算出」とする。GA4 との個票結合がなければ「集計照合」と表示し、因果・個票一致を主張しない。

**EPC / RPS 算出条件**  
- 確定 EPC = 帰属可能な確定報酬 ÷ 対応 ASP クリック。分母 0 / 欠測 / 期間不整合は「未算出」  
- RPS = 確定報酬 ÷ 対応セッション。分母 0 / 欠測は「未算出」  
- 承認率 = 確定件数 ÷ 同一コホートの判定済み件数（確定＋否認＋取消。取消は事前に固定したASP別定義で区分）（`status: "pending"` を否認と扱わない）

**sample / demo データ**  
`data_quality.is_sample: true` のレコードは `diagnosis: demo` として集計停止。demo からゲート通過・承認を生成できない。

---

## §3. 案件の状態機械

**※状態定義のみ。コード実装未実施（NOT RUN）。**

```
candidate
  ──[需要根拠あり]──────────────→ screened
  ──[insufficient_data]──────────→ 保留（needs: demand_evidence）

screened
  ──[採算予測 pass + ASP 契約 approved]──→ experiment_ready
  ──[採算 insufficient_data]─────────────→ 保留（needs: cost_data）
  ──[demand fail]────────────────────────→ rejected

experiment_ready
  ──[#207 でオーナー実験承認]──→ observing
     実行前に固定する項目:
     仮説 1 つ / 対象 1 導線 / 比較基準 / 観測期間 /
     分母・最小サンプル根拠 / 直接費上限 / 戻し方

observing
  ──[観測期間完了 + 確定報酬・採算・需要・再現性・品質の事前条件を評価]──→ validated | rejected | insufficient_data
     クリック: 7 日以上、発生: 14〜30 日、確定: ASP サイクル
     期限のみで確定待ちを成功/失敗にしない

validated
  ──[#207 でオーナー量産承認]──→ scale_pending
     validatedへ入る前の合格条件（すべて満たすこと）:
     ① confirmed_reward 照合済み（reconciliation_status: matched）
     ② 費用/工数確認済み、事前採算基準を満たす（単なる非nullでは足りない）
     ③ 需要ゲート pass
     ④ 再現性の根拠あり
     ⑤ 品質チェック通過

scale_pending
  ──[段階展開実施]──→ active（量産）

rejected / insufficient_data
  ──→ 保留または廃止（resume_when と理由を記録）
```

既存CEOグラフの状態機械は再実装しない。この状態は案件検証の属性として扱い、実行状態は既存形式を参照する。案件のobservingは既存observing、判断待ちはawaiting_approval、その他は次工程に応じqueued/verifying等へ対応付ける。別スケジューラ・常駐処理・監視・有料APIを作らない。

各段階に保存する属性: `evidence` / `condition_sha`（対象仕様バージョン）/ `owner` / `pass_condition` / `fail_condition` / `resume_when`

---

## §4. CEO 向け出力フォーマット（`output/ceo-report-{date}.json`）

**※フォーマット定義のみ。CEO ダッシュボードとの接続未実施（NOT RUN）。**

```json
{
  "schema_version": "2.0",
  "master_issue": 207,
  "task_issue": 209,
  "business_id": "string",
  "experiment_id": "string | null",
  "owner": "string",
  "status": "string（§3 の状態）",
  "commit_sha": "string",
  "observation_period": {
    "start": "YYYY-MM-DD | null",
    "end": "YYYY-MM-DD | null"
  },
  "source_refs": ["string"],
  "fetched_at": "YYYY-MM-DDTHH:mm:ssZ",
  "metrics": {
    "sessions":          { "value": "number | null", "unit": "sessions",    "missing_reason": "string | null" },
    "asp_clicks":        { "value": "number | null", "unit": "clicks",      "missing_reason": "string | null" },
    "confirmed_reward":  { "value": "number | null", "unit": "JPY",         "missing_reason": "string | null" },
    "cost":              { "value": "number | null", "unit": "JPY",         "missing_reason": "string | null" },
    "epc":               { "value": "number | null", "unit": "JPY/click",   "missing_reason": "string | null" },
    "rps":               { "value": "number | null", "unit": "JPY/session", "missing_reason": "string | null" }
  },
  "reconciliation_status": "matched | unmatched | unattributed | pending | not_run",
  "gate_results": {
    "demand":                   "pass | fail | insufficient_data",
    "profitability_forecast":   "pass | fail | insufficient_data",
    "profitability_actual":     "pass | fail | insufficient_data | not_run",
    "asp_contract":             "pass | fail | insufficient_data"
  },
  "next_action": "string",
  "resume_when": "string | null",
  "owner_decision": "string | null（#207 への判断依頼内容）"
}
```

---

## §5. 承認ゲートスキーマ（`config/approvals.json`）

**※スキーマ定義のみ。コード実装未実施（NOT RUN）。**

```json
{
  "approvals": [
    {
      "id": "string（approval-{YYYYMMDD}-{slug}）",
      "target": "string（案件 ID / LP slug / 実験 ID）",
      "limit": "string（例: この LP 1 件のみ / 観測期間 30 日まで）",
      "action_type": "experiment_publish | scale | merge | other",
      "target_sha": "string（対象コミット SHA）",
      "spec_version": "2.0",
      "approver": "string",
      "approved_at": "YYYY-MM-DDTHH:mm:ssZ",
      "evidence_ref": "string（#207 コメント URL 等）",
      "scope_note": "string（この承認が及ぶ範囲・及ばない範囲）"
    }
  ],
  "_note": "承認記録は権限境界そのものではない。仕様/SHA/範囲変更は再審査が必要。一般の GO・ラベル・AI 自己申告 approved=true を包括承認にしない。"
}
```

**承認が必要な操作（コード実装後に強制）**:  
- `status: draft` → `status: published` への変更  
- `scale_pending` → 量産実行  
- 実験ブランチの main マージ

**今回（Issue #209）の許可範囲**:  
仕様・指示・既存資産の読取・ローカル検証・Draft PR まで。  
本番公開・新規課金・workflow 変更・main push は禁止。

---

## §6. 拒否テスト計画

**本書執筆時点ではコード未実装。以下は後続コード実装時に実行すべきテストケースの定義のみ。テスト未実施。**

| # | ケース | 期待する動作 |
|---|---|---|
| R-01 | 原本の空欄・欠落・非数と、原本で確認済みの0を取り込む | 空欄等はnull/エラー、実測0は0を維持。変換前の原本で検査し、自己申告フラグだけに依存しない |
| R-02 | 不正数値（NaN、Infinity、数値列の文字列 "未確定"。負の取消調整額はASP定義を確認し別扱い） | `invalid_values` に記録 → `diagnosis: error` → 集計停止 |
| R-03 | `is_sample: true` のレコードを実データ判定ループに混入 | エラーで停止。`diagnosis: demo` → ゲート通過・承認を生成できない |
| R-04 | 期間不一致（開始>終了、およびGA4/ASPで期間・TZ・媒体・コホートが不一致） | バリデーションエラー。集計しない |
| R-05 | 同一 `source_record_id` の再取込（重複 CSV） | 上書き更新のみ。新規追加なし、合計変化なし |
| R-06 | 発生月コホートと確定月コホートを加算（二重計上） | `cohort_basis` の不一致エラー。二重売上に加算しない |
| R-07 | `campaign` 列なしで `program_id` のみで複数 LP に帰属 | `attribution_level: "lp"` を付与できない。`unattributed` で 1 件計上。LP 別 EPC/RPS は「未算出」 |
| R-08 | 保留コホート（`status: "pending"`）を否認扱いで承認率を計算 | `pending` をコホートから除外して計算。除外件数を明示 |
| R-09 | 費用 `null` のまま `profit` を算出 | `profit: null`、`cost_note` に「費用未取得」を記録。`profitability_forecast.result` = `insufficient_data` |
| R-10 | EPC / RPS の分母が 0 | `epc: null`、`rps: null`、`missing_reason: "分母0"` |
| R-11 | 承認レコードなしで `status: "published"` に変更 | エラー。`approvals.json` に該当エントリがない限り `published` 移行を拒否 |
| R-12 | `owner_decision` 未設定で `scale_pending` → 量産実行 | エラー。量産承認のない段階展開を拒否 |
| R-13 | 承認レコードの `target_sha` が現在の HEAD と不一致 | エラーとして実行拒否。仕様/SHA/範囲変更後は旧承認を無効化し再審査 |
| R-14 | 観測期間終了のみで確定待ち成果を「成功」と判定 | `status: "insufficient_data"`（`reconciliation_status: "pending"` の間は validated にしない） |
| R-15 | `attribution_level: "program"` のまま複数 LP の EPC/RPS を算出 | `epc: null`、`rps: null`、`missing_reason: "帰属不能（attribution_level=program）"` |

---

## §7. 未実施宣言（NOT RUN）

本仕様書は文書引継ぎのみ。以下は実施していない:

| 項目 | 状態 | 次の一手 |
|---|---|---|
| §1-2 ゲートフィールドのコード化（`affiliates.json` バリデーション） | **未実装** | 本Issueの後続工程で実装。§6 テストを合わせて実行 |
| §2 照合スキーマのコード実装（`scripts/reconcile-asp.ts` 等） | **未実装** | 本Issueの後続工程で実装 |
| §2 `analyze-metrics.ts` の `num()` / 二重計上修正 | **未修正**（既知問題） | §6 R-01 / R-07 / R-08 のテストと合わせて修正 |
| §3 状態機械のコード実装 | **未実装** | 本Issueの後続工程で実装 |
| §4 CEO ダッシュボードとの接続 | **未実装** | #207 の判断を待ち、既存 CEO ダッシュボードへの連携方式を決定 |
| §5 承認ゲートの強制チェック（ビルド・validate 連動） | **未実装** | 本Issueの後続工程で実装 |
| §6 拒否テストの実行 | **未実施** | コード実装後に実行。文書のみの現在はテスト未実施と明記 |
| 実 ASP データ（`data/reports/`）の配置・照合 | **未実施** | 実データはこのスナップショットに未提供。#207の取得済み・権限済みデータを再利用し、取得不可は原因と最小の本人認証だけを分離 |
| 非公開実案件 1 件の最小実証 | **未実施** | #207 が選ぶ候補案件確定後に実施。現時点で特定案件が採算合格とは断定しない |
| `config/approvals.json` の作成 | **未実施** | 承認ゲートコード実装時に合わせて作成 |

## §8. 非公開でのレンズナビ最小検証案と再開条件

#207が選定する既存の実案件1件と既存導線のデータだけを再利用する。PR #200の変更を複製せず、新しい事業監査・サイト・実験・監視は作らない。

1. エージェントが既存の無料・権限済み経路から取得済みデータを参照。日常のCSV配置をオーナーに要求しない。未取得は0にしない。本人認証が必要な場合だけ理由と最小操作を分離する。
2. 非公開ローカル原本で媒体・案件・期間・TZ・コホート・成果状態を照合し、重複排除→欠測判定→ゲート判定→CEO向け要約まで1件通す。入手できなければ技術fixtureのみとして収益実証未完と表示する。
3. localhost限定とし、外部プレビュー/デプロイは禁止。noindexだけを非公開の根拠にしない。本番GA4へイベントを送らない。広告の自己クリック・申込・購入で成果を作らない。
4. 原本、個人情報、Secrets、内部報酬をGit/Issue/公開HTMLへ保存しない。outputはGit除外のまま。原本は認証済みローカルに置き、CEOへ返すのは識別不能な集計・出典参照・欠測理由のみ。
5. 非公開処理の整合性は新LPの需要・CVR・売上増加の証明にならない。次の公開実験は#207の候補最大1件に統合し、仮説・観測分母・採否基準・費用上限0・戻し方を実行前に固定してオーナー判断へ。

再開条件: #207の案件選定、対象データ/無料取得経路の利用可否確認、コード実装と拒否テストの合格。文書反映・Draft PR作成と実装/実証完了を分離する。修正は1実行最大3巡、状態/証拠/対象SHA/次の一手/再開条件/戻し方を既存CEO形式で記録する。

追加拒否テスト（すべてNOT RUN）: 発生→確定→取消で売上が最新状態に一度だけ反映、古いCSVで取消が復活しない、期間が重なる複数CSV、承認の種別/案件/上限/仕様版不一致、照合済み赤字の採算pass拒否、再現性なしvalidated拒否。
