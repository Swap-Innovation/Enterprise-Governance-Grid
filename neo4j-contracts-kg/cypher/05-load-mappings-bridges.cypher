// 05-load-mappings-bridges.cypher — Cross-pack meaning + structural bridges (X1–X19 style)
// --- Meaning bridges → Concept ---

// Business Term / Entity / Attribute MAPS_TO Concept
MATCH (term:BusinessTerm {id: 'term-customer'}), (c:Concept {id: 'concept-global-customer'})
MERGE (map1:MappingRecord {id: 'map-term-customer'})
SET map1.kind = 'business_to_concept',
    map1.confidence = 1.0,
    map1.status = 'approved',
    map1.da = 'DA-08',
    map1.pack = 'semantic-control-plane'
MERGE (term)-[:MAPS_TO {via: 'map-term-customer'}]->(c)
MERGE (map1)-[:SOURCE]->(term)
MERGE (map1)-[:TARGET]->(c);

MATCH (entity:DataEntity {id: 'entity-customer'}), (c:Concept {id: 'concept-global-customer'})
MERGE (map2:MappingRecord {id: 'map-entity-customer'})
SET map2.kind = 'business_to_concept',
    map2.confidence = 1.0,
    map2.status = 'approved',
    map2.da = 'DA-08',
    map2.pack = 'semantic-control-plane'
MERGE (entity)-[:MAPS_TO {via: 'map-entity-customer'}]->(c)
MERGE (map2)-[:SOURCE]->(entity)
MERGE (map2)-[:TARGET]->(c);

MATCH (attr:DataAttribute {id: 'attr-customer-id'}), (c:Concept {id: 'concept-global-customer-identifier'})
MERGE (map3:MappingRecord {id: 'map-attr-customer-id'})
SET map3.kind = 'business_to_concept',
    map3.confidence = 1.0,
    map3.status = 'approved',
    map3.da = 'DA-08',
    map3.pack = 'semantic-control-plane'
MERGE (attr)-[:MAPS_TO {via: 'map-attr-customer-id'}]->(c)
MERGE (map3)-[:SOURCE]->(attr)
MERGE (map3)-[:TARGET]->(c);

// Technical Column / Table REPRESENTS Concept
MATCH (col:Column {id: 'col-crm-customer-id'}), (c:Concept {id: 'concept-global-customer-identifier'})
MERGE (map4:MappingRecord {id: 'map-col-crm-customer-id'})
SET map4.kind = 'technical_to_concept',
    map4.confidence = 0.95,
    map4.status = 'approved',
    map4.da = 'DA-09',
    map4.pack = 'semantic-control-plane'
MERGE (col)-[:REPRESENTS {via: 'map-col-crm-customer-id'}]->(c)
MERGE (map4)-[:SOURCE]->(col)
MERGE (map4)-[:TARGET]->(c);

MATCH (tbl:Table {id: 'table-crm-customer'}), (c:Concept {id: 'concept-global-customer'})
MERGE (map5:MappingRecord {id: 'map-table-crm-customer'})
SET map5.kind = 'technical_to_concept',
    map5.confidence = 0.9,
    map5.status = 'approved',
    map5.da = 'DA-09',
    map5.pack = 'semantic-control-plane'
MERGE (tbl)-[:REPRESENTS {via: 'map-table-crm-customer'}]->(c)
MERGE (map5)-[:SOURCE]->(tbl)
MERGE (map5)-[:TARGET]->(c);

MATCH (colDp:Column {id: 'col-dp-customer-id'}), (c:Concept {id: 'concept-global-customer-identifier'})
MERGE (map6:MappingRecord {id: 'map-col-dp-customer-id'})
SET map6.kind = 'technical_to_concept',
    map6.confidence = 1.0,
    map6.status = 'approved',
    map6.da = 'DA-09',
    map6.pack = 'semantic-control-plane'
MERGE (colDp)-[:REPRESENTS {via: 'map-col-dp-customer-id'}]->(c)
MERGE (map6)-[:SOURCE]->(colDp)
MERGE (map6)-[:TARGET]->(c);

// Data Product / Port / Field IMPLEMENTS Concept
MATCH (prod:DataProduct {id: 'dp-customer-360'}), (c:Concept {id: 'concept-global-customer'})
MERGE (map7:MappingRecord {id: 'map-dp-customer-360'})
SET map7.kind = 'product_to_concept',
    map7.confidence = 1.0,
    map7.status = 'approved',
    map7.da = 'DA-10',
    map7.pack = 'semantic-control-plane'
MERGE (prod)-[:IMPLEMENTS {via: 'map-dp-customer-360'}]->(c)
MERGE (map7)-[:SOURCE]->(prod)
MERGE (map7)-[:TARGET]->(c);

MATCH (field:ContractField {id: 'field-customer-id'}), (c:Concept {id: 'concept-global-customer-identifier'})
MERGE (map8:MappingRecord {id: 'map-field-customer-id'})
SET map8.kind = 'product_to_concept',
    map8.confidence = 1.0,
    map8.status = 'approved',
    map8.da = 'DA-10',
    map8.pack = 'semantic-control-plane'
MERGE (field)-[:IMPLEMENTS {via: 'map-field-customer-id'}]->(c)
MERGE (map8)-[:SOURCE]->(field)
MERGE (map8)-[:TARGET]->(c);

// --- Structural bridges ---

// Entity ↔ Table
MATCH (entity:DataEntity {id: 'entity-customer'}), (tbl:Table {id: 'table-crm-customer'})
MERGE (entity)-[:IMPLEMENTED_IN]->(tbl)
MERGE (tbl)-[:IMPLEMENTS_ENTITY]->(entity);

MATCH (entity:DataEntity {id: 'entity-customer'}), (tblDp:Table {id: 'table-dp-customer-360'})
MERGE (entity)-[:IMPLEMENTED_IN]->(tblDp)
MERGE (tblDp)-[:IMPLEMENTS_ENTITY]->(entity);

// Attribute ↔ Column
MATCH (attr:DataAttribute {id: 'attr-customer-id'}), (col:Column {id: 'col-crm-customer-id'})
MERGE (attr)-[:IMPLEMENTED_BY]->(col)
MERGE (col)-[:IMPLEMENTS_ATTRIBUTE]->(attr);

MATCH (attr:DataAttribute {id: 'attr-customer-id'}), (colDp:Column {id: 'col-dp-customer-id'})
MERGE (attr)-[:IMPLEMENTED_BY]->(colDp)
MERGE (colDp)-[:IMPLEMENTS_ATTRIBUTE]->(attr);

// Port ↔ Table
MATCH (out:OutputPort {id: 'port-out-customer-360'}), (tblDp:Table {id: 'table-dp-customer-360'})
MERGE (out)-[:BACKED_BY]->(tblDp);

MATCH (inp:InputPort {id: 'port-in-crm-customer'}), (tbl:Table {id: 'table-crm-customer'})
MERGE (inp)-[:READS_FROM]->(tbl);

// Contract Field ↔ Column
MATCH (field:ContractField {id: 'field-customer-id'}), (colDp:Column {id: 'col-dp-customer-id'})
MERGE (field)-[:MAPS_TO_COLUMN]->(colDp);

// Product ↔ Domain
MATCH (prod:DataProduct {id: 'dp-customer-360'}), (domain:DataDomain {id: 'domain-customer'})
MERGE (prod)-[:BELONGS_TO_DOMAIN]->(domain);
