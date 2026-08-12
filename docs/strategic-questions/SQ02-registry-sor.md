# SQ2 — Where does the registry live? (system of record)

| Field | Value |
| --- | --- |
| Status | **POC recommendation** · criteria frozen for vendor workshop |
| Decision | Criteria pre-workshop; decision at W6 |
| Owner | Vincent + Architecture |
| Separated from | SQ3 (interaction surface may differ from SoR) |

## POC recommendation

| Metadata kind | System of record | Notes |
| --- | --- | --- |
| Concepts, namespaces, ontologies, mappings, federation | **Git** — `connected-data/10. Contracts/Semantic Control Plane/` | Materialised in Neo4j for query/demo; Neo4j is **not** SoR |
| Glossary prose / business terms | **Collibra** | Sources that `mapsTo` concepts |
| Data product identity & ODCS manifests | **Entropy Marketplace** | Products `implements` concepts; marketplace may **render** meaning |
| Physical inventory | Technical Catalog (Collibra / Dataplex) | `represents` → concepts |

**Known asymmetry:** WS1 builds ontology depth in the marketplace path. This POC exercises the **Git** path with equal depth (Contracts packs + Neo4j seed + enrich). That is intentional: Git is the candidate SoR; marketplace is the candidate experience surface (SQ3).

## Decision criteria (frozen before 24 Aug)

Score each 1–5 (higher = better for that criterion). Decision = weighted comparison, not vendor charm.

| Criterion | Why it matters | Git (Contracts) | Entropy (as SoR) |
| --- | --- | --- | --- |
| Authoring friction | Domain self-service | PR + review in familiar DevOps | Native UI; vendor-dependent |
| Review / approval mechanics | Steward SLA (SQ10) | Branch protection, CODEOWNERS | Workflow product features |
| Versioning fidelity | SQ5 | Git history + tags = ground truth | Must match or exceed Git |
| API / machine access | Agents, contracts, Model AI | Files + kg-api / future registry API | Vendor APIs |
| Ossie import-export | SQ11 portability bet | Export from Git/registry slice | Must not trap meaning |
| Operational cost | NatCo scale | Repo + CI; no second meaning DB | Licence + ops + lock-in risk |

**POC score (Architecture draft):** Git wins on versioning, portability, and cost; Entropy wins on authoring UX if used as **render/edit UI** with Git (or registry API) still SoR — a legitimate split with SQ3.

## What the vendor demo must prove

1. Can Entropy hold/render concepts **without** becoming the only writable copy?
2. Round-trip to Ossie / Git without loss of URI, lifecycle, mapping ids (feeds SQ11).
3. Approval hooks that map to steward SLA (feeds SQ4/SQ10).

## Related

- [SQ1 Definition](SQ01-semantic-layer-definition.md) · [SQ3 Experience](SQ03-experience-blueprint.md) · [SQ11 Ossie](SQ11-ossie-portability.md)
