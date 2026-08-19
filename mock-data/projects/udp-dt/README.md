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
```

- Ossie SoR: `scopes/global/technical-catalogue/entity/apache-ossie/semantic-model.json`
- Contracts UI: `derived/catalog.json`
- Semantics KG: `derived/knowledge-graph.json`
- Gaps: `derived/coverage.json` (HU/PL CRM SDPs are not in the Ossie package yet)

Demo URL: `/demo/udp-dt/`
