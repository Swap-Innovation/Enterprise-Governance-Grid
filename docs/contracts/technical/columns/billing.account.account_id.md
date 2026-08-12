---
title: Technical Asset Contract — billing.account.account_id
contract_id: ctr-tech-col-billing-account-id
asset_id: asset-col-billing-account-id
kind: column
natco: natco-de
status: draft
domain: customer
---

# billing.account.account_id

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-col-billing-account-id` |
| **Asset ID** | `asset-col-billing-account-id` |
| **Kind** | `column` |
| **Qualified name** | `ord.billing.account.account_id` |
| **NATCO** | `natco-de` |

## Semantic links (`represents`)

- [`global/customer-account`](../../../contracts/examples/pitch/tmforum.json) — SID-aligned global concept

## Linked assets & contracts

### `table`

- [billing.account](../tables/billing.account.md) — `asset-tbl-billing-account`

### `flowsTo`

- [dp.customer_360.account_id](dp.customer_360.account_id.md) — `asset-col-c360-account-id`

## Contract body (JSON)

```json
{
  "id": "asset-col-billing-account-id",
  "contract_id": "ctr-tech-col-billing-account-id",
  "kind": "column",
  "name": "billing.account.account_id",
  "qualified_name": "ord.billing.account.account_id",
  "natco": "natco-de",
  "parent_table": "asset-tbl-billing-account",
  "represents": [
    "global/customer-account"
  ],
  "links": {
    "table": "asset-tbl-billing-account",
    "flowsTo": [
      "asset-col-c360-account-id"
    ]
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
