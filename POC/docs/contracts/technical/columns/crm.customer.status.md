---
title: Technical Asset Contract — crm.customer.status
contract_id: ctr-tech-col-crm-status
asset_id: asset-col-crm-status
kind: column
natco: natco-de
status: draft
domain: customer
---

# crm.customer.status

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-col-crm-status` |
| **Asset ID** | `asset-col-crm-status` |
| **Kind** | `column` |
| **Qualified name** | `projects/de-lake/datasets/crm/tables/customer/columns/status` |
| **NATCO** | `natco-de` |
| **Catalog system** | `collibra` |

## Linked assets & contracts

### `table`

- [crm.customer](../tables/crm.customer.md) — `asset-tbl-crm-customer`

## Contract body (JSON)

```json
{
  "id": "asset-col-crm-status",
  "contract_id": "ctr-tech-col-crm-status",
  "kind": "column",
  "name": "crm.customer.status",
  "qualified_name": "projects/de-lake/datasets/crm/tables/customer/columns/status",
  "natco": "natco-de",
  "source_system": "collibra",
  "parent_table": "asset-tbl-crm-customer",
  "graph_node": null,
  "represents": [],
  "links": {
    "table": "asset-tbl-crm-customer"
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
