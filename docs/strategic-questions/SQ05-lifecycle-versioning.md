# SQ5 — Lifecycle & versioning (concepts, ontologies, mappings)

| Field | Value |
| --- | --- |
| Status | **POC specification draft** |
| Decision | Draft pre-workshop · ratify W6 |
| Owner | Architecture |
| Evidence | WS1 first lifecycle events · WS6 TM Forum deprecation / remap |

## One spec, three artifacts

Concepts, ontologies, and mappings version **differently**. Drift usually lives in **mappings**, not in concept URIs.

### A. Concept lifecycle

| State | Meaning | Allowed as bind target? |
| --- | --- | --- |
| `draft` | Proposed | No |
| `review` | Steward queue | No |
| `approved` / `active` | Certified meaning | Yes |
| `deprecated` | Still resolvable; prefer `replaced_by` | Soft — warn; no new hard gates |
| `retired` | Tombstone | No |

**Breaking definition change:** change to intension that invalidates existing mappings or product binds (e.g. narrowing Customer to exclude prospects). Requires: new Concept version or new URI, deprecation of old, remap plan, NATCO notify (see governance deprecated rule — 5 business days).

### B. Ontology versioning

Treat a namespace slice (e.g. `global` Customer ABE set) as an **ontology package** with **semver**:

| Bump | When | Consumer obligation |
| --- | --- | --- |
| MAJOR | Removed/merged concepts; incompatible URI set | Must remap; CI fails on stale binds |
| MINOR | Additive concepts / non-breaking properties | May adopt; no forced remap |
| PATCH | Editorial / documentation | None |

Release only from approved content (POL-SEM-06 Ossie/release slice).

### C. Mapping versioning

Mappings are first-class (`MappingRecord`) with their own ids and status.

| Event | Concept stable? | Mapping action |
| --- | --- | --- |
| Wrong field→concept discovered | Yes | New mapping version; deprecate old `via` |
| Schema column rename | Yes | Remap; drift job (SQ9) should flag |
| Concept deprecated | No | Mapping must retarget `replaced_by` or retire |

**Rule:** semantic quality claims cite **mapping version + concept version**, not concept alone.

## POC evidence hooks

- Concept `status` / steward fields in Contracts examples
- MappingRecord materialisation in Neo4j enrich script
- Federation edges versioned by id (`fed-…`)

## Related

- [SQ4 Governance](SQ04-governance-and-conflict.md) · [SQ9 Drift](SQ09-drift-detection.md) · [SQ6 Canonisation](SQ06-canonisation.md)
