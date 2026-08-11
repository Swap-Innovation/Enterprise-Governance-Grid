---
title: Technical Asset Contract — dp.customer_360.customer_id
contract_id: ctr-tech-col-customer-id
asset_id: asset-col-c360-customer-id
kind: column
natco: global
status: draft
domain: customer
---

# dp.customer_360.customer_id

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-col-customer-id` |
| **Asset ID** | `asset-col-c360-customer-id` |
| **Kind** | `column` |
| **Qualified name** | `projects/global-lake/datasets/dp/tables/customer_360/columns/customer_id` |
| **NATCO** | `global` |
| **Primary key** | yes |
| **Classification** | `PII` |
| **Context graph node** | `col-customer-id` |

## Semantic links (`represents`)

- [`global/customer-identifier`](../../../examples/tmforum.json) — SID-aligned global concept

## Linked assets & contracts

### `table`

- [dp.customer_360](../tables/dp.customer_360.md) — `asset-tbl-c360`

### `flowsFrom`

- [crm.customer.party_id](crm.customer.party_id.md) — `asset-col-crm-party-id`

### `classifiedAs`

- `ctr-gov-class-pii`

### `semantics`

- `ctr-sem-customer-id`

## Contract body (JSON)

```json
{
  "id": "asset-col-c360-customer-id",
  "contract_id": "ctr-tech-col-customer-id",
  "kind": "column",
  "name": "dp.customer_360.customer_id",
  "qualified_name": "projects/global-lake/datasets/dp/tables/customer_360/columns/customer_id",
  "natco": "global",
  "parent_table": "asset-tbl-c360",
  "graph_node": "col-customer-id",
  "represents": [
    "global/customer-identifier"
  ],
  "classification": "PII",
  "primary_key": true,
  "links": {
    "table": "asset-tbl-c360",
    "flowsFrom": [
      "asset-col-crm-party-id"
    ],
    "classifiedAs": [
      "ctr-gov-class-pii"
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
