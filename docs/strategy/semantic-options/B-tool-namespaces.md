---
title: Option B — Tool-specific namespaces
status: draft
template: reference
last_reviewed: 2026-08-12
owner: Data Architecture
tags: [option-b, powerbi, palantir]
---

# Option B — Tool-specific namespaces (minimal disruption)

## Pitch

“Keep Power BI and Palantir semantics as they are. Register each under its own namespace. Cross-tool meaning is optional.”

## Namespace layout

```text
opt-b-de-powerbi
  Customer (PBI grain / naming)
  Umsatz (DAX-oriented measure concept)
opt-b-de-palantir
  Account (Palantir object type)
  RevenueMetric (ontology property)
opt-b-de                 ← thin country label only (optional shared glossary)
```

Tool structures are **maintained**. No mandatory federation to a rich canonical model.

## Setup implications

| Area | Choice |
| --- | --- |
| SoR | SCP still stores concepts — but **per tool** |
| Power BI | Full freedom of semantic model shape |
| Palantir | Full freedom of ontology shape |
| Unified meaning | Weak / optional MappingRecords |
| Drift | High unless stewardship is strong |

## Client message

- Fastest adoption path  
- Does **not** solve “one Customer definition” alone  
- Use as **bridge**, not end-state

## Demo ids

- Namespaces: `ns-opt-b-de-powerbi`, `ns-opt-b-de-palantir`, `ns-opt-b-de`
- Query: **O2**
