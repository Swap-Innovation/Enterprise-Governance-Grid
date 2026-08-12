# SQ3 — How do people and machines interact? (experience)

| Field | Value |
| --- | --- |
| Status | **POC blueprint** · co-design 24 Aug · confirm W6 |
| Owner | Vincent (workshop) · workstream leads |
| Evidence | WS1 authoring · WS2 steward · WS5 BI consumption |

## Principle

Federation lives or dies on **domain self-service**. Architects design the rails; domains and stewards ride them. SoR (SQ2) and experience (this SQ) may differ: e.g. Git SoR + marketplace / Collibra / Grid UI for interaction.

## Journeys (POC blueprint)

### 1. Producer — domain member adds a concept

| Step | Actor | Surface (POC) |
| --- | --- | --- |
| Propose | Domain member | PR to `Semantic Control Plane/` or Contracts UI folders |
| Annotate | Domain member | URI, namespace, kind, description |
| Link | Domain member | Optional draft MappingRecord / federation proposal |
| Demo | — | `/demo/customer360/contracts` (pack folders) |

### 2. Steward — review and approve

| Step | Actor | Surface (POC) |
| --- | --- | --- |
| Review | Domain / global steward | PR review + [governance states](../06.%20Governance%20Examples.md) |
| Approve | Steward / council | Lifecycle → `approved` (POL-SEM-02) |
| Reject / conflict | Steward | Escalate per [SQ4](SQ04-governance-and-conflict.md) |
| Demo | — | Governance examples + MappingRecord in Semantics KG |

### 3. Consumer — browse concept → product

| Step | Actor | Surface (POC) |
| --- | --- | --- |
| Discover | Marketplace user | `/demo/customer360/marketplace` |
| Navigate meaning | Consumer | Product → Semantics Q3 lineage |
| Trust gate | Consumer | Only approved concepts bind products |
| Demo | — | Marketplace CTA → `/semantics?query=Q3&product=…` |

### 4. Machine — API / agents

| Step | Actor | Surface (POC) |
| --- | --- | --- |
| Health / catalog | Service | `GET /api/kg/health` · `GET /api/kg/queries` |
| Lineage query | Agent / Model AI | `POST /api/kg/queries/run` (Q1–Q7, N1–N5) |
| Contract bind | Pipeline | ODCS `authoritativeDefinitions` → concept IRIs |
| Demo | — | Live kg-api · Pages mock snapshots |

## 24 Aug workshop outcomes (expected)

Co-designed blueprint refining the four journeys with vendor UX; must not silently move SoR (SQ2). Capture: click-paths, approval widgets, API contracts, accessibility for NatCo stewards.

## Related

- [SQ2 SoR](SQ02-registry-sor.md) · [SQ7 Consumers](SQ07-consumers.md) · [SQ10 Stewardship](SQ10-stewardship-ops.md)
