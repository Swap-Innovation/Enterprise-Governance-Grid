# SQ11 — Does the Apache Ossie bet hold? (portability proof)

| Field | Value |
| --- | --- |
| Status | Round-trip protocol |
| Decision | W6 |
| Owner | Thorsten + Vincent |
| Demo | [/demo/customer360/questions?q=SQ11](../../enterprise-governance-grid/) (Strategic Qs page) |

## The question

Round-trip one domain ontology: export Ossie form → import second tool → verify nothing load-bearing is lost.

## Why it matters

Buy-no-tool-now rests on portability. One successful round-trip retires risk; one failure changes strategy.

## POC recommendation

Ossie is interchange, not a second SoR. Protocol: export Customer slice → Palantir (WS4) → checklist URIs, lifecycle, mappings, federation → verdict Hold / Hold with gaps / Fail.

## In scope

- Export package
- Second-tool import harness
- Load-bearing checklist
- Written verdict

## Out of scope

- “Aligned with Ossie” as slogan without a test

## Must survive

- Concept URI / id
- Namespace membership
- Lifecycle status
- MappingRecord source→target + predicate
- FederationEdge from→to

## Acceptable loss

Tool UI layout, display hints, Neo4j internal ids.

## Evidence

- WS4 Palantir harness
- Vendor Entropy import/export

## Deliverable

Round-trip report: exported, survived, lost, verdict.

## Try in the demo

- **Studio · control plane** → `/demo/customer360/studio`
- **Contracts · SCP** → `/demo/customer360/contracts`

## Residual (workstreams)

Execute harness with Thorsten; vendor notes from workshop.

## Related

- Hub: [../16. Strategic Questions.md](../16.%20Strategic%20Questions.md)
- Interactive board: demo route `questions`
