---
title: Technical Asset Contract — c360_customer_build
contract_id: ctr-tech-pipe-c360
asset_id: asset-pipe-c360
kind: pipeline
natco: global
status: draft
domain: customer
---

# c360_customer_build

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-pipe-c360` |
| **Asset ID** | `asset-pipe-c360` |
| **Kind** | `pipeline` |
| **Qualified name** | `jobs/entropy/c360_customer_build` |
| **NATCO** | `global` |
| **Catalog system** | `spark-dbt` |
| **Context graph node** | `pipe-c360-build` |

## Linked assets & contracts

### `inputs`

- [crm.customer](../tables/crm.customer.md) — `asset-tbl-crm-customer`
- [billing.account](../tables/billing.account.md) — `asset-tbl-billing-account`
- [customer.cdc.v1](../topics/customer.cdc.v1.md) — `asset-topic-cdc`

### `output`

- [dp.customer_360](../tables/dp.customer_360.md) — `asset-tbl-c360`

### `lineage_events`

- [OpenLineage run-8841](../lineage/openlineage-run-8841.md) — `asset-ol-8841`

### `ownedBy`

- `ctr-org-data-eng`

## Contract body (JSON)

```json
{
  "id": "asset-pipe-c360",
  "contract_id": "ctr-tech-pipe-c360",
  "kind": "pipeline",
  "name": "c360_customer_build",
  "qualified_name": "jobs/entropy/c360_customer_build",
  "natco": "global",
  "source_system": "spark-dbt",
  "graph_node": "pipe-c360-build",
  "links": {
    "inputs": [
      "asset-tbl-crm-customer",
      "asset-tbl-billing-account",
      "asset-topic-cdc"
    ],
    "output": "asset-tbl-c360",
    "lineage_events": [
      "asset-ol-8841"
    ],
    "ownedBy": [
      "ctr-org-data-eng"
    ]
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
