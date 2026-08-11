---
title: Technical Asset Contract — crm.customer.email
contract_id: ctr-tech-col-crm-email
asset_id: asset-col-crm-email
kind: column
natco: natco-de
status: draft
domain: customer
---

# crm.customer.email

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-col-crm-email` |
| **Asset ID** | `asset-col-crm-email` |
| **Kind** | `column` |
| **Qualified name** | `projects/de-lake/datasets/crm/tables/customer/columns/email` |
| **NATCO** | `natco-de` |
| **Catalog system** | `collibra` |
| **Classification** | `PII` |

## Linked assets & contracts

### `table`

- [crm.customer](../tables/crm.customer.md) — `asset-tbl-crm-customer`

### `classifiedAs`

- `ctr-gov-class-pii`

## Contract body (JSON)

```json
{
  "id": "asset-col-crm-email",
  "contract_id": "ctr-tech-col-crm-email",
  "kind": "column",
  "name": "crm.customer.email",
  "qualified_name": "projects/de-lake/datasets/crm/tables/customer/columns/email",
  "natco": "natco-de",
  "source_system": "collibra",
  "parent_table": "asset-tbl-crm-customer",
  "graph_node": null,
  "represents": [],
  "classification": "PII",
  "links": {
    "table": "asset-tbl-crm-customer",
    "classifiedAs": [
      "ctr-gov-class-pii"
    ]
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
