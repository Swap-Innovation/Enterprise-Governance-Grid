#!/usr/bin/env bash
# Setup B — mock UI only (no Neo4j). Same scenarios as GitHub Pages.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="$ROOT/enterprise-governance-grid"

cd "$APP"
if [[ ! -d node_modules ]]; then
  npm install
fi

echo ""
echo "  Setup B · Mock (no Neo4j)"
echo "  Web UI : http://localhost:5173/"
echo "  Demo   : http://localhost:5173/demo/customer360/semantics"
echo "  Public : https://swapkodgire.github.io/Enterprise_governance_grid/"
echo "  SQ board: $ROOT/docs/16. Strategic Questions.md"
echo ""
echo "  Live Neo4j instead: $ROOT/scripts/dev-local.sh"
echo ""

exec npm run dev:mock
