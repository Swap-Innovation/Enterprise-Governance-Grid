# SQ9 — How do we detect semantic drift?

| Field | Value |
| --- | --- |
| Status | **Concept note** · mechanism autumn |
| Decision | Concept at W6 |
| Owner | Architecture |
| Principle | Declared-vs-observed (metadata strategy) applied to semantics |

## Problem

Governance says who **may** change meaning. Drift is when meaning **silently diverges** from reality — e.g. RAN counters table changes shape and field→concept mappings become wrong while the registry still looks “approved.”

A registry that only accretes becomes **confidently wrong**.

## Mechanism (PoC stub)

| Element | POC proposal |
| --- | --- |
| Signal | Re-run AI enrichment / Model AI mapping pass on a schedule |
| Compare | Diff proposed mappings vs current MappingRecord set (by source asset id) |
| Output | Drift report: added / removed / changed targets |
| Actor | Domain steward owns triage; Architecture owns false-positive rate |
| Cadence | Weekly for pilot domain; tune at W6 |

### Demo recipe (executable today)

1. Export current MappingRecord snapshot from Neo4j (or Contracts Git).
2. Re-run enrichment / suggestion pass on the same contract pack.
3. Diff JSON; present one intentional mismatch (e.g. temporarily wrong column map) then fix.

Autumn build: automate cadence + ticket creation.

## Who acts on a diff

| Diff type | Action |
| --- | --- |
| Suggestion matches registry | No-op / confidence bump |
| Suggestion disagrees | Steward review — accept remap (SQ5/SQ8) or dismiss |
| Source asset disappeared | Retire mapping; notify product owner |

## Related

- [SQ8 Binding](SQ08-binding-cost.md) · [SQ5 Lifecycle](SQ05-lifecycle-versioning.md) · [SQ4 Governance](SQ04-governance-and-conflict.md)
