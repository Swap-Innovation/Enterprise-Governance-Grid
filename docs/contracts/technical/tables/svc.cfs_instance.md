---
title: Technical Asset Contract — svc.cfs_instance
contract_id: ctr-tech-svc-cfs
asset_id: asset-tbl-svc-cfs
kind: table
natco: natco-de
status: draft
domain: customer
---

# svc.cfs_instance

| Field | Value |
| --- | --- |
| **Contract ID** | `ctr-tech-svc-cfs` |
| **Asset ID** | `asset-tbl-svc-cfs` |
| **Kind** | `table` |
| **Qualified name** | `projects/de-lake/datasets/svc/tables/cfs_instance` |
| **NATCO** | `natco-de` |
| **Catalog system** | `dataplex` |
| **Catalog source_id** | `dpx-entry-de-svc-cfs-001` |
| **Mapping ID** | `map-tech-de-cfs-table-001` |

## Semantic links (`represents`)

- [`global/customer-facing-service`](../../../examples/tmforum.json) — SID-aligned global concept

## Linked assets & contracts

### `semantics`

- `ctr-sem-cfs`

## Contract body (JSON)

```json
{
  "id": "asset-tbl-svc-cfs",
  "contract_id": "ctr-tech-svc-cfs",
  "kind": "table",
  "name": "svc.cfs_instance",
  "qualified_name": "projects/de-lake/datasets/svc/tables/cfs_instance",
  "natco": "natco-de",
  "source_system": "dataplex",
  "catalog_source_id": "dpx-entry-de-svc-cfs-001",
  "mapping_id": "map-tech-de-cfs-table-001",
  "represents": [
    "global/customer-facing-service"
  ],
  "links": {
    "semantics": [
      "ctr-sem-cfs"
    ]
  }
}
```

## Navigation

- [Technical catalog inventory](../00. Inventory.md)
- [Customer Context Graph](../../../08.%20Customer%20Context%20Graph.md)
- [Technical Catalog Examples](../../../09.%20Technical%20Catalog%20Examples.md)
