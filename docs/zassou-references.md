# 雑草おじさん 施策・型リファレンス

DMMアフィリエイト（雑草おじさんキャラクター）関連で、うまくいった設定・型・注意点を残すメモ。
新しい施策を試すときはここに追記し、うまくいかなかった場合も「なぜ」を残す。

## 現在の運用状態（2026-09-22時点で全停止中）

- ストック自動生成ワークフロー（`.github/workflows/zassou-stock.yml`）は **schedule無効化済み**。`workflow_dispatch` の手動実行のみ可能
- X投稿の自動化は未実装（コード・ワークフローとも存在しない）
- 停止の経緯・確認ログはPR #9（squash commit `edff3fb`）参照

## うまくいっている型（DMMストック生成）

- ジャンル配分: 熟女40〜45%、人妻/NTR/若妻/フェラを残りに分散（`HITS_PER_GENRE`）。VRジャンルは意図的に除外
- サブスクCTA挿入比率: 新規10件につき1件（`ctaCount = Math.floor(newItems.length / 10)`）
- 親投稿プロンプト: 「（女優名/作品特徴）。小生の（愚息/老眼鏡/血圧等の自虐オチ）である。」型、25〜35文字、命令形で終わらせない
- リプライ投稿: 商品の魅力→購入リンク誘導文、100文字以内
- 拒否レスポンス検知・フォールバック文言（`isRefusal` / `fallbackComment` 等）を実装済み。Claude Haiku 4.5がガードレールに引っかかった場合の自動置換がある

## 既知の課題・リスク

1. **スプレッドシート同期は一方向（JSON→Sheet）で、逆方向はない**
   `scripts/sync-zassou-to-sheets.ts` は `values.clear` → `values.update` のみで、シート側の値を読み取る処理（`values.get`）が存在しない。
   → 人がシート上で「投稿済み」チェックボックスを手動でONにしても、次回同期時にJSON側の`posted:false`で**上書きされて消える**。運用復帰時はこの一方向性を前提にする（逆方向反映を作るなら`values.get`でシートを読み、`posted`列と`zId`を突き合わせてJSONに書き戻す処理が必要）。
2. `data/zassou-posted.json` の `postedIds` は現状空配列のまま運用されている（投稿が自動化されていないため実質未使用）。
3. `data/zassou-stock.json` の `posted` フィールドは全件 `false`（自動投稿が一度も本番稼働していないため）。

## 参考にした運用ルール

- DMMアフィリエイトID: `nsplot-003`（通常）/ `nsplot-990`（API用）
- X投稿は手動運用（従量課金コストのため自動化しない）
- スプレッドシートID: `1buk2IktTAiEv7-g4UIqYkMGV7qF1sUgGviXsNdzsuL4`
