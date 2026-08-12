# SQ5 — How do concepts, ontologies and mappings version?

| Field | Value |
| --- | --- |
| Status | POC specification draft |
| Decision | Draft pre-workshop · ratify W6 |
| Owner | Architecture |
| Demo | [/demo/customer360/questions?q=SQ5](https://swapkodgire.github.io/Enterprise_governance_grid/demo/customer360/questions?q=SQ5) (Strategic Qs page) |

## The question

Three artifacts version differently: concept lifecycle states, ontology semver, and mapping versions that can break while concepts stay stable.

## Why it matters

Without a lifecycle, “deprecated” means “someone said so in a meeting”; without mapping versioning, semantic quality claims are unverifiable.

## POC recommendation

Concepts: draft → review → approved/active → deprecated → retired. Ontologies: semver on namespace slices. Mappings: first-class MappingRecord versions; most real-world drift lives here.

## In scope

- Concept lifecycle states and breaking-change rules
- Ontology MAJOR/MINOR/PATCH obligations
- Independent mapping version ids

## Out of scope

- Treating concept stability as proof that mappings are correct

## Concept states

- draft / review — not bind targets
- approved/active — only valid hard-gate targets (POL-SEM-02)
- deprecated — warn; replaced_by + NatCo notify
- retired — no binds

## Ontology semver

MAJOR: removed/merged concepts — consumers must remap. MINOR: additive. PATCH: editorial.

## Mapping versioning

A concept can be stable while its mapping is wrong. Quality claims cite mapping version + concept version together.

## Evidence

- WS1 first lifecycle events
- WS6 TM Forum deprecation and remapping

## Deliverable

One lifecycle & versioning specification covering all three artifacts.

## Try in the demo

- **Semantics · MappingRecords in graph** → `/demo/customer360/semantics`
- **Contracts · concept packs** → `/demo/customer360/contracts`

## Residual (workstreams)

WS6 supplies TM Forum deprecation cases.

## Related

- Hub: [../16. Strategic Questions.md](../16.%20Strategic%20Questions.md)
- Interactive board: demo route `questions`
