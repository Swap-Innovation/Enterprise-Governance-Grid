# SQ7 — Who consumes the layer, and what can they do that they could not before?

| Field | Value |
| --- | --- |
| Status | POC demo checklist |
| Decision | W6 — demos decide |
| Owner | WS4 Thorsten · WS5 Daniel · Architecture (agent) |
| Demo | [/demo/customer360/questions?q=SQ7](https://swapkodgire.github.io/Enterprise_governance_grid/demo/customer360/questions?q=SQ7) (Strategic Qs page) |

## The question

Name consumers and demonstrate: marketplace concept→products; BI definition pickup; external platform consume; one agent-shaped query.

## Why it matters

Feasibility without a consumer convinces nobody. Producer work is cost; consumers are the return.

## POC recommendation

Three live journeys plus one machine-driven query. POC stand-ins: Marketplace→Q3, Concept definition for BI pattern, kg-api for platforms, Q6/Q3 for agent-shaped “which products implement Customer?”

## In scope

- Marketplace navigation to lineage
- BI definition pickup pattern
- External/API consumption
- Agent-shaped curated query

## Out of scope

- Slide-only consumer stories without live demo

## Journeys

- (a) Marketplace user: product → Semantics lineage to SID Concept
- (b) BI: pull concept definition/URI; measures stay beside (SQ1)
- (c) External platform: kg-api / package import (WS4 harness)
- (d) Agent: curated Cypher/API answering product↔concept questions

## Evidence

- WS4
- WS5
- Marketplace
- Model AI / agent

## Deliverable

Three named consumer journeys demonstrated live; one machine-driven.

## Try in the demo

- **Marketplace** → `/demo/customer360/marketplace`
- **Semantics · Q3 product path** → `/demo/customer360/semantics?query=Q3`
- **Semantics · Q6 all products** → `/demo/customer360/semantics?query=Q6`

## Residual (workstreams)

WS4/WS5 live demos at W6; replace Customer stand-in with churn/network when data exists.

## Related

- Hub: [../16. Strategic Questions.md](../16.%20Strategic%20Questions.md)
- Interactive board: demo route `questions`
