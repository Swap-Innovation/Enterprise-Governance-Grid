# SQ4 — What is our governance model — including conflict?

| Field | Value |
| --- | --- |
| Status | POC handbook v1 outline |
| Decision | W6 |
| Owner | Architecture + domain stewards |
| Demo | [/demo/customer360/questions?q=SQ4](../../enterprise-governance-grid/) (Strategic Qs page) |

## The question

Charter flows (domain PR, architecture promotions, product field maps) must be exercised by domain people. Unstated half: dispute resolution when two domains claim the same term incompatibly.

## Why it matters

Governance that has never processed a disagreement is a diagram. The first real conflict will otherwise be settled by seniority, not process.

## POC recommendation

Happy path: draft → review → approved. Conflict path: freeze global claims → convene → federate, disambiguate, or defer → decision_ref → notify. PoC provoke: Customer vs NATCO local terms resolved by federation.

## In scope

- Domain PR-style adds
- Promotion reviews
- Conflict freeze / convene / decide / record
- Counted validation events at W6

## Out of scope

- Architects performing all adds
- Meeting-only decisions with no decision_ref

## Conflict resolution steps

- Freeze — neither claim approved in global until resolved
- Convene — stewards + Architecture (e.g. 5 business days)
- Decide — federate, disambiguate URIs, or defer NatCo-only
- Record — decision_ref on Concept / FederationEdge
- Notify — product and mapping owners if binds change

## PoC provoke case

Kunde / Kupac / Ügyfél / Klient vs Customer: incompatible local labels, compatible meaning via federation to global/Customer — resolved by process, not seniority.

## Evidence

- WS1 governance from scratch
- WS2 NatCo glossary conflicts

## Deliverable

Governance handbook v1 validated by: N domain PRs · one promotion E2E · one conflict through the mechanism.

## Try in the demo

- **Governance page** → `/demo/customer360/governance`
- **Semantics · federation (Q7)** → `/demo/customer360/semantics?query=Q7`

## Residual (workstreams)

Domain PR counts and walked conflict event from WS1/WS2.

## Related

- Hub: [../16. Strategic Questions.md](../16.%20Strategic%20Questions.md)
- Interactive board: demo route `questions`
