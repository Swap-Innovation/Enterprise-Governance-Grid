---
title: Option A — Single Germany namespace
status: draft
template: reference
last_reviewed: 2026-08-12
owner: Data Architecture
tags: [option-a, namespace, germany]
---

# Option A — Single Germany namespace for all tools

## Pitch

“One Germany semantic layer. Power BI and Palantir do not own meaning — they consume `de`.”

## Namespace layout

```text
opt-a-de          ← only namespace (Germany business + tool usage)
  Customer
  CustomerRevenue   (KPI name / concept)
  … shared by Power BI measures and Palantir ontology objects
```

No `powerbi` / `palantir` namespaces. Tool artefacts **bind to the same concepts**.

## Setup implications

| Area | Choice |
| --- | --- |
| SoR | Semantic Control Plane · namespace `opt-a-de` |
| Power BI | Semantic model measures/tables `MAPS_TO` `opt-a-de` concepts only |
| Palantir | Ontology objects alias / map into same concepts |
| Local tool structure | **Not preserved** as separate meaning — folded into Germany model |
| Governance | Strict central approval before any new concept |

## Client message

- Maximum consistency across tools  
- Highest change management cost  
- Best when leadership will enforce “no tool-local meaning”

## Demo ids

- Namespaces: `ns-opt-a-de`
- Concepts: `concept-opt-a-customer`, `concept-opt-a-revenue`
- Query: **O1**
