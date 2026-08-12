#!/usr/bin/env bash
# Load Contracts KG into Neo4j (constraints + Customer 360 E2E + contracts enrichment).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO="$(cd "$ROOT/../.." && pwd)"
APP="$REPO/frontend"
cd "$ROOT"

USER="${NEO4J_USER:-neo4j}"
PASS="${NEO4J_PASSWORD:-contracts-kg}"

echo "==> Waiting for Neo4j ..."
for i in $(seq 1 60); do
  if docker compose exec -T neo4j cypher-shell -u "$USER" -p "$PASS" "RETURN 1;" >/dev/null 2>&1; then
    break
  fi
  if [[ "$i" -eq 60 ]]; then
    echo "Neo4j not ready. Run: docker compose up -d"
    exit 1
  fi
  sleep 2
done

run_file() {
  local file="$1"
  echo "==> Applying $(basename "$file")"
  docker compose exec -T neo4j cypher-shell -u "$USER" -p "$PASS" -f "/cypher/$(basename "$file")"
}

run_file "$ROOT/cypher/00-constraints.cypher"
run_file "$ROOT/cypher/e2e-customer-360.cypher"
run_file "$ROOT/cypher/e2e-marketplace-families.cypher"
run_file "$ROOT/cypher/e2e-cross-pack-complete.cypher"

if command -v node >/dev/null 2>&1; then
  echo "==> Enriching from contracts/ (schemas, assets, mappings, federation)"
  (cd "$APP" && node "$ROOT/scripts/enrich-from-contracts.mjs")
else
  echo "WARN: node not found — skipped contracts enrichment"
fi

echo "==> Done. Open http://localhost:7474  (neo4j / contracts-kg)"
echo "    Show E2E: paste VIEW A/C from cypher/show-e2e-customer-360.cypher"
