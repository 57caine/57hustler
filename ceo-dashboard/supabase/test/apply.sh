#!/bin/sh
# Usage: apply.sh <psql connection args...>  e.g. apply.sh -h /tmp/pgrun -p 54329 -U postgres -d consensus_test
set -eu
DIR="$(cd "$(dirname "$0")" && pwd)"
psql "$@" -v ON_ERROR_STOP=1 -q -f "$DIR/bootstrap.sql"
for f in "$DIR"/../migrations/*.sql; do
  psql "$@" -v ON_ERROR_STOP=1 -q -f "$f"
done
psql "$@" -v ON_ERROR_STOP=1 -q -f "$DIR/tables.sql"
