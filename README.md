# Enterprise Governance Grid

Standalone copy of the **Enterprise Governance Grid** POC: marketing + demo tenant site, Neo4j contracts knowledge graph, pitch docs/examples, connected **10. Contracts** packs, and **SQ1–SQ12** strategic answers.

## Two setups

| Setup | Command | Semantics | Use when |
| --- | --- | --- | --- |
| **A · Live local** | `./scripts/dev-local.sh` | Real Neo4j + kg-api (**Q1–Q7**, **N1–N5**) | Demos, mapping/enrichment, SQ evidence |
| **B · Mock (Pages or local)** | Pages URL, or `npm run dev:mock` | Bundled snapshots (same scenarios) | Share link / no Docker |

Strategic board: **[docs/16. Strategic Questions.md](docs/16.%20Strategic%20Questions.md)** (SQ1 definition · SQ2 Git SoR · SQ3–SQ12).

---

### Setup A — Live local (Neo4j + kg-api)

Requires Docker Desktop.

```bash
chmod +x scripts/dev-local.sh
./scripts/dev-local.sh
```

Step by step:

```bash
cd neo4j-contracts-kg && docker compose up -d && ./scripts/load.sh
cd ../enterprise-governance-grid && npm install && npm run dev
```

| URL | Role |
| --- | --- |
| http://localhost:5173/ | Web UI |
| http://localhost:5173/demo/customer360/marketplace | Consumer journey (SQ7) |
| http://localhost:5173/demo/customer360/contracts | Producer / packs (SQ3) |
| http://localhost:5173/demo/customer360/semantics | Live KG · Q1–Q7 · N1–N5 |
| http://localhost:5173/demo/customer360/questions | Strategic Qs SQ1–SQ12 |
| http://127.0.0.1:8787/api/kg/health | KG API (machine journey SQ3) |
| http://127.0.0.1:7474 | Neo4j Browser (`neo4j` / `contracts-kg`) |

`load.sh` seeds Customer 360 + marketplace families, then `enrich-from-contracts.mjs` loads every asset-type contract + JSON schema (raw), sample assets, **MappingRecord** / **FederationEdge**, and cross-pack X1–X19.

---

### Setup B — Mock (GitHub Pages + optional local mock)

**Public URL:** [https://swapkodgire.github.io/Enterprise_governance_grid/](https://swapkodgire.github.io/Enterprise_governance_grid/)

Same marketing + demo routes; Semantics uses exported snapshots (Q1–Q7, N1–N5, Q2 NATCOs, Q3 product families). No Neo4j.

Local mock (no Docker):

```bash
cd enterprise-governance-grid && npm install && npm run dev:mock
# → http://localhost:5173/
```

Refresh Pages snapshots after KG changes (while live stack is up):

```bash
cd enterprise-governance-grid
npm run kg:export-mock
# commit src/data/kg-snapshots/ and push main → Actions deploys Pages
```

---

## Strategic questions (SQ1–SQ12)

POC recommendations for layer boundary, Git meaning SoR, experience, governance/conflict, versioning, canonisation, consumers, binding cost, drift, stewardship, Ossie, and strategy amendments:

→ **[docs/16. Strategic Questions.md](docs/16.%20Strategic%20Questions.md)** · [per-SQ pages](docs/strategic-questions/)

## Layout

| Path | Role |
| --- | --- |
| `enterprise-governance-grid/` | Vite + React app + KG API |
| `neo4j-contracts-kg/` | Docker Neo4j + Cypher seed/load + contracts enrich |
| `docs/` | POC docs · SQ1–SQ12 hub |
| `docs/strategic-questions/` | Per-SQ decision papers |
| `examples/` | Pitch / graph JSON |
| `connected-data/10. Contracts/` | Business, Technical, Data Products, Semantic Control Plane |
| `scripts/dev-local.sh` | Setup A bootstrap |
| `scripts/dev-mock.sh` | Setup B local mock bootstrap |

In the parent Architecture_space tree, contracts live at `../10. Contracts/`. In this repo they are under `connected-data/10. Contracts/`.
