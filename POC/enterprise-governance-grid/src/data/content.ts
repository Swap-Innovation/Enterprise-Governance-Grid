export const nav = [
  { id: 'thesis', label: 'Thesis' },
  { id: 'sor', label: 'SoR' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'context-graph', label: 'Context Graph' },
  { id: 'engines', label: 'Engines' },
  { id: 'federation', label: 'Federation' },
  { id: 'mapping', label: 'Mapping' },
  { id: 'graph', label: 'Graph' },
  { id: 'apis', label: 'APIs' },
  { id: 'governance', label: 'Governance' },
  { id: 'roadmap', label: 'Roadmap' },
] as const

export const principles = [
  {
    title: 'Headless platform',
    body: 'Backend services only. UI lives in Entropy Marketplace.',
  },
  {
    title: 'API first',
    body: 'Every capability is exposed as a contract: Semantic, Graph, Search, MCP.',
  },
  {
    title: 'Federated ownership',
    body: 'Global and NATCO keep owning catalog metadata; meaning is central.',
  },
  {
    title: 'Semantic governance',
    body: 'Approval, versioning, and audit run through the Governance Engine.',
  },
  {
    title: 'Standards based',
    body: 'TM Forum SID seeds global meaning; Apache OSSIE carries interchange.',
  },
  {
    title: 'Do not fork global',
    body: 'NATCOs federate to global/ — they never redefine enterprise meaning.',
  },
] as const

export const sorMatrix = [
  {
    capability: 'Enterprise meaning',
    owner: 'Semantic Control Plane',
    role: 'SoR',
    note: 'Concepts, ontology, namespaces, mappings, federation, governance',
  },
  {
    capability: 'Business glossary',
    owner: 'Collibra / Dataplex',
    role: 'SoR',
    note: 'Local term prose; mapped into the control plane',
  },
  {
    capability: 'Technical metadata',
    owner: 'Collibra / Dataplex',
    role: 'SoR',
    note: 'Asset inventory remains federated per unit',
  },
  {
    capability: 'Data products & UI',
    owner: 'Entropy Marketplace',
    role: 'SoR',
    note: 'Lifecycle, ports, contracts, discovery UX',
  },
  {
    capability: 'Industry standards',
    owner: 'TM Forum SID',
    role: 'Source',
    note: 'Seeds global/; Control Plane owns after approval',
  },
  {
    capability: 'Interchange packages',
    owner: 'Apache OSSIE',
    role: 'Exchange',
    note: 'Import / export only — never a metadata repository',
  },
] as const

export const spineLayers = [
  {
    id: 'sources',
    label: 'Authoritative sources',
    items: ['TM Forum SID R20.0', 'Global catalogs', 'NATCO catalogs'],
  },
  {
    id: 'connectors',
    label: 'Metadata connectors',
    items: ['Collibra', 'Dataplex', 'REST', 'Files', 'Events'],
  },
  {
    id: 'plane',
    label: 'Enterprise Semantic Control Plane',
    items: [
      'Registry',
      'Namespace',
      'Ontology',
      'Knowledge Graph',
      'Mapping',
      'Federation',
      'Governance',
    ],
    highlight: true,
  },
  {
    id: 'apis',
    label: 'Semantic APIs',
    items: ['Semantic', 'Graph', 'Search', 'MCP Server'],
  },
  {
    id: 'consumers',
    label: 'Consumers & exchange',
    items: ['Entropy Marketplace', 'AI / BI / Apps', 'Apache OSSIE'],
  },
] as const

export const engines = [
  {
    id: 'registry',
    name: 'Semantic Registry',
    tag: 'DA-04',
    summary:
      'Stores enterprise concepts with stable URIs, versioning, and lifecycle.',
    points: ['CRUD + retire', 'Immutable URI', 'Draft → approved → deprecated'],
  },
  {
    id: 'namespace',
    name: 'Namespace Registry',
    tag: 'DA-02',
    summary: 'Hierarchy of global and NATCO semantic scopes with visibility.',
    points: ['global + natco-{iso}', 'Ownership / scope', 'Staging namespaces'],
  },
  {
    id: 'ontology',
    name: 'Ontology & Taxonomy',
    tag: 'DA-06',
    summary: 'Enterprise knowledge modeling: hierarchies, classification, definitions.',
    points: ['Specialization', 'Composition', 'Predicate catalog'],
  },
  {
    id: 'kg',
    name: 'Knowledge Graph',
    tag: 'DA-13',
    summary: 'Context layer connecting concepts, assets, products, and policies.',
    points: ['Traversal', 'Impact analysis', 'AI-ready neighbors'],
  },
  {
    id: 'mapping',
    name: 'Mapping Engine',
    tag: 'DA-08–10',
    summary: 'Crosswalks from catalogs and products into enterprise concepts.',
    points: ['mapsTo', 'represents', 'implements'],
  },
  {
    id: 'federation',
    name: 'Federation Engine',
    tag: 'DA-11',
    summary: 'Aligns NATCO meaning to global without forking the backbone.',
    points: ['sameAs', 'extends', 'specializes', 'implements'],
  },
  {
    id: 'governance',
    name: 'Governance Engine',
    tag: 'DA-12',
    summary: 'Stewardship workflows, policies, audit, and release gates.',
    points: ['RACI', 'POL-SEM-*', 'Audit + events'],
  },
] as const

export const federationPredicates = [
  {
    predicate: 'sameAs',
    when: 'Same meaning; local label only',
  },
  {
    predicate: 'specializes',
    when: 'Stricter NATCO subtype of a global concept',
  },
  {
    predicate: 'implements',
    when: 'Local operationalization of abstract global',
  },
  {
    predicate: 'extends',
    when: 'Adds local attributes; keeps global core',
  },
] as const

export const mappings = [
  {
    from: 'Business term',
    to: 'Enterprise concept',
    type: 'mapsTo',
    id: 'DA-08',
  },
  {
    from: 'Technical asset / column',
    to: 'Enterprise concept',
    type: 'represents',
    id: 'DA-09',
  },
  {
    from: 'Marketplace product',
    to: 'Enterprise concept',
    type: 'implements',
    id: 'DA-10',
  },
] as const

export const graphExample = [
  { from: 'Customer', edge: 'owns', to: 'Account' },
  { from: 'Account', edge: 'contains', to: 'SIM' },
  { from: 'SIM', edge: 'belongsTo', to: 'Product' },
  { from: 'BusinessTerm', edge: 'mapsTo', to: 'Customer' },
  { from: 'Table.Column', edge: 'represents', to: 'Customer' },
  { from: 'DataProduct', edge: 'implements', to: 'Customer' },
  { from: 'natco:Kunde', edge: 'sameAs', to: 'global:Customer' },
] as const

export const apis = [
  {
    name: 'Semantic API',
    ops: ['Lookup', 'Search', 'Expand', 'Validate', 'Compare', 'Resolve'],
  },
  {
    name: 'Graph API',
    ops: ['Traverse', 'Neighbors', 'Path analysis', 'Impact'],
  },
  {
    name: 'Search API',
    ops: ['Full-text', 'Semantic', 'Hybrid', 'Vector'],
  },
  {
    name: 'MCP Server',
    ops: ['Context retrieval', 'Tool execution', 'Prompt enrichment'],
  },
] as const

export const governanceStates = [
  { state: 'draft', desc: 'Steward authors concept or edge' },
  { state: 'review', desc: 'Submitted for approval' },
  { state: 'approved', desc: 'Valid target for active mappings & hard gates' },
  { state: 'deprecated', desc: 'Retired with replaced_by + impact report' },
] as const

export const policies = [
  'POL-SEM-01 — No silent edit of approved definition without version bump',
  'POL-SEM-02 — Active mapping requires approved target',
  'POL-SEM-03 — Deprecated targets block new binds',
  'POL-SEM-04 — Global breaking change notifies NATCOs in 5 business days',
  'POL-SEM-05 — Suggested mappings never auto-approve',
  'POL-SEM-06 — Ossie release only from approved content slice',
] as const

export const roadmapPhases = [
  {
    phase: '0',
    title: 'Spine',
    focus: 'Architecture, vision, plan, federation model',
    status: 'done' as const,
  },
  {
    phase: '1',
    title: 'Control plane',
    focus: 'Registry, namespace, ontology, governance, APIs',
    status: 'next' as const,
  },
  {
    phase: '2',
    title: 'Mapping',
    focus: 'Business / technical / product engines + soft gate',
    status: 'planned' as const,
  },
  {
    phase: '3',
    title: 'Knowledge Graph',
    focus: 'Materialize context graph; Graph API',
    status: 'planned' as const,
  },
  {
    phase: '4',
    title: 'Harden',
    focus: 'Hard product gate; expand NATCOs',
    status: 'planned' as const,
  },
  {
    phase: '5',
    title: 'Discovery',
    focus: 'Search API UX in Marketplace',
    status: 'planned' as const,
  },
  {
    phase: '6',
    title: 'Intelligence',
    focus: 'MCP agents, recommendations, copilot',
    status: 'planned' as const,
  },
] as const

export const foundation = [
  { service: 'PostgreSQL', role: 'Transactional / registry store' },
  { service: 'Neo4j', role: 'Knowledge graph' },
  { service: 'pgVector', role: 'Embeddings / vector search' },
  { service: 'Redis', role: 'Cache' },
  { service: 'Kafka', role: 'Change events' },
  { service: 'Object storage', role: 'Packages / artifacts' },
  { service: 'IAM', role: 'Identity and access' },
  { service: 'Observability', role: 'Monitoring / logging' },
] as const

export const outcomes = [
  'One enterprise semantic backbone',
  'Federated ownership with central meaning',
  'Cross-NATCO alignment via federation predicates',
  'AI-ready context through KG + MCP',
  'Marketplace enrichment without forking SoRs',
  'Open interoperability via Apache OSSIE',
] as const
