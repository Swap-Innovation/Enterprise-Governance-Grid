# Enterprise Governance Grid

Standalone **Enterprise Governance Grid** POC: marketing + demo tenant site, Neo4j contracts knowledge graph, pitch docs/examples, **contracts** packs, and **SQ1–SQ12** strategic answers.

## Repository layout

```text
frontend/                 Vite + React UI (GitHub Pages build)
backend/
  api/                    KG HTTP API (:8787)
  neo4j/                  Docker Neo4j + Cypher seeds + enrich
contracts/                Business · Technical · Data Products · Semantic packs
  examples/               Master pitch + scenario JSON (UI + docs + KG narrative)
docs/                     Architecture · demos · guides · kg · strategy
scripts/                  Setup A / Setup B bootstraps
```

Documentation follows the same package convention as contracts (`00. README.md` section hubs). Details: [`docs/00. README.md`](docs/00.%20README.md).

## Two setups

| Setup | Command | Semantics | Use when |
| --- | --- | --- | --- |
| **A · Live local** | `./scripts/dev-local.sh` | Real Neo4j + kg-api (**Q1–Q7**, **N1–N5**) | Demos, mapping/enrichment, SQ evidence |
| **B · Mock (Pages or local)** | Pages URL, or `npm run dev:mock` | Bundled snapshots (same scenarios) | Share link / no Docker |

Strategic board: **[docs/strategy/16. Strategic Questions.md](docs/strategy/16.%20Strategic%20Questions.md)** (SQ1 definition · SQ2 Git SoR · SQ3–SQ12).

---

### Setup A — Live local (Neo4j + kg-api)

Requires Docker Desktop.

```bash
chmod +x scripts/dev-local.sh
./scripts/dev-local.sh
```

Step by step:

```bash
cd backend/neo4j && docker compose up -d && ./scripts/load.sh
cd ../../frontend && npm install && npm run dev
```

| URL | Role |
| --- | --- |
| http://localhost:5173/ | Web UI |
| http://localhost:5173/demo/customer360/marketplace | Consumer journey (SQ7) |
| http://localhost:5173/demo/customer360/contracts | Producer / packs (SQ3) |
| http://localhost:5173/demo/customer360/semantics | Live KG · Q1–Q7 · N1–N5 |
| http://localhost:5173/demo/customer360/questions | Strategic Qs SQ1–SQ12 |
| http://localhost:5173/demo/customer360/options | Semantic options A/B/C (DE · Power BI · Palantir) |
| http://127.0.0.1:8787/api/kg/health | KG API (machine journey SQ3) |
| http://127.0.0.1:7474 | Neo4j Browser (`neo4j` / `contracts-kg`) |

`load.sh` seeds Customer 360 + marketplace families + cross-pack completeness, then `enrich-from-contracts.mjs` loads every asset-type contract + JSON schema (raw), sample assets, **MappingRecord** / **FederationEdge**, and cross-pack X1–X19.

---

### Setup B — Mock (GitHub Pages + optional local mock)

**Public URL:** [https://swapkodgire.github.io/Enterprise_governance_grid/](https://swapkodgire.github.io/Enterprise_governance_grid/)

Same marketing + demo routes; Semantics uses exported snapshots (Q1–Q7, N1–N5, Q2 NATCOs, Q3 product families). No Neo4j.

Local mock (no Docker):

```bash
cd frontend && npm install && npm run dev:mock
# → http://localhost:5173/
```

Refresh Pages snapshots after KG changes (while live stack is up):

```bash
cd frontend
npm run kg:export-mock
# commit frontend/src/data/kg-snapshots/ and push main → Actions deploys Pages
```

---

## Strategic questions (SQ1–SQ12)

POC recommendations for layer boundary, Git meaning SoR, experience, governance/conflict, versioning, canonisation, consumers, binding cost, drift, stewardship, Ossie, and strategy amendments:

→ **[docs/strategy/16. Strategic Questions.md](docs/strategy/16.%20Strategic%20Questions.md)** · [per-SQ pages](docs/strategy/strategic-questions/)

## Path map

| Path | Role |
| --- | --- |
| `frontend/` | Vite + React app |
| `backend/api/` | KG API |
| `backend/neo4j/` | Docker Neo4j + Cypher + contracts enrich |
| `docs/` | POC docs · SQ1–SQ12 hub (sectioned) |
| `contracts/examples/` | Master pitch + scenario JSON |
| `contracts/` | Business, Technical, Data Products, Semantic Control Plane |
| `scripts/dev-local.sh` | Setup A bootstrap |
| `scripts/dev-mock.sh` | Setup B local mock bootstrap |
