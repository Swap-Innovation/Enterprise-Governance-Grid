---
title: Option C — Federated canonical model
status: draft
template: reference
last_reviewed: 2026-08-14
owner: Data Architecture
tags: [option-c, federation, business-units, recommended]
---

# Option C — BU canonical · federated to global (recommended)

## Pitch

“Global owns enterprise Customer/Revenue. Germany's **B2B, B2C, and Network BUs** own **canonical** semantics in dedicated namespaces. Tools keep local structure but must map durable concepts to the BU they serve.”

## Namespace layout

```text
opt-c-global
  Customer · CustomerRevenue

opt-c-de                     ← country anchor
  opt-c-de-b2b               Geschäftskunde  ──FEDERATES──▶ global/Customer
  opt-c-de-b2c               Kunde           ──FEDERATES──▶ global/Customer
  opt-c-de-network           Netzstandort    ──FEDERATES──▶ global/Customer

opt-c-de-powerbi
  DimCustomer ──MAPS_TO──▶ opt-c-de-b2c/Kunde
  MeasureUmsatz ──MAPS_TO──▶ global/CustomerRevenue

opt-c-de-palantir
  Account ──MAPS_TO──▶ opt-c-de-b2b/Geschäftskunde
  RevenueProp ──MAPS_TO──▶ global/CustomerRevenue
```

BU namespaces are **SoR**. Tools are execution layers.

## Business units under NATCO

| BU | Canonical namespace | Example concept | Primary tool |
| --- | --- | --- | --- |
| **B2B** | `opt-c-de-b2b` | Geschäftskunde | Palantir |
| **B2C** | `opt-c-de-b2c` | Kunde | Power BI |
| **Network** | `opt-c-de-network` | Netzstandort | Planning / shared reads |

## Setup implications

| Area | Choice |
| --- | --- |
| SoR | Git SCP · BU canonical namespaces + FederationEdge |
| Power BI / Palantir | Execution layers; not meaning SoR |
| Different structures | Preserved as tool concepts; unified via MAPS_TO |
| Gate | New tool semantic objects need MAPS_TO or explicit `local` status |

## Client message

- End-state for multi-BU, multi-tool Germany (and multi-NATCO later)  
- Balances BU freedom with enterprise control  
- Matches SQ1/SQ2 POC stance

## Demo ids

- BU namespaces: `ns-opt-c-de-b2b`, `ns-opt-c-de-b2c`, `ns-opt-c-de-network`
- Query: **O3**
