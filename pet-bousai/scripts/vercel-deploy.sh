#!/usr/bin/env bash
# ペット防災（pet-bousai）を Vercel に「プレビュー」として公開する（GitHub Actions から実行）。
#
# - Vercelプロジェクト「pet-bousai」が無ければ作成する。GitHub連携はしない（楽旅くんと同じ方式。
#   連携するとモノレポへの全pushでビルド判定が走り、同時ビルド枠1の環境で他事業のデプロイを圧迫するため）
# - GitHub Actions 上でビルドし（vercel build）、成果物だけをアップロードする（--prebuilt）
# - このスクリプトは本番公開（--prod）を行わない。独自ドメインでの公開はオーナー承認後に別途追加する
# - 確認URLをオーナーがログインなしで開けるよう、このプロジェクトに限りプレビューの Vercel認証 を無効にする
#   （検索エンジン対策は、ページの noindex と X-Robots-Tag ヘッダーで行う）
#
# 必要な環境変数: VERCEL_TOKEN
# このスクリプトは pet-bousai/ ディレクトリで実行する。最後に PREVIEW_URL=... を出力する。
set -euo pipefail

TEAM_ID="team_3ZA38DTbe02rLyjHXAaNuCs5"
PROJECT_NAME="pet-bousai"
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
echo "projectId=${PROJECT_ID} name=$(jq -r .name /tmp/project.json)"
GIT_LINK=$(jq -c '.link // empty' /tmp/project.json)
if [ -n "${GIT_LINK}" ]; then
  echo "::error::VercelプロジェクトがGitリポジトリと連携しています（${GIT_LINK}）。想定外の公開経路になるため停止します"
  exit 1
fi
echo "GitHub連携: なし"
# 独自ドメイン・index 用の環境変数がプロジェクト側に入っていないこと（入っていると noindex が外れうる）
ENV_KEYS=$(curl -sS "${API}/v9/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}" -H "${AUTH}" | jq -r '[.envs[]?.key] | join(",")')
echo "プロジェクトの環境変数: ${ENV_KEYS:-（なし）}"
if echo ",${ENV_KEYS}," | grep -qE ',PET_BOUSAI_INDEXABLE,|,PET_BOUSAI_SITE_URL,'; then
  echo "::error::プロジェクトに PET_BOUSAI_INDEXABLE / PET_BOUSAI_SITE_URL が設定されています。この段階では公開しません"
  exit 1
fi
SSO=$(jq -c '.ssoProtection' /tmp/project.json)
if [ "${SSO}" != "null" ]; then
  echo "プレビューのVercel認証を無効にします（現在: ${SSO}）"
  curl -sS -X PATCH "${API}/v9/projects/${PROJECT_ID}?teamId=${TEAM_ID}" -H "${AUTH}" -H 'Content-Type: application/json' \
    -d '{"ssoProtection":null}' | jq -c '{ssoProtection, error}'
fi

echo "=== 2. ビルド・プレビュー公開 ==="
export VERCEL_ORG_ID="${TEAM_ID}"
export VERCEL_PROJECT_ID="${PROJECT_ID}"
unset PET_BOUSAI_INDEXABLE PET_BOUSAI_SITE_URL
npx --yes vercel@latest pull --yes --environment=preview --token="${VERCEL_TOKEN}" >/dev/null
npx --yes vercel@latest build --token="${VERCEL_TOKEN}"
PREVIEW_URL=$(npx --yes vercel@latest deploy --prebuilt --yes --token="${VERCEL_TOKEN}")
echo "PREVIEW_URL=${PREVIEW_URL}"

# 固定の vercel.app URL（初回公開時に Vercel が本番エイリアスとして割り当てたもの）も確認対象として出力する
PRODUCTION_ALIAS=$(curl -sS "${API}/v9/projects/${PROJECT_ID}/domains?teamId=${TEAM_ID}" -H "${AUTH}" \
  | jq -r '[.domains[]?.name | select(endswith(".vercel.app"))][0] // empty')
[ -n "${PRODUCTION_ALIAS}" ] && echo "PRODUCTION_ALIAS=https://${PRODUCTION_ALIAS}"
