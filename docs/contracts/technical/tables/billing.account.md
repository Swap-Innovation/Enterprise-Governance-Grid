---
title: Technical Asset Contract — billing.account
contract_id: ctr-tech-billing-account
asset_id: asset-tbl-billing-account
kind: table
natco: natco-de
status: draft
domain: customer
---

# billing.account

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-billing-account` |
| **Asset ID** | `asset-tbl-billing-account` |
| **Kind** | `table` |
| **Qualified name** | `ord.billing.account` |
| **NATCO** | `natco-de` |
| **Catalog system** | `collibra` |
| **Catalog source_id** | `col-asset-de-billing-account-001` |
| **Context graph node** | `tbl-billing-account` |

## Semantic links (`represents`)

- [`global/customer-account`](../../../contracts/examples/pitch/tmforum.json) — SID-aligned global concept

## Linked assets & contracts

### `columns`

- [billing.account.account_id](../columns/billing.account.account_id.md) — `asset-col-billing-account-id`
- [billing.account.customer_ref](../columns/billing.account.customer_ref.md) — `asset-col-billing-customer-ref`
- [billing.account.billing_cycle](../columns/billing.account.billing_cycle.md) — `asset-col-billing-cycle`

### `feeds`

- [c360_customer_build](../pipelines/c360_customer_build.md) — `asset-pipe-c360`

### `semantics`

- `ctr-sem-customer-account`

## Contract body (JSON)

```json
{
  "id": "asset-tbl-billing-account",
  "contract_id": "ctr-tech-billing-account",
  "kind": "table",
  "name": "billing.account",
  "qualified_name": "ord.billing.account",
  "natco": "natco-de",
  "source_system": "collibra",
  "catalog_source_id": "col-asset-de-billing-account-001",
  "graph_node": "tbl-billing-account",
  "represents": [
    "global/customer-account"
  ],
  "links": {
    "columns": [
      "asset-col-billing-account-id",
      "asset-col-billing-customer-ref",
      "asset-col-billing-cycle"
    ],
    "feeds": [
      "asset-pipe-c360"
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
