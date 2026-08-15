---
title: Option B — Migration phase (not a showcase option)
status: archived
template: reference
last_reviewed: 2026-08-14
owner: Data Architecture
tags: [option-b, migration, archived]
---

# Option B — Migration phase only (removed from showcase)

## Why this is not a third workshop option

An earlier **Option B** (tool namespaces + BU mapping targets + `MAPS_TO` + `FEDERATES`) produced **the same graph shape as Option C**:

- Global + NATCO container  
- B2B / B2C / Network BU namespaces  
- Power BI + Palantir tool namespaces  
- `MAPS_TO` from tool → BU, `FEDERATES` from BU → global  

The only difference was governance wording (“mapping target” vs “canonical SoR”), not structure. Clients saw copy-paste tabs — so **B was retired from the demo**.

## What to say in workshops instead

| Phase | Use |
| --- | --- |
| **Today (tool reality)** | “Tools own local semantics; we are mapping toward enterprise meaning.” |
| **Option A** | Centralized NATCO — one Germany namespace, tools `BINDS_TO` shared concepts. |
| **Option C** | Target end-state — BU canonical namespaces, tools `MAPS_TO` BU, federation to global. |

Option B is useful **narratively** as the migration path from tool-first → Option C, but not as a separate clickable architecture in the UI.

## Historical note

If you need the old O2 query or Option B seed data, check git history before 2026-08-14 for `e2e-semantic-options.cypher` and `options-abc.json`.
