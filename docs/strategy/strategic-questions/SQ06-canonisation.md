# SQ6 — What is the canonisation strategy? (promotion and demotion)

| Field | Value |
| --- | --- |
| Status | POC criteria |
| Decision | W6 |
| Owner | Architecture |
| Demo | [/demo/customer360/questions?q=SQ6](https://swapkodgire.github.io/Enterprise_governance_grid/demo/customer360/questions?q=SQ6) (Strategic Qs page) |

## The question

Criteria for a domain concept entering the global core, and the reverse path when usage does not materialise.

## Why it matters

“Thin global core” is a design principle; without demotion the core only grows into the canonical vocabulary the charter forbids.

## POC recommendation

Promote when ≥2 domains/NatCos (or enterprise product spanning NatCos), stable window (POC default 30 days), no unresolved conflict, recorded approval, and at least one consumer. Demote when usage fails to materialise.

## In scope

- Promotion checklist
- Demotion triggers and decision_ref
- Customer federation as PoC promotion evidence

## Out of scope

- Promotion by exception with no demotion path
- Core growth without usage evidence

## Promotion criteria (all required)

- Used by ≥2 domains or NatCos (or multi-NatCo product family)
- Stable for agreed window (POC: 30 days)
- No unresolved SQ4 conflict
- Steward + Architecture decision_ref
- At least one product or mapping ready to bind

## Demotion triggers

- <2 active consumers for 90 days → review
- Superseded → deprecated + replaced_by
- Never federated after exception → retire or move off global

## Evidence

- WS1 + WS2 promotion candidates
- Charter success criterion 3 — one promotion E2E

## Deliverable

Canonisation criteria in the governance handbook + one executed promotion.

## Try in the demo

- **Semantics · Q7 federation** → `/demo/customer360/semantics?query=Q7`
- **Semantics · N1 Germany stack** → `/demo/customer360/semantics?query=N1`

## Residual (workstreams)

Formal walked promotion event recorded at W6.

## Related

- Hub: [../16. Strategic Questions.md](../16.%20Strategic%20Questions.md)
- Interactive board: demo route `questions`
