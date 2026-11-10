<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Claude への受け渡しラベル（2026-11-05）

- `claude-task` または `claude-in-progress` ラベルが付いた Issue、および `claude/` で始まるブランチの PR は Claude の担当。他のエージェント・自走タスクは着手しない
- Claude 側は下書きPR作成までで、マージ・本番公開はしない。詳細は `docs/claude-task-handoff.md`

# CEO 運用グラフ（2026-11-10）

- CEO運用・集客改善・投稿継続の作業前に `docs/ceo-agent-graph.md` を読む。状態遷移、証拠付き合格条件、修正上限、次回再開条件を既存Issue/PRへ残す。
- 既存の事業別承認範囲とClaude専任ルールは維持する。本書の追加は新規課金・投稿方式変更・権限拡大への承認ではない。
