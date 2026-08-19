# Project mock-data (single instance store)

Demo **instance** contracts, Apache Ossie packages, and knowledge graphs live here. Type characteristics stay under `contracts/{Pack}/{AssetType}/contract.json`. Ossie is interchange (SQ11) — concept URIs still belong to the Semantic Control Plane.

```text
mock-data/projects/{project}/
  project.json
  scopes/{scope}/
    semantics/                 ← Contracts UI · Semantics pack
      namespaces.json
      concepts.json
      ossie-semantic-model.json
      knowledge-graph.json     ← Semantics page (global only)
    business-catalogue/
    technical-catalogue/
      systems.json … tables.json … columns.json
      entity/
        apache-ossie/
          semantic-model.json  ← Ossie 0.2.0.dev0 JSON (SoR)
    data-products/
      sdp.json · adp.json · cdp.json · contracts.json
  derived/
    catalog.json               ← ContractBrowser
    knowledge-graph.json       ← Semantics KG
    coverage.json              ← missing Ossie / links / KG
```

| Project | Global meaning | Scopes |
| --- | --- | --- |
| `udp-dt` | TM Forum SID Customer | `global` + `natco-de` · `at` · `hr` · `hu` · `pl` |
| `udp-pattern` | [UCP shopping](https://ucp.dev/2026-04-08/specification/reference/) | `global` + `amazon` · `tiktok` · `tmall` |

Compile: `node scripts/compile-project-mock.mjs` (also `npm run mock:compile` in `frontend/`).
