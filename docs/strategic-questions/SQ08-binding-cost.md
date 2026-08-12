# SQ8 — How does meaning bind to data, and what does it cost?

| Field | Value |
| --- | --- |
| Status | **Playbook + cost template** (hours TBD by WS) |
| Decision | Evidence by W5 · report at W6 |
| Owner | Mihai (retrofit) · Chris (greenfield) |
| Ratified convention | ODCS `authoritativeDefinitions` with semantic-concept type (S3) |

## Binding model (load-bearing)

```text
Business Term / Entity / Attribute  ──mapsTo (DA-08)──────┐
Table / Column                      ──represents (DA-09)──┼──▶ MappingRecord ──▶ Concept
Data Product / Contract Field       ──implements (DA-10)──┘
ODCS authoritativeDefinitions (type: semantic-concept) ──▶ Concept IRI
```

POC materialises MappingRecords for every MAPS_TO / REPRESENTS / IMPLEMENTS edge in Neo4j (`enrich-from-contracts.mjs`).

## Mapping playbook

| Step | Who | Assist |
| --- | --- | --- |
| 1. Inventory fields / columns in contract | Product / data engineer | Contract template |
| 2. First-pass concept suggestions | Mapping assist (Valeria tool / skills / Model AI) | AI enrichment (WS1) |
| 3. Steward confirms or corrects | Domain steward | Review UI / PR |
| 4. Write MappingRecord + ODCS refs | Engineer / steward | CI validates approved targets |
| 5. On schema change | Owner of contract | Drift job (SQ9) + remap |

**Greenfield (cheapest):** map at design time in WS3-style new contract.  
**Retrofit:** map existing published products; expect higher hours and more conflict (SQ4).

## Cost template (fill with real numbers)

| Path | Hours per contract (median) | Notes |
| --- | --- | --- |
| Greenfield + AI first pass | _TBD — Chris_ | Measure share automated vs manual (WS1) |
| Retrofit + AI first pass | _TBD — Mihai_ | Include review cycles |
| Manual only (baseline) | _TBD_ | Control for AI lift |

Leadership asks “what does this cost per product?” — answer with the table above, not adjectives.

## When a schema change breaks mappings

1. Detect (SQ9 diff or failed CI on contract schema hash).
2. Open remap task; freeze new publishes if hard-gate depends on broken field.
3. Version mapping (SQ5); keep concept stable when possible.

## Related

- [SQ5 Versioning](SQ05-lifecycle-versioning.md) · [SQ9 Drift](SQ09-drift-detection.md) · [Data Products pack](../../connected-data/10.%20Contracts/Data%20Products/00.%20README.md)
