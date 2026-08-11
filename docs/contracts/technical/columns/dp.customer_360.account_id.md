---
title: Technical Asset Contract — dp.customer_360.account_id
contract_id: ctr-tech-col-account-id
asset_id: asset-col-c360-account-id
kind: column
natco: global
status: draft
domain: customer
---

# dp.customer_360.account_id

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-col-account-id` |
| **Asset ID** | `asset-col-c360-account-id` |
| **Kind** | `column` |
| **Qualified name** | `projects/global-lake/datasets/dp/tables/customer_360/columns/account_id` |
| **NATCO** | `global` |
| **Context graph node** | `col-account-id` |

## Semantic links (`represents`)

- [`global/customer-account`](../../../examples/tmforum.json) — SID-aligned global concept

## Linked assets & contracts

### `table`

- [dp.customer_360](../tables/dp.customer_360.md) — `asset-tbl-c360`

### `flowsFrom`

- [billing.account.account_id](billing.account.account_id.md) — `asset-col-billing-account-id`

### `semantics`

- `ctr-sem-customer-account`

## Contract body (JSON)

```json
{
  "id": "asset-col-c360-account-id",
  "contract_id": "ctr-tech-col-account-id",
  "kind": "column",
  "name": "dp.customer_360.account_id",
  "qualified_name": "projects/global-lake/datasets/dp/tables/customer_360/columns/account_id",
  "natco": "global",
  "parent_table": "asset-tbl-c360",
  "graph_node": "col-account-id",
  "represents": [
    "global/customer-account"
  ],
  "links": {
    "table": "asset-tbl-c360",
    "flowsFrom": [
      "asset-col-billing-account-id"
    ],
    "semantics": [
      "ctr-sem-customer-account"
    ]
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
