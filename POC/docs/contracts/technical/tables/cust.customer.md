---
title: Technical Asset Contract — cust.customer
contract_id: ctr-tech-cust-customer
asset_id: asset-tbl-cust-customer
kind: table
natco: natco-de
status: draft
domain: customer
---

# cust.customer

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-cust-customer` |
| **Asset ID** | `asset-tbl-cust-customer` |
| **Kind** | `table` |
| **Qualified name** | `cust.customer` |
| **NATCO** | `natco-de` |
| **Catalog system** | `collibra` |
| **Catalog source_id** | `col-asset-de-cust-customer-001` |
| **Mapping ID** | `map-tech-de-cust-table-001` |
| **Grain** | One row per customer_id |

## Semantic links (`represents`)

- [`global/customer`](../../../examples/tmforum.json) — SID-aligned global concept

## Linked assets & contracts

### `columns`

- [cust.customer.customer_id](../columns/cust.customer.customer_id.md) — `asset-col-cust-customer-id`

### `semantics`

- `ctr-sem-customer`

### `related_alias`

- [crm.customer](crm.customer.md) — `asset-tbl-crm-customer`

## Contract body (JSON)

```json
{
  "id": "asset-tbl-cust-customer",
  "contract_id": "ctr-tech-cust-customer",
  "kind": "table",
  "name": "cust.customer",
  "qualified_name": "cust.customer",
  "natco": "natco-de",
  "source_system": "collibra",
  "catalog_source_id": "col-asset-de-cust-customer-001",
  "mapping_id": "map-tech-de-cust-table-001",
  "graph_node": null,
  "represents": [
    "global/customer"
  ],
  "grain": "One row per customer_id",
  "links": {
    "columns": [
      "asset-col-cust-customer-id"
    ],
    "semantics": [
      "ctr-sem-customer"
    ],
    "related_alias": "asset-tbl-crm-customer"
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
