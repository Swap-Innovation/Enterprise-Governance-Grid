# SQ3 — How do people and machines interact? (experience)

| Field | Value |
| --- | --- |
| Status | POC blueprint · co-design 24 Aug |
| Decision | 24 Aug workshop · confirm W6 |
| Owner | Vincent (workshop) · workstream leads |
| Demo | [/demo/customer360/questions?q=SQ3](https://swapkodgire.github.io/Enterprise_governance_grid/demo/customer360/questions?q=SQ3) (Strategic Qs page) |

## The question

Authoring (domain adds concept), review (steward approves), browsing (consumer navigates concept → product), and machine interface (API for contracts, Model AI, agents).

## Why it matters

Federation lives or dies on domain self-service; a registry only architects can use is a bottleneck with a wiki attached.

## POC recommendation

Four journeys demable in this Grid: Contracts folders (producer), governance + MappingRecord (steward), Marketplace → Semantics (consumer), /api/kg/* (machine). SoR (SQ2) and UX may differ.

## In scope

- Producer PR / Contracts UI
- Steward review and approval
- Consumer marketplace → lineage
- Machine kg-api and agents

## Out of scope

- Architects doing all domain authoring
- Moving SoR silently during UX co-design

## Producer

Domain member proposes a concept via PR to the SCP pack or Contracts UI, with URI, namespace, kind, and optional draft mapping.

## Steward

Review → approve to lifecycle approved (POL-SEM-02). Reject or escalate conflicts per SQ4.

## Consumer

Discover in Marketplace, open Semantics Q3 lineage for a product, trust only approved concept binds.

## Machine

GET /api/kg/health and queries; POST run for Q1–Q7 / N1–N5; ODCS authoritativeDefinitions resolve to concept IRIs.

## Evidence

- WS1 tribal knowledge authoring
- WS2 steward workflows
- WS5 BI consumption

## Deliverable

Co-designed experience blueprint (producer, steward, consumer, machine) with vendor.

## Try in the demo

- **Marketplace** → `/demo/customer360/marketplace`
- **Contracts** → `/demo/customer360/contracts`
- **Semantics** → `/demo/customer360/semantics`
- **Guided tour** → `/demo/customer360/guided`

## Residual (workstreams)

24 Aug co-design polish with vendor; must not change SoR.

## Related

- Hub: [../16. Strategic Questions.md](../16.%20Strategic%20Questions.md)
- Interactive board: demo route `questions`
