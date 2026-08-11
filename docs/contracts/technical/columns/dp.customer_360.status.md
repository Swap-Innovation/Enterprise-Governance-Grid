---
title: Technical Asset Contract — dp.customer_360.status
contract_id: ctr-tech-col-c360-status
asset_id: asset-col-c360-status
kind: column
natco: global
status: draft
domain: customer
---

# dp.customer_360.status

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-col-c360-status` |
| **Asset ID** | `asset-col-c360-status` |
| **Kind** | `column` |
| **Qualified name** | `projects/global-lake/datasets/dp/tables/customer_360/columns/status` |
| **NATCO** | `global` |

## Linked assets & contracts

### `table`

- [dp.customer_360](../tables/dp.customer_360.md) — `asset-tbl-c360`

## Contract body (JSON)

```json
{
  "id": "asset-col-c360-status",
  "contract_id": "ctr-tech-col-c360-status",
  "kind": "column",
  "name": "dp.customer_360.status",
  "qualified_name": "projects/global-lake/datasets/dp/tables/customer_360/columns/status",
  "natco": "global",
  "parent_table": "asset-tbl-c360",
  "links": {
    "table": "asset-tbl-c360"
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
