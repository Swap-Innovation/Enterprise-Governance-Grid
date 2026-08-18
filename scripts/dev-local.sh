#!/usr/bin/env bash
# Start Neo4j Contracts KG + Enterprise Governance Grid (live mode).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KG="$ROOT/backend/neo4j"
APP="$ROOT/frontend"

die() { echo "ERROR: $*" >&2; exit 1; }

if ! command -v docker >/dev/null 2>&1; then
  die "Docker is required. Install Docker Desktop, then retry."
fi

if ! docker info >/dev/null 2>&1; then
  die "Docker daemon is not reachable. Start Docker Desktop and wait until it is ready."
fi

port_in_use() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
  else
    return 1
  fi
}

for port in 5173 8787; do
  if port_in_use "$port"; then
    die "Port $port is already in use. Stop the other process (or: lsof -iTCP:$port -sTCP:LISTEN) and retry."
  fi
done

echo "==> Starting Neo4j (contracts-kg)"
cd "$KG"
docker compose up -d

echo "==> Loading Contracts KG"
./scripts/load.sh

echo "==> Checking Bolt health"
if ! docker compose exec -T neo4j cypher-shell -u neo4j -p contracts-kg "RETURN 1;" >/dev/null 2>&1; then
  die "Neo4j did not accept Bolt connections after load."
fi

echo "==> Starting web UI + kg-api (live Neo4j)"
cd "$APP"
if [[ ! -d node_modules ]]; then
  npm install
fi

echo ""
echo "  Setup A · Live (Neo4j + kg-api)"
echo "  Web UI : http://127.0.0.1:5173/   (also http://localhost:5173/)"
echo "  Demo   : http://127.0.0.1:5173/demo/customer360/semantics"
echo "  KG API : http://127.0.0.1:8787/api/kg/health"
echo "  Neo4j  : http://127.0.0.1:7474  (neo4j / contracts-kg)"
echo "  SQ board: $ROOT/docs/strategy/16. Strategic Questions.md"
echo ""
echo "  Setup B · Mock (no Neo4j): $ROOT/scripts/dev-mock.sh"
echo "  Pages  : https://swapkodgire.github.io/Enterprise-Governance-Grid/"
echo ""

exec npm run dev
