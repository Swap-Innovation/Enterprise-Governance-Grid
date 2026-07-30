---
title: Technical Asset Contract — test_c360_pk_unique
contract_id: ctr-tech-test-pk
asset_id: asset-test-c360-pk
kind: test_case
natco: global
status: draft
domain: customer
---

# test_c360_pk_unique

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-test-pk` |
| **Asset ID** | `asset-test-c360-pk` |
| **Kind** | `test_case` |
| **Qualified name** | `dq/test_c360_pk_unique` |
| **NATCO** | `global` |
| **Context graph node** | `test-c360-pk` |

## Linked assets & contracts

### `validates`

- [dp.customer_360](../tables/dp.customer_360.md) — `asset-tbl-c360`
- [dp.customer_360.customer_id](../columns/dp.customer_360.customer_id.md) — `asset-col-c360-customer-id`

## Contract body (JSON)

```json
{
  "id": "asset-test-c360-pk",
  "contract_id": "ctr-tech-test-pk",
  "kind": "test_case",
  "name": "test_c360_pk_unique",
  "qualified_name": "dq/test_c360_pk_unique",
  "natco": "global",
  "graph_node": "test-c360-pk",
  "links": {
    "validates": [
      "asset-tbl-c360",
      "asset-col-c360-customer-id"
    ]
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
