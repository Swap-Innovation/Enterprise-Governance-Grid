#!/usr/bin/env node
/**
 * Generate / refresh Business Catalog asset-type packages from a type registry.
 * Usage: node connected-data/10.\ Contracts/Business\ Catalog/scripts/generate-biz-packages.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const TYPES = [
  {
    folder: 'Business Term',
    asset_type: 'Business Term',
    contract_id: 'ctr-biz-type-business-term',
    kind_value: 'business_term',
    layer: 'glossary',
    collibra_path: 'Business Asset > Business Term',
    collibra_id: 'BusinessTerm',
    role: 'leaf',
    hierarchy_note: 'May specialize / synonym other terms; mapsTo Registry concept; may relate to KPI / Data Entity',
    mapping: {
      predicate: 'mapsTo',
      da_contract: 'DA-08',
      typical_source_type: 'glossary_term',
      note: 'Primary glossary crosswalk to Control Plane concepts.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Business Term', path: 'Business Asset > Business Term' },
      dataplex: { equivalent: 'Glossary Term', notes: 'Link term to entries/columns' },
      openmetadata: { equivalent: 'GlossaryTerm' },
      microsoft_purview: { equivalent: 'Glossary term' },
      alation: { equivalent: 'Glossary term' },
      informatica_cdgc: { equivalent: 'Business Term' },
    },
    description: 'Business vocabulary unit with approved definition and status.',
  },
  {
    folder: 'Acronym',
    asset_type: 'Acronym',
    contract_id: 'ctr-biz-type-acronym',
    kind_value: 'acronym',
    layer: 'glossary',
    collibra_path: 'Business Asset > Acronym',
    collibra_id: 'Acronym',
    role: 'leaf',
    hierarchy_note: 'Belongs to / expands a Business Term; optional direct mapsTo',
    mapping: {
      predicate: 'mapsTo',
      da_contract: 'DA-08',
      typical_source_type: 'acronym',
      note: 'Usually inherits meaning via related Business Term.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Acronym', path: 'Business Asset > Acronym' },
      dataplex: { equivalent: 'Related Glossary Term / synonym pattern' },
      openmetadata: { equivalent: 'GlossaryTerm (related/synonym)' },
      microsoft_purview: { equivalent: 'Related term' },
      alation: { equivalent: 'Related / acronym term' },
      informatica_cdgc: { equivalent: 'Acronym / synonym' },
    },
    description: 'Short form of a Business Term.',
  },
  {
    folder: 'Glossary Category',
    asset_type: 'Glossary Category',
    contract_id: 'ctr-biz-type-glossary-category',
    kind_value: 'glossary_category',
    layer: 'glossary',
    collibra_path: 'Business Asset Domain / folder patterns',
    collibra_id: 'BusinessAssetDomain',
    role: 'intermediate',
    hierarchy_note: 'Groups Business Terms (and nested categories); Dataplex Category analogue',
    mapping: {
      predicate: 'mapsTo',
      da_contract: 'DA-08',
      typical_source_type: 'glossary_category',
      note: 'Optional mapsTo Registry group concept; often organizational only.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Business Asset Domain / community folder', notes: 'No single OOTB Category type; use domains/folders' },
      dataplex: { equivalent: 'Glossary Category', notes: 'Native hierarchy under Glossary' },
      openmetadata: { equivalent: 'Glossary (parent) / term hierarchy' },
      microsoft_purview: { equivalent: 'Term hierarchy / collection' },
      alation: { equivalent: 'Glossary category / domain' },
      informatica_cdgc: { equivalent: 'Category / Domain' },
    },
    description: 'Taxonomy node grouping glossary terms (Dataplex Category pattern).',
  },
  {
    folder: 'Measure',
    asset_type: 'Measure',
    contract_id: 'ctr-biz-type-measure',
    kind_value: 'measure',
    layer: 'glossary',
    collibra_path: 'Business Asset > Measure',
    collibra_id: 'Measure',
    role: 'intermediate',
    hierarchy_note: 'Parent of KPI in Collibra; general quantified business measure',
    mapping: {
      predicate: 'mapsTo',
      da_contract: 'DA-08',
      typical_source_type: 'measure',
      note: 'Prefer mapsTo metric Concept; calculation logic stays beside the semantic layer (SQ1).',
    },
    tool_coverage: {
      collibra: { equivalent: 'Measure', path: 'Business Asset > Measure' },
      dataplex: { equivalent: '— (define as Term + Aspect)', notes: 'No first-class Measure type' },
      openmetadata: { equivalent: 'Metric' },
      microsoft_purview: { equivalent: '— / custom glossary term' },
      alation: { equivalent: '— / glossary term' },
      informatica_cdgc: { equivalent: 'Measure / Metric' },
    },
    description: 'Quantified business measure; KPI is a specialized Measure.',
  },
  {
    folder: 'KPI',
    asset_type: 'KPI',
    contract_id: 'ctr-biz-type-kpi',
    kind_value: 'kpi',
    layer: 'glossary',
    collibra_path: 'Business Asset > Measure > KPI',
    collibra_id: 'KPI',
    role: 'leaf',
    hierarchy_note: 'Specialized Measure; may measure Business Term; calculated using Data Attribute / Column',
    mapping: {
      predicate: 'mapsTo',
      da_contract: 'DA-08',
      typical_source_type: 'kpi',
      note: 'Prefer mapsTo global metric concept when enterprise-shared. Calculation Rule is descriptive; authoritative calc in BI (SQ1).',
    },
    tool_coverage: {
      collibra: { equivalent: 'KPI', path: 'Business Asset > Measure > KPI' },
      dataplex: { equivalent: '— (Term + Aspect for formula metadata)' },
      openmetadata: { equivalent: 'Metric / custom KPI' },
      microsoft_purview: { equivalent: 'Glossary term (metric)' },
      alation: { equivalent: 'Glossary term (KPI)' },
      informatica_cdgc: { equivalent: 'KPI' },
    },
    description: 'Key performance indicator toward a strategic goal.',
  },
  {
    folder: 'Data Domain',
    asset_type: 'Data Domain',
    contract_id: 'ctr-biz-type-data-domain',
    kind_value: 'data_domain',
    layer: 'conceptual',
    collibra_path: 'Business Asset > Business Dimension > Data Domain',
    collibra_id: 'DataDomain',
    role: 'root',
    hierarchy_note: 'Contains Data Concept; may contain Business Term / Data Model',
    mapping: {
      predicate: 'mapsTo',
      da_contract: 'DA-08',
      typical_source_type: 'data_domain',
      note: 'Often mapsTo Registry group concepts / namespace facets.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Data Domain / Data Category', path: 'Business Dimension > Data Domain' },
      dataplex: { equivalent: 'Glossary / organizational grouping' },
      openmetadata: { equivalent: 'Domain' },
      microsoft_purview: { equivalent: 'Collection / domain' },
      alation: { equivalent: 'Domain' },
      informatica_cdgc: { equivalent: 'Domain' },
    },
    description: 'Container for data concepts and associated terminology (subject area).',
  },
  {
    folder: 'Data Concept',
    asset_type: 'Data Concept',
    contract_id: 'ctr-biz-type-data-concept',
    kind_value: 'data_concept',
    layer: 'conceptual',
    collibra_path: 'Business Asset > Business Dimension > Data Concept',
    collibra_id: 'DataConcept',
    role: 'intermediate',
    hierarchy_note: 'Part of Data Domain; classifies Data Attribute',
    mapping: {
      predicate: 'mapsTo',
      da_contract: 'DA-08',
      typical_source_type: 'data_concept',
      note: 'Prefer Registry shared_property / entity concepts in global/.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Data Concept', path: 'Business Dimension > Data Concept' },
      dataplex: { equivalent: 'Glossary Term (conceptual)' },
      openmetadata: { equivalent: 'GlossaryTerm / Tag' },
      microsoft_purview: { equivalent: 'Glossary term' },
      alation: { equivalent: 'Glossary term' },
      informatica_cdgc: { equivalent: 'Concept' },
    },
    description: 'High-level theoretical data property of a Data Domain.',
  },
  {
    folder: 'Data Model',
    asset_type: 'Data Model',
    contract_id: 'ctr-biz-type-data-model',
    kind_value: 'data_model',
    layer: 'semantic',
    collibra_path: 'Data Asset > Data Structure > Data Model',
    collibra_id: 'DataModel',
    role: 'root',
    hierarchy_note: 'Contains Data Entity; model itself rarely mapsTo',
    mapping: {
      predicate: 'mapsTo',
      da_contract: 'DA-08',
      typical_source_type: 'data_model',
      note: 'Model rarely maps; entities/attributes inside map.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Data Model', path: 'Data Structure > Data Model' },
      dataplex: { equivalent: 'Entry (logical system/model)' },
      openmetadata: { equivalent: 'DatabaseSchema / custom model' },
      microsoft_purview: { equivalent: '—' },
      alation: { equivalent: '—' },
      informatica_cdgc: { equivalent: 'Model' },
    },
    description: 'Logical data model containing entities and attributes.',
  },
  {
    folder: 'Data Entity',
    asset_type: 'Data Entity',
    contract_id: 'ctr-biz-type-data-entity',
    kind_value: 'data_entity',
    layer: 'semantic',
    collibra_path: 'Data Asset > Data Structure > Data Entity',
    collibra_id: 'DataEntity',
    role: 'intermediate',
    hierarchy_note: 'Part of Data Model; contains Data Attribute; realized by Table (DA-09)',
    mapping: {
      predicate: 'mapsTo',
      da_contract: 'DA-08',
      typical_source_type: 'data_entity',
      note: 'Strong candidate for entity concepts (e.g. global/Customer).',
    },
    tool_coverage: {
      collibra: { equivalent: 'Data Entity', path: 'Data Structure > Data Entity' },
      dataplex: { equivalent: 'Entry (table) + Term link' },
      openmetadata: { equivalent: 'Table (logical documentation)' },
      microsoft_purview: { equivalent: 'Asset + glossary' },
      alation: { equivalent: 'Data dictionary object' },
      informatica_cdgc: { equivalent: 'Entity' },
    },
    description: 'Logical entity bridging business meaning and physical tables.',
  },
  {
    folder: 'Data Attribute',
    asset_type: 'Data Attribute',
    contract_id: 'ctr-biz-type-data-attribute',
    kind_value: 'data_attribute',
    layer: 'semantic',
    collibra_path: 'Data Asset > Data Element > Data Attribute',
    collibra_id: 'DataAttribute',
    role: 'leaf',
    hierarchy_note: 'Part of Data Entity; classified by Data Concept; realized by Column (DA-09)',
    mapping: {
      predicate: 'mapsTo',
      da_contract: 'DA-08',
      typical_source_type: 'data_attribute',
      note: 'Prefer shared_property concepts; Column represents same URI via DA-09.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Data Attribute', path: 'Data Element > Data Attribute' },
      dataplex: { equivalent: 'Column + Glossary Term link' },
      openmetadata: { equivalent: 'Column' },
      microsoft_purview: { equivalent: 'Column + term' },
      alation: { equivalent: 'Attribute / column' },
      informatica_cdgc: { equivalent: 'Attribute' },
    },
    description: 'Logical attribute; business counterpart of a physical column/field.',
  },
  {
    folder: 'Business Process',
    asset_type: 'Business Process',
    contract_id: 'ctr-biz-type-business-process',
    kind_value: 'business_process',
    layer: 'context',
    collibra_path: 'Business Asset > Business Process',
    collibra_id: 'BusinessProcess',
    role: 'leaf',
    hierarchy_note: 'May consume / produce Business Terms and Data Domains',
    mapping: {
      predicate: 'mapsTo',
      da_contract: 'DA-08',
      typical_source_type: 'business_process',
      note: 'Optional mapsTo process-oriented Concepts when used as meaning anchors.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Business Process', path: 'Business Asset > Business Process' },
      dataplex: { equivalent: '—' },
      openmetadata: { equivalent: '—' },
      microsoft_purview: { equivalent: '—' },
      alation: { equivalent: '—' },
      informatica_cdgc: { equivalent: 'Process' },
    },
    description: 'Business activity that uses or produces governed data.',
  },
  {
    folder: 'Business Rule',
    asset_type: 'Business Rule',
    contract_id: 'ctr-biz-type-business-rule',
    kind_value: 'business_rule',
    layer: 'context',
    collibra_path: 'Business Asset > Business Rule',
    collibra_id: 'BusinessRule',
    role: 'leaf',
    hierarchy_note: 'Constrains Business Term / Data Attribute / KPI interpretation',
    mapping: {
      predicate: 'mapsTo',
      da_contract: 'DA-08',
      typical_source_type: 'business_rule',
      note: 'May reference Concepts; does not replace MappingRecord.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Business Rule / DQ Rule patterns' },
      dataplex: { equivalent: 'Aspect (rule metadata)' },
      openmetadata: { equivalent: 'Test Definition / custom' },
      microsoft_purview: { equivalent: '—' },
      alation: { equivalent: '—' },
      informatica_cdgc: { equivalent: 'Rule' },
    },
    description: 'Business or data-quality rule governing interpretation or validity.',
  },
  {
    folder: 'Policy',
    asset_type: 'Policy',
    contract_id: 'ctr-biz-type-policy',
    kind_value: 'policy',
    layer: 'context',
    collibra_path: 'Governance Asset > Policy',
    collibra_id: 'Policy',
    role: 'leaf',
    hierarchy_note: 'Applies to Terms, Domains, Reports; distinct from Control Plane POL-SEM-*',
    mapping: {
      predicate: 'mapsTo',
      da_contract: 'DA-08',
      typical_source_type: 'policy',
      note: 'Optional; policies usually constrain catalogs rather than define meaning.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Policy' },
      dataplex: { equivalent: 'Aspect / policy tag patterns' },
      openmetadata: { equivalent: 'Policy / Classification' },
      microsoft_purview: { equivalent: 'Policy' },
      alation: { equivalent: 'Policy' },
      informatica_cdgc: { equivalent: 'Policy' },
    },
    description: 'Business or data governance policy applicable to catalog assets.',
  },
  {
    folder: 'Issue',
    asset_type: 'Issue',
    contract_id: 'ctr-biz-type-issue',
    kind_value: 'issue',
    layer: 'context',
    collibra_path: 'Issue',
    collibra_id: 'Issue',
    role: 'leaf',
    hierarchy_note: 'Impacts any business/semantic asset; stewardship workflow object',
    mapping: {
      predicate: 'mapsTo',
      da_contract: 'DA-08',
      typical_source_type: 'issue',
      note: 'Does not mapsTo Concepts; tracks defects against assets that do.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Issue' },
      dataplex: { equivalent: '—' },
      openmetadata: { equivalent: '—' },
      microsoft_purview: { equivalent: '—' },
      alation: { equivalent: '—' },
      informatica_cdgc: { equivalent: 'Issue / Finding' },
    },
    description: 'Stewardship issue impacting one or more catalog assets.',
  },
  {
    folder: 'Report',
    asset_type: 'Report',
    contract_id: 'ctr-biz-type-report',
    kind_value: 'report',
    layer: 'context',
    collibra_path: 'Business Asset > Report / BI Report',
    collibra_id: 'Report',
    role: 'intermediate',
    hierarchy_note: 'Contains Report Attribute; may use KPI / Business Term',
    mapping: {
      predicate: 'mapsTo',
      da_contract: 'DA-08',
      typical_source_type: 'report',
      note: 'Report itself rarely maps; attributes and KPIs do.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Report / BI Report', path: 'Report Catalog' },
      dataplex: { equivalent: '—' },
      openmetadata: { equivalent: 'Dashboard / Report' },
      microsoft_purview: { equivalent: 'Report / Power BI asset' },
      alation: { equivalent: 'BI object' },
      informatica_cdgc: { equivalent: 'Report' },
    },
    description: 'Business or BI report with governed definitions.',
  },
  {
    folder: 'Report Attribute',
    asset_type: 'Report Attribute',
    contract_id: 'ctr-biz-type-report-attribute',
    kind_value: 'report_attribute',
    layer: 'context',
    collibra_path: 'Business Asset > Report Attribute',
    collibra_id: 'ReportAttribute',
    role: 'leaf',
    hierarchy_note: 'Part of Report; may bind to KPI / Data Attribute / Business Term',
    mapping: {
      predicate: 'mapsTo',
      da_contract: 'DA-08',
      typical_source_type: 'report_attribute',
      note: 'Prefer mapsTo metric or shared_property Concepts via related KPI/Attribute.',
    },
    tool_coverage: {
      collibra: { equivalent: 'Report Attribute / BI Report Attribute' },
      dataplex: { equivalent: '—' },
      openmetadata: { equivalent: 'Chart / field custom' },
      microsoft_purview: { equivalent: '—' },
      alation: { equivalent: '—' },
      informatica_cdgc: { equivalent: 'Report field' },
    },
    description: 'Field or measure exposed on a Report.',
  },
]

function char(name, publicId, kind, opts = {}) {
  return {
    name,
    public_id: publicId,
    kind,
    cardinality: { min: opts.min ?? 0, max: opts.max ?? (kind === 'Text' && name === 'Description' ? 1 : null) },
    scope: opts.scope ?? (name === 'Description' || name === 'Status' ? 'core' : 'optional'),
    system_managed: false,
    read_only: false,
    description: opts.description ?? name,
    asset_type_filter: opts.filter ?? null,
  }
}

function characteristicsFor(t) {
  const base = [
    char('Description', 'Description', 'Text', { min: 1, max: 1, scope: 'core', description: `Business definition of the ${t.asset_type}` }),
    char('Status', 'Status', 'Text', { min: 0, max: 1, scope: 'core', description: 'Approval / lifecycle status in catalog' }),
    char('Owner', 'Owner', 'Text', { min: 0, max: 1, description: 'Steward or owning team' }),
  ]
  const extra = {
    'Business Term': [
      char('Descriptive Example', 'DescriptiveExample', 'Text', { description: 'Example usage' }),
      char('has Synonym', 'BusinessTermHasSynonym', 'Explicit Relation', { filter: 'Business Term' }),
      char('has Acronym', 'BusinessTermHasAcronym', 'Explicit Relation', { filter: 'Acronym' }),
      char('is part of Data Domain', 'DataDomainContainsBusinessTerm', 'Explicit Relation', { filter: 'Data Domain' }),
      char('is in Glossary Category', 'GlossaryCategoryContainsBusinessTerm', 'Explicit Relation', { filter: 'Glossary Category' }),
      char('represents Data Entity', 'BusinessTermRepresentsDataEntity', 'Explicit Relation', { filter: 'Data Entity' }),
      char('is measured by KPI', 'KPIMeasuresBusinessTerm', 'Explicit Relation', { filter: 'KPI' }),
      char('impacted by Issue', 'IssueImpactsAsset', 'Explicit Relation', { filter: 'Issue' }),
    ],
    Acronym: [
      char('is acronym of Business Term', 'AcronymOfBusinessTerm', 'Explicit Relation', {
        min: 1,
        max: null,
        scope: 'core',
        filter: 'Business Term',
        description: 'Expanded Business Term',
      }),
    ],
    'Glossary Category': [
      char('contains Business Term', 'GlossaryCategoryContainsBusinessTerm', 'Explicit Relation', { filter: 'Business Term' }),
      char('contains Glossary Category', 'GlossaryCategoryContainsCategory', 'Explicit Relation', { filter: 'Glossary Category' }),
      char('parent Glossary Category', 'GlossaryCategoryParent', 'Explicit Relation', { filter: 'Glossary Category', max: 1 }),
    ],
    Measure: [
      char('Unit', 'Unit', 'Text', { max: 1, description: 'Unit of measure' }),
      char('Calculation Rule', 'CalculationRule', 'Text', {
        max: 1,
        description: 'Descriptive calculation; authoritative calc stays in BI (SQ1)',
      }),
      char('specialized by KPI', 'MeasureHasKPI', 'Explicit Relation', { filter: 'KPI' }),
      char('measures Business Term', 'MeasureMeasuresBusinessTerm', 'Explicit Relation', { filter: 'Business Term' }),
    ],
    KPI: [
      char('Calculation Rule', 'CalculationRule', 'Text', {
        max: 1,
        description: 'Descriptive how-to; authoritative calc in BI / metrics store (SQ1)',
      }),
      char('Unit', 'Unit', 'Text', { max: 1 }),
      char('is a Measure', 'KPIIsMeasure', 'Explicit Relation', { filter: 'Measure', max: 1 }),
      char('measures Business Term', 'KPIMeasuresBusinessTerm', 'Explicit Relation', { filter: 'Business Term' }),
      char('is calculated using Data Attribute', 'KPIUsesDataAttribute', 'Explicit Relation', { filter: 'Data Attribute' }),
      char('is part of Data Domain', 'KPIInDataDomain', 'Explicit Relation', { filter: 'Data Domain' }),
      char('shown on Report', 'ReportUsesKPI', 'Explicit Relation', { filter: 'Report' }),
    ],
    'Data Domain': [
      char('contains Data Concept', 'DataDomainContainsDataConcept', 'Explicit Relation', { filter: 'Data Concept' }),
      char('contains Business Term', 'DataDomainContainsBusinessTerm', 'Explicit Relation', { filter: 'Business Term' }),
      char('owns Data Model', 'DataDomainOwnsDataModel', 'Explicit Relation', { filter: 'Data Model' }),
    ],
    'Data Concept': [
      char('is part of Data Domain', 'DataConceptInDataDomain', 'Explicit Relation', {
        min: 1,
        scope: 'core',
        filter: 'Data Domain',
      }),
      char('classifies Data Attribute', 'DataConceptClassifiesDataAttribute', 'Explicit Relation', { filter: 'Data Attribute' }),
      char('represented by Business Term', 'DataConceptRepresentedByTerm', 'Explicit Relation', { filter: 'Business Term' }),
    ],
    'Data Model': [
      char('contains Data Entity', 'DataModelContainsDataEntity', 'Explicit Relation', {
        min: 1,
        scope: 'core',
        filter: 'Data Entity',
      }),
      char('belongs to Data Domain', 'DataModelInDataDomain', 'Explicit Relation', { filter: 'Data Domain', max: 1 }),
    ],
    'Data Entity': [
      char('is part of Data Model', 'DataEntityInDataModel', 'Explicit Relation', {
        min: 1,
        scope: 'core',
        filter: 'Data Model',
      }),
      char('contains Data Attribute', 'DataEntityContainsDataAttribute', 'Explicit Relation', {
        min: 1,
        scope: 'core',
        filter: 'Data Attribute',
      }),
      char('represented by Business Term', 'DataEntityRepresentedByTerm', 'Explicit Relation', { filter: 'Business Term' }),
      char('classified by Data Concept', 'DataEntityClassifiedByConcept', 'Explicit Relation', { filter: 'Data Concept' }),
      char('implemented in Table', 'DataEntityImplementedInTable', 'Explicit Relation', { filter: 'Table' }),
    ],
    'Data Attribute': [
      char('is part of Data Entity', 'DataAttributeInDataEntity', 'Explicit Relation', {
        min: 1,
        scope: 'core',
        filter: 'Data Entity',
      }),
      char('Technical Data Type', 'TechnicalDataType', 'Text', { max: 1 }),
      char('classified by Data Concept', 'DataAttributeClassifiedByConcept', 'Explicit Relation', { filter: 'Data Concept' }),
      char('implemented by Column', 'DataAttributeImplementedByColumn', 'Explicit Relation', { filter: 'Column' }),
    ],
    'Business Process': [
      char('uses Business Term', 'ProcessUsesBusinessTerm', 'Explicit Relation', { filter: 'Business Term' }),
      char('in Data Domain', 'ProcessInDataDomain', 'Explicit Relation', { filter: 'Data Domain' }),
    ],
    'Business Rule': [
      char('Rule Expression', 'RuleExpression', 'Text', { max: 1, description: 'Human-readable or formal rule text' }),
      char('applies to Business Term', 'RuleAppliesToTerm', 'Explicit Relation', { filter: 'Business Term' }),
      char('applies to Data Attribute', 'RuleAppliesToAttribute', 'Explicit Relation', { filter: 'Data Attribute' }),
      char('applies to KPI', 'RuleAppliesToKPI', 'Explicit Relation', { filter: 'KPI' }),
    ],
    Policy: [
      char('Policy Statement', 'PolicyStatement', 'Text', { min: 1, max: 1, scope: 'core' }),
      char('applies to Data Domain', 'PolicyAppliesToDomain', 'Explicit Relation', { filter: 'Data Domain' }),
      char('applies to Business Term', 'PolicyAppliesToTerm', 'Explicit Relation', { filter: 'Business Term' }),
    ],
    Issue: [
      char('Severity', 'Severity', 'Text', { max: 1 }),
      char('impacts Business Term', 'IssueImpactsBusinessTerm', 'Explicit Relation', { filter: 'Business Term' }),
      char('impacts Data Attribute', 'IssueImpactsDataAttribute', 'Explicit Relation', { filter: 'Data Attribute' }),
      char('impacts KPI', 'IssueImpactsKPI', 'Explicit Relation', { filter: 'KPI' }),
    ],
    Report: [
      char('contains Report Attribute', 'ReportContainsReportAttribute', 'Explicit Relation', { filter: 'Report Attribute' }),
      char('uses KPI', 'ReportUsesKPI', 'Explicit Relation', { filter: 'KPI' }),
      char('uses Business Term', 'ReportUsesBusinessTerm', 'Explicit Relation', { filter: 'Business Term' }),
    ],
    'Report Attribute': [
      char('is part of Report', 'ReportAttributeInReport', 'Explicit Relation', {
        min: 1,
        scope: 'core',
        filter: 'Report',
      }),
      char('binds to KPI', 'ReportAttributeBindsKPI', 'Explicit Relation', { filter: 'KPI' }),
      char('binds to Data Attribute', 'ReportAttributeBindsDataAttribute', 'Explicit Relation', { filter: 'Data Attribute' }),
      char('binds to Business Term', 'ReportAttributeBindsTerm', 'Explicit Relation', { filter: 'Business Term' }),
    ],
  }
  return [...base, ...(extra[t.asset_type] ?? [])]
}

function writePackage(t) {
  const dir = path.join(ROOT, t.folder)
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
    catalog_sor: ['collibra', 'dataplex', 'openmetadata', 'microsoft_purview', 'alation', 'informatica_cdgc'],
    layer: t.layer,
    collibra: {
      asset_type_display_name: t.asset_type,
      asset_type_public_id: t.collibra_id,
      asset_type_path: t.collibra_path,
      product: 'Business Glossary / Guided Stewardship / Report Catalog',
      parent_asset_type: 'Business Asset',
      source:
        'https://productresources.collibra.com/docs/collibra/latest/Content/Assets/AssetTypes/ref_ootb-asset-types.htm',
    },
    tool_coverage: t.tool_coverage,
    hierarchy: { role: t.role, note: t.hierarchy_note },
    mapping_engine: t.mapping,
    characteristics: characteristicsFor(t),
    instance_shape: {
      required_fields: ['id', 'contract_id', 'kind', 'name', 'source_system'],
      kind_value: t.kind_value,
    },
  }
  fs.writeFileSync(path.join(dir, 'contract.json'), JSON.stringify(contract, null, 2) + '\n')

  const readme = `---
title: ${t.asset_type}
section: "10.05.10.BusinessCatalog.${t.folder.replace(/\s+/g, '')}"
status: draft
template: asset-type
last_reviewed: 2026-08-12
owner: Enterprise Architecture
tags: [business-catalog, ${t.kind_value}, contracts]
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
| Collibra path | \`${t.collibra_path}\` |

## Tool coverage

See [03. Catalog Tool Coverage](../03.%20Catalog%20Tool%20Coverage.md) and \`tool_coverage\` in the contract.

## Mapping

DA-08 \`${t.mapping.predicate}\` — ${t.mapping.note}

Parent: [Business Catalog](../00.%20README.md)
`
  fs.writeFileSync(path.join(dir, '00. README.md'), readme)

  const chars = `# ${t.asset_type} — Characteristics

Contract: \`${t.contract_id}\` · Layer: **${t.layer}**

${t.description}

## Core

See [\`contract.json\`](contract.json) \`characteristics\` array (generated; keep in sync).

## Hierarchy

${t.hierarchy_note}

## Cross-tool notes

${Object.entries(t.tool_coverage)
  .map(([k, v]) => `- **${k}:** ${v.equivalent}${v.notes ? ` — ${v.notes}` : ''}${v.path ? ` (\`${v.path}\`)` : ''}`)
  .join('\n')}
`
  fs.writeFileSync(path.join(dir, '01. Characteristics.md'), chars)

  const example = {
    id: `asset-example-${t.kind_value}`,
    contract_id: `ctr-inst-${t.kind_value}`,
    type_contract_id: t.contract_id,
    kind: t.kind_value,
    asset_type: t.asset_type,
    display_name: `Example ${t.asset_type}`,
    name: `example-${t.kind_value}`,
    qualified_name: `business.${t.kind_value}.example`,
    source_system: 'collibra',
    natco: 'global',
    layer: t.layer,
    characteristics: {
      Description: t.description,
      Status: 'Draft',
    },
  }
  fs.writeFileSync(path.join(dir, 'example.json'), JSON.stringify(example, null, 2) + '\n')
}

for (const t of TYPES) writePackage(t)

// schema enum
const schemaPath = path.join(ROOT, 'shared/asset-type-characteristics.schema.json')
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'))
schema.properties.asset_type.enum = TYPES.map((t) => t.asset_type)
schema.properties.tool_coverage = { type: 'object' }
fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2) + '\n')

// index.json
const index = {
  meta: {
    title: 'Business Catalog — Asset Type Contracts Index',
    section: '10.05.10.Contracts.BusinessCatalog',
    version: '1.1.0',
    status: 'draft',
    last_reviewed: '2026-08-12',
    doc_root: '10. Contracts/Business Catalog',
    catalog_sor: ['collibra', 'dataplex', 'openmetadata', 'microsoft_purview', 'alation', 'informatica_cdgc'],
    control_plane_role: 'Mapping Engine mapsTo → Registry concepts',
    layers: 'glossary + conceptual + semantic (logical) + context',
    tool_coverage_doc: '03. Catalog Tool Coverage.md',
  },
  contracts: [
    {
      contract_id: 'ctr-biz-hierarchy-v1',
      kind: 'business_catalog_hierarchy',
      file: 'hierarchy.relations.json',
      doc: '01. Hierarchy And Relations.md',
    },
    ...TYPES.map((t) => ({
      contract_id: t.contract_id,
      kind: 'asset_type_characteristics',
      asset_type: t.asset_type,
      layer: t.layer,
      folder: t.folder,
      file: `${t.folder}/contract.json`,
      doc: `${t.folder}/01. Characteristics.md`,
      example: `${t.folder}/example.json`,
      collibra_path: t.collibra_path,
    })),
  ],
  schema: 'shared/asset-type-characteristics.schema.json',
  documentation_standard: '02. Documentation Standard.md',
  tool_coverage: '03. Catalog Tool Coverage.md',
  example_instances: 'examples/index.json',
}
fs.writeFileSync(path.join(ROOT, 'index.json'), JSON.stringify(index, null, 2) + '\n')

console.log('Generated', TYPES.length, 'Business Catalog asset types')
