---
title: Option C — Federated canonical model
status: draft
template: reference
last_reviewed: 2026-08-12
owner: Data Architecture
tags: [option-c, federation, recommended]
---

# Option C — Federated canonical (recommended end-picture)

## Pitch

“Germany and Global own canonical meaning. Power BI and Palantir keep tool namespaces, but every durable concept must map or federate to canonical.”

## Namespace layout

```text
opt-c-global
  Customer
  CustomerRevenue
opt-c-de
  Kunde  ──FEDERATES──▶ opt-c-global/Customer
opt-c-de-powerbi
  DimCustomer ──MAPS_TO──▶ opt-c-de/Kunde (or global Customer)
  MeasureUmsatz ──MAPS_TO──▶ opt-c-global/CustomerRevenue
opt-c-de-palantir
  Account ──MAPS_TO──▶ opt-c-de/Kunde
  RevenueProp ──MAPS_TO──▶ opt-c-global/CustomerRevenue
```

Tool-specific structure is **allowed** (local / derived). Enterprise reuse requires mapping.

## Setup implications

| Area | Choice |
| --- | --- |
| SoR | Git SCP · canonical namespaces + MappingRecord / FederationEdge |
| Power BI / Palantir | Execution layers; not meaning SoR |
| Different structures | Preserved as tool concepts; unified via contracts |
| Gate | New tool semantic objects need `MAPS_TO` or explicit `local` status |

## Client message

- End-state for multi-tool Germany (and multi-NATCO later)  
- Balances speed (tool freedom) with control (canonical SoR)  
- Matches SQ1/SQ2 POC stance

## Demo ids

- Namespaces: `ns-opt-c-global`, `ns-opt-c-de`, `ns-opt-c-de-powerbi`, `ns-opt-c-de-palantir`
- Query: **O3**
