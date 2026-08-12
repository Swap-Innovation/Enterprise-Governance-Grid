# SQ1 — What is our semantic layer? (definition & boundary)

| Field | Value |
| --- | --- |
| Status | POC recommendation · polish at W6 |
| Decision | W6 leadership review |
| Owner | Architecture |
| Demo | [/demo/customer360/questions?q=SQ1](../../enterprise-governance-grid/) (Strategic Qs page) |

## The question

One paragraph that says what the semantic layer is — and an explicit boundary list of what it is not. Open point: are metrics and dimensions (calculations, not just concepts) in scope?

## Why it matters

Every later decision (home, governance, tooling) inherits its scope from this sentence. An unbounded definition produces an unbuildable layer.

## POC recommendation

The enterprise semantic layer is the Semantic Control Plane: namespaces, certified concepts with stable URIs, mapping records, and federation edges. Metric and dimension calculation logic stays beside the layer; KPI names may mapsTo a Concept.

## In scope

- Namespaces (global, natco-*, import-*)
- Concepts with URI and lifecycle
- Mapping Records (DA-08 / DA-09 / DA-10)
- Federation Edges (NATCO/import → global)
- Concept names for metrics as meaning targets
- Policies gating binds to approved concepts

## Out of scope

- Collibra Guided Stewardship Data Model / Entity / Attribute
- Physical tables, columns, files (Technical Catalog)
- Data product identity and ODCS lifecycle (Marketplace)
- Glossary prose and steward UI (Collibra)
- SQL / DAX / MDX / semantic-model measure formulas
- BI tool models as a second meaning SoR

## Definition

The enterprise semantic layer is the shared system of canonical meaning: scoped namespaces, certified concepts with stable URIs, mapping records that bind catalog and product artifacts to those concepts, and federation edges that align NATCO or import meanings to the global core.

It answers “what does this word mean for the enterprise?” — not “where is the table?” and not “how is the KPI calculated?”

## Metrics boundary (WS5)

POC recommendation: calculations stay beside the layer. A KPI name may live in the Business Catalog and mapsTo a Concept (kind metric if needed). Formula, grain, and tool-specific measures live in BI or a metrics store.

If leadership puts calculations inside the layer at W6, scope and tooling cost expand materially.

## Evidence

- WS1 — what a domain needs
- WS5 — metrics in or beside the layer

## Deliverable

One-page definition with is/is-not boundary (written last at W6).

## Try in the demo

- **Contracts · Semantic Control Plane** → `/demo/customer360/contracts`
- **Semantics · knowledge graph** → `/demo/customer360/semantics`

## Residual (workstreams)

WS5 confirms BI metrics stay beside the layer at W6.

## Related

- Hub: [../16. Strategic Questions.md](../16.%20Strategic%20Questions.md)
- Interactive board: demo route `questions`
