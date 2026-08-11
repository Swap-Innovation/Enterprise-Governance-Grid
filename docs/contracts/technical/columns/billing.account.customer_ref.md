---
title: Technical Asset Contract — billing.account.customer_ref
contract_id: ctr-tech-col-billing-customer-ref
asset_id: asset-col-billing-customer-ref
kind: column
natco: natco-de
status: draft
domain: customer
---

# billing.account.customer_ref

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-col-billing-customer-ref` |
| **Asset ID** | `asset-col-billing-customer-ref` |
| **Kind** | `column` |
| **Qualified name** | `ord.billing.account.customer_ref` |
| **NATCO** | `natco-de` |

## Semantic links (`represents`)

- [`global/customer`](../../../examples/tmforum.json) — SID-aligned global concept

## Linked assets & contracts

### `table`

- [billing.account](../tables/billing.account.md) — `asset-tbl-billing-account`

## Contract body (JSON)

```json
{
  "id": "asset-col-billing-customer-ref",
  "contract_id": "ctr-tech-col-billing-customer-ref",
  "kind": "column",
  "name": "billing.account.customer_ref",
  "qualified_name": "ord.billing.account.customer_ref",
  "natco": "natco-de",
  "parent_table": "asset-tbl-billing-account",
  "represents": [
    "global/customer"
  ],
  "links": {
    "table": "asset-tbl-billing-account"
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
