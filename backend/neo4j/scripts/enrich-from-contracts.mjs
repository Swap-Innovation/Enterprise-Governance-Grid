#!/usr/bin/env node
/**
 * Enrich Neo4j Contracts KG from contracts:
 * - every asset-type contract.json (+ raw JSON)
 * - every *.schema.json (+ raw JSON)
 * - every per-type example.json and Type/examples/*.json instance (+ raw JSON)
 * - MappingRecord for every MAPS_TO / REPRESENTS / IMPLEMENTS
 * - FederationEdge for every FEDERATES
 * - CrossPackRelation from cross-pack.relations.json
 *
 * Usage (from repo root or this package):
 *   node backend/app/kg/enrich-from-contracts.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../../..')
const CONTRACTS = path.join(ROOT, 'contracts')
const APP = path.join(ROOT, 'frontend')

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
  glossary_category: 'GlossaryCategory',
  measure: 'Measure',
  kpi: 'KPI',
  data_domain: 'DataDomain',
  data_concept: 'DataConcept',
  data_model: 'DataModel',
  data_entity: 'DataEntity',
  data_attribute: 'DataAttribute',
  business_process: 'BusinessProcess',
  business_rule: 'BusinessRule',
  policy: 'Policy',
  issue: 'Issue',
  report: 'Report',
  report_attribute: 'ReportAttribute',
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
  data_product_domain: 'DataProductDomain',
  data_product_port: 'OutputPort',
  data_product_output_port: 'OutputPort',
  data_product_input_port: 'InputPort',
  data_product_access: 'DataProductAccess',
  data_contract: 'DataContract',
  contract_field: 'ContractField',
  ontology_package: 'OntologyPackage',
  value_set: 'ValueSet',
  concept_relation: 'ConceptRelation',
  semantic_policy: 'SemanticPolicy',
  dataset: 'Dataset',
  pipeline: 'Pipeline',
  topic: 'Topic',
  api_endpoint: 'ApiEndpoint',
  stored_procedure: 'StoredProcedure',
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

    console.log('==> Per-type examples (example.json + Type/examples/*.json)')
    // Instance SoR: each asset-type package. Pack-level examples/index.json is refs-only.
    const SKIP_NAMES = new Set([
      'sample-assets.json',
      'index.json',
      'namespaces.json',
      'multi-natco-customer.json',
      'end-to-end-customer-flow.json',
      'customer-contracts.json',
      'customer-context-graph.json',
      'multi-natco-customer-assets.json',
      'technical-catalog-assets.json',
      'tmforum.json',
      'pitch-concepts.json',
      '00. README.md',
    ])
    const PACK_TOP = new Set([
      'Business Catalog',
      'Technical Catalog',
      'Data Products',
      'Semantic Control Plane',
    ])

    function isAssetInstance(data) {
      if (!data || typeof data !== 'object' || Array.isArray(data)) return false
      if (data.meta && (data.assets || data.namespaces || data.global || data.natcos)) return false
      if (data.ref && !data.kind && !data.asset_type) return false
      return Boolean(data.id && (data.kind || data.asset_type || data.type_contract_id))
    }

    const instanceFiles = [
      ...walk(CONTRACTS, (_f, name) => name === 'example.json'),
      ...walk(
        CONTRACTS,
        (full, name) =>
          name.endsWith('.json') &&
          !SKIP_NAMES.has(name) &&
          full.split(path.sep).includes('examples'),
      ),
    ]

    const seenAssetIds = new Set()
    for (const file of instanceFiles) {
      const rel = relPath(file)
      const parts = rel.split('/')
      // Skip master examples/ (scenarios + pitch) and pack-level examples/*; keep Type/examples/*
      if (parts[0] === 'examples') continue
      if (parts.length >= 2 && PACK_TOP.has(parts[0]) && parts[1] === 'examples') continue

      let data
      try {
        data = readJson(file)
      } catch {
        continue
      }
      if (!isAssetInstance(data)) continue
      const id = data.id
      if (!id || seenAssetIds.has(id)) continue
      seenAssetIds.add(id)

      let assetType = data.asset_type
      if (!assetType && parts.includes('examples')) {
        const exIdx = parts.indexOf('examples')
        if (exIdx > 0) assetType = parts[exIdx - 1]
      }
      if (!assetType) assetType = path.basename(path.dirname(file))

      const asset = {
        ...data,
        id,
        asset_type: assetType,
        display_name: data.display_name ?? data.name ?? data.title,
        name: data.name ?? data.display_name,
      }
      await upsertContractAsset(session, asset, rel, packFromRel(rel))
      stats.examples += 1
    }
    stats.assets = stats.examples

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
  const chars = asset.characteristics && typeof asset.characteristics === 'object' ? asset.characteristics : {}
  const meta = asset.metadata && typeof asset.metadata === 'object' ? asset.metadata : {}
  const description =
    chars.Description ?? chars.PolicyStatement ?? meta.description ?? asset.description ?? ''
  const status = chars.Status ?? meta.status ?? asset.status ?? ''
  const owner = chars.Owner ?? meta.owner ?? asset.owner ?? ''
  const familyId = asset.familyId ?? meta.familyId ?? ''
  const scope = asset.scope ?? meta.scope ?? ''
  const uri = chars.Uri ?? meta.uri ?? asset.uri ?? ''
  const conceptId = chars.ConceptId ?? meta.conceptId ?? ''
  const preferredLabel = chars.PreferredLabel ?? asset.display_name ?? asset.name ?? ''
  const fullyQualifiedName = asset.qualified_name ?? meta.fullyQualifiedName ?? ''
  const dataType = chars.TechnicalDataType ?? meta.dataType ?? ''
  const isPrimaryKey = Boolean(chars.IsPrimaryKey ?? meta.isPrimaryKey ?? false)
  const version = chars.Version ?? meta.version ?? ''
  const da = meta.da ?? chars.DA ?? ''
  const predicate = chars.Predicate ?? meta.predicate ?? ''

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
        a.fullyQualifiedName = $fullyQualifiedName,
        a.sourceSystem = $sourceSystem,
        a.natco = $natco,
        a.pack = $pack,
        a.sourcePath = $sourcePath,
        a.rawJson = $rawJson,
        a.characteristicsJson = $characteristicsJson,
        a.linksJson = $linksJson,
        a.metadataJson = $metadataJson,
        a.layer = $layer,
        a.description = $description,
        a.status = $status,
        a.owner = $owner,
        a.familyId = $familyId,
        a.scope = $scope,
        a.uri = $uri,
        a.conceptId = $conceptId,
        a.preferredLabel = $preferredLabel,
        a.dataType = $dataType,
        a.isPrimaryKey = $isPrimaryKey,
        a.version = $version,
        a.da = $da,
        a.predicate = $predicate
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
      fullyQualifiedName,
      sourceSystem: asset.source_system ?? '',
      natco: asset.natco ?? '',
      pack,
      sourcePath,
      rawJson: JSON.stringify(asset),
      characteristicsJson: JSON.stringify(chars),
      linksJson: JSON.stringify(asset.links ?? {}),
      metadataJson: JSON.stringify(meta),
      layer: asset.layer ?? '',
      description,
      status,
      owner,
      familyId,
      scope,
      uri,
      conceptId,
      preferredLabel,
      dataType,
      isPrimaryKey,
      version: String(version),
      da,
      predicate,
    },
  )

  const emptyToNull = (v) => (v === undefined || v === null || v === '' ? null : v)

  // MERGE typed label and enrich metadata onto live e2e nodes (same id)
  if (label) {
    await run(
      session,
      `
      MERGE (n:${label} {id: $id})
      SET n.name = coalesce($name, n.name),
          n.displayName = coalesce($displayName, n.displayName),
          n.pack = coalesce(n.pack, $pack),
          n.kind = coalesce($kind, n.kind),
          n.sourcePath = $sourcePath,
          n.rawJson = $rawJson,
          n.characteristicsJson = $characteristicsJson,
          n.linksJson = $linksJson,
          n.metadataJson = $metadataJson,
          n.natco = coalesce($natco, n.natco),
          n.description = coalesce($description, n.description),
          n.status = coalesce($status, n.status),
          n.owner = coalesce($owner, n.owner),
          n.familyId = coalesce($familyId, n.familyId),
          n.scope = coalesce($scope, n.scope),
          n.uri = coalesce($uri, n.uri),
          n.conceptId = coalesce($conceptId, n.conceptId),
          n.preferredLabel = coalesce($preferredLabel, n.preferredLabel),
          n.qualifiedName = coalesce($qualifiedName, n.qualifiedName),
          n.fullyQualifiedName = coalesce($fullyQualifiedName, n.fullyQualifiedName),
          n.dataType = coalesce($dataType, n.dataType),
          n.isPrimaryKey = CASE WHEN $isPrimaryKey THEN true ELSE coalesce(n.isPrimaryKey, false) END,
          n.version = coalesce($version, n.version),
          n.da = coalesce($da, n.da),
          n.predicate = coalesce($predicate, n.predicate),
          n.sourceSystem = coalesce($sourceSystem, n.sourceSystem),
          n.typeContractId = coalesce($typeContractId, n.typeContractId),
          n.assetType = coalesce($assetType, n.assetType),
          n.layer = coalesce($layer, n.layer)
      WITH n
      MATCH (a:ContractAsset {id: $id})
      MERGE (a)-[:MATERIALIZED_AS]->(n)
      `,
      {
        id,
        name: emptyToNull(asset.name ?? asset.display_name ?? id),
        displayName: emptyToNull(asset.display_name ?? asset.name ?? id),
        pack,
        kind: emptyToNull(asset.kind),
        sourcePath,
        rawJson: JSON.stringify(asset),
        characteristicsJson: JSON.stringify(chars),
        linksJson: JSON.stringify(asset.links ?? {}),
        metadataJson: JSON.stringify(meta),
        natco: emptyToNull(asset.natco),
        description: emptyToNull(description),
        status: emptyToNull(status),
        owner: emptyToNull(owner),
        familyId: emptyToNull(familyId),
        scope: emptyToNull(scope),
        uri: emptyToNull(uri),
        conceptId: emptyToNull(conceptId),
        preferredLabel: emptyToNull(preferredLabel),
        qualifiedName: emptyToNull(asset.qualified_name),
        fullyQualifiedName: emptyToNull(fullyQualifiedName),
        dataType: emptyToNull(dataType),
        isPrimaryKey,
        version: emptyToNull(String(version || '')),
        da: emptyToNull(da),
        predicate: emptyToNull(predicate),
        sourceSystem: emptyToNull(asset.source_system),
        typeContractId: emptyToNull(asset.type_contract_id),
        assetType: emptyToNull(asset.asset_type),
        layer: emptyToNull(asset.layer),
      },
    )
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
