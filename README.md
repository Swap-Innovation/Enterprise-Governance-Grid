# Enterprise Governance Grid

Standalone copy of the **Enterprise Governance Grid** POC: marketing + demo tenant site, Neo4j contracts knowledge graph, pitch docs/examples, and the connected **10. Contracts** packs.

## Two ways to run

| Mode | Who | Semantics data |
| --- | --- | --- |
| **Live (local)** | You / demos on your machine | Real Neo4j + kg-api Cypher (Q1–Qn) |
| **Mock (GitHub Pages)** | Public share link | Bundled JSON graph (Q1–Q3 mock scenarios) |

### Public mock demo (GitHub Pages)

**URL:** [https://swapkodgire.github.io/Enterprise_governance_grid/](https://swapkodgire.github.io/Enterprise_governance_grid/)

Static marketing + demo UI. Semantics uses mock Q1 / Q2 / Q3 over `customer-context-graph.json` (no Neo4j).

### Live local (Neo4j + kg-api)

Requires Docker.

```bash
# One-shot: start Neo4j, load Contracts KG, run web + API
chmod +x scripts/dev-local.sh
./scripts/dev-local.sh
```

Or step by step:

```bash
# 1) Neo4j Contracts KG
cd neo4j-contracts-kg && docker compose up -d && ./scripts/load.sh

# 2) Site + KG API (live mode)
cd ../enterprise-governance-grid && npm install && npm run dev
```

| URL | Role |
| --- | --- |
| http://127.0.0.1:5173/ | Web UI |
| http://127.0.0.1:5173/demo/customer360/semantics | Live knowledge graph |
| http://127.0.0.1:8787/api/kg/health | KG API health |
| http://127.0.0.1:7474 | Neo4j Browser (`neo4j` / `contracts-kg`) |

If Neo4j is down while running `npm run dev`, Semantics automatically falls back to the same mock graph used on Pages.

### Mock UI only (local, no Docker)

```bash
cd enterprise-governance-grid && npm install && npm run dev:mock
```

## Layout

| Path | Role |
| --- | --- |
| `enterprise-governance-grid/` | Vite + React app + KG API |
| `neo4j-contracts-kg/` | Docker Neo4j + Cypher seed/load scripts |
| `docs/` | POC documentation |
| `examples/` | Pitch / graph JSON (static fallback) |
| `connected-data/10. Contracts/` | Business, Technical, Data Products, Semantic Control Plane packs |
| `scripts/dev-local.sh` | Live local bootstrap |

In the parent Architecture_space tree, contracts live at `../10. Contracts/`. In this repo they are under `connected-data/10. Contracts/`.
