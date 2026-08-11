---
title: Technical Asset Contract — ord.product_order
contract_id: ctr-tech-ord-product-order
asset_id: asset-tbl-ord-product-order
kind: table
natco: natco-de
status: draft
domain: customer
---

# ord.product_order

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-ord-product-order` |
| **Asset ID** | `asset-tbl-ord-product-order` |
| **Kind** | `table` |
| **Qualified name** | `ord.product_order` |
| **NATCO** | `natco-de` |
| **Catalog system** | `collibra` |
| **Catalog source_id** | `col-asset-de-order-001` |
| **Mapping ID** | `map-tech-de-order-table-001` |

## Semantic links (`represents`)

- [`global/product-order`](../../../examples/tmforum.json) — SID-aligned global concept

## Linked assets & contracts

### `semantics`

- `ctr-sem-product-order`

## Contract body (JSON)

```json
{
  "id": "asset-tbl-ord-product-order",
  "contract_id": "ctr-tech-ord-product-order",
  "kind": "table",
  "name": "ord.product_order",
  "qualified_name": "ord.product_order",
  "natco": "natco-de",
  "source_system": "collibra",
  "catalog_source_id": "col-asset-de-order-001",
  "mapping_id": "map-tech-de-order-table-001",
  "represents": [
    "global/product-order"
  ],
  "links": {
    "semantics": [
      "ctr-sem-product-order"
    ]
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
