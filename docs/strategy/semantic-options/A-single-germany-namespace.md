---
title: Option A — Single Germany namespace
status: draft
template: reference
last_reviewed: 2026-08-14
owner: Data Architecture
tags: [option-a, namespace, germany, business-units]
---

# Option A — Single Germany namespace · BUs co-steward

## Pitch

“One Germany semantic layer. B2B, B2C, and Network **steward** concepts inside the same `opt-a-de` namespace. Power BI and Palantir do not own meaning — they consume Germany concepts (B2C / B2B primary tools). Federation goes to global.”

## Namespace layout

```text
opt-a-global
  Customer · CustomerRevenue

opt-a-de                    ← single publish surface (NATCO)
  Customer · CustomerRevenue   (B2B + B2C co-steward)
  NetworkSite                  (Network steward)

opt-a-de-b2b / b2c / network   ← stewardship domains (SCOPED_TO de)
  STEWARDS → concepts in opt-a-de (not separate meaning SoR)
```

No tool namespaces. Tool artefacts **bind to the same Germany concepts**.

## Business units under NATCO

| BU | Stewards | Primary tool |
| --- | --- | --- |
| **B2B** | Business customer semantics | Palantir |
| **B2C** | Consumer customer & revenue | Power BI |
| **Network** | Network site & topology | Both (read) |

## Setup implications

| Area | Choice |
| --- | --- |
| SoR | SCP · one Germany namespace + global federation |
| BUs | Co-stewardship metadata — not separate publish namespaces |
| Power BI | Binds to `opt-a-de` (B2C steward) |
| Palantir | Binds to `opt-a-de` (B2B steward) |
| Local tool structure | **Not preserved** as separate meaning |
| Governance | Strict approval; BU leads agree on shared Customer |

## Client message

- Maximum consistency across BUs and tools inside Germany  
- Highest change-management cost for BU autonomy  
- Best when leadership will enforce “no BU-local or tool-local meaning”

## Demo ids

- Namespaces: `ns-opt-a-global`, `ns-opt-a-de`, `ns-opt-a-de-b2b`, `ns-opt-a-de-b2c`, `ns-opt-a-de-network`
- Query: **O1**
