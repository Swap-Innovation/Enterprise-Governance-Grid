#!/usr/bin/env node
/**
 * Enrich Neo4j Contracts KG from connected-data/10. Contracts:
 * - every asset-type contract.json (+ raw JSON)
 * - every *.schema.json (+ raw JSON)
 * - every sample-assets.json / example.json instance (+ raw JSON)
 * - MappingRecord for every MAPS_TO / REPRESENTS / IMPLEMENTS
 * - FederationEdge for every FEDERATES
 * - CrossPackRelation from cross-pack.relations.json
 *
 * Usage (from repo root or this package):
 *   node neo4j-contracts-kg/scripts/enrich-from-contracts.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const CONTRACTS = path.join(ROOT, 'connected-data', '10. Contracts')
const APP = path.join(ROOT, 'enterprise-governance-grid')

const NEO4J_URI = process.env.NEO4J_URI ?? 'bolt://127.0.0.1:7687'
const NEO4J_USER = process.env.NEO4J_USER ?? 'neo4j'
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD ?? 'contracts-kg'

const KIND_LABEL = {
  namespace: 'Namespace',
  concept: 'Concept',
  mapping_record: 'MappingRecord',
  federation_edge: 'FederationEdge',
  business_term: 'BusinessTerm',
  acronym: 'Acronym',
  kpi: 'KPI',
  data_domain: 'DataDomain',
  data_concept: 'DataConcept',
  data_model: 'DataModel',
  data_entity: 'DataEntity',
  data_attribute: 'DataAttribute',
  system: 'System',
  database: 'Database',
  schema: 'Schema',
  table: 'Table',
  column: 'Column',
  database_view: 'DatabaseView',
  foreign_key: 'ForeignKey',
  technology_asset: 'TechnologyAsset',
  file_storage: 'FileStorage',
  directory: 'Directory',
  file: 'File',
  field: 'Field',
  data_product: 'DataProduct',
  data_product_port: 'OutputPort',
  data_product_output_port: 'OutputPort',
  data_product_input_port: 'InputPort',
  data_contract: 'DataContract',
  contract_field: 'ContractField',
  pipeline: 'Pipeline',
  team: 'Team',
}

function walk(dir, pred) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...walk(full, pred))
    else if (pred(full, ent.name)) out.push(full)
  }
  return out
}

function relPath(p) {
  return path.relative(CONTRACTS, p).split(path.sep).join('/')
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function packFromRel(rel) {
  const top = rel.split('/')[0]
  if (top === 'Business Catalog') return 'business-catalog'
  if (top === 'Technical Catalog') return 'technical-catalog'
  if (top === 'Data Products') return 'data-products'
  if (top === 'Semantic Control Plane') return 'semantic-control-plane'
  return 'contracts'
}

async function loadDriver() {
  const mod = await import(pathToFileURL(path.join(APP, 'node_modules', 'neo4j-driver', 'lib', 'index.js')).href).catch(
    async () => import('neo4j-driver'),
  )
  return mod.default ?? mod
}

async function run(session, cypher, params = {}) {
  await session.run(cypher, params)
}

async function main() {
  if (!fs.existsSync(CONTRACTS)) {
    console.error('Contracts folder not found:', CONTRACTS)
    process.exit(1)
  }

  const neo4j = await loadDriver()
  const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD), {
    disableLosslessIntegers: true,
  })

  const session = driver.session({ defaultAccessMode: neo4j.session.WRITE })
  const stats = {
    typeContracts: 0,
    schemas: 0,
    assets: 0,
    examples: 0,
    mappingRecords: 0,
    federationEdges: 0,
    crossPack: 0,
  }

  try {
    console.log('==> Asset type contracts (raw JSON)')
    const contractFiles = walk(CONTRACTS, (full, name) => name === 'contract.json')
    for (const file of contractFiles) {
      const data = readJson(file)
      const id = data.contract_id ?? `type-${path.basename(path.dirname(file))}`
      const rel = relPath(file)
      await run(
        session,
        `
        MERGE (c:AssetTypeContract {id: $id})
        SET c.assetType = $assetType,
            c.kind = $kind,
            c.title = $title,
            c.version = $version,
            c.status = $status,
            c.pack = $pack,
            c.sourcePath = $sourcePath,
            c.rawJson = $rawJson,
            c.layer = $layer
        WITH c
        OPTIONAL MATCH (s:JsonSchema {id: $schemaId})
        FOREACH (_ IN CASE WHEN s IS NULL THEN [] ELSE [1] END |
          MERGE (c)-[:HAS_CHARACTERISTICS_SCHEMA]->(s)
        )
        `,
        {
          id,
          assetType: data.asset_type ?? path.basename(path.dirname(file)),
          kind: data.kind ?? '',
          title: data.title ?? '',
          version: data.version ?? '',
          status: data.status ?? '',
          pack: packFromRel(rel),
          sourcePath: rel,
          rawJson: JSON.stringify(data),
          layer: data.layer ?? '',
          schemaId: `schema-${packFromRel(rel)}`,
        },
      )
      stats.typeContracts += 1
    }

    console.log('==> JSON schemas (raw JSON)')
    const schemaFiles = walk(CONTRACTS, (full, name) => name.endsWith('.schema.json'))
    for (const file of schemaFiles) {
      const data = readJson(file)
      const pack = packFromRel(relPath(file))
      const id = `schema-${pack}`
      await run(
        session,
        `
        MERGE (s:JsonSchema {id: $id})
        SET s.title = $title,
            s.pack = $pack,
            s.sourcePath = $sourcePath,
            s.rawJson = $rawJson
        WITH s
        MATCH (c:AssetTypeContract {pack: $pack})
        MERGE (c)-[:HAS_CHARACTERISTICS_SCHEMA]->(s)
        `,
        {
          id,
          title: data.title ?? path.basename(file),
          pack,
          sourcePath: relPath(file),
          rawJson: JSON.stringify(data),
        },
      )
      stats.schemas += 1
    }

    console.log('==> Sample assets + examples (raw JSON)')
    const sampleFiles = walk(CONTRACTS, (full, name) => name === 'sample-assets.json')
    for (const file of sampleFiles) {
      const data = readJson(file)
      const assets = Array.isArray(data.assets) ? data.assets : []
      for (const asset of assets) {
        await upsertContractAsset(session, asset, relPath(file), packFromRel(relPath(file)))
        stats.assets += 1
      }
    }

    const exampleFiles = walk(CONTRACTS, (full, name) => name === 'example.json')
    for (const file of exampleFiles) {
      const data = readJson(file)
      const asset = {
        id: data.id ?? `example-${relPath(file).replace(/[^\w.-]+/g, '-')}`,
        contract_id: data.contract_id,
        type_contract_id: data.type_contract_id,
        kind: data.kind,
        asset_type: data.asset_type ?? path.basename(path.dirname(file)),
        display_name: data.display_name ?? data.name ?? data.title,
        name: data.name ?? data.display_name,
        qualified_name: data.qualified_name,
        source_system: data.source_system,
        natco: data.natco,
        characteristics: data.characteristics,
        links: data.links,
        ...data,
      }
      await upsertContractAsset(session, asset, relPath(file), packFromRel(relPath(file)))
      stats.examples += 1
    }

    console.log('==> Cross-pack relations catalog')
    const xPath = path.join(CONTRACTS, 'cross-pack.relations.json')
    if (fs.existsSync(xPath)) {
      const xdoc = readJson(xPath)
      const rows = [
        ...(xdoc.meaning_crosswalks ?? []).map((r) => ({ ...r, category: 'meaning' })),
        ...(xdoc.structural_bridges ?? []).map((r) => ({ ...r, category: 'structural' })),
        ...(xdoc.federation ?? []).map((r) => ({ ...r, category: 'federation' })),
      ]
      // also accept other arrays
      for (const [key, val] of Object.entries(xdoc)) {
        if (Array.isArray(val) && key !== 'packs' && key !== 'meaning_crosswalks' && key !== 'structural_bridges' && key !== 'federation') {
          for (const r of val) {
            if (r && r.id) rows.push({ ...r, category: key })
          }
        }
      }
      const seen = new Set()
      for (const r of rows) {
        if (!r?.id || seen.has(r.id)) continue
        seen.add(r.id)
        await run(
          session,
          `
          MERGE (x:CrossPackRelation {id: $id})
          SET x.category = $category,
              x.predicate = $predicate,
              x.da = $da,
              x.owner = $owner,
              x.via = $via,
              x.fromPack = $fromPack,
              x.fromAssetType = $fromAssetType,
              x.toPack = $toPack,
              x.toAssetType = $toAssetType,
              x.rawJson = $rawJson
          `,
          {
            id: r.id,
            category: r.category ?? '',
            predicate: r.predicate ?? '',
            da: r.da ?? '',
            owner: r.owner ?? '',
            via: r.via ?? '',
            fromPack: r.from?.pack ?? '',
            fromAssetType: r.from?.asset_type ?? '',
            toPack: r.to?.pack ?? '',
            toAssetType: r.to?.asset_type ?? '',
            rawJson: JSON.stringify(r),
          },
        )
        stats.crossPack += 1
      }
    }

    console.log('==> Materialize MappingRecord for MAPS_TO / REPRESENTS / IMPLEMENTS')
    const mapResult = await session.run(`
      MATCH (src)-[r:MAPS_TO|REPRESENTS|IMPLEMENTS]->(tgt)
      WHERE src.id IS NOT NULL AND tgt.id IS NOT NULL
      WITH src, tgt, type(r) AS relType, coalesce(r.via, type(r) + '-' + src.id + '-' + tgt.id) AS mapId,
           CASE type(r)
             WHEN 'MAPS_TO' THEN 'business_to_concept'
             WHEN 'REPRESENTS' THEN 'technical_to_concept'
             ELSE 'product_to_concept'
           END AS kind,
           CASE type(r)
             WHEN 'MAPS_TO' THEN 'DA-08'
             WHEN 'REPRESENTS' THEN 'DA-09'
             ELSE 'DA-10'
           END AS da
      MERGE (m:MappingRecord {id: mapId})
      SET m.kind = kind,
          m.da = da,
          m.status = 'approved',
          m.confidence = coalesce(m.confidence, 1.0),
          m.pack = 'semantic-control-plane',
          m.predicate = relType
      MERGE (m)-[:SOURCE]->(src)
      MERGE (m)-[:TARGET]->(tgt)
      RETURN count(DISTINCT m) AS created
    `)
    stats.mappingRecords = mapResult.records[0]?.get('created') ?? 0

    console.log('==> Materialize FederationEdge for FEDERATES')
    const fedResult = await session.run(`
      MATCH (from:Concept)-[r:FEDERATES]->(to:Concept)
      WHERE from.id IS NOT NULL AND to.id IS NOT NULL
      WITH from, to,
           coalesce(r.via, 'fed-' + from.id + '-' + to.id) AS fedId,
           coalesce(r.predicate, 'sameAs') AS predicate
      MERGE (f:FederationEdge {id: fedId})
      SET f.predicate = predicate,
          f.status = 'approved',
          f.pack = 'semantic-control-plane'
      MERGE (from)-[:FROM_CONCEPT]->(f)-[:TO_CONCEPT]->(to)
      RETURN count(DISTINCT f) AS created
    `)
    stats.federationEdges = fedResult.records[0]?.get('created') ?? 0

    // Link ContractAssets to typed graph nodes when possible
    console.log('==> Link ContractAsset → live typed nodes (by id / name)')
    await run(
      session,
      `
      MATCH (a:ContractAsset)
      OPTIONAL MATCH (n)
      WHERE n.id IS NOT NULL
        AND (
          n.id = a.id
          OR n.id = replace(a.id, 'asset-', '')
          OR (a.name IS NOT NULL AND n.name = a.name)
        )
        AND NOT a:AssetTypeContract
        AND NOT n:ContractAsset
        AND NOT n:AssetTypeContract
        AND NOT n:JsonSchema
        AND NOT n:CrossPackRelation
        AND NOT n:MappingRecord
        AND NOT n:FederationEdge
      WITH a, head(collect(n)) AS n
      WHERE n IS NOT NULL
      MERGE (a)-[:MATERIALIZED_AS]->(n)
      `,
    )

    console.log('==> Done')
    console.log(JSON.stringify(stats, null, 2))
  } finally {
    await session.close()
    await driver.close()
  }
}

async function upsertContractAsset(session, asset, sourcePath, pack) {
  const id = asset.id
  if (!id) return
  const label = KIND_LABEL[asset.kind] ?? null
  await run(
    session,
    `
    MERGE (a:ContractAsset {id: $id})
    SET a.contractId = $contractId,
        a.typeContractId = $typeContractId,
        a.kind = $kind,
        a.assetType = $assetType,
        a.displayName = $displayName,
        a.name = $name,
        a.qualifiedName = $qualifiedName,
        a.sourceSystem = $sourceSystem,
        a.natco = $natco,
        a.pack = $pack,
        a.sourcePath = $sourcePath,
        a.rawJson = $rawJson,
        a.layer = $layer
    WITH a
    OPTIONAL MATCH (t:AssetTypeContract {id: $typeContractId})
    FOREACH (_ IN CASE WHEN t IS NULL THEN [] ELSE [1] END |
      MERGE (a)-[:OF_TYPE]->(t)
    )
    `,
    {
      id,
      contractId: asset.contract_id ?? '',
      typeContractId: asset.type_contract_id ?? '',
      kind: asset.kind ?? '',
      assetType: asset.asset_type ?? '',
      displayName: asset.display_name ?? asset.name ?? '',
      name: asset.name ?? asset.display_name ?? '',
      qualifiedName: asset.qualified_name ?? '',
      sourceSystem: asset.source_system ?? '',
      natco: asset.natco ?? '',
      pack,
      sourcePath,
      rawJson: JSON.stringify(asset),
      layer: asset.layer ?? '',
    },
  )

  // Also merge into typed label when we have a kind mapping (ensures Acronym/KPI/etc exist)
  if (label && ['Acronym', 'KPI', 'DataConcept', 'TechnologyAsset', 'DatabaseView', 'ForeignKey', 'FileStorage', 'Directory', 'File', 'Field', 'Pipeline', 'Team'].includes(label)) {
    await run(
      session,
      `
      MERGE (n:${label} {id: $id})
      SET n.name = $name,
          n.displayName = $displayName,
          n.pack = $pack,
          n.kind = $kind,
          n.sourcePath = $sourcePath,
          n.rawJson = $rawJson,
          n.natco = $natco
      WITH n
      MATCH (a:ContractAsset {id: $id})
      MERGE (a)-[:MATERIALIZED_AS]->(n)
      `,
      {
        id,
        name: asset.name ?? asset.display_name ?? id,
        displayName: asset.display_name ?? asset.name ?? id,
        pack,
        kind: asset.kind ?? '',
        sourcePath,
        rawJson: JSON.stringify(asset),
        natco: asset.natco ?? '',
      },
    )
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
