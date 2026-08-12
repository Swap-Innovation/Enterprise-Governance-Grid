#!/usr/bin/env bash
# Wipe all nodes/relationships and reload seed data (keeps constraints).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

USER="${NEO4J_USER:-neo4j}"
PASS="${NEO4J_PASSWORD:-contracts-kg}"

echo "==> Deleting all graph data ..."
docker compose exec -T neo4j cypher-shell -u "$USER" -p "$PASS" --format plain \
  "MATCH (n) DETACH DELETE n;"

echo "==> Reloading ..."
"$ROOT/scripts/load.sh"
