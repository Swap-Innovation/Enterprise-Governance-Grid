# SQ12 — What changes in the metadata strategy?

| Field | Value |
| --- | --- |
| Status | **Candidate amendment** |
| Decision | Drafted at W6 · ratified with strategy owners after |
| Owner | Vincent |
| External target | `docs/metadata-management/metadata-management-strategy.md` (may live outside this repo) |

## Aggregation question

The PoC is not an island. Outcomes must land as amendments in strategy documents leadership already knows — or they evaporate.

## What this PoC closes

| Open row | Closure |
| --- | --- |
| Semantic authority matrix row | SQ2 — Git Contracts / SCP as SoR for concepts, ontologies, mappings, federation |
| Semantic layer scope | SQ1 — Control Plane in; metric calculations beside |
| Experience vs SoR | SQ3 — may differ; marketplace render OK |

Candidate patch: [amendments/semantic-authority-matrix-candidate.md](amendments/semantic-authority-matrix-candidate.md)

## Transition plan inherits (Phase 1+)

1. Pilot Customer domain + selected NatCos with Git SoR + measured steward SLA (SQ10).
2. Marketplace remains product SoR; bind via DA-10 / ODCS.
3. Collibra remains glossary SoR; expand mapsTo coverage.
4. Drift detection from stub → scheduled job (SQ9).
5. Ossie round-trip before expanding tool footprint (SQ11).

## Compliance bar v2 — rule candidates (score-only first)

Per established pattern: **score-only** before enforce.

| Candidate id | Rule (draft) | Score signal |
| --- | --- | --- |
| SEM-V2-01 | Product publish references only `approved` concepts | % binds to approved |
| SEM-V2-02 | ODCS contract has semantic-concept authoritativeDefinitions for key fields | % fields covered |
| SEM-V2-03 | MappingRecord present for each implements/mapsTo/represents edge | orphan bind count |
| SEM-V2-04 | Deprecated concept has `replaced_by` within notify window | policy breach count |
| SEM-V2-05 | NatCo concept federates to global when used in enterprise product | unfederated usage |

Wire later into `dp-compliance-rules` (external); keep candidates listed here until that repo accepts them.

## Related

- All SQ pages · [Contracts SoR language](../../connected-data/10.%20Contracts/00.%20README.md)
