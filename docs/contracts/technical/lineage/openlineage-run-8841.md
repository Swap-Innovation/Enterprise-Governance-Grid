---
title: Technical Asset Contract — OpenLineage run-8841
contract_id: ctr-tech-ol-8841
asset_id: asset-ol-8841
kind: openlineage_event
natco: global
status: draft
domain: customer
---

# OpenLineage run-8841

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-ol-8841` |
| **Asset ID** | `asset-ol-8841` |
| **Kind** | `openlineage_event` |
| **Qualified name** | `openlineage:entropy.c360/run-8841` |
| **NATCO** | `global` |
| **Context graph node** | `ol-c360-run-8841` |

## Linked assets & contracts

### `updatesLineageFor`

- [c360_customer_build](../pipelines/c360_customer_build.md) — `asset-pipe-c360`

## Contract body (JSON)

```json
{
  "id": "asset-ol-8841",
  "contract_id": "ctr-tech-ol-8841",
  "kind": "openlineage_event",
  "name": "OpenLineage run-8841",
  "qualified_name": "openlineage:entropy.c360/run-8841",
  "natco": "global",
  "graph_node": "ol-c360-run-8841",
  "links": {
    "updatesLineageFor": [
      "asset-pipe-c360"
    ]
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
