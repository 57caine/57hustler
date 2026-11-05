# Claude への作業受け渡し手順（claude-task / claude-in-progress）
更新日：2026-11-05（JST）

## 目的
既存の自走タスク（ChatGPT「57hustler 集客改善の自走」毎朝8時JST、GitHub Actions の各ワークフロー）は止めずに、
Claude（Claude Code の予約タスク、1日1回）に楽旅くんの改善を個別に渡すための手順。
ラベルで「誰が持っている作業か」をはっきりさせ、同じ作業を二重に進めないようにする。

## CEO判断（2026-11-05）
- 既存の自走タスクは停止しない
- Claude は楽旅くん（`rakutabi/`）の改善を優先する
- 専用ラベルで既存タスクとの重複を防ぐ
- 予約タスクはまず1日1回
- Claude の実装は **下書きPR（Draft PR）作成まで**。本番公開・マージは禁止
- API従量課金・追加課金は禁止（`ANTHROPIC_API_KEY` 等を使う処理を新たに動かさない）

## ラベル
| ラベル | 意味 | 付ける人 |
|---|---|---|
| `claude-task` | Claude に任せる作業。予約タスクが拾う候補 | オーナー（またはオーナー指示を受けたChatGPT） |
| `claude-in-progress` | Claude が着手済み。他のエージェントは触らない | Claude（着手時） |

## 受け渡しの流れ
1. **依頼する（オーナー側）**：Issue を作り `claude-task` を付ける。テンプレート「Claude依頼（楽旅くん）」を使うと必要事項が埋まる。
   1 Issue = 1 件の改善。対象ページ・困っていること・完了の条件を書く。
2. **着手する（Claude）**：予約タスクが `claude-task` 付き・`claude-in-progress` なしの Open Issue を古い順に1件だけ選び、
   `claude-in-progress` を付けて「着手しました」とコメントする。
3. **実装する（Claude）**：`claude/rakutabi-issue-{番号}` ブランチで実装し、検証（`rakutabi/` で `npm run lint` と `npm run build`）を通して
   **Draft PR** を作る。PR本文に `Refs #{番号}`、変更内容、検証結果、戻し方を書く（`Closes` は使わない。マージはオーナー判断のため）。
4. **報告する（Claude）**：Issue に Draft PR のリンクと結果をコメントする。ラベルは `claude-in-progress` のまま残す（PRレビュー待ちの目印）。
5. **判断する（オーナー）**：Draft PR を確認し、マージするか見送るかを決める。終わったら Issue を閉じる。
   見送り・やり直しの場合は `claude-in-progress` を外せば、次回の予約タスクで再度拾われる。

## 止まるべき場面（Claude は実装せず Issue にコメントして終了）
- 同じ Issue を参照する Open PR が既にある（Claude 以外が作ったものも含む）
- 直近24時間以内に、同じ Issue へ Claude 以外のエージェントが作業中とコメントしている
- 作業内容が `rakutabi/` 以外に及ぶ、または下記の禁止事項に触れる
- 依頼内容が曖昧で、オーナーの判断なしには進められない

## Claude の禁止事項
- PR のマージ、本番公開（`rakutabi/scripts/vercel-deploy.sh` の実行、Vercel CLI、main への push）
- `.github/workflows/` の変更（公開処理や有料APIを使う処理が動く可能性があるため）
- `data/yonaka-feedback.json` の変更（push 時に有料APIを使うワークフローが起動するため）
- アフィリエイトURL・送客先・価格の計算式・計測の意味や範囲・noindex・認証/権限の変更
- 新規の有料サービス・API キーの利用

## 既存の自走タスク側のルール（重複防止）
- `claude-task` または `claude-in-progress` が付いた Issue、および `claude/` で始まるブランチの PR には着手しない
- `docs/rakutabi-growth-loop.md` の継続承認（小さな改善のマージ・公開）は既存タスク側のもので、Claude には適用しない
