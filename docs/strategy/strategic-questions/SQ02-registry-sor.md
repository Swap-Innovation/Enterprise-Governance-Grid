# SQ2 — Where does the registry live? (system of record)

| Field | Value |
| --- | --- |
| Status | POC recommendation · criteria frozen |
| Decision | Criteria pre-workshop · decision at W6 |
| Owner | Vincent + Architecture |
| Demo | [/demo/customer360/questions?q=SQ2](https://swapkodgire.github.io/Enterprise_governance_grid/demo/customer360/questions?q=SQ2) (Strategic Qs page) |

## The question

Marketplace (Entropy) or Git — which system is SoR for concepts, ontologies and mappings? Separated from SQ3: record and interaction surface may differ.

## Why it matters

The authority matrix requires exactly one system of record per metadata kind; the semantic row was the open one.

## POC recommendation

Git Contracts (Semantic Control Plane pack) is SoR for concepts, ontologies, mappings, and federation. Entropy Marketplace is SoR for products; Collibra for glossary prose. Marketplace may render meaning; it does not own it. Neo4j is a query materialisation, not SoR.

## In scope

- Git · contracts/Semantic Control Plane/
- Versioned MappingRecord and FederationEdge files
- Criteria-scored decision before vendor demo

## Out of scope

- Entropy as sole writable meaning SoR
- Neo4j as authoritative store
- Collibra as enterprise concept SoR

## Authority split

One SoR per metadata kind:

- Concepts / namespaces / mappings / federation → Git SCP
- Glossary prose → Collibra
- Product identity / ODCS → Entropy Marketplace
- Physical inventory → Technical Catalog

## Asymmetry corrected

WS1 builds ontology depth on the marketplace path. This POC exercises the Git path with equal depth (Contracts packs + Neo4j seed + enrich). Git is the candidate SoR; marketplace is the candidate experience surface (SQ3).

## Vendor demo must prove

- Entropy can render concepts without becoming the only writable copy
- Round-trip to Ossie/Git without losing URI, lifecycle, mapping ids
- Approval hooks that map to steward SLA

## Evidence

- WS1 marketplace path
- WS6 Git-first counterpart
- Vendor workshop (Entropy hold/render)

## Deliverable

Decision paper with frozen criteria: authoring friction, review/approval, versioning fidelity, API access, Ossie I/O, operational cost.

## Try in the demo

- **Contracts folders** → `/demo/customer360/contracts`
- **Studio · control plane** → `/demo/customer360/studio`

## Residual (workstreams)

Vendor workshop validates Entropy as render/edit UI with Git still SoR.

## Related

- Hub: [../16. Strategic Questions.md](../16.%20Strategic%20Questions.md)
- Interactive board: demo route `questions`
