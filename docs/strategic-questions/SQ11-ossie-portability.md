# SQ11 — Does the Apache Ossie bet hold? (portability proof)

| Field | Value |
| --- | --- |
| Status | **Round-trip protocol** |
| Decision | W6 |
| Owner | Thorsten + Vincent |
| Stance in pitch | Ossie = interchange packages, **not** a second SoR |

## Why this is not a slogan

“Aligned with Apache Ossie” (Open Semantic Interchange) needs a **concrete test**. One successful round-trip retires lock-in risk; one failure changes strategy — either result is valuable. The buy-no-tool-now position depends on it.

## Round-trip protocol

| Step | Action | Owner |
| --- | --- | --- |
| 1 | Select one domain ontology slice (Customer `global` + one NatCo) | Architecture |
| 2 | Export from registry/Git in Ossie (or Ossie-shaped) form | Vincent / tooling |
| 3 | Import into second tool (WS4 — Palantir as harness) | Thorsten |
| 4 | Verify load-bearing fields | Joint |
| 5 | Write round-trip report | Thorsten + Vincent |

### Load-bearing checklist (must survive)

- Concept URI / id
- Namespace membership
- Lifecycle status
- MappingRecord source → target + predicate (DA-08/09/10)
- FederationEdge from → to
- Labels / preferred terms needed for human review

### Acceptable loss (document explicitly)

- Tool-specific UI layout
- Non-authoritative display hints
- Demo-only Neo4j internal node ids

## Report template

| Section | Content |
| --- | --- |
| What exported | Package path, version, artifact count |
| What survived | Checklist pass/fail |
| What was lost | List + severity |
| Verdict | **Hold** / **Hold with gaps** / **Fail — change strategy** |
| Entropy side | Vendor workshop import/export notes |

## POC hooks

- [API examples](../07.%20API%20Examples.md) Ossie export stub
- Pitch: packages only — interchange, not repository
- Git SoR (SQ2) maximises exportability

## Related

- [SQ2 SoR](SQ02-registry-sor.md) · [SQ12 Amendments](SQ12-strategy-amendments.md) · [Client Pitch](../13.%20Client%20Pitch%20Guide.md)
