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
