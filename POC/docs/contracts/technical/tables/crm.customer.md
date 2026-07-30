---
title: Technical Asset Contract — crm.customer
contract_id: ctr-tech-crm-customer
asset_id: asset-tbl-crm-customer
kind: table
natco: natco-de
status: draft
domain: customer
---

# crm.customer

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-crm-customer` |
| **Asset ID** | `asset-tbl-crm-customer` |
| **Kind** | `table` |
| **Qualified name** | `projects/de-lake/datasets/crm/tables/customer` |
| **NATCO** | `natco-de` |
| **Catalog system** | `collibra` |
| **Catalog source_id** | `col-asset-de-crm-customer-001` |
| **Context graph node** | `tbl-crm-customer` |

## Semantic links (`represents`)

- [`global/customer`](../../../examples/tmforum.json) — SID-aligned global concept

## Linked assets & contracts

### `columns`

- [crm.customer.party_id](../columns/crm.customer.party_id.md) — `asset-col-crm-party-id`
- [crm.customer.email](../columns/crm.customer.email.md) — `asset-col-crm-email`
- [crm.customer.status](../columns/crm.customer.status.md) — `asset-col-crm-status`

### `feeds`

- [c360_customer_build](../pipelines/c360_customer_build.md) — `asset-pipe-c360`
- [customer.cdc.v1](../topics/customer.cdc.v1.md) — `asset-topic-cdc`

### `semantics`

- `ctr-sem-customer`

### `mappings`

- `map-tech-de-crm-customer-001`

## Contract body (JSON)

```json
{
  "id": "asset-tbl-crm-customer",
  "contract_id": "ctr-tech-crm-customer",
  "kind": "table",
  "name": "crm.customer",
  "qualified_name": "projects/de-lake/datasets/crm/tables/customer",
  "natco": "natco-de",
  "source_system": "collibra",
  "catalog_source_id": "col-asset-de-crm-customer-001",
  "graph_node": "tbl-crm-customer",
  "represents": [
    "global/customer"
  ],
  "links": {
    "columns": [
      "asset-col-crm-party-id",
      "asset-col-crm-email",
      "asset-col-crm-status"
    ],
    "feeds": [
      "asset-pipe-c360",
      "asset-topic-cdc"
    ],
    "semantics": [
      "ctr-sem-customer"
    ],
    "mappings": [
      "map-tech-de-crm-customer-001"
    ]
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
