#!/bin/sh
# Real HTTPS + real Next.js + real PostgreSQL end-to-end. Requires: openssl, psql, a running PostgreSQL
# reachable with PGURL (superuser) and `npm run build` already done. No cloud service, no paid API.
set -eu
cd "$(dirname "$0")/../.."
: "${PGURL:?set PGURL, e.g. postgres://postgres@localhost:5432/postgres}"
W=$(mktemp -d); trap 'kill $(cat $W/pids 2>/dev/null) 2>/dev/null || true; pkill -f "next-server|next start" 2>/dev/null || true' EXIT
DBNAME=consensus_https_e2e
psql "$PGURL" -q -c "drop database if exists $DBNAME" -c "create database $DBNAME" >/dev/null
BASEURL=$(echo "$PGURL" | sed "s#/[^/?]*\(\?.*\)\?\$#/$DBNAME\1#")
# apply schema using psql connection string
sh supabase/test/apply.sh "$BASEURL"
openssl req -x509 -newkey rsa:2048 -nodes -days 1 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" -keyout $W/key.pem -out $W/cert.pem 2>/dev/null
SHIM=54330; NEXT=3101; TLS=8443
node scripts/test-support/postgrest-shim.mjs $SHIM "$BASEURL" & echo $! >> $W/pids
export MCP_BRIDGE_ENABLED=true CONSENSUS_OAUTH_TOKEN_EXCHANGE_ENABLED=true CONSENSUS_OAUTH_AUTHORIZATION_ENABLED=true
export CONSENSUS_OAUTH_ISSUER=https://localhost:$TLS
export CONSENSUS_OAUTH_SIGNING_SECRET=$(openssl rand -hex 32)
export CONSENSUS_OAUTH_CLIENTS='[{"clientId":"claude","name":"Claude","redirectUris":["https://claude.ai/api/mcp/auth_callback"]},{"clientId":"chatgpt","name":"ChatGPT","redirectUris":["https://chatgpt.com/connector_platform_oauth_redirect"]}]'
export CONSENSUS_OAUTH_RATE_LIMIT_PER_MIN=120 CONSENSUS_OAUTH_DCR_ENABLED=true CONSENSUS_SHARED_RATE_LIMIT=true
export NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:$SHIM SUPABASE_SERVICE_ROLE_KEY=test-not-a-real-key NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=test-not-a-real-key
npx next start -p $NEXT -H 127.0.0.1 >$W/next.log 2>&1 & echo $! >> $W/pids
node scripts/test-support/tls-proxy.mjs $TLS $NEXT $W/key.pem $W/cert.pem & echo $! >> $W/pids
i=0; until curl -s -o /dev/null --cacert $W/cert.pem https://localhost:$TLS/.well-known/oauth-authorization-server; do i=$((i+1)); [ $i -gt 60 ] && { echo "server did not start"; tail -20 $W/next.log; exit 1; }; sleep 1; done
NODE_EXTRA_CA_CERTS=$W/cert.pem E2E_BASE=https://localhost:$TLS E2E_ISSUER=https://localhost:$TLS E2E_PLAIN_HTTP=http://127.0.0.1:$NEXT E2E_DB="$BASEURL" node scripts/test-support/https-e2e.mjs
echo "server log tail (must contain no secrets):"; tail -5 $W/next.log
grep -Ei "refresh_token|access_token|signing|service" $W/next.log && { echo "SECRET LEAK IN LOGS"; exit 1; } || echo "no token/secret material in server log"
