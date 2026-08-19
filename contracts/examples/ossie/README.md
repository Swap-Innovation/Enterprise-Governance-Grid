# Apache Ossie interchange · SDP / ADP / CDP

Ossie is **exchange**, not a second catalog ([SQ11](../../docs/strategy/strategic-questions/SQ11-ossie-portability.md)). The Semantic Control Plane remains SoR for concept URIs. Each project exports one [Ossie 0.2.0.dev0](https://github.com/apache/ossie/blob/main/core-spec/spec.md) `semantic_model`.

**Authored JSON SoR** (Contracts + Semantics compile from here):

- `mock-data/projects/udp-dt/scopes/global/technical-catalogue/entity/apache-ossie/semantic-model.json`
- `mock-data/projects/udp-pattern/scopes/global/technical-catalogue/entity/apache-ossie/semantic-model.json`

YAML in this folder is a human-readable twin of those JSON packages.

## Spec mapping

| Ossie construct | Grid layer | Contract |
| --- | --- | --- |
| `semantic_model` | Semantics (interchange pack) | `ossie_semantic_model` |
| `datasets[]` | Technical `source` + product grain | Table + Data Product `OssieDataset` |
| `fields[]` | Concept identifiers / columns | Concept `OssieField` |
| `relationships[]` | Federation / lineage joins | Federation Edge + KG `feeds` |
| `metrics[]` | Business KPI / Measure | Measure mapsTo concept |
| `ai_context` | Agent instructions | Copilot / MCP |
| `custom_extensions` | `ENTERPRISE_GOVERNANCE_GRID` | project, SDP/ADP/CDP lists, concept map |

## Product classes

| Class | Meaning | UDP-DT | UDP-Pattern |
| --- | --- | --- | --- |
| **SDP** | Source-aligned, 1:1 with a system | NATCO CRM (`customers_de`) | Amazon listing, TikTok product, Tmall item, GMC offer |
| **ADP** | Aggregated / integrated enterprise grain | Customer 360 (`customers`) | Brand Catalog 360 (`product` / `variant`) |
| **CDP** | Consumer-aligned projection | Copilot slice (`copilot_customer`) | Google UCP Checkout (`checkout_session`) |

## Packages

JSON SoR (compiled into Contracts + Semantics):

- [udp-dt semantic-model.json](../../mock-data/projects/udp-dt/scopes/global/technical-catalogue/entity/apache-ossie/semantic-model.json)
- [udp-pattern semantic-model.json](../../mock-data/projects/udp-pattern/scopes/global/technical-catalogue/entity/apache-ossie/semantic-model.json)

YAML twins in this folder (human-readable):

- [udp-dt-customer-360.yaml](udp-dt-customer-360.yaml)
- [udp-pattern-ucp-shopping.yaml](udp-pattern-ucp-shopping.yaml)
- [gap-analysis.json](gap-analysis.json) — static checklist; live gaps are `mock-data/projects/{id}/derived/coverage.json`

## What was updated

1. Data Product type contract — `ProductClass`, `OssieModel`, `OssieDataset` (core class)
2. Concept type contract — `OssieDataset`, `OssieField`; bootstrap may be `apache-ossie`
3. Every Data Product example instance stamped SDP or ADP; CDP examples added
4. Pitch catalogs + context graphs for both projects
5. Marketplace chips and Pattern KG query **P6**
