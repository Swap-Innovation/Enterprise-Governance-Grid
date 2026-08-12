# SQ9 — How do we detect semantic drift?

| Field | Value |
| --- | --- |
| Status | Concept note · build autumn |
| Decision | Concept at W6 |
| Owner | Architecture |
| Demo | [/demo/customer360/questions?q=SQ9](https://swapkodgire.github.io/Enterprise_governance_grid/demo/customer360/questions?q=SQ9) (Strategic Qs page) |

## The question

Governance covers who may change meaning; nothing yet detects silent divergence — e.g. schema change breaks mappings.

## Why it matters

A registry that only accretes becomes confidently wrong. Drift detection keeps “trust as data” honest.

## POC recommendation

Stub: scheduled AI remapping pass, diff vs MappingRecord set, steward triage. Cadence weekly for pilot. Automate tickets in autumn.

## In scope

- Declared-vs-observed diffs
- Cadence and ownership
- One executed demo diff

## Out of scope

- Assuming approved mappings stay correct forever

## Mechanism

- Signal — re-run enrichment / mapping suggest
- Compare — diff vs current MappingRecords
- Output — added / removed / changed targets
- Actor — domain steward triage; Architecture owns false-positive rate

## Evidence

- WS1 re-run enrichment
- Model AI mapping pass

## Deliverable

Drift-detection concept note + one executed diff demonstration.

## Try in the demo

- **Semantics · technical lineage Q4** → `/demo/customer360/semantics?query=Q4`
- **Studio** → `/demo/customer360/studio`

## Residual (workstreams)

Scheduled automation in autumn.

## Related

- Hub: [../16. Strategic Questions.md](../16.%20Strategic%20Questions.md)
- Interactive board: demo route `questions`
