# SQ7 — Who consumes the layer, and what can they do that they couldn't before?

| Field | Value |
| --- | --- |
| Status | **POC demo checklist** |
| Decision | W6 — decided by demos, not documents |
| Owner | WS4 Thorsten · WS5 Daniel · Architecture (agent query) |

## Principle

Feasibility without a consumer convinces nobody. Producer-side work is cost; consumers are the return.

## Named journeys (demonstrate live)

### (a) Marketplace user — concept → products

| Before | After |
| --- | --- |
| Product cards without certified meaning | Navigate product → Semantics lineage to SID Concept |
| Trust marketing copy | Trust approved concept + contract bind |

**POC demo:** `/demo/customer360/marketplace` → open Semantics with `query=Q3&product=dp-customer-360` (or family product).

### (b) BI picks up a definition (WS5)

| Before | After |
| --- | --- |
| Report author invents “customer” locally | BI pulls concept definition / URI from the layer; measures stay beside (SQ1) |

**POC demo:** show Concept `Customer` definition + KPI name `mapsTo` pattern; WS5 supplies tool-specific pickup.

### (c) External platform consumes concepts (WS4)

| Before | After |
| --- | --- |
| Point-to-point spreadsheets | Platform imports concept package / API |

**POC demo:** kg-api query catalog + [API examples](../07.%20API%20Examples.md); WS4 Palantir harness for real import.

### (d) Agent-shaped query (MARA context layer)

**Example question:** “Which products carry churn-relevant network data?”

**POC stand-in (Customer domain):** “Which marketplace products implement `global/Customer` and which NATCO tables feed them?” → Semantics **Q6** (all products) + **Q3** (one product path) via kg-api or Pages mock.

W6 should replace with a true churn/network query once WS data exists; the **pattern** is: natural-language intent → curated Cypher/API → concepts + products.

## W6 acceptance

Three journeys demonstrated **live** (not slideware); at least one machine-driven (API or agent).

## Related

- [SQ3 Experience](SQ03-experience-blueprint.md) · [SQ1 Boundary](SQ01-semantic-layer-definition.md) · [Pitch guide](../13.%20Client%20Pitch%20Guide.md)
