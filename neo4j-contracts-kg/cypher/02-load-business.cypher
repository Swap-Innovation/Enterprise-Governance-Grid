// 02-load-business.cypher — Business Catalog (glossary + conceptual + semantic)
MERGE (term:BusinessTerm {id: 'term-customer'})
SET term.name = 'Customer',
    term.definition = 'A party that buys or uses products or services',
    term.status = 'Approved',
    term.steward = 'Global Business Glossary Office',
    term.pack = 'business-catalog';

MERGE (domain:DataDomain {id: 'domain-customer'})
SET domain.name = 'Customer',
    domain.description = 'Customer master and commercial party data',
    domain.status = 'Active',
    domain.owner = 'Customer Domain Office',
    domain.pack = 'business-catalog';

MERGE (model:DataModel {id: 'model-customer-logical'})
SET model.name = 'Customer Logical Model',
    model.status = 'Approved',
    model.owner = 'Enterprise Architecture',
    model.pack = 'business-catalog';

MERGE (entity:DataEntity {id: 'entity-customer'})
SET entity.name = 'Customer',
    entity.description = 'Logical customer entity',
    entity.status = 'Approved',
    entity.owner = 'Customer Domain Office',
    entity.pack = 'business-catalog';

MERGE (attr:DataAttribute {id: 'attr-customer-id'})
SET attr.name = 'customerId',
    attr.description = 'Business identifier of the customer',
    attr.dataType = 'string',
    attr.status = 'Approved',
    attr.owner = 'Customer Domain Office',
    attr.pack = 'business-catalog';

MERGE (domain)-[:OWNS_MODEL]->(model)
MERGE (model)-[:CONTAINS_ENTITY]->(entity)
MERGE (entity)-[:HAS_ATTRIBUTE]->(attr)
MERGE (domain)-[:CLASSIFIES]->(entity)
MERGE (term)-[:RELATES_TO {role: 'defines'}]->(entity)
