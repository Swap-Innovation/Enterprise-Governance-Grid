/**
 * Generates Collibra-inspired multi-pack contracts for the demo workspace.
 * Run: node scripts/generate-rich-contracts.mjs
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '../src/data/customer-contracts.json')

const NATCOS = [
  { code: 'de', slug: 'natco-de', label: 'Germany', local: 'Kunde', idLocal: 'Kundennummer', crm: 'crm_de', schema: 'public', table: 'kunde', tech: 'PostgreSQL' },
  { code: 'at', slug: 'natco-at', label: 'Austria', local: 'Kunde', idLocal: 'Kundennummer', crm: 'crm_at', schema: 'dbo', table: 'Kunde', tech: 'SQL Server' },
  { code: 'hr', slug: 'natco-hr', label: 'Croatia', local: 'Kupac', idLocal: 'Broj kupca', crm: 'crm_hr', schema: 'public', table: 'kupac', tech: 'PostgreSQL' },
  { code: 'hu', slug: 'natco-hu', label: 'Hungary', local: 'Ügyfél', idLocal: 'Ügyfélazonosító', crm: 'crm_hu', schema: 'dbo', table: 'Ugyfel', tech: 'SQL Server' },
  { code: 'pl', slug: 'natco-pl', label: 'Poland', local: 'Klient', idLocal: 'Numer klienta', crm: 'crm_pl', schema: 'public', table: 'klient', tech: 'PostgreSQL' },
]

const FAMILIES = [
  {
    id: 'customer-360',
    productId: 'dp-customer-360',
    name: 'Customer 360',
    concept: 'Customer',
    domain: 'Customer',
    owner: 'Customer 360 Product Team',
    table: 'customer_360',
  },
  {
    id: 'customer-interactions',
    productId: 'dp-customer-interactions',
    name: 'Customer Interactions',
    concept: 'CustomerInteraction',
    domain: 'Customer',
    owner: 'CX Analytics Team',
    table: 'customer_interactions',
  },
  {
    id: 'product-orders',
    productId: 'dp-product-orders',
    name: 'Product Orders',
    concept: 'ProductOrder',
    domain: 'Commerce',
    owner: 'Order Management COE',
    table: 'product_orders',
  },
  {
    id: 'billing-accounts',
    productId: 'dp-billing-accounts',
    name: 'Billing Accounts',
    concept: 'BillingAccount',
    domain: 'Billing',
    owner: 'Revenue Assurance',
    table: 'billing_accounts',
  },
  {
    id: 'service-subscriptions',
    productId: 'dp-service-subscriptions',
    name: 'Service Subscriptions',
    concept: 'ServiceSubscription',
    domain: 'Service',
    owner: 'Service Inventory Team',
    table: 'service_subscriptions',
  },
]

const contracts = {}

function put(c) {
  contracts[c.id] = c
}

function base(partial) {
  return {
    status: 'Approved',
    version: '1.0.0',
    effective_from: '2026-01-15',
    last_reviewed: '2026-07-01',
    source_system: partial.source_system ?? 'collibra',
    ...partial,
  }
}

// ─── Global Semantics ───────────────────────────────────────────────
put(
  base({
    id: 'ctr-ns-global',
    kind: 'namespace',
    pack: 'semantics',
    asset_type: 'Namespace',
    type_contract_id: 'ctr-scp-type-namespace',
    name: 'global',
    display_name: 'Enterprise Global (TM Forum SID)',
    description: 'Enterprise semantic namespace for TM Forum SID-aligned concepts. System of record for meaning across NATCOs.',
    natco: 'global',
    owner: 'Global Semantic COE',
    steward: 'enterprise-ontology-stewards',
    source_system: 'semantic_control_plane',
    catalog_source_id: 'col-ns-global-001',
    uri_base: 'https://semantics.example/ns/global/',
    characteristics: {
      Slug: 'global',
      DisplayName: 'Enterprise Global (TM Forum SID)',
      Description: 'Enterprise semantic namespace for TM Forum SID-aligned concepts.',
      Kind: 'enterprise',
      UriBase: 'https://semantics.example/ns/global/',
      Status: 'Approved',
      Owner: 'Global Semantic COE',
      Steward: 'enterprise-ontology-stewards',
    },
    links: {
      concepts: [
        'global/Customer',
        'global/CustomerIdentification',
        'global/CustomerName',
        'global/CustomerEmail',
        'global/CustomerStatus',
        'global/CustomerInteraction',
        'global/ProductOrder',
        'global/BillingAccount',
        'global/ServiceSubscription',
      ],
    },
    concepts: [
      'global/Customer',
      'global/CustomerIdentification',
      'global/CustomerName',
      'global/CustomerEmail',
      'global/CustomerStatus',
    ],
  }),
)

const globalConcepts = [
  {
    id: 'ctr-sem-customer',
    name: 'Customer',
    kindKind: 'entity',
    desc: 'TM Forum SID Customer — a party that buys or uses products or services.',
    identity: 'CustomerIdentification',
    federated: NATCOS.map((n) => `${n.slug}/${n.local.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')}`),
  },
  {
    id: 'ctr-sem-customer-id',
    name: 'CustomerIdentification',
    kindKind: 'shared_property',
    desc: 'Stable enterprise identifier for a Customer across NATCO sources.',
    identity: null,
  },
  {
    id: 'ctr-sem-customer-name',
    name: 'CustomerName',
    kindKind: 'shared_property',
    desc: 'Legal or preferred display name of the Customer.',
    identity: null,
  },
  {
    id: 'ctr-sem-customer-email',
    name: 'CustomerEmail',
    kindKind: 'shared_property',
    desc: 'Primary contact email address for the Customer.',
    identity: null,
    classification: 'PII',
  },
  {
    id: 'ctr-sem-customer-status',
    name: 'CustomerStatus',
    kindKind: 'shared_property',
    desc: 'Lifecycle status of the Customer relationship (active, suspended, churned).',
    identity: null,
  },
  {
    id: 'ctr-sem-customer-interaction',
    name: 'CustomerInteraction',
    kindKind: 'entity',
    desc: 'Omnichannel interaction event between the enterprise and a Customer (call, chat, retail, app).',
    identity: null,
  },
  {
    id: 'ctr-sem-product-order',
    name: 'ProductOrder',
    kindKind: 'entity',
    desc: 'TM Forum SID ProductOrder — request to fulfill products or services for a Customer.',
    identity: null,
  },
  {
    id: 'ctr-sem-billing-account',
    name: 'BillingAccount',
    kindKind: 'entity',
    desc: 'TM Forum SID BillingAccount — account used for charging and invoicing.',
    identity: null,
  },
  {
    id: 'ctr-sem-service-subscription',
    name: 'ServiceSubscription',
    kindKind: 'entity',
    desc: 'TM Forum SID ServiceSubscription — active subscription binding a Customer to a service.',
    identity: null,
  },
]

for (const c of globalConcepts) {
  put(
    base({
      id: c.id,
      kind: 'semantic_concept',
      pack: 'semantics',
      asset_type: 'Concept',
      type_contract_id: 'ctr-scp-type-concept',
      name: c.name,
      display_name: c.name,
      description: c.desc,
      natco: 'global',
      owner: 'Global Semantic COE',
      steward: 'customer-domain-stewards',
      source_system: 'semantic_control_plane',
      catalog_source_id: `col-concept-${c.name}`,
      uri: `https://semantics.example/ns/global/${c.name}`,
      sid: c.name,
      bootstrap: 'tmforum-sid',
      classification: c.classification ?? 'Internal',
      federated_from: c.federated,
      characteristics: {
        ConceptId: c.name,
        Uri: `https://semantics.example/ns/global/${c.name}`,
        ConceptKind: c.kindKind,
        PreferredLabel: c.name,
        Description: c.desc,
        Status: 'Approved',
        Version: 1,
        EffectiveFrom: '2026-01-15',
        Owner: 'Global Semantic COE',
        Steward: 'customer-domain-stewards',
        Scope: 'enterprise',
        BootstrapSource: 'tmforum-sid',
        Classification: c.classification ?? 'Internal',
        ...(c.identity ? { IdentityKeys: c.identity } : {}),
      },
      links: {
        namespace: 'ns-global',
        ...(c.federated ? { federated_from: c.federated } : {}),
      },
    }),
  )
}

// ─── Global Business Catalog ────────────────────────────────────────
put(
  base({
    id: 'ctr-biz-domain-customer',
    kind: 'data_domain',
    pack: 'business',
    asset_type: 'Data Domain',
    type_contract_id: 'ctr-biz-type-data-domain',
    name: 'Customer',
    display_name: 'Customer Domain',
    description: 'Business domain covering party, relationship, and customer master meaning.',
    natco: 'global',
    owner: 'Customer Domain Owner',
    steward: 'customer-domain-stewards',
    catalog_source_id: 'col-domain-customer-001',
    characteristics: {
      Description: 'Business domain covering party, relationship, and customer master meaning.',
      Status: 'Approved',
      Owner: 'Customer Domain Owner',
    },
    links: {
      terms: ['ctr-biz-global-customer'],
      entities: ['ctr-biz-entity-customer'],
    },
  }),
)

put(
  base({
    id: 'ctr-biz-global-customer',
    kind: 'business_term',
    pack: 'business',
    asset_type: 'Business Term',
    type_contract_id: 'ctr-biz-type-business-term',
    name: 'Customer',
    display_name: 'Customer',
    description: 'A party that buys or uses products or services — enterprise glossary definition aligned to SID Customer.',
    natco: 'global',
    owner: 'Customer Domain Owner',
    steward: 'glossary-stewards',
    catalog_source_id: 'col-business-term-customer',
    catalog_sor: 'Collibra',
    maps_to: ['global/Customer'],
    characteristics: {
      Description: 'A party that buys or uses products or services — enterprise glossary definition aligned to SID Customer.',
      Status: 'Approved',
      Synonyms: 'Client; Account Holder; Party (customer role)',
      Acronyms: 'C360',
    },
    links: {
      data_domain: 'ctr-biz-domain-customer',
      data_entity: 'ctr-biz-entity-customer',
      maps_to: ['global/Customer'],
    },
  }),
)

put(
  base({
    id: 'ctr-biz-entity-customer',
    kind: 'data_entity',
    pack: 'business',
    asset_type: 'Data Entity',
    type_contract_id: 'ctr-biz-type-data-entity',
    name: 'Customer',
    display_name: 'Customer Entity',
    description: 'Logical business entity for Customer in the enterprise data model.',
    natco: 'global',
    owner: 'Enterprise Data Architecture',
    steward: 'customer-domain-stewards',
    catalog_source_id: 'col-entity-customer-001',
    characteristics: {
      Description: 'Logical business entity for Customer in the enterprise data model.',
      Status: 'Approved',
    },
    links: {
      data_domain: 'ctr-biz-domain-customer',
      attributes: [
        'ctr-biz-attr-customer-id',
        'ctr-biz-attr-customer-name',
        'ctr-biz-attr-customer-email',
        'ctr-biz-attr-customer-status',
      ],
      implemented_in: ['ctr-tech-c360-table'],
    },
  }),
)

for (const [id, name, desc, concept] of [
  ['ctr-biz-attr-customer-id', 'Customer Id', 'Business attribute for the enterprise customer identifier.', 'global/CustomerIdentification'],
  ['ctr-biz-attr-customer-name', 'Customer Name', 'Business attribute for customer legal/preferred name.', 'global/CustomerName'],
  ['ctr-biz-attr-customer-email', 'Customer Email', 'Business attribute for primary customer email (PII).', 'global/CustomerEmail'],
  ['ctr-biz-attr-customer-status', 'Customer Status', 'Business attribute for customer lifecycle status.', 'global/CustomerStatus'],
]) {
  put(
    base({
      id,
      kind: 'data_attribute',
      pack: 'business',
      asset_type: 'Data Attribute',
      type_contract_id: 'ctr-biz-type-data-attribute',
      name,
      display_name: name,
      description: desc,
      natco: 'global',
      owner: 'Enterprise Data Architecture',
      steward: 'customer-domain-stewards',
      catalog_source_id: `col-attr-${name.replace(/\s+/g, '-').toLowerCase()}`,
      classification: name.includes('Email') ? 'PII' : 'Internal',
      characteristics: {
        Description: desc,
        Status: 'Approved',
        DataType: name.includes('Id') ? 'string' : 'string',
      },
      links: {
        entity: 'ctr-biz-entity-customer',
        implements: [concept],
      },
      maps_to: [concept],
    }),
  )
}

// ─── Global Technical curated hub ───────────────────────────────────
put(
  base({
    id: 'ctr-tech-sys-platform',
    kind: 'system',
    pack: 'technical',
    asset_type: 'System',
    type_contract_id: 'ctr-tech-type-system',
    name: 'data-platform',
    display_name: 'Enterprise Data Platform',
    description: 'Curated analytics platform hosting marketplace data products.',
    natco: 'global',
    owner: 'Data Platform Engineering',
    steward: 'platform-stewards',
    catalog_source_id: 'col-sys-platform-001',
    characteristics: {
      Description: 'Curated analytics platform hosting marketplace data products.',
      Technology: 'Cloud Data Platform',
      Status: 'Approved',
    },
    links: {
      databases: ['ctr-tech-db-curated'],
    },
  }),
)

put(
  base({
    id: 'ctr-tech-db-curated',
    kind: 'database',
    pack: 'technical',
    asset_type: 'Database',
    type_contract_id: 'ctr-tech-type-database',
    name: 'dp',
    display_name: 'dp (curated)',
    description: 'Curated database for certified data products.',
    natco: 'global',
    owner: 'Data Platform Engineering',
    steward: 'platform-stewards',
    catalog_source_id: 'col-db-dp-001',
    characteristics: {
      Description: 'Curated database for certified data products.',
      Technology: 'Analytical Warehouse',
      Status: 'Approved',
    },
    links: {
      system: 'ctr-tech-sys-platform',
      schemas: ['ctr-tech-schema-curated'],
    },
  }),
)

put(
  base({
    id: 'ctr-tech-schema-curated',
    kind: 'schema',
    pack: 'technical',
    asset_type: 'Schema',
    type_contract_id: 'ctr-tech-type-schema',
    name: 'curated',
    display_name: 'curated',
    description: 'Schema for published marketplace product tables.',
    natco: 'global',
    owner: 'Data Platform Engineering',
    steward: 'platform-stewards',
    catalog_source_id: 'col-sch-curated-001',
    characteristics: {
      Description: 'Schema for published marketplace product tables.',
      Status: 'Approved',
    },
    links: {
      database: 'ctr-tech-db-curated',
      tables: ['ctr-tech-c360-table'],
    },
  }),
)

put(
  base({
    id: 'ctr-tech-c360-table',
    kind: 'technical_asset',
    pack: 'technical',
    asset_type: 'Table',
    type_contract_id: 'ctr-tech-type-table',
    name: 'customer_360',
    display_name: 'customer_360',
    description: 'Curated enterprise customer master federating DE / AT / HR / HU / PL CRM sources under TM Forum SID Customer.',
    natco: 'global',
    owner: 'Data Engineering',
    steward: 'c360-stewards',
    owner_team: 'Data Engineering',
    qualified_name: 'dp.curated.customer_360',
    catalog_source_id: 'col-tbl-c360-001',
    represents: ['global/Customer'],
    characteristics: {
      Description: 'Curated enterprise customer master federating NATCO CRM sources under SID Customer.',
      DescriptionFromSourceSystem: 'CUSTOMER_360',
      TableType: 'TABLE',
      PartitionedFlag: true,
      PartitionKey: 'natco_code',
      RowCountEstimate: 12500000,
      LastSyncDate: '2026-07-28',
      Classification: 'Confidential',
    },
    links: {
      schema: 'ctr-tech-schema-curated',
      columns: [
        'ctr-tech-col-customer-id',
        'ctr-tech-col-full-name',
        'ctr-tech-col-email',
        'ctr-tech-col-status',
        'ctr-tech-col-natco-code',
      ],
      represents: ['global/Customer'],
      pipeline: 'ctr-tech-pipe-c360',
    },
    schema: [
      { name: 'customer_id', type: 'string', pk: true, nullable: false, represents: 'global/CustomerIdentification' },
      { name: 'full_name', type: 'string', pk: false, nullable: false, represents: 'global/CustomerName' },
      { name: 'email', type: 'string', pk: false, nullable: true, represents: 'global/CustomerEmail', classification: 'PII' },
      { name: 'status', type: 'string', pk: false, nullable: false, represents: 'global/CustomerStatus' },
      { name: 'natco_code', type: 'string', pk: false, nullable: false, represents: null },
    ],
  }),
)

const curatedCols = [
  ['ctr-tech-col-customer-id', 'customer_id', 'Enterprise customer identifier.', 'string', true, false, 'global/CustomerIdentification', 'Internal'],
  ['ctr-tech-col-full-name', 'full_name', 'Customer full / legal name.', 'string', false, false, 'global/CustomerName', 'Internal'],
  ['ctr-tech-col-email', 'email', 'Primary customer email address.', 'string', false, true, 'global/CustomerEmail', 'PII'],
  ['ctr-tech-col-status', 'status', 'Customer lifecycle status code.', 'string', false, false, 'global/CustomerStatus', 'Internal'],
  ['ctr-tech-col-natco-code', 'natco_code', 'Source NATCO code (de|at|hr|hu|pl).', 'string', false, false, null, 'Internal'],
]

for (const [id, name, desc, dtype, pk, nullable, concept, classification] of curatedCols) {
  put(
    base({
      id,
      kind: 'column',
      pack: 'technical',
      asset_type: 'Column',
      type_contract_id: 'ctr-tech-type-column',
      name,
      display_name: name,
      description: desc,
      natco: 'global',
      owner: 'Data Engineering',
      steward: 'c360-stewards',
      catalog_source_id: `col-col-${name}`,
      classification,
      represents: concept ? [concept] : [],
      characteristics: {
        Description: desc,
        DescriptionFromSourceSystem: name.toUpperCase(),
        TechnicalDataType: dtype,
        IsNullable: nullable,
        IsPrimaryKey: pk,
        Classification: classification,
      },
      links: {
        table: 'ctr-tech-c360-table',
        ...(concept ? { represents: [concept] } : {}),
      },
    }),
  )
}

put(
  base({
    id: 'ctr-tech-pipe-c360',
    kind: 'pipeline',
    pack: 'technical',
    asset_type: 'Pipeline',
    type_contract_id: 'ctr-tech-type-pipeline',
    name: 'c360_customer_build',
    display_name: 'Customer 360 Build',
    description: 'Federation pipeline that consolidates NATCO CRM kunde/kupac/ügyfél/klient tables into curated customer_360.',
    natco: 'global',
    owner: 'Data Engineering',
    steward: 'c360-stewards',
    catalog_source_id: 'col-pipe-c360-001',
    inputs: NATCOS.map((n) => `${n.crm}.${n.schema}.${n.table}`),
    output: 'dp.curated.customer_360',
    characteristics: {
      Description: 'Federation pipeline consolidating NATCO CRM sources into curated customer_360.',
      Schedule: 'hourly',
      Orchestrator: 'Airflow',
      SLA: 'RPO 1h · RTO 4h',
      Status: 'Approved',
    },
    links: {
      inputs: NATCOS.map((n) => `ctr-tech-${n.code}-table`),
      output: 'ctr-tech-c360-table',
    },
  }),
)

// ─── Global Data Products ───────────────────────────────────────────
for (const fam of FAMILIES) {
  const contractId = `ctr-gov-odcs-${fam.id}`
  const productCtrId = fam.id === 'customer-360' ? 'ctr-prod-global-c360' : `ctr-prod-global-${fam.id}`
  const odcsId = fam.id === 'customer-360' ? 'ctr-gov-odcs-c360' : contractId

  put(
    base({
      id: productCtrId,
      kind: 'data_product',
      pack: 'products',
      asset_type: 'Data Product',
      type_contract_id: 'ctr-dp-type-data-product',
      name: fam.name,
      display_name: fam.name,
      description: `${fam.name} marketplace product implementing global/${fam.concept} with federated NATCO inputs.`,
      natco: 'global',
      owner: fam.owner,
      steward: `${fam.id}-stewards`,
      catalog_source_id: `col-dp-${fam.id}`,
      source_system: 'entropy_marketplace',
      implements: [`global/${fam.concept}`],
      consumes: NATCOS.map((n) => `${fam.productId}-${n.code}`),
      characteristics: {
        Description: `${fam.name} marketplace product implementing global/${fam.concept}.`,
        Status: 'Published',
        Owner: fam.owner,
        Domain: fam.domain,
        Scope: 'Global',
        InputCount: 5,
      },
      links: {
        implements: [`global/${fam.concept}`],
        output_ports: [`ctr-port-out-${fam.id}`],
        data_contract: odcsId,
        domain: fam.domain,
      },
    }),
  )

  put(
    base({
      id: `ctr-port-out-${fam.id}`,
      kind: 'output_port',
      pack: 'products',
      asset_type: 'Data Product Output Port',
      type_contract_id: 'ctr-dp-type-output-port',
      name: `${fam.table}_out`,
      display_name: `${fam.name} · Table Port`,
      description: `Primary table output port for ${fam.name}.`,
      natco: 'global',
      owner: fam.owner,
      steward: `${fam.id}-stewards`,
      source_system: 'entropy_marketplace',
      catalog_source_id: `col-port-${fam.id}`,
      characteristics: {
        Description: `Primary table output port for ${fam.name}.`,
        PortType: 'table',
        Status: 'Active',
      },
      links: {
        product: productCtrId,
        contract: odcsId,
        backed_by: fam.id === 'customer-360' ? 'ctr-tech-c360-table' : `ctr-tech-tbl-${fam.id}`,
      },
    }),
  )

  put(
    base({
      id: odcsId,
      kind: 'data_contract',
      pack: 'products',
      asset_type: 'Data Contract',
      type_contract_id: 'ctr-dp-type-data-contract',
      name: `odcs-${fam.id}-v1`,
      display_name: `ODCS · ${fam.name} v1`,
      description: `Open Data Contract Standard manifest governing ${fam.name} output schema, quality, and SLA.`,
      natco: 'global',
      owner: fam.owner,
      steward: `${fam.id}-stewards`,
      source_system: 'entropy_marketplace',
      catalog_source_id: `col-odcs-${fam.id}`,
      version: '1.0.0',
      applies_to: [fam.productId],
      characteristics: {
        Description: `ODCS manifest for ${fam.name}.`,
        ManifestStandard: 'ODCS',
        ManifestVersion: '3.0.2',
        SLA: 'RPO 1h · freshness < 2h',
        QualityScoreTarget: 0.98,
        Status: 'Approved',
      },
      links: {
        product: productCtrId,
        ports: [`ctr-port-out-${fam.id}`],
        fields:
          fam.id === 'customer-360'
            ? [
                'ctr-field-customer-id',
                'ctr-field-full-name',
                'ctr-field-email',
                'ctr-field-status',
                'ctr-field-natco-code',
              ]
            : [`ctr-field-${fam.id}-id`],
        governs_table: fam.id === 'customer-360' ? 'ctr-tech-c360-table' : `ctr-tech-tbl-${fam.id}`,
      },
      schema:
        fam.id === 'customer-360'
          ? [
              { name: 'customer_id', type: 'string', required: true, primary_key: true, implements: 'global/CustomerIdentification' },
              { name: 'full_name', type: 'string', required: true, implements: 'global/CustomerName' },
              { name: 'email', type: 'string', required: false, implements: 'global/CustomerEmail', classification: 'PII' },
              { name: 'status', type: 'string', required: true, implements: 'global/CustomerStatus' },
              { name: 'natco_code', type: 'string', required: true },
            ]
          : [{ name: 'id', type: 'string', required: true, primary_key: true, implements: `global/${fam.concept}` }],
    }),
  )

  if (fam.id === 'customer-360') {
    for (const [id, name, dtype, req, pk, concept, classification] of [
      ['ctr-field-customer-id', 'customer_id', 'string', true, true, 'global/CustomerIdentification', 'Internal'],
      ['ctr-field-full-name', 'full_name', 'string', true, false, 'global/CustomerName', 'Internal'],
      ['ctr-field-email', 'email', 'string', false, false, 'global/CustomerEmail', 'PII'],
      ['ctr-field-status', 'status', 'string', true, false, 'global/CustomerStatus', 'Internal'],
      ['ctr-field-natco-code', 'natco_code', 'string', true, false, null, 'Internal'],
    ]) {
      put(
        base({
          id,
          kind: 'contract_field',
          pack: 'products',
          asset_type: 'Contract Field',
          type_contract_id: 'ctr-dp-type-contract-field',
          name,
          display_name: name,
          description: `Contract field ${name} on Customer 360 ODCS manifest.`,
          natco: 'global',
          owner: fam.owner,
          steward: 'c360-stewards',
          source_system: 'entropy_marketplace',
          catalog_source_id: `col-cf-${name}`,
          classification: classification,
          characteristics: {
            Description: `Contract field ${name}.`,
            TechnicalDataType: dtype,
            IsNullable: !req,
            IsPrimaryKey: pk,
            Classification: classification,
          },
          links: {
            contract: odcsId,
            column: `ctr-tech-col-${name.replace(/_/g, '-') === 'customer-id' ? 'customer-id' : name.replace(/_/g, '-')}`,
            ...(concept ? { implements: [concept] } : {}),
          },
        }),
      )
    }
    // fix column link ids to match curated col ids
    contracts['ctr-field-customer-id'].links.column = 'ctr-tech-col-customer-id'
    contracts['ctr-field-full-name'].links.column = 'ctr-tech-col-full-name'
    contracts['ctr-field-email'].links.column = 'ctr-tech-col-email'
    contracts['ctr-field-status'].links.column = 'ctr-tech-col-status'
    contracts['ctr-field-natco-code'].links.column = 'ctr-tech-col-natco-code'
  } else {
    put(
      base({
        id: `ctr-tech-tbl-${fam.id}`,
        kind: 'technical_asset',
        pack: 'technical',
        asset_type: 'Table',
        type_contract_id: 'ctr-tech-type-table',
        name: fam.table,
        display_name: fam.table,
        description: `Curated table backing ${fam.name}.`,
        natco: 'global',
        owner: fam.owner,
        steward: `${fam.id}-stewards`,
        qualified_name: `dp.curated.${fam.table}`,
        catalog_source_id: `col-tbl-${fam.id}`,
        represents: [`global/${fam.concept}`],
        characteristics: {
          Description: `Curated table backing ${fam.name}.`,
          TableType: 'TABLE',
          PartitionedFlag: false,
          Status: 'Approved',
        },
        links: {
          schema: 'ctr-tech-schema-curated',
          represents: [`global/${fam.concept}`],
          product: productCtrId,
        },
      }),
    )
    put(
      base({
        id: `ctr-field-${fam.id}-id`,
        kind: 'contract_field',
        pack: 'products',
        asset_type: 'Contract Field',
        type_contract_id: 'ctr-dp-type-contract-field',
        name: 'id',
        display_name: 'id',
        description: `Primary identifier field for ${fam.name}.`,
        natco: 'global',
        owner: fam.owner,
        characteristics: {
          Description: `Primary identifier for ${fam.name}.`,
          TechnicalDataType: 'string',
          IsNullable: false,
          IsPrimaryKey: true,
        },
        links: {
          contract: odcsId,
          implements: [`global/${fam.concept}`],
        },
      }),
    )
  }
}

put(
  base({
    id: 'ctr-org-data-eng',
    kind: 'team',
    pack: 'products',
    asset_type: 'Team',
    name: 'Data Engineering',
    display_name: 'Data Engineering',
    description: 'Platform and product engineering team owning curated pipelines and Customer 360 build.',
    natco: 'global',
    owner: 'Data Engineering',
    steward: 'platform-stewards',
    characteristics: {
      Description: 'Owns curated pipelines and Customer 360 build.',
      Organization: 'Enterprise Data',
    },
    links: {
      owns: ['ctr-tech-pipe-c360', 'ctr-tech-c360-table', 'ctr-prod-global-c360'],
    },
  }),
)

// ─── Per-NATCO packs ────────────────────────────────────────────────
for (const n of NATCOS) {
  const localSlug = n.local
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '')

  put(
    base({
      id: `ctr-ns-${n.code}`,
      kind: 'namespace',
      pack: 'semantics',
      asset_type: 'Namespace',
      type_contract_id: 'ctr-scp-type-namespace',
      name: n.slug,
      display_name: `${n.label} · ${n.slug}`,
      description: `NATCO semantic namespace for ${n.label}. Local concepts federate to global SID.`,
      natco: n.slug,
      owner: `${n.slug}-data-office`,
      steward: `${n.code}-semantic-stewards`,
      source_system: 'semantic_control_plane',
      catalog_source_id: `col-ns-${n.code}`,
      uri_base: `https://semantics.example/ns/${n.slug}/`,
      aligns_to: 'global',
      characteristics: {
        Slug: n.slug,
        DisplayName: `${n.label} · ${n.slug}`,
        Description: `NATCO semantic namespace for ${n.label}.`,
        Kind: 'natco',
        UriBase: `https://semantics.example/ns/${n.slug}/`,
        Status: 'Approved',
        Owner: `${n.slug}-data-office`,
        AlignsTo: 'global',
      },
      links: {
        aligns_to: 'ctr-ns-global',
        concepts: [`${n.slug}/${localSlug}`, `${n.slug}/${localSlug}-id`],
      },
      concepts: [`${n.slug}/${localSlug}`, `${n.slug}/${localSlug}-id`],
    }),
  )

  put(
    base({
      id: `ctr-sem-${n.code}-entity`,
      kind: 'semantic_concept',
      pack: 'semantics',
      asset_type: 'Concept',
      type_contract_id: 'ctr-scp-type-concept',
      name: n.local,
      display_name: n.local,
      description: `${n.label} local concept for customer (${n.local}), federated to SID Customer via sameAs.`,
      natco: n.slug,
      owner: `${n.slug}-data-office`,
      steward: `${n.code}-semantic-stewards`,
      source_system: 'semantic_control_plane',
      catalog_source_id: `col-concept-${n.code}-entity`,
      uri: `https://semantics.example/ns/${n.slug}/${localSlug}`,
      classification: 'Internal',
      federates: { predicate: 'sameAs', to: 'global/Customer' },
      characteristics: {
        ConceptId: localSlug,
        Uri: `https://semantics.example/ns/${n.slug}/${localSlug}`,
        ConceptKind: 'entity',
        PreferredLabel: n.local,
        Description: `${n.label} local customer concept federated to SID Customer.`,
        Status: 'Approved',
        Owner: `${n.slug}-data-office`,
        Scope: 'natco',
        Classification: 'Internal',
      },
      links: {
        namespace: `ctr-ns-${n.code}`,
        federates_to: 'ctr-sem-customer',
      },
    }),
  )

  put(
    base({
      id: `ctr-sem-${n.code}-id`,
      kind: 'semantic_concept',
      pack: 'semantics',
      asset_type: 'Concept',
      type_contract_id: 'ctr-scp-type-concept',
      name: n.idLocal,
      display_name: n.idLocal,
      description: `${n.label} local customer identifier concept, federated to CustomerIdentification.`,
      natco: n.slug,
      owner: `${n.slug}-data-office`,
      steward: `${n.code}-semantic-stewards`,
      source_system: 'semantic_control_plane',
      catalog_source_id: `col-concept-${n.code}-id`,
      uri: `https://semantics.example/ns/${n.slug}/${localSlug}-id`,
      federates: { predicate: 'sameAs', to: 'global/CustomerIdentification' },
      characteristics: {
        ConceptId: `${localSlug}-id`,
        PreferredLabel: n.idLocal,
        ConceptKind: 'shared_property',
        Description: `${n.label} local customer identifier.`,
        Status: 'Approved',
        Scope: 'natco',
      },
      links: {
        namespace: `ctr-ns-${n.code}`,
        federates_to: 'ctr-sem-customer-id',
      },
    }),
  )

  put(
    base({
      id: `ctr-biz-${n.code}-customer`,
      kind: 'business_term',
      pack: 'business',
      asset_type: 'Business Term',
      type_contract_id: 'ctr-biz-type-business-term',
      name: n.local,
      display_name: n.local,
      description: `${n.label} business glossary term for customer (${n.local}), mapped to SID Customer and expressed as local concept.`,
      natco: n.slug,
      owner: `${n.slug}-data-office`,
      steward: `${n.code}-glossary-stewards`,
      catalog_source_id: `col-term-${n.code}-customer`,
      catalog_sor: 'Collibra',
      maps_to: ['global/Customer'],
      expressed_as: [`${n.slug}/${localSlug}`],
      characteristics: {
        Description: `${n.label} glossary term for ${n.local}.`,
        Status: 'Approved',
        Synonyms: n.local,
        Language: n.code === 'de' || n.code === 'at' ? 'de' : n.code,
      },
      links: {
        data_domain: 'ctr-biz-domain-customer',
        maps_to: ['global/Customer'],
        expressed_as: [`ctr-sem-${n.code}-entity`],
      },
    }),
  )

  put(
    base({
      id: `ctr-tech-${n.code}-system`,
      kind: 'system',
      pack: 'technical',
      asset_type: 'System',
      type_contract_id: 'ctr-tech-type-system',
      name: n.crm,
      display_name: `${n.label} CRM`,
      description: `${n.label} CRM system of record for local customer master.`,
      natco: n.slug,
      owner: `${n.slug}-data-office`,
      steward: `${n.code}-tech-stewards`,
      catalog_source_id: `col-sys-${n.code}`,
      characteristics: {
        Description: `${n.label} CRM system.`,
        Technology: n.tech,
        Status: 'Approved',
        Environment: 'Production',
      },
      links: {
        databases: [`ctr-tech-${n.code}-db`],
      },
    }),
  )

  put(
    base({
      id: `ctr-tech-${n.code}-db`,
      kind: 'database',
      pack: 'technical',
      asset_type: 'Database',
      type_contract_id: 'ctr-tech-type-database',
      name: n.crm,
      display_name: n.crm,
      description: `${n.label} CRM database.`,
      natco: n.slug,
      owner: `${n.slug}-data-office`,
      steward: `${n.code}-tech-stewards`,
      catalog_source_id: `col-db-${n.code}`,
      characteristics: {
        Description: `${n.label} CRM database.`,
        Technology: n.tech,
        Status: 'Approved',
      },
      links: {
        system: `ctr-tech-${n.code}-system`,
        schemas: [`ctr-tech-${n.code}-schema`],
      },
    }),
  )

  put(
    base({
      id: `ctr-tech-${n.code}-schema`,
      kind: 'schema',
      pack: 'technical',
      asset_type: 'Schema',
      type_contract_id: 'ctr-tech-type-schema',
      name: n.schema,
      display_name: n.schema,
      description: `${n.label} CRM schema containing ${n.table}.`,
      natco: n.slug,
      owner: `${n.slug}-data-office`,
      steward: `${n.code}-tech-stewards`,
      catalog_source_id: `col-sch-${n.code}`,
      characteristics: {
        Description: `${n.label} CRM schema.`,
        Status: 'Approved',
      },
      links: {
        database: `ctr-tech-${n.code}-db`,
        tables: [`ctr-tech-${n.code}-table`],
      },
    }),
  )

  const qn = `${n.crm}.${n.schema}.${n.table}`
  put(
    base({
      id: `ctr-tech-${n.code}-table`,
      kind: 'technical_asset',
      pack: 'technical',
      asset_type: 'Table',
      type_contract_id: 'ctr-tech-type-table',
      name: n.table,
      display_name: n.table,
      description: `${n.label} CRM source table ${qn} — local customer master federated to SID Customer.`,
      natco: n.slug,
      owner: `${n.slug}-data-office`,
      steward: `${n.code}-tech-stewards`,
      system: n.crm,
      qualified_name: qn,
      catalog_source_id: `col-tbl-${n.code}-customer`,
      represents: ['global/Customer'],
      represents_local: [`${n.slug}/${localSlug}`],
      characteristics: {
        Description: `${n.label} CRM customer table.`,
        DescriptionFromSourceSystem: n.table.toUpperCase(),
        TableType: 'TABLE',
        PartitionedFlag: false,
        LastSyncDate: '2026-07-28',
        Classification: 'Confidential',
        FullyQualifiedName: qn,
      },
      links: {
        schema: `ctr-tech-${n.code}-schema`,
        columns: [`ctr-tech-col-${n.code}-id`, `ctr-tech-col-${n.code}-name`, `ctr-tech-col-${n.code}-email`, `ctr-tech-col-${n.code}-status`],
        represents: ['global/Customer'],
        represents_local: [`ctr-sem-${n.code}-entity`],
      },
      schema: [
        { name: n.code === 'de' || n.code === 'at' ? 'kundennummer' : 'id', type: 'string', pk: true, nullable: false, represents: 'global/CustomerIdentification' },
        { name: 'name', type: 'string', pk: false, nullable: false, represents: 'global/CustomerName' },
        { name: 'email', type: 'string', pk: false, nullable: true, represents: 'global/CustomerEmail', classification: 'PII' },
        { name: 'status', type: 'string', pk: false, nullable: false, represents: 'global/CustomerStatus' },
      ],
    }),
  )

  for (const [suffix, colName, desc, concept, pk, nullable, classification] of [
    ['id', n.code === 'de' || n.code === 'at' ? 'kundennummer' : 'id', `${n.label} local customer id column.`, 'global/CustomerIdentification', true, false, 'Internal'],
    ['name', 'name', `${n.label} customer name column.`, 'global/CustomerName', false, false, 'Internal'],
    ['email', 'email', `${n.label} customer email column.`, 'global/CustomerEmail', false, true, 'PII'],
    ['status', 'status', `${n.label} customer status column.`, 'global/CustomerStatus', false, false, 'Internal'],
  ]) {
    put(
      base({
        id: `ctr-tech-col-${n.code}-${suffix}`,
        kind: 'column',
        pack: 'technical',
        asset_type: 'Column',
        type_contract_id: 'ctr-tech-type-column',
        name: colName,
        display_name: colName,
        description: desc,
        natco: n.slug,
        owner: `${n.slug}-data-office`,
        steward: `${n.code}-tech-stewards`,
        catalog_source_id: `col-col-${n.code}-${suffix}`,
        classification,
        represents: [concept],
        represents_local: suffix === 'id' ? [`${n.slug}/${localSlug}-id`] : [`${n.slug}/${localSlug}`],
        characteristics: {
          Description: desc,
          TechnicalDataType: 'string',
          IsNullable: nullable,
          IsPrimaryKey: pk,
          Classification: classification,
          ColumnPosition: ['id', 'name', 'email', 'status'].indexOf(suffix) + 1,
        },
        links: {
          table: `ctr-tech-${n.code}-table`,
          represents: [concept],
        },
      }),
    )
  }

  // NATCO Customer 360 product + contract
  put(
    base({
      id: `ctr-prod-${n.code}-c360`,
      kind: 'data_product',
      pack: 'products',
      asset_type: 'Data Product',
      type_contract_id: 'ctr-dp-type-data-product',
      name: `${n.label} · ${n.local}`,
      display_name: `${n.label} · ${n.local}`,
      description: `${n.label} CRM source product — ${qn} federated to SID Customer.`,
      natco: n.slug,
      owner: `${n.slug}-data-office`,
      steward: `${n.code}-product-stewards`,
      source_system: 'entropy_marketplace',
      catalog_source_id: `col-dp-${n.code}-c360`,
      implements: ['global/Customer', `${n.slug}/${localSlug}`],
      characteristics: {
        Description: `${n.label} NATCO source product for Customer.`,
        Status: 'Published',
        Scope: 'NATCO',
        Owner: `${n.slug}-data-office`,
      },
      links: {
        implements: ['ctr-sem-customer', `ctr-sem-${n.code}-entity`],
        federates_to: 'ctr-prod-global-c360',
        data_contract: `ctr-gov-odcs-${n.code}-c360`,
        backed_by: `ctr-tech-${n.code}-table`,
      },
    }),
  )

  put(
    base({
      id: `ctr-gov-odcs-${n.code}-c360`,
      kind: 'data_contract',
      pack: 'products',
      asset_type: 'Data Contract',
      type_contract_id: 'ctr-dp-type-data-contract',
      name: `odcs-customer-360-${n.code}-v1`,
      display_name: `ODCS · ${n.label} Customer v1`,
      description: `ODCS contract for ${n.label} NATCO customer source product.`,
      natco: n.slug,
      owner: `${n.slug}-data-office`,
      steward: `${n.code}-product-stewards`,
      source_system: 'entropy_marketplace',
      catalog_source_id: `col-odcs-${n.code}-c360`,
      version: '1.0.0',
      applies_to: [`dp-customer-360-${n.code}`],
      characteristics: {
        Description: `ODCS for ${n.label} customer source.`,
        ManifestStandard: 'ODCS',
        ManifestVersion: '3.0.2',
        SLA: 'RPO 4h',
        Status: 'Approved',
      },
      links: {
        product: `ctr-prod-${n.code}-c360`,
        governs_table: `ctr-tech-${n.code}-table`,
        fields: [`ctr-field-${n.code}-id`],
      },
      schema: [
        { name: n.code === 'de' || n.code === 'at' ? 'kundennummer' : 'id', type: 'string', required: true, primary_key: true, implements: 'global/CustomerIdentification' },
      ],
    }),
  )

  put(
    base({
      id: `ctr-field-${n.code}-id`,
      kind: 'contract_field',
      pack: 'products',
      asset_type: 'Contract Field',
      type_contract_id: 'ctr-dp-type-contract-field',
      name: n.code === 'de' || n.code === 'at' ? 'kundennummer' : 'id',
      display_name: n.code === 'de' || n.code === 'at' ? 'kundennummer' : 'id',
      description: `${n.label} contract field mapped to local id column.`,
      natco: n.slug,
      owner: `${n.slug}-data-office`,
      characteristics: {
        Description: `${n.label} primary id field.`,
        TechnicalDataType: 'string',
        IsNullable: false,
        IsPrimaryKey: true,
      },
      links: {
        contract: `ctr-gov-odcs-${n.code}-c360`,
        column: `ctr-tech-col-${n.code}-id`,
        implements: ['global/CustomerIdentification'],
      },
    }),
  )
}

const payload = {
  meta: {
    title: 'Multi-Pack Contracts — Collibra-inspired Asset Catalog',
    domain: 'customer',
    sid_version: 'R20.0',
    inspiration: 'Collibra Data Catalog Characteristics + ODCS + Semantic Control Plane type contracts',
    packs: ['semantics', 'business', 'technical', 'products'],
    natcos: ['global', ...NATCOS.map((n) => n.slug)],
    generated_at: new Date().toISOString().slice(0, 10),
    contract_count: Object.keys(contracts).length,
  },
  contracts,
}

writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n')
console.log(`Wrote ${Object.keys(contracts).length} contracts → ${outPath}`)
