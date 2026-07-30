---
title: Technical Asset Contract — billing.account.billing_cycle
contract_id: ctr-tech-col-billing-cycle
asset_id: asset-col-billing-cycle
kind: column
natco: natco-de
status: draft
domain: customer
---

# billing.account.billing_cycle

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-col-billing-cycle` |
| **Asset ID** | `asset-col-billing-cycle` |
| **Kind** | `column` |
| **Qualified name** | `ord.billing.account.billing_cycle` |
| **NATCO** | `natco-de` |

## Linked assets & contracts

### `table`

- [billing.account](../tables/billing.account.md) — `asset-tbl-billing-account`

## Contract body (JSON)

```json
{
  "id": "asset-col-billing-cycle",
  "contract_id": "ctr-tech-col-billing-cycle",
  "kind": "column",
  "name": "billing.account.billing_cycle",
  "qualified_name": "ord.billing.account.billing_cycle",
  "natco": "natco-de",
  "parent_table": "asset-tbl-billing-account",
  "represents": [],
  "links": {
    "table": "asset-tbl-billing-account"
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
