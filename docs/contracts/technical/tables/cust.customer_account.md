---
title: Technical Asset Contract — cust.customer_account
contract_id: ctr-tech-cust-account
asset_id: asset-tbl-cust-account
kind: table
natco: natco-de
status: draft
domain: customer
---

# cust.customer_account

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-cust-account` |
| **Asset ID** | `asset-tbl-cust-account` |
| **Kind** | `table` |
| **Qualified name** | `cust.customer_account` |
| **NATCO** | `natco-de` |
| **Catalog system** | `collibra` |
| **Catalog source_id** | `col-asset-de-acct-001` |
| **Mapping ID** | `map-tech-de-acct-table-001` |

## Semantic links (`represents`)

- [`global/customer-account`](../../../examples/tmforum.json) — SID-aligned global concept

## Linked assets & contracts

### `semantics`

- `ctr-sem-customer-account`

### `related_alias`

- [billing.account](billing.account.md) — `asset-tbl-billing-account`

## Contract body (JSON)

```json
{
  "id": "asset-tbl-cust-account",
  "contract_id": "ctr-tech-cust-account",
  "kind": "table",
  "name": "cust.customer_account",
  "qualified_name": "cust.customer_account",
  "natco": "natco-de",
  "source_system": "collibra",
  "catalog_source_id": "col-asset-de-acct-001",
  "mapping_id": "map-tech-de-acct-table-001",
  "represents": [
    "global/customer-account"
  ],
  "links": {
    "semantics": [
      "ctr-sem-customer-account"
    ],
    "related_alias": "asset-tbl-billing-account"
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
