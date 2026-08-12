# Neo4j Contracts Knowledge Graph — POC

Runnable **Neo4j** setup that materializes [`10. Contracts`](../../10.%20Contracts/) as a knowledge graph: Business Catalog · Technical Catalog · Data Products · Semantic Control Plane, with cross-pack bridges and the Customer 360 end-to-end flow.

## Quick start

```bash
cd neo4j-contracts-kg
docker compose up -d
./scripts/load.sh
```

From the repo root you can also run the full live stack:

```bash
./scripts/dev-local.sh
```

| Service | URL |
| --- | --- |
| Neo4j Browser | http://localhost:7474 |
| Bolt | `bolt://localhost:7687` |
| User / password | `neo4j` / `contracts-kg` |

Then open Neo4j Browser and paste **VIEW G1** from [`cypher/show-e2e-customer-360.cypher`](cypher/show-e2e-customer-360.cypher) to see the full Customer 360 graph.

### Demo UI (live Cypher)

The Enterprise Governance Grid **Semantics** tab calls the same curated views via a thin API:

```bash
cd ../enterprise-governance-grid && npm run dev
# → http://127.0.0.1:5173/demo/customer360/semantics
# API: http://127.0.0.1:8787/api/kg/health
```

GitHub Pages uses a **mock** graph (bundled JSON) instead of Neo4j. See the root [`README.md`](../README.md).

## Contents

| Path | Role |
| --- | --- |
| [`docker-compose.yml`](docker-compose.yml) | Neo4j 5 community |
| [`cypher/`](cypher/) | Constraints, seed, demo queries |
| [`scripts/load.sh`](scripts/load.sh) | Apply all Cypher in order |
| [`scripts/reset.sh`](scripts/reset.sh) | Wipe graph + reload |
| [`docs/00. README.md`](docs/00.%20README.md) | Section hub |
| [`docs/01. Graph Model.md`](docs/01.%20Graph%20Model.md) | Labels, relationships, pack mapping |
| [`docs/02. Setup And Run.md`](docs/02.%20Setup%20And%20Run.md) | Ops guide |

## What gets loaded

Multi-NATCO **Customer 360** from [`multi-natco-customer.json`](../../10.%20Contracts/Semantic%20Control%20Plane/examples/multi-natco-customer.json):

- **Namespaces:** `global` (TM Forum SID) + `natco-de` · `natco-at` · `natco-hr` · `natco-hu` · `natco-pl` (`ALIGNS_TO` global)
- **Global concepts:** `Customer`, `CustomerIdentification` (SID PascalCase)
- **NATCO concepts + variations:** Kunde / Kupac / Ügyfél / Klient (+ local id names) → `FEDERATES` → global
- **Per NATCO:** glossary term, CRM system → table → column, product input ports
- **Enterprise product:** Customer 360 output + contract on curated `dp.curated.customer_360`

## Source of truth

Contracts docs remain canonical. This folder is a **POC materialization** for demos — not a second SoR.
