#!/usr/bin/env bash
# 落旅くんを Vercel に公開する（GitHub Actions から実行）。
#
# - Vercelプロジェクト「rakutabi」が無ければ作成する（GitHub連携はしない。
#   連携するとモノレポへの全pushでビルド判定が走り、他事業のデプロイ待ち行列を圧迫するため。
#   CLAUDE.md「Vercel Ignored Build Step」の障害履歴を参照）
# - 送客クリック記録用の Vercel Blob ストアが無ければ作成してプロジェクトに接続する（失敗しても公開は続行）
# - GitHub Actions 上でビルドし（vercel build）、ビルド済みの成果物だけをアップロードする（--prebuilt）。
#   Vercel側のビルド枠を使わないので、他プロジェクトのデプロイと競合しない
#
# 必要な環境変数: VERCEL_TOKEN
# このスクリプトは rakutabi/ ディレクトリで実行する。
set -euo pipefail

TEAM_ID="team_3ZA38DTbe02rLyjHXAaNuCs5"
PROJECT_NAME="rakutabi"
BLOB_STORE_NAME="rakutabi-clicks"
API="https://api.vercel.com"
AUTH="Authorization: Bearer ${VERCEL_TOKEN}"

echo "=== 1. Vercelプロジェクト ==="
code=$(curl -sS -o /tmp/project.json -w '%{http_code}' "${API}/v9/projects/${PROJECT_NAME}?teamId=${TEAM_ID}" -H "${AUTH}")
if [ "${code}" = "404" ]; then
  echo "プロジェクトが無いため作成します"
  curl -sS -X POST "${API}/v11/projects?teamId=${TEAM_ID}" -H "${AUTH}" -H 'Content-Type: application/json' \
    -d "{\"name\":\"${PROJECT_NAME}\",\"framework\":\"nextjs\"}" > /tmp/project.json
fi
PROJECT_ID=$(jq -r '.id // empty' /tmp/project.json)
if [ -z "${PROJECT_ID}" ]; then
  echo "プロジェクトの取得・作成に失敗しました:"; cat /tmp/project.json; exit 1
fi
echo "projectId=${PROJECT_ID} name=$(jq -r .name /tmp/project.json) rootDirectory=$(jq -r '.rootDirectory // "（なし）"' /tmp/project.json)"

echo "=== 2. 送客クリック記録用 Vercel Blob ストア ==="
(
  set +e
  curl -sS "${API}/v1/storage/stores?teamId=${TEAM_ID}" -H "${AUTH}" > /tmp/stores.json
  STORE_ID=$(jq -r --arg n "${BLOB_STORE_NAME}" '[.stores[]? | select(.name == $n)][0].id // empty' /tmp/stores.json)
  if [ -z "${STORE_ID}" ]; then
    echo "ストアが無いため作成します"
    curl -sS -X POST "${API}/v1/storage/stores/blob?teamId=${TEAM_ID}" -H "${AUTH}" -H 'Content-Type: application/json' \
      -d "{\"name\":\"${BLOB_STORE_NAME}\",\"access\":\"private\"}" > /tmp/store.json
    echo "作成結果: $(jq -c '{id: (.store.id // .id), name: (.store.name // .name), error}' /tmp/store.json)"
    STORE_ID=$(jq -r '.store.id // .id // empty' /tmp/store.json)
  fi
  echo "storeId=${STORE_ID:-（なし）}"
  HAS_ENV=$(curl -sS "${API}/v9/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}" -H "${AUTH}" | jq -r '[.envs[]?.key | select(startswith("BLOB_"))] | join(",")')
  if [ -n "${STORE_ID}" ] && [ -z "${HAS_ENV}" ]; then
    echo "ストアをプロジェクトに接続します"
    curl -sS -X POST "${API}/v1/storage/stores/${STORE_ID}/connections?teamId=${TEAM_ID}" -H "${AUTH}" -H 'Content-Type: application/json' \
      -d "{\"projectId\":\"${PROJECT_ID}\",\"envVarEnvironments\":[\"production\",\"preview\",\"development\"]}" | jq -c '{error} // .' | head -c 500; echo
    HAS_ENV=$(curl -sS "${API}/v9/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}" -H "${AUTH}" | jq -r '[.envs[]?.key | select(startswith("BLOB_"))] | join(",")')
  fi
  echo "プロジェクトのBlob関連の環境変数: ${HAS_ENV:-（なし。クリック記録は無効のまま公開します）}"
) || echo "Blobストアの準備に失敗しました（公開は続行します）"

echo "=== 3. ビルド・公開 ==="
export VERCEL_ORG_ID="${TEAM_ID}"
export VERCEL_PROJECT_ID="${PROJECT_ID}"

production_domain() {
  curl -sS "${API}/v9/projects/${PROJECT_ID}/domains?teamId=${TEAM_ID}" -H "${AUTH}" \
    | jq -r '[.domains[]?.name | select(endswith(".vercel.app"))][0] // empty'
}

build_and_deploy() {
  # Actions上のビルドではVercelのシステム環境変数が入らないため、本番URLを自分で渡す（lib/site-config.ts の SITE_URL）
  export VERCEL_PROJECT_PRODUCTION_URL="$(production_domain)"
  echo "VERCEL_PROJECT_PRODUCTION_URL=${VERCEL_PROJECT_PRODUCTION_URL:-（未割り当て）}"
  npx --yes vercel@latest pull --yes --environment=production --token="${VERCEL_TOKEN}" >/dev/null
  npx --yes vercel@latest build --prod --token="${VERCEL_TOKEN}"
  # ページ数が多く15,000ファイルの上限を超えるため、まとめて圧縮してアップロードする
  DEPLOY_URL=$(npx --yes vercel@latest deploy --prebuilt --prod --yes --archive=tgz --token="${VERCEL_TOKEN}")
  echo "deployment=${DEPLOY_URL}"
}

had_domain="$(production_domain)"
build_and_deploy
if [ -z "${had_domain}" ]; then
  # 初回は本番URLが公開後に割り当てられるため、URLが決まった状態でもう一度ビルド・公開する
  echo "初回公開のため、本番URLを反映して再公開します"
  build_and_deploy
fi

echo "=== 4. 公開URL（本番ドメイン） ==="
curl -sS "${API}/v9/projects/${PROJECT_ID}/domains?teamId=${TEAM_ID}" -H "${AUTH}" | jq -r '.domains[]?.name'
