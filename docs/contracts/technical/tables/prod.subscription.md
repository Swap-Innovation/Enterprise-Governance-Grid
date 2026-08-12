---
title: Technical Asset Contract — prod.subscription
contract_id: ctr-tech-prod-subscription
asset_id: asset-tbl-prod-subscription
kind: table
natco: natco-de
status: draft
domain: customer
---

# prod.subscription

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-prod-subscription` |
| **Asset ID** | `asset-tbl-prod-subscription` |
| **Kind** | `table` |
| **Qualified name** | `projects/de-lake/datasets/prod/tables/subscription` |
| **NATCO** | `natco-de` |
| **Catalog system** | `dataplex` |
| **Catalog source_id** | `dpx-entry-de-prod-subscription-001` |
| **Mapping ID** | `map-tech-de-prod-table-001` |

## Semantic links (`represents`)

- [`global/product`](../../../contracts/examples/pitch/tmforum.json) — SID-aligned global concept

## Linked assets & contracts

### `semantics`

- `ctr-sem-product`

## Contract body (JSON)

```json
{
  "id": "asset-tbl-prod-subscription",
  "contract_id": "ctr-tech-prod-subscription",
  "kind": "table",
  "name": "prod.subscription",
  "qualified_name": "projects/de-lake/datasets/prod/tables/subscription",
  "natco": "natco-de",
  "source_system": "dataplex",
  "catalog_source_id": "dpx-entry-de-prod-subscription-001",
  "mapping_id": "map-tech-de-prod-table-001",
  "represents": [
    "global/product"
  ],
  "links": {
    "semantics": [
      "ctr-sem-product"
    ]
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
