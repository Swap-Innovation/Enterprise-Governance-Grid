---
title: Technical Asset Contract — customer.cdc.v1
contract_id: ctr-tech-topic-cdc
asset_id: asset-topic-cdc
kind: topic
natco: natco-de
status: draft
domain: customer
---

# customer.cdc.v1

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-topic-cdc` |
| **Asset ID** | `asset-topic-cdc` |
| **Kind** | `topic` |
| **Qualified name** | `kafka://de/customer.cdc.v1` |
| **NATCO** | `natco-de` |
| **Catalog system** | `kafka` |
| **Context graph node** | `topic-customer-cdc` |

## Linked assets & contracts

### `feeds`

- [c360_customer_build](../pipelines/c360_customer_build.md) — `asset-pipe-c360`

### `key_column`

- [crm.customer.party_id](../columns/crm.customer.party_id.md) — `asset-col-crm-party-id`

## Contract body (JSON)

```json
{
  "id": "asset-topic-cdc",
  "contract_id": "ctr-tech-topic-cdc",
  "kind": "topic",
  "name": "customer.cdc.v1",
  "qualified_name": "kafka://de/customer.cdc.v1",
  "natco": "natco-de",
  "source_system": "kafka",
  "graph_node": "topic-customer-cdc",
  "links": {
    "feeds": [
      "asset-pipe-c360"
    ],
    "key_column": "asset-col-crm-party-id"
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
