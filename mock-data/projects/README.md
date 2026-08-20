# Project mock-data (single instance store)

Demo **instance** contracts, Apache Ossie packages, and knowledge graphs live here. Type characteristics stay under `contracts/{Pack}/{AssetType}/contract.json`. Ossie is interchange (SQ11) — concept URIs still belong to the Semantic Control Plane.

```text
mock-data/projects/{project}/
  project.json
  scopes/{scope}/
    semantics/                 ← Contracts UI · Semantics pack
      Namespace/contracts.json
      Concept/contracts.json
      Ossie Semantic Model/contracts.json
      knowledge-graph.json     ← Semantics page (global only)
    business-catalogue/
      Data Domain|Model|Entity|Attribute|Concept|Business Term|Policy/
        contracts.json          ← empty scaffold bucket
        {id}.json               ← one file per instance (e.g. domain-global-customer.json)
    technical-catalogue/
      System|Database|Schema|Table|Column|Pipeline|Topic|Technology Asset/
        contracts.json
      entity/
        apache-ossie/
          semantic-model.json  ← Ossie 0.2.0.dev0 JSON (SoR)
    data-products/
      Data Product/sdp.json · adp.json · cdp.json
      Data Contract/contracts.json
      KPI/contracts.json
  derived/
    catalog.json               ← ContractBrowser
    knowledge-graph.json       ← Semantics KG
    coverage.json              ← missing Ossie / links / KG
  tmforum.json · pitch-concepts.json · strategic-questions.json  ← UDP-DT reference (Studio / SQ board)
```

| Project | Global meaning | Scopes |
| --- | --- | --- |
| `udp-dt` | TM Forum SID Customer | `global` + `natco-de` · `at` · `hr` · `hu` · `pl` |
| `udp-pattern` | [UCP shopping](https://ucp.dev/2026-04-08/specification/reference/) | `global` + `amazon` · `tiktok` · `tmall` |

Compile: `node scripts/compile-project-mock.mjs` (also `npm run mock:compile` in `frontend/`).

**Projects API** (with `npm run dev` / `kg-api` on `:8787`):

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/projects` | List projects from `mock-data/projects/` |
| POST | `/api/projects` | Create project + seed global namespace |
| DELETE | `/api/projects/:id` | Delete project folder under `mock-data/projects/:id/` (not `udp-dt` / `udp-pattern`) |
| GET | `/api/projects/:id/namespaces` | List namespace scopes under `scopes/` |
| POST | `/api/projects/:id/namespaces` | Create namespace + per-asset pack folders + empty contract JSON + Apache Ossie package stub |
| DELETE | `/api/projects/:id/namespaces/:namespaceId` | Delete namespace scope under `scopes/:namespaceId/` (same rules as UI: protected demos keep `global`; cannot delete last namespace) |
| POST | `/api/projects/:id/namespaces/normalize` | Migrate flat shards → asset folders and ensure Ossie package scaffold |
| GET | `/api/projects/:id/catalog` | Compiled contracts |
| POST | `/api/projects/:id/contracts` | Upsert full contract, or create typed asset shell with `{ kind, scope, name?, product_class? }` |
| PUT/DELETE | `/api/projects/:id/contracts/:contractId` | Update / remove |
| POST | `/api/projects/:id/compile` | Rebuild derived artifacts |
