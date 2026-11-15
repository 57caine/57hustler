# JARVIS 2.0 の実行ゲート（初期実装）

- `scripts/validate-links.ts` は `JARVIS_ENV=production` の公開対象LPごとに、需要・採算・ASP・品質・実験公開承認を検査し、不足があればビルドを停止する。
- `npm run gate:check -- --campaign <slug> --action experiment_publish` は同じ公開実験判定を単独実行する。
- `npm run gate:check -- --campaign <slug> --action scale` は、加えて実際の確定報酬、利益、再現性、**量産専用承認**を必要とする。
- `config/publication-gates.json` はデフォルトで存在しないため、本番判定は失敗する（fail closed）。根拠と許可が揃った場合だけ、検証済みデータを使って作成する。現行リポジトリには架空の承認を作らない。
- 必須証拠: `campaigns[slug].demand` (target, intent, evidenceUrl, checkedAt, competitiveDiff, organicChannel)、`asp` (status=approved, conditionsSource)、`quality` (complianceChecked=true, linksChecked=true)、`forecast` (sessions, sendRate, occurrenceRate, confirmationRate, rewardPerConversion, directCost, operationCost, minProfit, sessionsSource, rateSource, rewardSource, costSource)。
- 量産には `actual` (confirmedReward, cost, sessions, minProfit, reconciliation=matched, repeatabilityEvidence 2件以上) と、別のscale承認が必要。
- 承認は `approvals[]` にactionType、target、targetSha、specVersion=2.0、approver、approvedAt、evidenceRef、scopeを持つ。ビルド時の `GITHUB_SHA` または `JARVIS_RELEASE_SHA` が対象SHAと一致しなければ拒否する。
- **重要**：このJSONは本人認証や権限制御ではない。編集権限・CI環境の保護と、本人による明示的な承認記録の照合を別途必要とする。自己記入したJSONの内容だけで法的・業務上の許可を得たとみなさない。
- 事業別の利益判断は `#207` が行い、JARVISは根拠を提示する。現段階ではASPの成果同定・期間突合、取消照合、実データ確認は未完成。**実収益が実証されたという意味ではない**。
- `npm run test:gates` で拒否/許容の論理テストを実行する。既存 `refresh` は途中失敗で停止するよう変更している。
- 現行の公開は許可していない。テスト／ローカル実装／Draft PRまで。

## 署名による承認の真正性（2026-11-15）
- 公開・量産のどちらも `approval.signature` に、署名対象8項目（`actionType,target,targetSha,specVersion,approver,approvedAt,evidenceRef,scope`）の**順序固定配列JSON**を `HMAC-SHA256` で署名した64桁hex文字列を要求する。
- 検証時の秘密鍵 `JARVIS_APPROVAL_SECRET` は32文字以上、**保護された本番/CI環境のsecretでのみ管理**し、Git・Issue・画面・標準出力に書かない。署名が無い、鍵が無い、対象SHA/範囲が異なる場合は不合格。
- 署名は鍵を持つオーナーの明示判断に基づく管理手順が必要。AIが架空の署名や自己承認を生成してはならない。真正な署名があっても本人認証・GitHubブランチ保護や部署内承認に代わらない。
- 現在は秘密鍵も真正な承認ファイルもリポジトリに**存在しない**。従って実験公開も量産も停止する。
- 技術検証には `npm run test:safety` （承認・ASP照合・署名検証）を使用。公開対象LPの `npm run build:prod` 拒否も別途実行し、通過すれば直ちに公開してよいという意味ではない。
- 旧 `npm run metrics -- --no-sample` は安全側で停止する。従来CSVは成果ID、更新時刻、確定/取消/コホートを一意に証明できないため。実報酬の非公開検証は正規化済みの私有原本から `npm run reconcile:asp -- --file /private/report.json`、CEO向けの個票非公開集計は `npm run report:ceo -- --file /private/report.json --business <id>` を使う。元データのASP画面・CSV定義との突合は未実施。既存のCSVを自動で正規化できると約束しない。
- 生データや秘密鍵は `data/reports/`、`dist/`、Gitに保存しない。必ずGit管理外の安全な絶対パスに置く。
