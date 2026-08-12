# SQ6 — Canonisation strategy (promotion and demotion)

| Field | Value |
| --- | --- |
| Status | **POC criteria** · one promotion as W6 evidence |
| Decision | W6 |
| Owner | Architecture |
| Design principle | Thin global core — without demotion the core only grows |

## Promotion — domain → global core

A domain / NATCO concept may enter `global` when **all** hold:

| # | Criterion | POC default |
| --- | --- | --- |
| 1 | Used by ≥ **2** domains or NatCos (or one enterprise product family spanning NatCos) | Customer local concepts federating to SID Customer |
| 2 | Stable for an agreed window | **30 days** with no breaking definition change (tune at W6) |
| 3 | No unresolved conflicting definition | [SQ4](SQ04-governance-and-conflict.md) clear |
| 4 | Steward + Architecture approval recorded | decision_ref on Concept / FederationEdge |
| 5 | Consumers identified | At least one product or mapping ready to bind |

**Process:** propose → conflict check → council approve → URI in `global` → federation from locals → optional deprecate redundant globals.

### PoC promotion evidence path

Walk **NATCO Customer locals → `global/Customer`** (already seeded): treat as the charter “one promotion” proof — document the criteria checklist against the live federation graph (Semantics Q7 / N1–N5).

## Demotion — global → local or retired

Core concepts **can and must** be demoted when usage does not materialise.

| Trigger | Action |
| --- | --- |
| < 2 active consumers for 90 days | Candidate demotion review |
| Superseded by better SID / import | `deprecated` + `replaced_by` |
| Entered core by exception, never federated | Retire or move to `import-*` / domain namespace |

Demotion requires the same decision_ref discipline as promotion. Thin core is a **measured** property, not a slogan.

## Related

- [SQ4 Conflict](SQ04-governance-and-conflict.md) · [SQ5 Lifecycle](SQ05-lifecycle-versioning.md) · [Namespace & Federation](../03.%20Namespace%20And%20Federation.md)
