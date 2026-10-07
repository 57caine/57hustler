#!/usr/bin/env bash
# CEO Dashboard: Supabase RLS 実動テスト
#
# 実データには一切触れない。架空のテストデータ（ラベル/名前に "RLS_TEST_TEMP" マーカーを
# 付与）のみを使い、終了時に必ず削除する。service_role keyは使用しない。
# 認証済みロール(authenticated)としてテストユーザーA/Bのアクセストークンを取得し、
# publishable key + 当該トークンのみでPostgREST(/rest/v1)を直接叩く。
#
# PASS/FAIL判定：
#   - 拒否されるべき操作は「4xxエラー」でも「200+0件(空配列)」でもPASSとする
#   - 許可されるべき操作は「2xx + 1件以上」でないとFAILとする
# 機密情報の扱い：
#   - アクセストークン・パスワード・ユーザーUUID・レコードUUIDは取得直後に
#     `::add-mask::` でGitHub Actionsのログマスク対象に登録し、意図的にも出力しない。
#   - 失敗時に原因診断のため出力するのはHTTPステータスとレスポンス本文のみ
#     （本文にはスキーマ上のエラーメッセージ以外の機密情報は含まれない）。

set -uo pipefail

: "${SUPABASE_URL:?required}"
: "${SUPABASE_PUBLISHABLE_KEY:?required}"
: "${RLS_TEST_USER1_EMAIL:?required}"
: "${RLS_TEST_USER1_PASSWORD:?required}"
: "${RLS_TEST_USER2_EMAIL:?required}"
: "${RLS_TEST_USER2_PASSWORD:?required}"

MARKER="RLS_TEST_TEMP"
FAIL_COUNT=0
RESP=/tmp/rls_resp.json

mask() { echo "::add-mask::$1" >&2; }

record() {
  local name="$1" ok="$2"
  if [ "$ok" = "1" ]; then
    echo "PASS: $name"
  else
    echo "FAIL: $name"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

row_count() {
  node -e "
    try {
      const d = require('fs').readFileSync('$1', 'utf8');
      const j = JSON.parse(d);
      console.log(Array.isArray(j) ? j.length : 0);
    } catch (e) { console.log(0); }
  " 2>/dev/null
}

first_id() {
  node -e "
    try {
      const d = require('fs').readFileSync('$1', 'utf8');
      const j = JSON.parse(d);
      console.log(Array.isArray(j) && j[0] && j[0].id ? j[0].id : '');
    } catch (e) { console.log(''); }
  " 2>/dev/null
}

first_owner() {
  node -e "
    try {
      const d = require('fs').readFileSync('$1', 'utf8');
      const j = JSON.parse(d);
      console.log(Array.isArray(j) && j[0] && j[0].owner_id ? j[0].owner_id : '');
    } catch (e) { console.log(''); }
  " 2>/dev/null
}

# 失敗診断用：レスポンス本文を出す(トークン等は含まれないPostgRESTのエラーメッセージのみ)
dump_on_fail() {
  echo "  response body for diagnosis: $(cat "$RESP" 2>/dev/null | head -c 500)"
}

# $1=method $2=path(query含む) $3=token(空なら未認証) $4=body(空ならなし) $5=extra header(任意)
req() {
  local method="$1" path="$2" token="$3" body="$4"
  local args=(-sS -o "$RESP" -w "%{http_code}" -X "$method" "${SUPABASE_URL}${path}"
    -H "apikey: ${SUPABASE_PUBLISHABLE_KEY}"
    -H "Content-Type: application/json"
    -H "Prefer: return=representation")
  if [ -n "$token" ]; then
    args+=(-H "Authorization: Bearer ${token}")
  fi
  if [ -n "$body" ]; then
    args+=(-d "$body")
  fi
  curl "${args[@]}"
}

login() {
  local email="$1" password="$2"
  curl -sS -o "$RESP" -w "%{http_code}" -X POST \
    "${SUPABASE_URL}/auth/v1/token?grant_type=password" \
    -H "apikey: ${SUPABASE_PUBLISHABLE_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${email}\",\"password\":\"${password}\"}" >/tmp/rls_login_status.txt
}

# ============================================================
# クリーンアップ(途中失敗でも必ず実行する。trapでも最後にも呼ぶ)
# ============================================================
cleanup() {
  echo "::group::cleanup"
  if [ -n "${TOKEN_A:-}" ]; then
    [ -n "${EDU_ID_A:-}" ] && req DELETE "/rest/v1/education_costs?id=eq.${EDU_ID_A}" "$TOKEN_A" "" >/dev/null
    [ -n "${FAMILY_ID_A:-}" ] && req DELETE "/rest/v1/family_members?id=eq.${FAMILY_ID_A}" "$TOKEN_A" "" >/dev/null
    [ -n "${ROW_X:-}" ] && req DELETE "/rest/v1/net_worth_items?id=eq.${ROW_X}" "$TOKEN_A" "" >/dev/null

    # マーカー付きの取り残しを一括掃除(id捕捉に失敗したケースの保険)
    req DELETE "/rest/v1/education_costs?label=eq.${MARKER}" "$TOKEN_A" "" >/dev/null
    req DELETE "/rest/v1/family_members?name=eq.${MARKER}" "$TOKEN_A" "" >/dev/null
    req DELETE "/rest/v1/net_worth_items?label=eq.${MARKER}" "$TOKEN_A" "" >/dev/null
  fi
  if [ -n "${TOKEN_B:-}" ]; then
    req DELETE "/rest/v1/education_costs?label=eq.${MARKER}" "$TOKEN_B" "" >/dev/null
    req DELETE "/rest/v1/family_members?name=eq.${MARKER}" "$TOKEN_B" "" >/dev/null
    req DELETE "/rest/v1/net_worth_items?label=eq.${MARKER}" "$TOKEN_B" "" >/dev/null
  fi
  echo "::endgroup::"
}
trap cleanup EXIT

# ============================================================
# セットアップ: ログイン
# ============================================================
echo "::group::login"
login "$RLS_TEST_USER1_EMAIL" "$RLS_TEST_USER1_PASSWORD"
STATUS_A=$(cat /tmp/rls_login_status.txt)
if [ "$STATUS_A" != "200" ]; then
  echo "FATAL: test_user_1のログインに失敗しました (status=$STATUS_A)"
  dump_on_fail
  exit 2
fi
TOKEN_A=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$RESP','utf8')).access_token || '')")
UID_A=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$RESP','utf8')).user.id || '')")
mask "$TOKEN_A"; mask "$UID_A"

login "$RLS_TEST_USER2_EMAIL" "$RLS_TEST_USER2_PASSWORD"
STATUS_B=$(cat /tmp/rls_login_status.txt)
if [ "$STATUS_B" != "200" ]; then
  echo "FATAL: test_user_2のログインに失敗しました (status=$STATUS_B)"
  dump_on_fail
  exit 2
fi
TOKEN_B=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$RESP','utf8')).access_token || '')")
UID_B=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$RESP','utf8')).user.id || '')")
mask "$TOKEN_B"; mask "$UID_B"

if [ -z "$TOKEN_A" ] || [ -z "$UID_A" ] || [ -z "$TOKEN_B" ] || [ -z "$UID_B" ]; then
  echo "FATAL: トークンまたはUUIDの取得に失敗しました"
  exit 2
fi
echo "login A/B: OK"
echo "::endgroup::"

# ============================================================
# 1. 未認証アクセス
# ============================================================
echo "::group::1. unauthenticated"
FAKE_ID="00000000-0000-0000-0000-000000000000"

STATUS=$(req GET "/rest/v1/net_worth_items?select=id&limit=5" "" "")
CNT=$(row_count "$RESP")
[ "$CNT" = "0" ] && record "1-1 未認証SELECT拒否" 1 || { record "1-1 未認証SELECT拒否" 0; dump_on_fail; }

STATUS=$(req POST "/rest/v1/net_worth_items" "" "{\"kind\":\"asset\",\"category\":\"cash\",\"label\":\"${MARKER}\",\"value_jpy\":1}")
CNT=$(row_count "$RESP")
if [ "$STATUS" -ge 400 ] 2>/dev/null || [ "$CNT" = "0" ]; then record "1-2 未認証INSERT拒否" 1; else record "1-2 未認証INSERT拒否" 0; dump_on_fail; fi

STATUS=$(req PATCH "/rest/v1/net_worth_items?id=eq.${FAKE_ID}" "" "{\"label\":\"x\"}")
CNT=$(row_count "$RESP")
if [ "$STATUS" -ge 400 ] 2>/dev/null || [ "$CNT" = "0" ]; then record "1-3 未認証UPDATE拒否" 1; else record "1-3 未認証UPDATE拒否" 0; dump_on_fail; fi

STATUS=$(req DELETE "/rest/v1/net_worth_items?id=eq.${FAKE_ID}" "" "")
CNT=$(row_count "$RESP")
if [ "$STATUS" -ge 400 ] 2>/dev/null || [ "$CNT" = "0" ]; then record "1-4 未認証DELETE拒否" 1; else record "1-4 未認証DELETE拒否" 0; dump_on_fail; fi
echo "::endgroup::"

# ============================================================
# 2. test_user_A による自分のデータのCRUD
# ============================================================
echo "::group::2. user A own data CRUD"

STATUS=$(req POST "/rest/v1/net_worth_items" "$TOKEN_A" "{\"kind\":\"asset\",\"category\":\"cash\",\"label\":\"${MARKER}\",\"value_jpy\":1}")
CNT=$(row_count "$RESP")
ROW_X=$(first_id "$RESP")
OWNER_OF_X=$(first_owner "$RESP")
[ -n "$ROW_X" ] && mask "$ROW_X"
if [ "$CNT" = "1" ] && [ "$OWNER_OF_X" = "$UID_A" ]; then record "2-1 A: INSERT成功・owner_id=A" 1; else record "2-1 A: INSERT成功・owner_id=A" 0; dump_on_fail; fi

STATUS=$(req GET "/rest/v1/net_worth_items?id=eq.${ROW_X}&select=id,label" "$TOKEN_A" "")
CNT=$(row_count "$RESP")
[ "$CNT" = "1" ] && record "2-2 A: SELECT成功(自分の行)" 1 || { record "2-2 A: SELECT成功(自分の行)" 0; dump_on_fail; }

STATUS=$(req PATCH "/rest/v1/net_worth_items?id=eq.${ROW_X}" "$TOKEN_A" "{\"label\":\"${MARKER}_updated\"}")
CNT=$(row_count "$RESP")
[ "$CNT" = "1" ] && record "2-3 A: UPDATE成功(自分の行)" 1 || { record "2-3 A: UPDATE成功(自分の行)" 0; dump_on_fail; }

STATUS=$(req POST "/rest/v1/net_worth_items" "$TOKEN_A" "{\"kind\":\"asset\",\"category\":\"cash\",\"label\":\"${MARKER}\",\"value_jpy\":1}")
ROW_Y=$(first_id "$RESP")
[ -n "$ROW_Y" ] && mask "$ROW_Y"
STATUS=$(req DELETE "/rest/v1/net_worth_items?id=eq.${ROW_Y}" "$TOKEN_A" "")
CNT=$(row_count "$RESP")
DELETE_OK=0
[ "$CNT" = "1" ] && DELETE_OK=1
STATUS=$(req GET "/rest/v1/net_worth_items?id=eq.${ROW_Y}&select=id" "$TOKEN_A" "")
CNT=$(row_count "$RESP")
[ "$DELETE_OK" = "1" ] && [ "$CNT" = "0" ] && record "2-4 A: DELETE成功・削除後は0件" 1 || { record "2-4 A: DELETE成功・削除後は0件" 0; dump_on_fail; }
echo "::endgroup::"

# ============================================================
# 3. owner_id 偽装
# ============================================================
echo "::group::3. owner_id spoofing"

STATUS=$(req POST "/rest/v1/net_worth_items" "$TOKEN_A" "{\"kind\":\"asset\",\"category\":\"cash\",\"label\":\"${MARKER}\",\"value_jpy\":1,\"owner_id\":\"${UID_B}\"}")
CNT=$(row_count "$RESP")
if [ "$STATUS" -ge 400 ] 2>/dev/null || [ "$CNT" = "0" ]; then record "3-1 A: owner_id=B偽装INSERT拒否" 1; else record "3-1 A: owner_id=B偽装INSERT拒否" 0; dump_on_fail; fi

STATUS=$(req PATCH "/rest/v1/net_worth_items?id=eq.${ROW_X}" "$TOKEN_A" "{\"owner_id\":\"${UID_B}\"}")
CNT=$(row_count "$RESP")
if [ "$STATUS" -ge 400 ] 2>/dev/null || [ "$CNT" = "0" ]; then UPDATE_SPOOF_BLOCKED=1; else UPDATE_SPOOF_BLOCKED=0; fi
STATUS=$(req GET "/rest/v1/net_worth_items?id=eq.${ROW_X}&select=id,owner_id" "$TOKEN_A" "")
STILL_OWNED_BY_A=$(first_owner "$RESP")
if [ "$UPDATE_SPOOF_BLOCKED" = "1" ] && [ "$STILL_OWNED_BY_A" = "$UID_A" ]; then record "3-2 A: 自分の行のowner_id書き換え拒否" 1; else record "3-2 A: 自分の行のowner_id書き換え拒否" 0; dump_on_fail; fi
echo "::endgroup::"

# ============================================================
# 4. test_user_B から A のデータへのアクセス
# ============================================================
echo "::group::4. user B accessing A's data"

STATUS=$(req GET "/rest/v1/net_worth_items?id=eq.${ROW_X}&select=id" "$TOKEN_B" "")
CNT=$(row_count "$RESP")
[ "$CNT" = "0" ] && record "4-1 B: AのデータをSELECTできない" 1 || { record "4-1 B: AのデータをSELECTできない" 0; dump_on_fail; }

STATUS=$(req PATCH "/rest/v1/net_worth_items?id=eq.${ROW_X}" "$TOKEN_B" "{\"label\":\"hacked\"}")
CNT=$(row_count "$RESP")
if [ "$STATUS" -ge 400 ] 2>/dev/null || [ "$CNT" = "0" ]; then record "4-2 B: AのデータをUPDATEできない" 1; else record "4-2 B: AのデータをUPDATEできない" 0; dump_on_fail; fi

STATUS=$(req DELETE "/rest/v1/net_worth_items?id=eq.${ROW_X}" "$TOKEN_B" "")
CNT=$(row_count "$RESP")
if [ "$STATUS" -ge 400 ] 2>/dev/null || [ "$CNT" = "0" ]; then record "4-3 B: AのデータをDELETEできない" 1; else record "4-3 B: AのデータをDELETEできない" 0; dump_on_fail; fi

STATUS=$(req GET "/rest/v1/net_worth_items?id=eq.${ROW_X}&select=id,label" "$TOKEN_A" "")
CNT=$(row_count "$RESP")
[ "$CNT" = "1" ] && record "4-4 A: Bの操作後も行が無傷で残っている" 1 || { record "4-4 A: Bの操作後も行が無傷で残っている" 0; dump_on_fail; }
echo "::endgroup::"

# ============================================================
# 5. education_costs と family_members の複合FK
# ============================================================
echo "::group::5. composite FK across owners"

STATUS=$(req POST "/rest/v1/family_members" "$TOKEN_A" "{\"name\":\"${MARKER}\",\"birth_year\":2015}")
CNT=$(row_count "$RESP")
FAMILY_ID_A=$(first_id "$RESP")
[ -n "$FAMILY_ID_A" ] && mask "$FAMILY_ID_A"
[ "$CNT" = "1" ] && record "5-1 A: family_members作成成功" 1 || { record "5-1 A: family_members作成成功" 0; dump_on_fail; }

STATUS=$(req POST "/rest/v1/education_costs" "$TOKEN_A" "{\"family_member_id\":\"${FAMILY_ID_A}\",\"label\":\"${MARKER}\",\"estimated_jpy\":1}")
CNT=$(row_count "$RESP")
EDU_ID_A=$(first_id "$RESP")
[ -n "$EDU_ID_A" ] && mask "$EDU_ID_A"
[ "$CNT" = "1" ] && record "5-2 A: 自分の子へのeducation_costs作成成功" 1 || { record "5-2 A: 自分の子へのeducation_costs作成成功" 0; dump_on_fail; }

STATUS=$(req POST "/rest/v1/education_costs" "$TOKEN_B" "{\"family_member_id\":\"${FAMILY_ID_A}\",\"owner_id\":\"${UID_B}\",\"label\":\"${MARKER}\",\"estimated_jpy\":1}")
CNT=$(row_count "$RESP")
if [ "$STATUS" -ge 400 ] 2>/dev/null || [ "$CNT" = "0" ]; then record "5-3 B: Aの子を自分名義で参照する複合FK拒否" 1; else record "5-3 B: Aの子を自分名義で参照する複合FK拒否" 0; dump_on_fail; fi

STATUS=$(req POST "/rest/v1/education_costs" "$TOKEN_B" "{\"family_member_id\":\"${FAMILY_ID_A}\",\"owner_id\":\"${UID_A}\",\"label\":\"${MARKER}\",\"estimated_jpy\":1}")
CNT=$(row_count "$RESP")
if [ "$STATUS" -ge 400 ] 2>/dev/null || [ "$CNT" = "0" ]; then record "5-4 B: owner_id=A偽装での参照拒否" 1; else record "5-4 B: owner_id=A偽装での参照拒否" 0; dump_on_fail; fi
echo "::endgroup::"

# ============================================================
# 6. クリーンアップ確認(trapで実行される前に能動的に確認)
# ============================================================
echo "::group::6. cleanup verification"
req DELETE "/rest/v1/education_costs?id=eq.${EDU_ID_A}" "$TOKEN_A" "" >/dev/null
req DELETE "/rest/v1/family_members?id=eq.${FAMILY_ID_A}" "$TOKEN_A" "" >/dev/null
req DELETE "/rest/v1/net_worth_items?id=eq.${ROW_X}" "$TOKEN_A" "" >/dev/null

STATUS=$(req GET "/rest/v1/net_worth_items?label=eq.${MARKER}&select=id" "$TOKEN_A" "")
CNT1=$(row_count "$RESP")
STATUS=$(req GET "/rest/v1/family_members?name=eq.${MARKER}&select=id" "$TOKEN_A" "")
CNT2=$(row_count "$RESP")
STATUS=$(req GET "/rest/v1/education_costs?label=eq.${MARKER}&select=id" "$TOKEN_A" "")
CNT3=$(row_count "$RESP")
if [ "$CNT1" = "0" ] && [ "$CNT2" = "0" ] && [ "$CNT3" = "0" ]; then
  record "6. テストデータが残っていない" 1
else
  record "6. テストデータが残っていない" 0
  echo "  残存件数: net_worth_items=$CNT1 family_members=$CNT2 education_costs=$CNT3"
fi
# EXITで再度cleanupが走るのを防ぐため、ここで取得したidを空にしておく
EDU_ID_A=""; FAMILY_ID_A=""; ROW_X=""
echo "::endgroup::"

# ============================================================
# 結果まとめ
# ============================================================
echo ""
echo "===== SUMMARY ====="
echo "FAIL_COUNT=${FAIL_COUNT}"
if [ "$FAIL_COUNT" -gt 0 ]; then
  echo "RESULT: FAIL"
  exit 1
else
  echo "RESULT: PASS"
  exit 0
fi
