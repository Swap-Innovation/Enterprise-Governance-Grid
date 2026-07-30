---
title: Technical Asset Contract — crm.customer.party_id
contract_id: ctr-tech-col-party-id
asset_id: asset-col-crm-party-id
kind: column
natco: natco-de
status: draft
domain: customer
---

# crm.customer.party_id

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-col-party-id` |
| **Asset ID** | `asset-col-crm-party-id` |
| **Kind** | `column` |
| **Qualified name** | `projects/de-lake/datasets/crm/tables/customer/columns/party_id` |
| **NATCO** | `natco-de` |
| **Catalog system** | `collibra` |
| **Context graph node** | `col-src-party-id` |

## Semantic links (`represents`)

- [`global/customer-identifier`](../../../examples/tmforum.json) — SID-aligned global concept

## Linked assets & contracts

### `table`

- [crm.customer](../tables/crm.customer.md) — `asset-tbl-crm-customer`

### `flowsTo`

- [dp.customer_360.customer_id](dp.customer_360.customer_id.md) — `asset-col-c360-customer-id`

### `semantics`

- `ctr-sem-customer-id`

## Contract body (JSON)

```json
{
  "id": "asset-col-crm-party-id",
  "contract_id": "ctr-tech-col-party-id",
  "kind": "column",
  "name": "crm.customer.party_id",
  "qualified_name": "projects/de-lake/datasets/crm/tables/customer/columns/party_id",
  "natco": "natco-de",
  "source_system": "collibra",
  "parent_table": "asset-tbl-crm-customer",
  "graph_node": "col-src-party-id",
  "represents": [
    "global/customer-identifier"
  ],
  "links": {
    "table": "asset-tbl-crm-customer",
    "flowsTo": [
      "asset-col-c360-customer-id"
    ],
    "semantics": [
      "ctr-sem-customer-id"
    ]
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
