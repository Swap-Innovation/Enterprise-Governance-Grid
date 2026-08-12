# Candidate amendment — semantic authority matrix

**Status:** POC candidate for merge into the Metadata Management Strategy (external path may be `docs/metadata-management/metadata-management-strategy.md`).  
**Closes:** open semantic row of the authority matrix (SQ2).  
**Related:** [SQ1](../SQ01-semantic-layer-definition.md) · [SQ2](../SQ02-registry-sor.md) · [SQ12](../SQ12-strategy-amendments.md)

## Proposed authority matrix rows (semantic)

| Metadata kind | System of record | Interaction / render (non-SoR OK) | Must not |
| --- | --- | --- | --- |
| Concept (URI, definition, lifecycle) | Git Semantic Control Plane / Semantic Registry | Marketplace, Collibra, Grid UI | Dual-write without Git win |
| Namespace | Git / Namespace Registry | Same | — |
| Mapping Record | Git / Mapping Engine | Assist tools, AI first pass | Silent overwrite in catalog tools |
| Federation Edge | Git / Federation Engine | Same | — |
| Glossary prose (Business Term, …) | Collibra | — | Treat as enterprise concept SoR |
| Data product identity / ODCS | Entropy Marketplace | — | Host canonical concept definitions |
| Metric/dimension **calculations** | BI / metrics platform | KPI **name** may mapsTo Concept | Store formulas in semantic layer |
| Physical assets | Technical Catalog | — | Host concepts |

## Transition notes

1. Until W6 ratification, treat the above as **POC recommendation**.
2. After ratification, update strategy owners’ matrix and Phase 1+ transition plan.
3. Compliance rule candidates remain score-only (see SQ12).

## Diff intent (for PR description)

- Fill the previously open **semantic** SoR cell with Git / SCP.
- Clarify Collibra and Marketplace roles.
- Explicitly place metric calculations **beside** the semantic layer.
