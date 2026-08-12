---
title: Technical Asset Contract — dp.customer_360
contract_id: ctr-tech-c360-table
asset_id: asset-tbl-c360
kind: table
natco: global
status: draft
domain: customer
---

# dp.customer_360

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-c360-table` |
| **Asset ID** | `asset-tbl-c360` |
| **Kind** | `table` |
| **Display name** | Customer 360 table |
| **Qualified name** | `projects/global-lake/datasets/dp/tables/customer_360` |
| **NATCO** | `global` |
| **Catalog system** | `dataplex` |
| **Grain** | one row per customer_id |
| **Context graph node** | `tbl-c360` |

## Semantic links (`represents`)

- [`global/customer`](../../../contracts/examples/pitch/tmforum.json) — SID-aligned global concept

## Linked assets & contracts

### `columns`

- [dp.customer_360.customer_id](../columns/dp.customer_360.customer_id.md) — `asset-col-c360-customer-id`
- [dp.customer_360.account_id](../columns/dp.customer_360.account_id.md) — `asset-col-c360-account-id`
- [dp.customer_360.status](../columns/dp.customer_360.status.md) — `asset-col-c360-status`
- [dp.customer_360.natco_code](../columns/dp.customer_360.natco_code.md) — `asset-col-c360-natco`
- [dp.customer_360.valid_from](../columns/dp.customer_360.valid_from.md) — `asset-col-c360-valid-from`

### `producedBy`

- [c360_customer_build](../pipelines/c360_customer_build.md) — `asset-pipe-c360`

### `partOf`

- `ctr-prod-global-c360`

### `validatedBy`

- [test_c360_pk_unique](../tests/test_c360_pk_unique.md) — `asset-test-c360-pk`

### `contract`

- `ctr-gov-odcs-c360`

### `ownedBy`

- `ctr-org-data-eng`

### `semantics`

- `ctr-sem-customer`

## Contract body (JSON)

```json
{
  "id": "asset-tbl-c360",
  "contract_id": "ctr-tech-c360-table",
  "kind": "table",
  "name": "dp.customer_360",
  "display_name": "Customer 360 table",
  "qualified_name": "projects/global-lake/datasets/dp/tables/customer_360",
  "natco": "global",
  "source_system": "dataplex",
  "graph_node": "tbl-c360",
  "represents": [
    "global/customer"
  ],
  "grain": "one row per customer_id",
  "links": {
    "columns": [
      "asset-col-c360-customer-id",
      "asset-col-c360-account-id",
      "asset-col-c360-status",
      "asset-col-c360-natco",
      "asset-col-c360-valid-from"
    ],
    "producedBy": [
      "asset-pipe-c360"
    ],
    "partOf": [
      "ctr-prod-global-c360"
    ],
    "validatedBy": [
      "asset-test-c360-pk"
    ],
    "contract": [
      "ctr-gov-odcs-c360"
    ],
    "ownedBy": [
      "ctr-org-data-eng"
    ],
    "semantics": [
      "ctr-sem-customer"
    ]
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
