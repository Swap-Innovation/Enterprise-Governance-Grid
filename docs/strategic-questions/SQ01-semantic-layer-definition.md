# SQ1 — What is our semantic layer? (definition & boundary)

| Field | Value |
| --- | --- |
| Status | **POC recommendation** · polish last at W6 |
| Decision | W6 leadership review |
| Evidence | WS1 (domain needs) · WS5 (metrics in or beside) |
| Pack SoR | [Semantic Control Plane](../../connected-data/10.%20Contracts/Semantic%20Control%20Plane/00.%20README.md) |

## Definition (one paragraph)

The **enterprise semantic layer** is the shared system of **canonical meaning**: scoped namespaces, certified concepts with stable URIs, mapping records that bind catalog and product artifacts to those concepts, and federation edges that align NATCO or import meanings to the global core. It is the target of DA-08/09/10 crosswalks and the source of truth for “what does this word mean for the enterprise?” — not the inventory of physical assets, not the marketplace product lifecycle, and not the engine that computes KPIs.

## Is / is-not boundary

| **Is** (in scope) | **Is not** (out of scope) |
| --- | --- |
| Namespaces (`global`, `natco-*`, `import-*`) | Collibra Guided Stewardship Data Model / Entity / Attribute (Business Catalog) |
| Concepts (entity, shared_property, group, …) with URI + lifecycle | Physical tables, columns, files (Technical Catalog) |
| Mapping Records (business / technical / product → Concept) | Data product identity, ports, ODCS lifecycle (Marketplace) |
| Federation Edges (NATCO/import → global Concept) | Glossary prose and stewardship workflow UI (Collibra) |
| Concept *names* for metrics/dimensions as meaning targets | Metric/dimension **calculation logic** (SQL, DAX, MDX, semantic-model measures) |
| Policies that gate “approved concept required to bind” | BI tool semantic models as a second meaning SoR |

## Open boundary — metrics and dimensions (WS5)

**POC recommendation:** calculations stay **beside** the layer.

- A KPI or measure **name** may exist in the Business Catalog and `mapsTo` a Concept (kind `metric` if needed).
- The **formula**, grain, and tool-specific measure definition live in the BI / analytics platform (or a metrics store), not in the Semantic Control Plane.
- This keeps the layer buildable and avoids turning the registry into a calculation engine the Metadata Management Strategy’s “semantic metadata” phrase might otherwise invite.

WS5 must confirm this at W6; if leadership insists calculations are “in,” the layer scope and tooling cost expand materially.

## Why write this last at W6

Home (SQ2), experience (SQ3), governance (SQ4), and consumers (SQ7) inherit this sentence. Draft now from the Contracts pack split; re-read after WS5 and ratify as the one-pager leadership signs.

## Related

- [SQ2 Registry SoR](SQ02-registry-sor.md) · [SQ8 Binding](SQ08-binding-cost.md) · [Contracts hub](../../connected-data/10.%20Contracts/00.%20README.md)
