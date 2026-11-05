<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Claude への受け渡しラベル（2026-11-05）

- `claude-task` または `claude-in-progress` ラベルが付いた Issue、および `claude/` で始まるブランチの PR は Claude の担当。他のエージェント・自走タスクは着手しない
- Claude 側は下書きPR作成までで、マージ・本番公開はしない。詳細は `docs/claude-task-handoff.md`
