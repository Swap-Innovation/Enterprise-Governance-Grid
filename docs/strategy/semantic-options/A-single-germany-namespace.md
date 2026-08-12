---
title: Option A — Single Germany namespace
status: draft
template: reference
last_reviewed: 2026-08-12
owner: Data Architecture
tags: [option-a, namespace, germany]
---

# Option A — Single Germany namespace for all tools (with global + NATCO)

## Pitch

“One Germany semantic layer. Power BI and Palantir do not own meaning — they consume `opt-a-de` (natco base), which federates to a shared global canonical.”

## Namespace layout (target end-picture)

```text
opt-a-global
  Customer
  CustomerRevenue
opt-a-de           ← Germany natco base (shared by tools)
  Customer
  CustomerRevenue   (KPI name / concept)
  (Tool binds + FEDERATES → opt-a-global)
```

No `powerbi` / `palantir` namespaces. Tool artefacts **bind to the same Germany (natco) concepts**, and those **federate to global**.

## Setup implications

| Area | Choice |
| --- | --- |
| SoR | Semantic Control Plane · global canonical + Germany (natco base) federation |
| Power BI | Semantic model measures/tables bind to `opt-a-de` concepts only |
| Palantir | Ontology objects alias/bind into the same `opt-a-de` concepts |
| Local tool structure | **Not preserved** as separate meaning — folded into Germany model |
| Governance | Strict approval before new concepts; federation edges kept stable |

## Client message

- Maximum consistency across tools  
- Highest change management cost  
- Best when leadership will enforce “no tool-local meaning”

## Demo ids

- Namespaces: `ns-opt-a-global`, `ns-opt-a-de`
- Concepts: `concept-opt-a-global-customer`, `concept-opt-a-global-revenue`, `concept-opt-a-customer`, `concept-opt-a-revenue`
- Query: **O1**
