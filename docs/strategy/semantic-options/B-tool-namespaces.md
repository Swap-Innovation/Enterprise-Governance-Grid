---
title: Option B — Tool-specific namespaces
status: draft
template: reference
last_reviewed: 2026-08-12
owner: Data Architecture
tags: [option-b, powerbi, palantir]
---

# Option B — Tool-specific namespaces (with global + NATCO mapping)

## Pitch

“Keep Power BI and Palantir semantics as they are. Register each under its own namespace, but map their concepts (`MAPS_TO`) to a shared Germany natco base that federates to global.”

## Namespace layout (target end-picture)

```text
opt-b-global
  Customer (PBI grain / naming)
  CustomerRevenue

opt-b-de             ← Germany natco base (shared mapping target)
  Customer
  CustomerRevenue

opt-b-de-powerbi
  Customer (PBI)
  Umsatz (DAX measure)
  MAPS_TO → opt-b-de/*

opt-b-de-palantir
  Account / RevenueMetric
  MAPS_TO → opt-b-de/*
```

Tool structures are **maintained**. Federation is handled at the natco base: `opt-b-de/* FEDERATES → opt-b-global/*`.

## Setup implications

| Area | Choice |
| --- | --- |
| SoR | SCP still stores concepts — but **per tool** |
| Power BI | Full freedom of semantic model shape |
| Palantir | Full freedom of ontology shape |
| Unified meaning | Enforced via MappingRecords at `MAPS_TO` gate (tools → natco base) |
| Drift | High unless stewardship is strong |

## Client message

- Fastest adoption path  
- Does **not** solve “one Customer definition” alone  
- Use as **bridge**, not end-state

## Demo ids

- Namespaces: `ns-opt-b-global`, `ns-opt-b-de`, `ns-opt-b-de-powerbi`, `ns-opt-b-de-palantir`
- Query: **O2**
