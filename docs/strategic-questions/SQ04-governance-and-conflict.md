# SQ4 — Governance model — including conflict

| Field | Value |
| --- | --- |
| Status | **POC handbook v1 outline** |
| Decision | W6 |
| Owner | Architecture + domain stewards |
| Evidence | WS1 · WS2 NatCo glossary conflicts · PoC must provoke one conflict |

## Happy path (add / approve)

Aligned with [Governance Examples](../06.%20Governance%20Examples.md):

| Role | Action |
| --- | --- |
| Domain steward | Add / change via PR-style flow (draft → review) |
| Architecture / Global Semantic Council | Review promotions to `global` |
| Product teams | Map fields / ports to **approved** concepts only |
| Mapping Engine | Reject binds to non-approved concepts (POL-SEM-02) |

**Validation counts (W6 evidence):**

- N concepts added via domain PRs (record N from WS1/WS2)
- One promotion walked end-to-end (see [SQ6](SQ06-canonisation.md))
- One conflict resolved through the mechanism below

## Conflict mechanism (the missing half)

**Problem:** two domains claim the same term with incompatible meanings (the “customer” problem).

### Detection

- Duplicate preferred labels across namespaces without a federation edge
- Competing `mapsTo` / `implements` targets for the same catalog asset
- Steward or CI check flags label collision in `global`

### Resolution path (POC)

1. **Freeze** — neither claim may be `approved` in `global` until resolved; NATCO concepts may remain local.
2. **Convene** — Domain stewards + Architecture (time-boxed, e.g. 5 business days).
3. **Decide one of:**
   - **Federate** — local concepts `FEDERATES` / `sameAs` a single global Concept (NATCO Customer pattern).
   - **Disambiguate** — two global concepts with distinct URIs and clear scope notes.
   - **Defer** — keep both as NATCO-only; no product hard-gate on global until ready.
4. **Record** — Decision log entry on the Concept / FederationEdge (`decision_ref`, date, owners).
5. **Notify** — Product and mapping owners if binds must change.

### PoC provoke case

Use **Customer** vs NATCO local terms (Kunde / Kupac / Ügyfél / Klient): incompatible local labels, compatible meaning via federation to `global/Customer`. Walk the conflict as “claimed same business word, resolved by federation not by seniority.”

## What is not governance

- Architects performing all domain adds (bottleneck)
- Settling disputes only in meetings with no written decision_ref
- Deprecation without `replaced_by` and NATCO notify window

## Related

- [SQ5 Lifecycle](SQ05-lifecycle-versioning.md) · [SQ6 Canonisation](SQ06-canonisation.md) · [SQ10 Stewardship](SQ10-stewardship-ops.md)
