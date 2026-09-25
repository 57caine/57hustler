#!/bin/sh
# lens-navi本体（ルートのVercelプロジェクト）のIgnored Build Step判定スクリプト。
#
# vercel.jsonのignoreCommandフィールドはVercel側のスキーマ制限で256文字までしか
# 書けない（2026-09-25発見。詳細はCLAUDE.mdの「Vercel Ignored Build Step」参照）。
# 以前は全ロジックをignoreCommand文字列に直書きしていたが、除外対象のdata/配下
# ファイルが増えるたびに文字数が伸び、1026文字まで達して制限を超過し、
# vercel.json自体がスキーマ検証エラーとなり本番デプロイが2026-09-22 17:43 UTC以降
# 全て失敗し続けていた。ロジックをこのスクリプトに切り出すことで、ignoreCommand
# 自体は短い固定文字列（`sh scripts/vercel-ignore-lens-navi.sh`）のまま保ち、
# 判定ロジック側は文字数制限を気にせず自由に拡張できるようにする。
#
# 判定方針:
#   - data/配下・他事業ディレクトリ（.github含む）以外に差分があれば build
#   - data/配下は、lens-navi本体が実際に使う4ファイルのみ差分を見る
#   - git diffコマンド自体がエラー（bad object等）の場合も安全側でbuildに倒す

PREV="${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}"

git diff --quiet "$PREV" HEAD -- . \
  :!school-navi :!shikaku-navi :!shop-navi :!yonaka-uranai :!ceo-dashboard :!.github :!data \
  :!CLAUDE.md :!AGENTS.md
CODE_DIFF=$?

git diff --quiet "$PREV" HEAD -- \
  data/prices.json data/product-url-map.json data/products.json data/unsplash-cache.json
DATA_DIFF=$?

if [ "$CODE_DIFF" = "0" ] && [ "$DATA_DIFF" = "0" ]; then
  exit 0
else
  exit 1
fi
