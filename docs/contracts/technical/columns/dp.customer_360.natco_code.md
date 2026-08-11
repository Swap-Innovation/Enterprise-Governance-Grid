---
title: Technical Asset Contract — dp.customer_360.natco_code
contract_id: ctr-tech-col-c360-natco
asset_id: asset-col-c360-natco
kind: column
natco: global
status: draft
domain: customer
---

# dp.customer_360.natco_code

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-col-c360-natco` |
| **Asset ID** | `asset-col-c360-natco` |
| **Kind** | `column` |
| **Qualified name** | `projects/global-lake/datasets/dp/tables/customer_360/columns/natco_code` |
| **NATCO** | `global` |

## Linked assets & contracts

### `table`

- [dp.customer_360](../tables/dp.customer_360.md) — `asset-tbl-c360`

## Contract body (JSON)

```json
{
  "id": "asset-col-c360-natco",
  "contract_id": "ctr-tech-col-c360-natco",
  "kind": "column",
  "name": "dp.customer_360.natco_code",
  "qualified_name": "projects/global-lake/datasets/dp/tables/customer_360/columns/natco_code",
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
