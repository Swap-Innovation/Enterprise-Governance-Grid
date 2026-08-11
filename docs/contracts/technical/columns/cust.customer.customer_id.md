---
title: Technical Asset Contract — cust.customer.customer_id
contract_id: ctr-tech-col-cust-customer-id
asset_id: asset-col-cust-customer-id
kind: column
natco: natco-de
status: draft
domain: customer
---

# cust.customer.customer_id

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-col-cust-customer-id` |
| **Asset ID** | `asset-col-cust-customer-id` |
| **Kind** | `column` |
| **Qualified name** | `cust.customer.customer_id` |
| **NATCO** | `natco-de` |
| **Catalog system** | `collibra` |
| **Catalog source_id** | `col-asset-de-cust-customer-id-001` |
| **Mapping ID** | `map-tech-de-cust-id-001` |

## Semantic links (`represents`)

- [`global/customer`](../../../examples/tmforum.json) — SID-aligned global concept

## Linked assets & contracts

### `table`

- [cust.customer](../tables/cust.customer.md) — `asset-tbl-cust-customer`

### `semantics`

- `ctr-sem-customer`
- `ctr-sem-customer-id`

## Contract body (JSON)

```json
{
  "id": "asset-col-cust-customer-id",
  "contract_id": "ctr-tech-col-cust-customer-id",
  "kind": "column",
  "name": "cust.customer.customer_id",
  "qualified_name": "cust.customer.customer_id",
  "natco": "natco-de",
  "source_system": "collibra",
  "catalog_source_id": "col-asset-de-cust-customer-id-001",
  "mapping_id": "map-tech-de-cust-id-001",
  "parent_table": "asset-tbl-cust-customer",
  "represents": [
    "global/customer"
  ],
  "links": {
    "table": "asset-tbl-cust-customer",
    "semantics": [
      "ctr-sem-customer",
      "ctr-sem-customer-id"
    ]
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
