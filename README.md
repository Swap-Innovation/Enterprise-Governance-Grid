# Enterprise Governance Grid

Standalone copy of the **Enterprise Governance Grid** POC: marketing + demo tenant site, Neo4j contracts knowledge graph, pitch docs/examples, and the connected **10. Contracts** packs.

## Two ways to run

| Mode | Who | Semantics data |
| --- | --- | --- |
| **Live (local)** | You / demos on your machine | Real Neo4j + kg-api Cypher (**Q1–Q7**, **N1–N5**) |
| **Mock (GitHub Pages)** | Public share link | Exported Neo4j snapshots for **all** scenarios |

### Public mock demo (GitHub Pages)

**URL:** [https://swapkodgire.github.io/Enterprise_governance_grid/](https://swapkodgire.github.io/Enterprise_governance_grid/)

Static marketing + demo UI. Semantics ships the full catalog (Q1–Q7, N1–N5, Q2 NATCO variants, Q3 marketplace products) from `src/data/kg-snapshots/`.

### Live local (Neo4j + kg-api)

Requires Docker.

```bash
# One-shot: start Neo4j, load + enrich Contracts KG, run web + API
chmod +x scripts/dev-local.sh
./scripts/dev-local.sh
```

Or step by step:

```bash
# 1) Neo4j Contracts KG (E2E seed + every contract/schema/asset + mappings)
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

`load.sh` applies constraints + Customer 360 / marketplace seeds, then runs `enrich-from-contracts.mjs` which loads:

- all 30 asset-type `contract.json` files (raw JSON on `:AssetTypeContract`)
- all pack `*.schema.json` files (raw JSON on `:JsonSchema`)
- sample + example assets (`:ContractAsset` + typed nodes where needed)
- `MappingRecord` for every `MAPS_TO` / `REPRESENTS` / `IMPLEMENTS`
- `FederationEdge` for every `FEDERATES`
- `CrossPackRelation` from `cross-pack.relations.json` (X1–X19)

### Refresh Pages mock snapshots (after KG changes)

With Neo4j loaded and `npm run kg-api` (or `npm run dev`) running:

```bash
cd enterprise-governance-grid
npm run kg:export-mock
```

### Mock UI only (local, no Docker)

```bash
cd enterprise-governance-grid && npm install && npm run dev:mock
```

## Layout

| Path | Role |
| --- | --- |
| `enterprise-governance-grid/` | Vite + React app + KG API |
| `neo4j-contracts-kg/` | Docker Neo4j + Cypher seed/load + contracts enrich |
| `docs/` | POC documentation |
| `examples/` | Pitch / graph JSON |
| `connected-data/10. Contracts/` | Business, Technical, Data Products, Semantic Control Plane packs |
| `scripts/dev-local.sh` | Live local bootstrap |

In the parent Architecture_space tree, contracts live at `../10. Contracts/`. In this repo they are under `connected-data/10. Contracts/`.
