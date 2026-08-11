// 01-load-control-plane.cypher — Semantic Control Plane (DA-02 / DA-04 / DA-11)
// Namespaces
MERGE (g:Namespace {id: 'ns-global'})
SET g.slug = 'global',
    g.displayName = 'Enterprise Global',
    g.kind = 'global',
    g.uriBase = 'https://semantics.example/ns/global/',
    g.status = 'active',
    g.owner = 'Global Semantic COE',
    g.pack = 'semantic-control-plane';

MERGE (de:Namespace {id: 'ns-natco-de'})
SET de.slug = 'natco-de',
    de.displayName = 'Germany',
    de.kind = 'natco',
    de.uriBase = 'https://semantics.example/ns/natco-de/',
    de.status = 'active',
    de.owner = 'natco-de-data-office',
    de.pack = 'semantic-control-plane';

// Concepts (global)
MERGE (cCust:Concept {id: 'concept-global-customer'})
SET cCust.conceptId = 'customer',
    cCust.uri = 'https://semantics.example/ns/global/customer',
    cCust.kind = 'entity',
    cCust.preferredLabel = 'Customer',
    cCust.description = 'A party that buys or uses products or services',
    cCust.status = 'approved',
    cCust.version = 1,
    cCust.scope = 'enterprise',
    cCust.bootstrapSource = 'tmforum-sid',
    cCust.pack = 'semantic-control-plane';

MERGE (cId:Concept {id: 'concept-global-customer-identifier'})
SET cId.conceptId = 'customer-identifier',
    cId.uri = 'https://semantics.example/ns/global/customer-identifier',
    cId.kind = 'shared_property',
    cId.preferredLabel = 'Customer Identifier',
    cId.description = 'Unique identifier of a customer',
    cId.status = 'approved',
    cId.version = 1,
    cId.scope = 'enterprise',
    cId.bootstrapSource = 'tmforum-sid',
    cId.pack = 'semantic-control-plane';

MERGE (g)-[:CONTAINS_CONCEPT]->(cCust)
MERGE (g)-[:CONTAINS_CONCEPT]->(cId)

// NATCO concept + federation
MERGE (cKunde:Concept {id: 'concept-natco-de-kunde'})
SET cKunde.conceptId = 'kunde',
    cKunde.uri = 'https://semantics.example/ns/natco-de/kunde',
    cKunde.kind = 'entity',
    cKunde.preferredLabel = 'Kunde',
    cKunde.description = 'NATCO-DE customer concept (federated to global/customer)',
    cKunde.status = 'approved',
    cKunde.version = 1,
    cKunde.scope = 'natco',
    cKunde.pack = 'semantic-control-plane';

MERGE (de)-[:CONTAINS_CONCEPT]->(cKunde)

MERGE (fed:FederationEdge {id: 'fed-de-kunde-customer'})
SET fed.predicate = 'sameAs',
    fed.status = 'approved',
    fed.isPrimary = true,
    fed.owner = 'Global Semantic COE',
    fed.da = 'DA-11',
    fed.pack = 'semantic-control-plane';

MERGE (cKunde)-[:FROM_CONCEPT]->(fed)
MERGE (fed)-[:TO_CONCEPT]->(cCust)
MERGE (cKunde)-[:FEDERATES {predicate: 'sameAs', edgeId: 'fed-de-kunde-customer'}]->(cCust)
