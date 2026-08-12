#!/usr/bin/env node
/**
 * Patch Technical Catalog contracts with tool_coverage + add gap types.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../Technical Catalog')
const SOR = ['collibra', 'dataplex', 'openmetadata', 'microsoft_purview', 'alation', 'informatica_cdgc']

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n')
}

function patchExisting(folder, tool_coverage) {
  const dir = path.join(ROOT, folder)
  const contractPath = path.join(dir, 'contract.json')
  const c = JSON.parse(fs.readFileSync(contractPath, 'utf8'))
  c.version = '1.1.0'
  c.catalog_sor = SOR
  c.tool_coverage = tool_coverage
  writeJson(contractPath, c)
  const charsPath = path.join(dir, '01. Characteristics.md')
  if (fs.existsSync(charsPath)) {
    let md = fs.readFileSync(charsPath, 'utf8')
    if (!md.includes('## Cross-tool notes')) {
      const notes = Object.entries(tool_coverage)
        .map(([k, v]) => `- **${k}:** ${v.equivalent || ''}${v.notes ? ` — ${v.notes}` : ''}${v.path ? ` (\`${v.path}\`)` : ''}`)
        .join('\n')
      md = md.trimEnd() + `\n\n## Cross-tool notes\n\n${notes}\n`
      fs.writeFileSync(charsPath, md)
    }
  }
}

function char(name, publicId, kind, opts = {}) {
  return {
    name,
    public_id: publicId,
    kind,
    cardinality: { min: opts.min ?? 0, max: opts.max ?? null },
    scope: opts.scope ?? 'optional',
    system_managed: false,
    read_only: false,
    description: opts.description ?? name,
    asset_type_filter: opts.filter ?? null,
  }
}

function writeNewPackage(t) {
  const dir = path.join(ROOT, t.folder)
  fs.mkdirSync(dir, { recursive: true })
  writeJson(path.join(dir, 'contract.json'), {
    $schema: '../shared/asset-type-characteristics.schema.json',
    contract_id: t.contract_id,
    version: '1.1.0',
    status: 'draft',
    asset_type: t.asset_type,
    kind: 'asset_type_characteristics',
    title: `${t.asset_type} — Characteristics Contract`,
    doc: `${t.folder}/01. Characteristics.md`,
    catalog_sor: SOR,
    layer: t.layer,
    collibra: t.collibra,
    tool_coverage: t.tool_coverage,
    hierarchy: t.hierarchy,
    mapping_engine: t.mapping,
    characteristics: t.characteristics,
    instance_shape: {
      required_fields: ['id', 'contract_id', 'kind', 'name', 'source_system'],
      kind_value: t.kind_value,
    },
  })
  fs.writeFileSync(
    path.join(dir, '00. README.md'),
    `---
title: ${t.asset_type}
section: "10.05.10.TechnicalCatalog.${t.folder.replace(/\s+/g, '')}"
status: draft
template: asset-type
last_reviewed: 2026-08-12
owner: Enterprise Architecture
tags: [technical-catalog, ${t.kind_value}, contracts]
canonical: true
---

# ${t.asset_type}

**Asset Type** — ${t.description}

| | |
| --- | --- |
| Contract | [\`contract.json\`](contract.json) (\`${t.contract_id}\`) |
| Characteristics | [01. Characteristics.md](01.%20Characteristics.md) |
| Example | [\`example.json\`](example.json) |
| Layer | **${t.layer}** |

See [03. Catalog Tool Coverage](../03.%20Catalog%20Tool%20Coverage.md).

Parent: [Technical Catalog](../00.%20README.md)
`,
  )
  fs.writeFileSync(
    path.join(dir, '01. Characteristics.md'),
    `# ${t.asset_type} — Characteristics

Contract: \`${t.contract_id}\`

${t.description}

See [\`contract.json\`](contract.json).

## Hierarchy

${t.hierarchy.note}

## Cross-tool notes

${Object.entries(t.tool_coverage)
  .map(([k, v]) => `- **${k}:** ${v.equivalent || ''}${v.notes ? ` — ${v.notes}` : ''}`)
  .join('\n')}
`,
  )
  writeJson(path.join(dir, 'example.json'), {
    id: `asset-example-${t.kind_value}`,
    contract_id: `ctr-inst-${t.kind_value}`,
    type_contract_id: t.contract_id,
    kind: t.kind_value,
    asset_type: t.asset_type,
    display_name: `Example ${t.asset_type}`,
    name: `example-${t.kind_value}`,
    qualified_name: `tech.${t.kind_value}.example`,
    source_system: 'collibra',
    layer: t.layer,
    characteristics: { Description: t.description, Status: 'Draft' },
  })
}

const EXISTING = {
  'Technology Asset': {
    collibra: { equivalent: 'Technology Asset', path: 'Technology Asset' },
    dataplex: { equivalent: 'Entry group / system patterns' },
    openmetadata: { equivalent: 'Service / Container abstract' },
    microsoft_purview: { equivalent: 'Asset (generic)' },
    alation: { equivalent: 'Data source abstract' },
    informatica_cdgc: { equivalent: 'Resource / System' },
  },
  System: {
    collibra: { equivalent: 'System', path: 'Technology Asset > System' },
    dataplex: { equivalent: 'Lake / system Entry' },
    openmetadata: { equivalent: 'DatabaseService / MessagingService / …' },
    microsoft_purview: { equivalent: 'Source / Collection system' },
    alation: { equivalent: 'Data source' },
    informatica_cdgc: { equivalent: 'System' },
  },
  Database: {
    collibra: { equivalent: 'Database' },
    dataplex: { equivalent: 'Entry (database)' },
    openmetadata: { equivalent: 'Database' },
    microsoft_purview: { equivalent: 'Database' },
    alation: { equivalent: 'Database' },
    informatica_cdgc: { equivalent: 'Database' },
  },
  Schema: {
    collibra: { equivalent: 'Schema' },
    dataplex: { equivalent: 'Entry (schema/dataset container)' },
    openmetadata: { equivalent: 'DatabaseSchema' },
    microsoft_purview: { equivalent: 'Schema' },
    alation: { equivalent: 'Schema' },
    informatica_cdgc: { equivalent: 'Schema' },
  },
  Table: {
    collibra: { equivalent: 'Table' },
    dataplex: { equivalent: 'Entry / Table' },
    openmetadata: { equivalent: 'Table' },
    microsoft_purview: { equivalent: 'Table / Asset' },
    alation: { equivalent: 'Table' },
    informatica_cdgc: { equivalent: 'Table' },
  },
  'Database View': {
    collibra: { equivalent: 'Database View' },
    dataplex: { equivalent: 'Entry (view)' },
    openmetadata: { equivalent: 'Table (view type)' },
    microsoft_purview: { equivalent: 'View' },
    alation: { equivalent: 'View' },
    informatica_cdgc: { equivalent: 'View' },
  },
  Column: {
    collibra: { equivalent: 'Column' },
    dataplex: { equivalent: 'Column / Aspect on Entry' },
    openmetadata: { equivalent: 'Column' },
    microsoft_purview: { equivalent: 'Column' },
    alation: { equivalent: 'Column / Attribute' },
    informatica_cdgc: { equivalent: 'Column' },
  },
  'Foreign Key': {
    collibra: { equivalent: 'Foreign Key' },
    dataplex: { equivalent: '—' },
    openmetadata: { equivalent: 'TableConstraint / FK' },
    microsoft_purview: { equivalent: '—' },
    alation: { equivalent: 'FK / relationship' },
    informatica_cdgc: { equivalent: 'Foreign Key' },
  },
  'File Storage': {
    collibra: { equivalent: 'File Storage' },
    dataplex: { equivalent: 'Cloud Storage / Lake zone' },
    openmetadata: { equivalent: 'StorageService / Container' },
    microsoft_purview: { equivalent: 'Storage account / ADLS' },
    alation: { equivalent: 'File system source' },
    informatica_cdgc: { equivalent: 'File connection' },
  },
  Directory: {
    collibra: { equivalent: 'Directory' },
    dataplex: { equivalent: 'Path / folder Entry' },
    openmetadata: { equivalent: 'Container / Directory' },
    microsoft_purview: { equivalent: 'Folder' },
    alation: { equivalent: 'Directory' },
    informatica_cdgc: { equivalent: 'Directory' },
  },
  File: {
    collibra: { equivalent: 'File' },
    dataplex: { equivalent: 'File Entry / object' },
    openmetadata: { equivalent: 'Spreadsheet / File / Object' },
    microsoft_purview: { equivalent: 'File / Resource set' },
    alation: { equivalent: 'File' },
    informatica_cdgc: { equivalent: 'File' },
  },
  Field: {
    collibra: { equivalent: 'Field' },
    dataplex: { equivalent: 'Schema field on File Entry' },
    openmetadata: { equivalent: 'Field / Column (file)' },
    microsoft_purview: { equivalent: 'Schema field' },
    alation: { equivalent: 'Field' },
    informatica_cdgc: { equivalent: 'Field' },
  },
}

for (const [folder, tool] of Object.entries(EXISTING)) patchExisting(folder, tool)

const NEW = [
  {
    folder: 'Dataset',
    asset_type: 'Dataset',
    contract_id: 'ctr-tech-type-dataset',
    kind_value: 'dataset',
    layer: 'physical',
    description: 'Catalog Entry / dataset abstraction spanning table, file, or API payload (Dataplex Entry pattern).',
    collibra: {
      asset_type_display_name: 'Dataset',
      asset_type_public_id: 'Dataset',
      asset_type_path: 'Data Asset > Dataset',
      product: 'Data Catalog',
      parent_asset_type: 'Data Asset',
    },
    hierarchy: {
      role: 'intermediate',
      note: 'May specialize Table/File/Topic; used when scanner emits Entry-level assets',
    },
    mapping: {
      typical_source_type: 'dataset',
      represents_typical: true,
      typical_target: 'entity concept IRI',
      note: 'Dataset represents entity Concepts when Table/File grain is unavailable.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Dataset / Data Set patterns' },
      dataplex: { equivalent: 'Entry / Dataset (primary)' },
      openmetadata: { equivalent: 'Table / Topic / Container as dataset' },
      microsoft_purview: { equivalent: 'Asset / Dataset' },
      alation: { equivalent: 'Data object' },
      informatica_cdgc: { equivalent: 'Dataset' },
    },
    characteristics: [
      char('Description', 'Description', 'Text', { min: 1, max: 1, scope: 'core' }),
      char('Status', 'Status', 'Text', { max: 1, scope: 'core' }),
      char('Dataset Format', 'DatasetFormat', 'Text', { max: 1, description: 'table|file|stream|api' }),
      char('realized as Table', 'DatasetAsTable', 'Explicit Relation', { filter: 'Table' }),
      char('realized as File', 'DatasetAsFile', 'Explicit Relation', { filter: 'File' }),
      char('realized as Topic', 'DatasetAsTopic', 'Explicit Relation', { filter: 'Topic' }),
      char('belongs to System', 'DatasetInSystem', 'Explicit Relation', { filter: 'System' }),
    ],
  },
  {
    folder: 'Pipeline',
    asset_type: 'Pipeline',
    contract_id: 'ctr-tech-type-pipeline',
    kind_value: 'pipeline',
    layer: 'process',
    description: 'ETL/ELT or orchestration job that moves or transforms physical data.',
    collibra: {
      asset_type_display_name: 'Pipeline',
      asset_type_public_id: 'DataPipeline',
      asset_type_path: 'Data Asset > Data Pipeline',
      product: 'Data Catalog / Lineage',
      parent_asset_type: 'Data Asset',
    },
    hierarchy: {
      role: 'leaf',
      note: 'Reads/writes Tables, Files, Topics; lineage process node',
    },
    mapping: {
      typical_source_type: 'pipeline',
      represents_typical: false,
      note: 'Pipelines rarely represent Concepts; they connect technical assets.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Data Pipeline / Process' },
      dataplex: { equivalent: 'Pipeline / Dataflow task' },
      openmetadata: { equivalent: 'Pipeline' },
      microsoft_purview: { equivalent: 'Pipeline / ADF activity' },
      alation: { equivalent: 'Job / transformation' },
      informatica_cdgc: { equivalent: 'Mapping / Workflow' },
    },
    characteristics: [
      char('Description', 'Description', 'Text', { min: 1, max: 1, scope: 'core' }),
      char('Status', 'Status', 'Text', { max: 1, scope: 'core' }),
      char('reads Table', 'PipelineReadsTable', 'Explicit Relation', { filter: 'Table' }),
      char('writes Table', 'PipelineWritesTable', 'Explicit Relation', { filter: 'Table' }),
      char('reads File', 'PipelineReadsFile', 'Explicit Relation', { filter: 'File' }),
      char('writes File', 'PipelineWritesFile', 'Explicit Relation', { filter: 'File' }),
      char('reads Topic', 'PipelineReadsTopic', 'Explicit Relation', { filter: 'Topic' }),
      char('writes Topic', 'PipelineWritesTopic', 'Explicit Relation', { filter: 'Topic' }),
      char('runs on System', 'PipelineOnSystem', 'Explicit Relation', { filter: 'System' }),
    ],
  },
  {
    folder: 'Topic',
    asset_type: 'Topic',
    contract_id: 'ctr-tech-type-topic',
    kind_value: 'topic',
    layer: 'streaming',
    description: 'Streaming / messaging topic (e.g. Kafka) carrying structured events.',
    collibra: {
      asset_type_display_name: 'Topic',
      asset_type_public_id: 'Topic',
      asset_type_path: 'Data Asset > Topic',
      product: 'Data Catalog',
      parent_asset_type: 'Data Asset',
    },
    hierarchy: {
      role: 'intermediate',
      note: 'Belongs to System (broker); may contain Field-like schema members',
    },
    mapping: {
      typical_source_type: 'topic',
      represents_typical: true,
      typical_target: 'entity concept IRI',
      note: 'Topics often represent event/entity Concepts at message grain.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Topic / Kafka Topic patterns' },
      dataplex: { equivalent: 'Entry (Pub/Sub / stream)' },
      openmetadata: { equivalent: 'Topic' },
      microsoft_purview: { equivalent: 'Event Hub / Kafka asset' },
      alation: { equivalent: '—' },
      informatica_cdgc: { equivalent: 'Streaming object' },
    },
    characteristics: [
      char('Description', 'Description', 'Text', { min: 1, max: 1, scope: 'core' }),
      char('Status', 'Status', 'Text', { max: 1, scope: 'core' }),
      char('Schema Format', 'SchemaFormat', 'Text', { max: 1, description: 'Avro|JSON|Protobuf' }),
      char('belongs to System', 'TopicInSystem', 'Explicit Relation', { filter: 'System', min: 1, scope: 'core' }),
      char('contains Field', 'TopicContainsField', 'Explicit Relation', { filter: 'Field' }),
    ],
  },
  {
    folder: 'API Endpoint',
    asset_type: 'API Endpoint',
    contract_id: 'ctr-tech-type-api-endpoint',
    kind_value: 'api_endpoint',
    layer: 'api',
    description: 'HTTP/gRPC endpoint exposing or ingesting data.',
    collibra: {
      asset_type_display_name: 'API Endpoint',
      asset_type_public_id: 'APIEndpoint',
      asset_type_path: 'Technology Asset > API Endpoint',
      product: 'Data Catalog',
      parent_asset_type: 'Technology Asset',
    },
    hierarchy: {
      role: 'leaf',
      note: 'Belongs to System; may implement Dataset or feed Pipeline',
    },
    mapping: {
      typical_source_type: 'api_endpoint',
      represents_typical: true,
      note: 'Endpoints may represent entity Concepts when they are the serving grain.',
    },
    tool_coverage: {
      collibra: { equivalent: 'API / Endpoint patterns' },
      dataplex: { equivalent: '—' },
      openmetadata: { equivalent: 'APIEndpoint / APICollection' },
      microsoft_purview: { equivalent: 'API asset' },
      alation: { equivalent: 'API source' },
      informatica_cdgc: { equivalent: 'API' },
    },
    characteristics: [
      char('Description', 'Description', 'Text', { min: 1, max: 1, scope: 'core' }),
      char('Status', 'Status', 'Text', { max: 1, scope: 'core' }),
      char('Method', 'HttpMethod', 'Text', { max: 1 }),
      char('Path', 'ApiPath', 'Text', { max: 1, scope: 'core' }),
      char('belongs to System', 'ApiInSystem', 'Explicit Relation', { filter: 'System', min: 1, scope: 'core' }),
      char('exposes Dataset', 'ApiExposesDataset', 'Explicit Relation', { filter: 'Dataset' }),
    ],
  },
  {
    folder: 'Stored Procedure',
    asset_type: 'Stored Procedure',
    contract_id: 'ctr-tech-type-stored-procedure',
    kind_value: 'stored_procedure',
    layer: 'physical',
    description: 'Database stored procedure or function transforming relational data.',
    collibra: {
      asset_type_display_name: 'Stored Procedure',
      asset_type_public_id: 'StoredProcedure',
      asset_type_path: 'Data Asset > Stored Procedure',
      product: 'Data Catalog',
      parent_asset_type: 'Data Asset',
    },
    hierarchy: {
      role: 'leaf',
      note: 'Belongs to Schema/Database; lineage process similar to Pipeline',
    },
    mapping: {
      typical_source_type: 'stored_procedure',
      represents_typical: false,
      note: 'Procedures are process nodes; outputs may represent Concepts via Tables.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Stored Procedure' },
      dataplex: { equivalent: '—' },
      openmetadata: { equivalent: 'StoredProcedure' },
      microsoft_purview: { equivalent: 'Stored procedure' },
      alation: { equivalent: 'Stored procedure' },
      informatica_cdgc: { equivalent: 'Procedure' },
    },
    characteristics: [
      char('Description', 'Description', 'Text', { min: 1, max: 1, scope: 'core' }),
      char('Status', 'Status', 'Text', { max: 1, scope: 'core' }),
      char('is part of Schema', 'ProcedureInSchema', 'Explicit Relation', { filter: 'Schema', min: 1, scope: 'core' }),
      char('reads Table', 'ProcedureReadsTable', 'Explicit Relation', { filter: 'Table' }),
      char('writes Table', 'ProcedureWritesTable', 'Explicit Relation', { filter: 'Table' }),
    ],
  },
]

for (const t of NEW) writeNewPackage(t)

const ALL_TYPES = [
  'Technology Asset',
  'System',
  'Database',
  'Schema',
  'Table',
  'Database View',
  'Column',
  'Foreign Key',
  'File Storage',
  'Directory',
  'File',
  'Field',
  'Dataset',
  'Pipeline',
  'Topic',
  'API Endpoint',
  'Stored Procedure',
]

const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'shared/asset-type-characteristics.schema.json'), 'utf8'))
schema.properties.asset_type.enum = ALL_TYPES
schema.properties.catalog_sor.items = { type: 'string' }
schema.properties.tool_coverage = { type: 'object' }
writeJson(path.join(ROOT, 'shared/asset-type-characteristics.schema.json'), schema)

writeJson(path.join(ROOT, 'index.json'), {
  meta: {
    title: 'Technical Catalog — Asset Type Contracts Index',
    section: '10.05.10.Contracts.TechnicalCatalog',
    version: '1.2.0',
    status: 'draft',
    last_reviewed: '2026-08-12',
    catalog_sor: SOR,
    control_plane_role: 'Mapping Engine represents → Registry concepts',
    doc_root: '10. Contracts/Technical Catalog',
    hierarchy_relational: 'System → Database → Schema → Table|Database View|Stored Procedure → Column',
    hierarchy_file: 'File Storage → Directory → File → Field',
    hierarchy_streaming_api: 'System → Topic|API Endpoint|Dataset|Pipeline',
    collibra_scope: 'Physical data layer + technology / file / streaming / pipeline assets (not BI report pack)',
    tool_coverage_doc: '03. Catalog Tool Coverage.md',
  },
  contracts: [
    { contract_id: 'ctr-tech-hierarchy-v1', kind: 'technical_catalog_hierarchy', file: 'hierarchy.relations.json', doc: '01. Hierarchy And Relations.md' },
    ...ALL_TYPES.map((asset_type) => ({
      contract_id: `ctr-tech-type-${asset_type.toLowerCase().replace(/ /g, '-')}`,
      kind: 'asset_type_characteristics',
      asset_type,
      folder: asset_type,
      file: `${asset_type}/contract.json`,
      doc: `${asset_type}/01. Characteristics.md`,
      example: `${asset_type}/example.json`,
    })),
  ],
  schema: 'shared/asset-type-characteristics.schema.json',
  documentation_standard: '02. Collibra Documentation Standard.md',
  tool_coverage: '03. Catalog Tool Coverage.md',
  example_instances: 'examples/index.json',
})

const hier = JSON.parse(fs.readFileSync(path.join(ROOT, 'hierarchy.relations.json'), 'utf8'))
hier.version = '1.2.0'
hier.tool_coverage_doc = '03. Catalog Tool Coverage.md'
hier.canonical_chains.streaming = ['System', 'Topic', 'Field']
hier.canonical_chains.api = ['System', 'API Endpoint', 'Dataset']
hier.canonical_chains.process = ['Pipeline | Stored Procedure → Table|File|Topic']
hier.canonical_chains.dataset = ['Dataset → Table|File|Topic']
hier.relations.push(
  {
    id: 'rel-system-has-topic',
    from: 'System',
    predicate: 'contains',
    to: 'Topic',
    public_id: 'SystemContainsTopic',
    normative: true,
  },
  {
    id: 'rel-system-has-api',
    from: 'System',
    predicate: 'contains',
    to: 'API Endpoint',
    public_id: 'SystemContainsApiEndpoint',
    normative: true,
  },
  {
    id: 'rel-schema-contains-procedure',
    from: 'Schema',
    predicate: 'contains',
    to: 'Stored Procedure',
    public_id: 'SchemaContainsStoredProcedure',
    normative: true,
  },
  {
    id: 'rel-dataset-as-table',
    from: 'Dataset',
    predicate: 'realized_as',
    to: 'Table',
    public_id: 'DatasetAsTable',
    normative: false,
  },
  {
    id: 'rel-pipeline-writes-table',
    from: 'Pipeline',
    predicate: 'writes',
    to: 'Table',
    public_id: 'PipelineWritesTable',
    normative: true,
  },
  {
    id: 'rel-table-represents-concept',
    from: 'Table',
    predicate: 'represents',
    to: 'Registry Concept',
    owned_by: 'mapping_engine',
    da_contract: 'DA-09',
    normative: true,
  },
  {
    id: 'rel-column-represents-concept',
    from: 'Column',
    predicate: 'represents',
    to: 'Registry Concept',
    owned_by: 'mapping_engine',
    da_contract: 'DA-09',
    normative: true,
  },
)
hier.asset_type_contracts = ALL_TYPES.map((a) => ({
  contract_id: `ctr-tech-type-${a.toLowerCase().replace(/ /g, '-')}`,
  file: `${a}/contract.json`,
}))
if (!hier.rules) hier.rules = []
hier.rules = [
  ...(hier.rules || []),
  'Dataset is the Dataplex Entry-style abstraction; prefer Table/File/Topic when grain is known.',
  'Pipeline and Stored Procedure are process nodes for lineage; they do not replace Mapping Records.',
  'BI report types remain out of this pack (see Business Catalog Report or future BI Catalog).',
]
writeJson(path.join(ROOT, 'hierarchy.relations.json'), hier)

fs.writeFileSync(
  path.join(ROOT, '03. Catalog Tool Coverage.md'),
  `# Technical Catalog — Catalog tool coverage

Maps physical / technology asset types to Collibra, Dataplex, OpenMetadata, Purview, Alation, and Informatica CDGC.

Last reviewed: 2026-08-12

## Hierarchies

| Chain | Types |
| --- | --- |
| Relational | System → Database → Schema → Table / Database View / Stored Procedure → Column (+ Foreign Key) |
| File | File Storage → Directory → File → Field |
| Streaming / API / process | System → Topic / API Endpoint / Dataset / Pipeline |

## Tool matrix

| Asset type | Collibra | Dataplex | OpenMetadata | Purview | Alation | Informatica |
| --- | --- | --- | --- | --- | --- | --- |
| Technology Asset | Technology Asset | Entry group | Service abstract | Asset | Source abstract | Resource |
| System | System | Lake/system | *Service | Source | Data source | System |
| Database | Database | Entry | Database | Database | Database | Database |
| Schema | Schema | Entry | DatabaseSchema | Schema | Schema | Schema |
| Table | Table | Entry/Table | Table | Table | Table | Table |
| Database View | Database View | Entry/view | Table(view) | View | View | View |
| Column | Column | Column | Column | Column | Column | Column |
| Foreign Key | Foreign Key | — | TableConstraint | — | FK | FK |
| File Storage | File Storage | Cloud Storage | StorageService | ADLS/Storage | File source | File connection |
| Directory | Directory | Path | Container | Folder | Directory | Directory |
| File | File | File Entry | File/Object | File | File | File |
| Field | Field | Schema field | Field | Schema field | Field | Field |
| Dataset | Dataset patterns | **Entry/Dataset** | Table/Topic as DS | Dataset | Data object | Dataset |
| Pipeline | Data Pipeline | Pipeline/Dataflow | **Pipeline** | ADF Pipeline | Job | Mapping/Workflow |
| Topic | Topic patterns | Pub/Sub Entry | **Topic** | Event Hub/Kafka | — | Streaming |
| API Endpoint | API patterns | — | **APIEndpoint** | API asset | API | API |
| Stored Procedure | Stored Procedure | — | **StoredProcedure** | Stored procedure | Procedure | Procedure |

## Out of pack

BI reports/dashboards (Business Catalog Report or future BI Catalog); glossary; data products.

## Mapping grain (DA-09)

Typical \`represents\` sources: **Table / View / File / Topic / Dataset** → entity · **Column / Field** → property.
`,
)

console.log('Technical Catalog done,', ALL_TYPES.length, 'types')
