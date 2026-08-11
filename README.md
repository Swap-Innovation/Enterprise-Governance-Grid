# Enterprise Governance Grid

Standalone copy of the **Enterprise Governance Grid** POC: marketing + demo tenant site, Neo4j contracts knowledge graph, pitch docs/examples, and the connected **10. Contracts** packs.

## Layout

| Path | Role |
| --- | --- |
| `enterprise-governance-grid/` | Vite + React app + KG API (`npm run dev`) |
| `neo4j-contracts-kg/` | Docker Neo4j + Cypher seed/load scripts |
| `docs/` | POC documentation |
| `examples/` | Pitch / graph JSON (static fallback) |
| `connected-data/10. Contracts/` | Business, Technical, Data Products, Semantic Control Plane packs |

## Run

```bash
# 1) Neo4j Contracts KG (optional but recommended for Semantics)
cd neo4j-contracts-kg && docker compose up -d && ./scripts/load.sh

# 2) Site + KG API
cd ../enterprise-governance-grid && npm install && npm run dev
```

| URL | Role |
| --- | --- |
| http://127.0.0.1:5173/ | Web UI |
| http://127.0.0.1:8787 | KG API |

In the parent Architecture_space tree, contracts live at `../10. Contracts/`. In this repo they are under `connected-data/10. Contracts/`.
