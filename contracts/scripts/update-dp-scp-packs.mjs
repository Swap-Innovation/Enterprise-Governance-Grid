#!/usr/bin/env node
/**
 * Patch existing contracts with tool_coverage + generate new gap types.
 * Packs: Data Products, Semantic Control Plane, Technical Catalog
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONTRACTS = path.resolve(__dirname, '..')

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n')
}

function patchExisting(dir, patches) {
  const contractPath = path.join(dir, 'contract.json')
  if (!fs.existsSync(contractPath)) throw new Error('missing ' + contractPath)
  const c = JSON.parse(fs.readFileSync(contractPath, 'utf8'))
  Object.assign(c, patches.fields || {})
  if (patches.tool_coverage) c.tool_coverage = patches.tool_coverage
  if (patches.catalog_sor) c.catalog_sor = patches.catalog_sor
  if (patches.version) c.version = patches.version
  writeJson(contractPath, c)

  const charsPath = path.join(dir, '01. Characteristics.md')
  if (fs.existsSync(charsPath)) {
    let md = fs.readFileSync(charsPath, 'utf8')
    if (!md.includes('## Cross-tool notes')) {
      const notes = Object.entries(patches.tool_coverage || {})
        .map(([k, v]) => `- **${k}:** ${v.equivalent || v.notes || JSON.stringify(v)}${v.notes && v.equivalent ? ` — ${v.notes}` : ''}${v.path ? ` (\`${v.path}\`)` : ''}`)
        .join('\n')
      md = md.trimEnd() + `\n\n## Cross-tool notes\n\n${notes}\n`
      fs.writeFileSync(charsPath, md)
    }
  }
  return c
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

function writeNewPackage(root, t) {
  const dir = path.join(root, t.folder)
  fs.mkdirSync(dir, { recursive: true })
  const contract = {
    $schema: '../shared/asset-type-characteristics.schema.json',
    contract_id: t.contract_id,
    version: '1.1.0',
    status: 'draft',
    asset_type: t.asset_type,
    kind: 'asset_type_characteristics',
    title: `${t.asset_type} — Characteristics Contract`,
    doc: `${t.folder}/01. Characteristics.md`,
    catalog_sor: t.catalog_sor,
    layer: t.layer,
    ...(t.collibra ? { collibra: t.collibra } : {}),
    ...(t.control_plane ? { control_plane: t.control_plane } : {}),
    ...(t.da_deliverable ? { da_deliverable: t.da_deliverable } : {}),
    tool_coverage: t.tool_coverage,
    hierarchy: t.hierarchy,
    mapping_engine: t.mapping,
    characteristics: t.characteristics,
    instance_shape: {
      required_fields: ['id', 'contract_id', 'kind', 'name', 'source_system'],
      kind_value: t.kind_value,
    },
  }
  writeJson(path.join(dir, 'contract.json'), contract)

  fs.writeFileSync(
    path.join(dir, '00. README.md'),
    `---
title: ${t.asset_type}
section: "10.05.10.${t.sectionSlug}"
status: draft
template: asset-type
last_reviewed: 2026-08-12
owner: Enterprise Architecture
tags: [${t.tags.join(', ')}]
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

## Tool coverage

See [03. Catalog Tool Coverage](../03.%20Catalog%20Tool%20Coverage.md) and \`tool_coverage\` in the contract.

## Mapping

${t.mapping?.note || 'See contract mapping_engine.'}

Parent: [${t.parentName}](../00.%20README.md)
`,
  )

  fs.writeFileSync(
    path.join(dir, '01. Characteristics.md'),
    `# ${t.asset_type} — Characteristics

Contract: \`${t.contract_id}\` · Layer: **${t.layer}**

${t.description}

## Core

See [\`contract.json\`](contract.json) \`characteristics\` array.

## Hierarchy

${t.hierarchy?.note || ''}

## Cross-tool notes

${Object.entries(t.tool_coverage)
  .map(([k, v]) => `- **${k}:** ${v.equivalent || ''}${v.notes ? ` — ${v.notes}` : ''}${v.path ? ` (\`${v.path}\`)` : ''}`)
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
    qualified_name: `${t.qnPrefix || 'asset'}.${t.kind_value}.example`,
    source_system: t.example_source || t.catalog_sor[0],
    layer: t.layer,
    characteristics: { Description: t.description, Status: 'Draft' },
  })
}

// ─── Data Products ───────────────────────────────────────────
const DP = path.join(CONTRACTS, 'Data Products')
const DP_SOR = ['entropy_marketplace', 'collibra', 'openmetadata', 'databricks_uc', 'microsoft_purview', 'informatica_cdgc']

const DP_TOOL = {
  'Data Product': {
    collibra: { equivalent: 'Data Product', path: 'Business Asset > Data Product' },
    entropy_marketplace: { equivalent: 'Data Product (SoR)', notes: 'Identity, lifecycle, ODCS' },
    openmetadata: { equivalent: 'DataProduct' },
    databricks_uc: { equivalent: 'Unity Catalog asset / Delta Share product patterns' },
    microsoft_purview: { equivalent: 'Data product (fabric) / custom' },
    informatica_cdgc: { equivalent: 'Data Product' },
    dataplex: { equivalent: '— (Entry + Aspects; no first-class DP)' },
  },
  'Data Product Port': {
    collibra: { equivalent: 'Data Product Port' },
    entropy_marketplace: { equivalent: 'Port (abstract)' },
    openmetadata: { equivalent: '—' },
    databricks_uc: { equivalent: '—' },
    microsoft_purview: { equivalent: '—' },
    informatica_cdgc: { equivalent: 'Port / Interface' },
  },
  'Data Product Output Port': {
    collibra: { equivalent: 'Data Product Output Port' },
    entropy_marketplace: { equivalent: 'Output Port (SoR)' },
    openmetadata: { equivalent: '—' },
    databricks_uc: { equivalent: 'Share / serving endpoint patterns' },
    microsoft_purview: { equivalent: '—' },
    informatica_cdgc: { equivalent: 'Output interface' },
  },
  'Data Product Input Port': {
    collibra: { equivalent: 'Data Product Input Port' },
    entropy_marketplace: { equivalent: 'Input Port (SoR)' },
    openmetadata: { equivalent: '—' },
    databricks_uc: { equivalent: '—' },
    microsoft_purview: { equivalent: '—' },
    informatica_cdgc: { equivalent: 'Input interface' },
  },
  'Data Contract': {
    collibra: { equivalent: 'Data Contract' },
    entropy_marketplace: { equivalent: 'ODCS manifest (SoR)' },
    openmetadata: { equivalent: 'DataContract' },
    databricks_uc: { equivalent: '—' },
    microsoft_purview: { equivalent: '—' },
    informatica_cdgc: { equivalent: 'Data Contract' },
    bitol_odcs: { equivalent: 'Open Data Contract Standard' },
  },
  'Contract Field': {
    collibra: { equivalent: 'Contract Field / schema property' },
    entropy_marketplace: { equivalent: 'ODCS schema property' },
    openmetadata: { equivalent: 'Contract schema field' },
    databricks_uc: { equivalent: '—' },
    microsoft_purview: { equivalent: '—' },
    informatica_cdgc: { equivalent: 'Contract attribute' },
  },
}

for (const [folder, tool] of Object.entries({
  'Data Product': DP_TOOL['Data Product'],
  'Data Product Port': DP_TOOL['Data Product Port'],
  'Data Product Output Port': DP_TOOL['Data Product Output Port'],
  'Data Product Input Port': DP_TOOL['Data Product Input Port'],
  'Data Contract': DP_TOOL['Data Contract'],
  'Contract Field': DP_TOOL['Contract Field'],
})) {
  patchExisting(path.join(DP, folder), {
    version: '1.1.0',
    catalog_sor: DP_SOR,
    tool_coverage: tool,
  })
}

const dpNew = [
  {
    folder: 'Data Product Domain',
    asset_type: 'Data Product Domain',
    contract_id: 'ctr-dp-type-data-product-domain',
    kind_value: 'data_product_domain',
    layer: 'product',
    sectionSlug: 'DataProducts.DataProductDomain',
    tags: ['data-products', 'domain', 'contracts'],
    parentName: 'Data Products',
    catalog_sor: DP_SOR,
    qnPrefix: 'product.domain',
    example_source: 'openmetadata',
    collibra: {
      asset_type_display_name: 'Data Product Domain',
      asset_type_public_id: 'DataProductDomain',
      asset_type_path: 'Business Asset > Domain (product)',
      product: 'Data Products',
      parent_asset_type: 'Business Asset',
    },
    hierarchy: { role: 'root', note: 'Contains Data Products; mesh/OpenMetadata Domain analogue' },
    mapping: {
      predicate: 'implements',
      da_contract: 'DA-10',
      typical_source_type: 'data_product_domain',
      note: 'Optional implements → group Concept; usually organizational.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Domain / Community (product grouping)' },
      entropy_marketplace: { equivalent: 'Product domain / family' },
      openmetadata: { equivalent: 'Domain' },
      databricks_uc: { equivalent: 'Catalog / Schema as domain boundary' },
      microsoft_purview: { equivalent: 'Collection / domain' },
      informatica_cdgc: { equivalent: 'Domain' },
    },
    description: 'Organizational / mesh domain that owns one or more Data Products.',
    characteristics: [
      char('Description', 'Description', 'Text', { min: 1, max: 1, scope: 'core' }),
      char('Status', 'Status', 'Text', { max: 1, scope: 'core' }),
      char('Owner', 'Owner', 'Text', { max: 1 }),
      char('contains Data Product', 'DomainContainsDataProduct', 'Explicit Relation', { filter: 'Data Product' }),
      char('owned by Team', 'DomainOwnedByTeam', 'Explicit Relation', { filter: 'Team' }),
    ],
  },
  {
    folder: 'Team',
    asset_type: 'Team',
    contract_id: 'ctr-dp-type-team',
    kind_value: 'team',
    layer: 'product',
    sectionSlug: 'DataProducts.Team',
    tags: ['data-products', 'team', 'contracts'],
    parentName: 'Data Products',
    catalog_sor: DP_SOR,
    qnPrefix: 'org.team',
    example_source: 'entropy_marketplace',
    collibra: {
      asset_type_display_name: 'Team',
      asset_type_public_id: 'Team',
      asset_type_path: 'Organization > Team',
      product: 'Data Products / Stewardship',
      parent_asset_type: 'Organization',
    },
    hierarchy: { role: 'leaf', note: 'Owns Data Products / Domains; stewardship accountability' },
    mapping: {
      predicate: 'implements',
      da_contract: 'DA-10',
      typical_source_type: 'team',
      note: 'Teams rarely implement Concepts; ownership metadata only.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Community / Role / User group' },
      entropy_marketplace: { equivalent: 'Owning team' },
      openmetadata: { equivalent: 'Team' },
      databricks_uc: { equivalent: 'Group / Account group' },
      microsoft_purview: { equivalent: 'Security group / collection owner' },
      informatica_cdgc: { equivalent: 'Stakeholder / Team' },
    },
    description: 'Product or domain owning team accountable for lifecycle and contracts.',
    characteristics: [
      char('Description', 'Description', 'Text', { min: 1, max: 1, scope: 'core' }),
      char('Status', 'Status', 'Text', { max: 1, scope: 'core' }),
      char('owns Data Product', 'TeamOwnsDataProduct', 'Explicit Relation', { filter: 'Data Product' }),
      char('owns Data Product Domain', 'TeamOwnsDomain', 'Explicit Relation', { filter: 'Data Product Domain' }),
    ],
  },
  {
    folder: 'Data Product Access',
    asset_type: 'Data Product Access',
    contract_id: 'ctr-dp-type-data-product-access',
    kind_value: 'data_product_access',
    layer: 'product',
    sectionSlug: 'DataProducts.DataProductAccess',
    tags: ['data-products', 'access', 'contracts'],
    parentName: 'Data Products',
    catalog_sor: DP_SOR,
    qnPrefix: 'product.access',
    example_source: 'entropy_marketplace',
    collibra: {
      asset_type_display_name: 'Data Product Access',
      asset_type_public_id: 'DataProductAccess',
      asset_type_path: 'Governance Asset > Data Product Access',
      product: 'Data Products / Marketplace',
      parent_asset_type: 'Governance Asset',
    },
    hierarchy: {
      role: 'leaf',
      note: 'Grants consumer access to Output Port / Product; marketplace subscription analogue',
    },
    mapping: {
      predicate: 'implements',
      da_contract: 'DA-10',
      typical_source_type: 'data_product_access',
      note: 'Access grants do not define meaning; optional audit link only.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Access request / entitlement patterns' },
      entropy_marketplace: { equivalent: 'Subscription / grant (SoR)' },
      openmetadata: { equivalent: 'Policy / subscription custom' },
      databricks_uc: { equivalent: 'Share recipient / grants' },
      microsoft_purview: { equivalent: 'Access policy' },
      informatica_cdgc: { equivalent: 'Access / entitlement' },
    },
    description: 'Consumer entitlement or subscription to a Data Product / Output Port.',
    characteristics: [
      char('Description', 'Description', 'Text', { min: 1, max: 1, scope: 'core' }),
      char('Status', 'Status', 'Text', { max: 1, scope: 'core', description: 'requested|approved|revoked' }),
      char('Consumer', 'Consumer', 'Text', { max: 1, scope: 'core' }),
      char('grants access to Data Product', 'AccessGrantsDataProduct', 'Explicit Relation', {
        filter: 'Data Product',
        scope: 'core',
        min: 1,
      }),
      char('via Output Port', 'AccessViaOutputPort', 'Explicit Relation', { filter: 'Data Product Output Port' }),
    ],
  },
]
for (const t of dpNew) writeNewPackage(DP, t)

writeJson(path.join(DP, 'index.json'), {
  meta: {
    title: 'Data Products — Asset Type Contracts Index',
    section: '10.05.10.Contracts.DataProducts',
    version: '1.1.0',
    status: 'draft',
    last_reviewed: '2026-08-12',
    doc_root: 'contracts/Data Products',
    catalog_sor: DP_SOR,
    control_plane_role: 'Mapping Engine implements → Registry concepts; ODCS authoritativeDefinitions',
    marketplace_sor: 'Entropy Marketplace',
    tool_coverage_doc: '03. Catalog Tool Coverage.md',
  },
  contracts: [
    { contract_id: 'ctr-dp-hierarchy-v1', kind: 'data_product_hierarchy', file: 'hierarchy.relations.json', doc: '01. Hierarchy And Relations.md' },
    ...[
      ['Data Product', 'ctr-dp-type-data-product', 'product'],
      ['Data Product Domain', 'ctr-dp-type-data-product-domain', 'product'],
      ['Team', 'ctr-dp-type-team', 'product'],
      ['Data Product Port', 'ctr-dp-type-data-product-port', 'product'],
      ['Data Product Output Port', 'ctr-dp-type-output-port', 'product'],
      ['Data Product Input Port', 'ctr-dp-type-input-port', 'product'],
      ['Data Contract', 'ctr-dp-type-data-contract', 'product'],
      ['Contract Field', 'ctr-dp-type-contract-field', 'product'],
      ['Data Product Access', 'ctr-dp-type-data-product-access', 'product'],
    ].map(([asset_type, contract_id, layer]) => ({
      contract_id,
      kind: 'asset_type_characteristics',
      asset_type,
      layer,
      folder: asset_type,
      file: `${asset_type}/contract.json`,
      doc: `${asset_type}/01. Characteristics.md`,
      example: `${asset_type}/example.json`,
    })),
  ],
  schema: 'shared/asset-type-characteristics.schema.json',
  documentation_standard: '02. Documentation Standard.md',
  tool_coverage: '03. Catalog Tool Coverage.md',
  example_instances: 'examples/index.json',
})

const dpSchema = JSON.parse(fs.readFileSync(path.join(DP, 'shared/asset-type-characteristics.schema.json'), 'utf8'))
dpSchema.properties.asset_type.enum = [
  'Data Product',
  'Data Product Domain',
  'Team',
  'Data Product Port',
  'Data Product Output Port',
  'Data Product Input Port',
  'Data Contract',
  'Contract Field',
  'Data Product Access',
]
dpSchema.properties.tool_coverage = { type: 'object' }
writeJson(path.join(DP, 'shared/asset-type-characteristics.schema.json'), dpSchema)

writeJson(path.join(DP, 'hierarchy.relations.json'), {
  contract_id: 'ctr-dp-hierarchy-v1',
  version: '1.1.0',
  status: 'draft',
  kind: 'data_product_hierarchy',
  title: 'Data Products — Hierarchy And Relations Contract',
  doc: '01. Hierarchy And Relations.md',
  tool_coverage_doc: '03. Catalog Tool Coverage.md',
  layers: {
    product: [
      'Data Product Domain',
      'Team',
      'Data Product',
      'Data Product Port',
      'Data Product Output Port',
      'Data Product Input Port',
      'Data Contract',
      'Contract Field',
      'Data Product Access',
    ],
  },
  canonical_chains: {
    product: [
      'Data Product Domain → Data Product',
      'Data Product → Output/Input Port → Data Contract → Contract Field',
      'Data Product Access → Data Product / Output Port',
    ],
  },
  relations: [
    { id: 'rel-domain-contains-dp', from: 'Data Product Domain', predicate: 'contains', to: 'Data Product', public_id: 'DomainContainsDataProduct', normative: true },
    { id: 'rel-team-owns-dp', from: 'Team', predicate: 'owns', to: 'Data Product', public_id: 'TeamOwnsDataProduct', normative: true },
    { id: 'rel-dp-exposes-out', from: 'Data Product', predicate: 'exposes', to: 'Data Product Output Port', public_id: 'DataProductExposesDataProductPort', normative: true },
    { id: 'rel-dp-consumes-in', from: 'Data Product', predicate: 'consumes', to: 'Data Product Input Port', public_id: 'DataProductConsumesDataProductPort', normative: true },
    { id: 'rel-contract-governs-port', from: 'Data Contract', predicate: 'governs', to: 'Data Product Port', public_id: 'DataContractGovernsDataProductPort', normative: true },
    { id: 'rel-contract-contains-field', from: 'Data Contract', predicate: 'contains', to: 'Contract Field', public_id: 'DataContractContainsContractField', normative: true },
    { id: 'rel-access-grants-dp', from: 'Data Product Access', predicate: 'grants', to: 'Data Product', public_id: 'AccessGrantsDataProduct', normative: true },
    { id: 'rel-port-implemented-by-table', from: 'Data Product Port', predicate: 'implemented_by', to: 'Table', public_id: 'DataProductPortImplementedByTable', normative: true },
    { id: 'rel-dp-implements-concept', from: 'Data Product', predicate: 'implements', to: 'Registry Concept', owned_by: 'mapping_engine', da_contract: 'DA-10', normative: true },
  ],
  rules: [
    'Entropy Marketplace is SoR for data product identity, lifecycle, ports, access, and contract manifests.',
    'Collibra / OpenMetadata / peers may host mirrored product assets for catalog visibility.',
    'Control Plane is SoR for concept meaning linked via implements / authoritativeDefinitions.',
    'Prefer ODCS manifests for Data Contract; SLA remains a contract characteristic (not a separate asset type).',
    'Every published Output Port should have a governing Data Contract.',
  ],
  asset_type_contracts: [
    'Data Product',
    'Data Product Domain',
    'Team',
    'Data Product Port',
    'Data Product Output Port',
    'Data Product Input Port',
    'Data Contract',
    'Contract Field',
    'Data Product Access',
  ].map((a) => ({
    contract_id: a === 'Data Product Output Port' ? 'ctr-dp-type-output-port' : a === 'Data Product Input Port' ? 'ctr-dp-type-input-port' : `ctr-dp-type-${a.toLowerCase().replace(/ /g, '-')}`,
    file: `${a}/contract.json`,
  })),
})

fs.writeFileSync(
  path.join(DP, '03. Catalog Tool Coverage.md'),
  `# Data Products — Catalog tool coverage

Research note mapping this pack to Collibra Data Products, Entropy Marketplace, OpenMetadata, Databricks Unity Catalog, Purview, Informatica CDGC, and Bitol ODCS.

Last reviewed: 2026-08-12

## SoR model

| Concern | SoR |
| --- | --- |
| Product identity, ports, access, ODCS manifests | **Entropy Marketplace** |
| Mirrored visibility | Collibra / OpenMetadata / peers |
| Meaning (\`implements\`) | Semantic Control Plane |

## Tool matrix

| Asset type | Marketplace | Collibra | OpenMetadata | Databricks UC | Purview | Informatica |
| --- | --- | --- | --- | --- | --- | --- |
| Data Product Domain | Product domain | Domain/Community | **Domain** | Catalog/Schema boundary | Collection | Domain |
| Team | Owning team | Community/roles | **Team** | Groups | Owners | Stakeholder |
| Data Product | Product (SoR) | Data Product | DataProduct | Share/product patterns | Fabric DP | Data Product |
| Port / In / Out | Ports (SoR) | Data Product Ports | — | Endpoint patterns | — | Interface |
| Data Contract | ODCS (SoR) | Data Contract | DataContract | — | — | Data Contract |
| Contract Field | ODCS property | Contract Field | Schema field | — | — | Attribute |
| Data Product Access | Subscription (SoR) | Access request | Policy custom | Share grants | Access policy | Entitlement |

## Explicitly out of pack

Physical Table/Column (Technical Catalog); glossary Terms (Business Catalog); Concept meaning (SCP). BI dashboards → future BI Catalog if needed.

## Sources

- Collibra Data Product operating model
- Bitol Open Data Contract Standard (ODCS)
- OpenMetadata DataProduct / Domain / Team
- Databricks Unity Catalog sharing / grants
- Microsoft Purview / Fabric data products
`,
)

// ─── Semantic Control Plane ──────────────────────────────────
const SCP = path.join(CONTRACTS, 'Semantic Control Plane')
const SCP_SOR = ['semantic_control_plane', 'git']

const SCP_TOOL = {
  Namespace: {
    semantic_control_plane: { equivalent: 'Namespace (SoR)', notes: 'DA-02 Git registry' },
    collibra: { equivalent: '— (not meaning SoR; domains live in Business Catalog)' },
    dataplex: { equivalent: '—' },
    openmetadata: { equivalent: '—' },
    dbt_semantic_layer: { equivalent: 'Project / package scope' },
    databricks_uc: { equivalent: '—' },
    microsoft_purview: { equivalent: '—' },
  },
  Concept: {
    semantic_control_plane: { equivalent: 'Concept (SoR)', notes: 'DA-04 entity/property/metric/group/value' },
    collibra: { equivalent: '— (Data Concept/Term are sources via mapsTo)' },
    dataplex: { equivalent: '— (Glossary Term is source)' },
    openmetadata: { equivalent: '— (GlossaryTerm is source)' },
    dbt_semantic_layer: { equivalent: 'Semantic model entity / measure / dimension' },
    databricks_uc: { equivalent: 'Metric View / semantic artifacts (peer)' },
    microsoft_purview: { equivalent: '— (glossary term is source)' },
  },
  'Mapping Record': {
    semantic_control_plane: { equivalent: 'Mapping Record (SoR)', notes: 'DA-08/09/10' },
    collibra: { equivalent: '— (relations are sources; crosswalk owned here)' },
    dataplex: { equivalent: 'Entry↔Term links (source evidence)' },
    openmetadata: { equivalent: 'Lineage / glossary links (source)' },
    dbt_semantic_layer: { equivalent: 'ref / semantic model bindings' },
    databricks_uc: { equivalent: '—' },
    microsoft_purview: { equivalent: '—' },
  },
  'Federation Edge': {
    semantic_control_plane: { equivalent: 'Federation Edge (SoR)', notes: 'DA-11 NATCO→global' },
    collibra: { equivalent: '—' },
    dataplex: { equivalent: '—' },
    openmetadata: { equivalent: '—' },
    dbt_semantic_layer: { equivalent: '—' },
    databricks_uc: { equivalent: '—' },
    microsoft_purview: { equivalent: '—' },
  },
}

for (const folder of ['Namespace', 'Concept', 'Mapping Record', 'Federation Edge']) {
  patchExisting(path.join(SCP, folder), {
    version: '1.1.0',
    catalog_sor: SCP_SOR,
    tool_coverage: SCP_TOOL[folder],
  })
}

const scpNew = [
  {
    folder: 'Ontology Package',
    asset_type: 'Ontology Package',
    contract_id: 'ctr-scp-type-ontology-package',
    kind_value: 'ontology_package',
    layer: 'registry',
    sectionSlug: 'SemanticControlPlane.OntologyPackage',
    tags: ['semantic-control-plane', 'ontology', 'contracts'],
    parentName: 'Semantic Control Plane',
    catalog_sor: SCP_SOR,
    qnPrefix: 'scp.ontology',
    example_source: 'semantic_control_plane',
    da_deliverable: 'DA-04',
    control_plane: {
      path: 'Semantic Control Plane > Semantic Registry > Ontology Package',
      sor: 'Semantic Control Plane (Git)',
      public_id: 'OntologyPackage',
    },
    hierarchy: { role: 'intermediate', note: 'Versioned bundle of Concepts within one or more Namespaces' },
    mapping: { predicate: 'target_scope', note: 'Packages group Concepts; mappings still target individual Concepts.' },
    tool_coverage: {
      semantic_control_plane: { equivalent: 'Ontology Package (SoR)' },
      dbt_semantic_layer: { equivalent: 'Semantic model / YAML package' },
      databricks_uc: { equivalent: 'Metric views package patterns' },
      collibra: { equivalent: '—' },
      openmetadata: { equivalent: '—' },
      dataplex: { equivalent: '—' },
    },
    description: 'Versioned, publishable set of Concepts (ontology / semantic model package).',
    characteristics: [
      char('Description', 'Description', 'Text', { min: 1, max: 1, scope: 'core' }),
      char('Version', 'PackageVersion', 'Text', { min: 1, max: 1, scope: 'core' }),
      char('Status', 'Status', 'Text', { max: 1, scope: 'core' }),
      char('contains Concept', 'OntologyContainsConcept', 'Explicit Relation', { filter: 'Concept', min: 1, scope: 'core' }),
      char('scoped by Namespace', 'OntologyScopedByNamespace', 'Explicit Relation', { filter: 'Namespace', min: 1 }),
    ],
  },
  {
    folder: 'Value Set',
    asset_type: 'Value Set',
    contract_id: 'ctr-scp-type-value-set',
    kind_value: 'value_set',
    layer: 'registry',
    sectionSlug: 'SemanticControlPlane.ValueSet',
    tags: ['semantic-control-plane', 'value-set', 'contracts'],
    parentName: 'Semantic Control Plane',
    catalog_sor: SCP_SOR,
    qnPrefix: 'scp.valueset',
    example_source: 'semantic_control_plane',
    da_deliverable: 'DA-04',
    control_plane: {
      path: 'Semantic Control Plane > Semantic Registry > Value Set',
      sor: 'Semantic Control Plane (Git)',
      public_id: 'ValueSet',
    },
    hierarchy: { role: 'intermediate', note: 'Contains value Concepts or literal members; bound to property Concepts' },
    mapping: { predicate: 'target', note: 'Value Sets constrain shared_property Concepts; catalog enums mapsTo members.' },
    tool_coverage: {
      semantic_control_plane: { equivalent: 'Value Set (SoR)' },
      dbt_semantic_layer: { equivalent: 'enum / accepted values' },
      collibra: { equivalent: 'Code Value / list (source)' },
      openmetadata: { equivalent: 'Enum / tag options (source)' },
      dataplex: { equivalent: '—' },
      microsoft_purview: { equivalent: 'Classification / enum patterns' },
    },
    description: 'Controlled set of allowed values for a property or metric dimension.',
    characteristics: [
      char('Description', 'Description', 'Text', { min: 1, max: 1, scope: 'core' }),
      char('Status', 'Status', 'Text', { max: 1, scope: 'core' }),
      char('contains value Concept', 'ValueSetContainsConcept', 'Explicit Relation', { filter: 'Concept' }),
      char('constrains Concept', 'ValueSetConstrainsConcept', 'Explicit Relation', { filter: 'Concept', scope: 'core', min: 1 }),
      char('belongs to Namespace', 'ValueSetInNamespace', 'Explicit Relation', { filter: 'Namespace', min: 1, scope: 'core' }),
    ],
  },
  {
    folder: 'Concept Relation',
    asset_type: 'Concept Relation',
    contract_id: 'ctr-scp-type-concept-relation',
    kind_value: 'concept_relation',
    layer: 'registry',
    sectionSlug: 'SemanticControlPlane.ConceptRelation',
    tags: ['semantic-control-plane', 'relation', 'contracts'],
    parentName: 'Semantic Control Plane',
    catalog_sor: SCP_SOR,
    qnPrefix: 'scp.rel',
    example_source: 'semantic_control_plane',
    da_deliverable: 'DA-04',
    control_plane: {
      path: 'Semantic Control Plane > Semantic Registry > Concept Relation',
      sor: 'Semantic Control Plane (Git)',
      public_id: 'ConceptRelation',
    },
    hierarchy: {
      role: 'leaf',
      note: 'Typed edge between Concepts (specializes, partOf, measures, …); distinct from Federation Edge',
    },
    mapping: { predicate: 'n/a', note: 'Internal registry structure; not a catalog mapsTo source.' },
    tool_coverage: {
      semantic_control_plane: { equivalent: 'Concept Relation (SoR)' },
      dbt_semantic_layer: { equivalent: 'entity relationships / foreign keys in semantic YAML' },
      collibra: { equivalent: '— (asset relations are catalog-side)' },
      openmetadata: { equivalent: '—' },
      dataplex: { equivalent: '—' },
      databricks_uc: { equivalent: '—' },
    },
    description: 'First-class typed relationship between two Concepts inside the registry.',
    characteristics: [
      char('Predicate', 'Predicate', 'Text', { min: 1, max: 1, scope: 'core', description: 'specializes|partOf|measures|relatedTo|…' }),
      char('Description', 'Description', 'Text', { max: 1 }),
      char('Status', 'Status', 'Text', { max: 1, scope: 'core' }),
      char('from Concept', 'ConceptRelationFrom', 'Explicit Relation', { filter: 'Concept', min: 1, max: 1, scope: 'core' }),
      char('to Concept', 'ConceptRelationTo', 'Explicit Relation', { filter: 'Concept', min: 1, max: 1, scope: 'core' }),
    ],
  },
  {
    folder: 'Semantic Policy',
    asset_type: 'Semantic Policy',
    contract_id: 'ctr-scp-type-semantic-policy',
    kind_value: 'semantic_policy',
    layer: 'governance',
    sectionSlug: 'SemanticControlPlane.SemanticPolicy',
    tags: ['semantic-control-plane', 'policy', 'contracts'],
    parentName: 'Semantic Control Plane',
    catalog_sor: SCP_SOR,
    qnPrefix: 'scp.policy',
    example_source: 'semantic_control_plane',
    da_deliverable: 'POL-SEM',
    control_plane: {
      path: 'Semantic Control Plane > Policies > Semantic Policy',
      sor: 'Semantic Control Plane (Git)',
      public_id: 'SemanticPolicy',
    },
    hierarchy: {
      role: 'leaf',
      note: 'Constrains mapping/federation/approval of Concepts; distinct from Business Catalog Policy',
    },
    mapping: { predicate: 'n/a', note: 'Policies govern Mapping Records and Federation Edges; not catalog sources.' },
    tool_coverage: {
      semantic_control_plane: { equivalent: 'Semantic Policy / POL-SEM-* (SoR)' },
      collibra: { equivalent: 'Policy (business) — different pack' },
      microsoft_purview: { equivalent: 'Policy (data access) — not meaning policy' },
      openmetadata: { equivalent: 'Policy (access)' },
      dbt_semantic_layer: { equivalent: '—' },
      dataplex: { equivalent: 'Policy tags (classification)' },
    },
    description: 'Rule governing how meaning may be mapped, federated, or approved (POL-SEM).',
    characteristics: [
      char('Policy ID', 'PolicyId', 'Text', { min: 1, max: 1, scope: 'core', description: 'e.g. POL-SEM-01' }),
      char('Policy Statement', 'PolicyStatement', 'Text', { min: 1, max: 1, scope: 'core' }),
      char('Status', 'Status', 'Text', { max: 1, scope: 'core' }),
      char('applies to Namespace', 'PolicyAppliesToNamespace', 'Explicit Relation', { filter: 'Namespace' }),
      char('applies to Concept', 'PolicyAppliesToConcept', 'Explicit Relation', { filter: 'Concept' }),
    ],
  },
]
for (const t of scpNew) writeNewPackage(SCP, t)

writeJson(path.join(SCP, 'index.json'), {
  meta: {
    title: 'Semantic Control Plane — Type Contracts Index',
    section: '10.05.10.Contracts.SemanticControlPlane',
    version: '1.1.0',
    status: 'draft',
    last_reviewed: '2026-08-12',
    sor: 'semantic_control_plane',
    doc_root: 'contracts/Semantic Control Plane',
    role: 'Enterprise meaning SoR — target of mapsTo / represents / implements',
    tool_coverage_doc: '03. Catalog Tool Coverage.md',
  },
  contracts: [
    { contract_id: 'ctr-scp-hierarchy-v1', kind: 'semantic_control_plane_hierarchy', file: 'hierarchy.relations.json', doc: '01. Hierarchy And Relations.md' },
    ...[
      ['Namespace', 'ctr-scp-type-namespace', 'DA-02'],
      ['Concept', 'ctr-scp-type-concept', 'DA-04'],
      ['Ontology Package', 'ctr-scp-type-ontology-package', 'DA-04'],
      ['Value Set', 'ctr-scp-type-value-set', 'DA-04'],
      ['Concept Relation', 'ctr-scp-type-concept-relation', 'DA-04'],
      ['Mapping Record', 'ctr-scp-type-mapping-record', 'DA-08/09/10'],
      ['Federation Edge', 'ctr-scp-type-federation-edge', 'DA-11'],
      ['Semantic Policy', 'ctr-scp-type-semantic-policy', 'POL-SEM'],
    ].map(([asset_type, contract_id, da]) => ({
      contract_id,
      kind: 'asset_type_characteristics',
      asset_type,
      da,
      folder: asset_type,
      file: `${asset_type}/contract.json`,
      doc: `${asset_type}/01. Characteristics.md`,
      example: `${asset_type}/example.json`,
    })),
  ],
  schema: 'shared/asset-type-characteristics.schema.json',
  documentation_standard: '02. Documentation Standard.md',
  tool_coverage: '03. Catalog Tool Coverage.md',
  example_instances: 'examples/index.json',
  foundation: [
    '01. Foundation/08. Systems of Record.md',
    '01. Foundation/09. Namespace Registry.md',
    '01. Foundation/11. Semantic Registry Schema.md',
    '01. Foundation/15. Mapping Contracts.md',
    '01. Foundation/16. Federation Engine Rules.md',
  ],
})

const scpSchema = JSON.parse(fs.readFileSync(path.join(SCP, 'shared/asset-type-characteristics.schema.json'), 'utf8'))
scpSchema.properties.asset_type.enum = [
  'Namespace',
  'Concept',
  'Ontology Package',
  'Value Set',
  'Concept Relation',
  'Mapping Record',
  'Federation Edge',
  'Semantic Policy',
]
scpSchema.properties.tool_coverage = { type: 'object' }
writeJson(path.join(SCP, 'shared/asset-type-characteristics.schema.json'), scpSchema)

writeJson(path.join(SCP, 'hierarchy.relations.json'), {
  contract_id: 'ctr-scp-hierarchy-v1',
  version: '1.1.0',
  status: 'draft',
  kind: 'semantic_control_plane_hierarchy',
  title: 'Semantic Control Plane — Object Relations Contract',
  doc: '01. Hierarchy And Relations.md',
  tool_coverage_doc: '03. Catalog Tool Coverage.md',
  layers: {
    registry: ['Namespace', 'Concept', 'Ontology Package', 'Value Set', 'Concept Relation'],
    mapping: ['Mapping Record'],
    federation: ['Federation Edge'],
    governance: ['Semantic Policy'],
  },
  canonical_chains: {
    registry: ['Namespace → Concept', 'Ontology Package → Concept', 'Value Set → value Concept'],
    mapping: ['Catalog/Marketplace asset → Mapping Record → Concept'],
    federation: ['Concept (natco/import) → Federation Edge → Concept (global)'],
    structure: ['Concept → Concept Relation → Concept'],
  },
  relations: [
    { id: 'rel-ns-contains-concept', from: 'Namespace', predicate: 'contains', to: 'Concept', public_id: 'NamespaceContainsConcept', normative: true },
    { id: 'rel-ontology-contains-concept', from: 'Ontology Package', predicate: 'contains', to: 'Concept', public_id: 'OntologyContainsConcept', normative: true },
    { id: 'rel-valueset-constrains-concept', from: 'Value Set', predicate: 'constrains', to: 'Concept', public_id: 'ValueSetConstrainsConcept', normative: true },
    { id: 'rel-concept-relation', from: 'Concept', predicate: 'related_via', to: 'Concept', via: 'Concept Relation', normative: true },
    { id: 'rel-mapping-targets-concept', from: 'Mapping Record', predicate: 'targets', to: 'Concept', public_id: 'MappingRecordTargetsConcept', normative: true },
    { id: 'rel-fed-from-to', from: 'Concept', predicate: 'federates', to: 'Concept', via: 'Federation Edge', normative: true },
    { id: 'rel-policy-applies-concept', from: 'Semantic Policy', predicate: 'applies_to', to: 'Concept', public_id: 'PolicyAppliesToConcept', normative: true },
  ],
  rules: [
    'Git Semantic Control Plane is the only SoR for enterprise meaning (concepts, namespaces, packages, value sets, mappings, federation, semantic policies).',
    'Collibra Guided Stewardship semantic layer (Data Model/Entity/Attribute) is NOT this pack — see Business Catalog.',
    'Technical Catalog and Business Catalog assets are SOURCES of Mapping Records; Concepts are TARGETS.',
    'Concept Relation is registry structure; Federation Edge is cross-namespace equivalence only.',
    'Semantic Policy (POL-SEM) is distinct from Business Catalog Policy.',
    'Only approved Concepts may be targets of active mappings / product binds.',
    'NATCO concepts used cross-NATCO require an approved Federation Edge to global.',
  ],
  asset_type_contracts: [
    'Namespace',
    'Concept',
    'Ontology Package',
    'Value Set',
    'Concept Relation',
    'Mapping Record',
    'Federation Edge',
    'Semantic Policy',
  ].map((a) => ({
    contract_id: `ctr-scp-type-${a.toLowerCase().replace(/ /g, '-')}`,
    file: `${a}/contract.json`,
  })),
})

fs.writeFileSync(
  path.join(SCP, '03. Catalog Tool Coverage.md'),
  `# Semantic Control Plane — Tool coverage

This pack is the **enterprise meaning SoR** (Git). Peer tools below are **not** meaning SoR — they either supply catalog sources or provide parallel semantic-layer engines.

Last reviewed: 2026-08-12

## Authority (SQ2)

| Artifact | SoR |
| --- | --- |
| Namespace, Concept, Ontology Package, Value Set, Concept Relation | **Git SCP** |
| Mapping Record, Federation Edge | **Git SCP** (Mapping / Federation Engines) |
| Semantic Policy (POL-SEM) | **Git SCP** |
| Glossary / tech / products | Catalogs / Marketplace (**sources only**) |
| Metric calculations | BI / metrics platform (**beside** layer — SQ1) |

## Peer matrix

| Type (this pack) | Collibra | Dataplex | OpenMetadata | dbt Semantic Layer | Databricks UC | Purview |
| --- | --- | --- | --- | --- | --- | --- |
| Namespace | — | — | — | project/package | — | — |
| Concept | Term/Data Concept are **sources** | Term **source** | GlossaryTerm **source** | entity/measure/dim | Metric View peer | Term **source** |
| Ontology Package | — | — | — | semantic YAML package | metric package patterns | — |
| Value Set | Code lists **source** | — | enums **source** | accepted values | — | enums |
| Concept Relation | asset relations ≠ this | — | — | entity relationships | — | — |
| Mapping Record | evidence only | entry↔term evidence | links evidence | refs/bindings | — | — |
| Federation Edge | — | — | — | — | — | — |
| Semantic Policy | Business Policy ≠ this | policy tags | access policy | — | — | access policy |

## Sources

- Foundation DA-02/04/08/09/10/11 · SQ1/SQ2
- dbt Semantic Layer · Databricks Metric Views · Bitol ODCS authoritativeDefinitions
`,
)

console.log('Data Products + SCP done')
