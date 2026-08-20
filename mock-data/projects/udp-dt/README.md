# UDP-DT

Canonical instance store for Customer 360 / TM Forum SID / NATCO federation.

```text
scopes/{global|natco-de|at|hr|hu|pl}/
  semantics/                 Contracts · Semantics
  business-catalogue/
  technical-catalogue/
    entity/apache-ossie/     Ossie JSON (global package only)
  data-products/             SDP · ADP · CDP
derived/                     Compiled catalog + KG + coverage
kg-snapshots/                Neo4j scenario snapshots
scenarios/                   Options A/B/C · end-to-end flows
tmforum.json                 TM Forum SID examples (Studio pages)
pitch-concepts.json          Concept explainers (Studio)
strategic-questions.json     SQ1–SQ12 board (Strategic Qs page)
```

- Ossie SoR: `scopes/global/technical-catalogue/entity/apache-ossie/semantic-model.json`
- Contracts UI: `derived/catalog.json`
- Semantics KG: `derived/knowledge-graph.json`
- Gaps: `derived/coverage.json` (HU/PL CRM SDPs are not in the Ossie package yet)
- Reference assets are listed in `project.json` → `reference`

Demo URL: `/demo/udp-dt/`
