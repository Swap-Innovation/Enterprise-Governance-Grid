// 06-queries-demo.cypher — Demo lineage catalog (UNION paths — complete asset coverage)
// Params: $productId (Q3), $natco (Q2)
// Each branch returns independent paths so LIMIT cannot drop NATCOs / namespaces.

// ============================================================
// Q1 — Global end-to-end · ALL namespaces + ALL NATCOs + all packs
// ============================================================
CALL {
  MATCH p = (:DataProduct {id: 'dp-customer-360'})-[:IMPLEMENTS]->(:Concept {conceptId: 'Customer'})
  RETURN p
  UNION
  MATCH p = (:DataProduct {id: 'dp-customer-360'})-[:BELONGS_TO_DOMAIN]->(:DataDomain)
  RETURN p
  UNION
  MATCH p = (:DataProduct {id: 'dp-customer-360'})-[:FEDERATES_FROM]->(:DataProduct)
  RETURN p
  UNION
  MATCH p = (:DataProduct {id: 'dp-customer-360'})-[:EXPOSES]->(:OutputPort)-[:GOVERNED_BY]->(:DataContract)
  RETURN p
  UNION
  MATCH p = (:DataProduct {id: 'dp-customer-360'})-[:EXPOSES]->(:OutputPort)-[:BACKED_BY]->(:Table)
  RETURN p
  UNION
  MATCH p = (:DataContract)-[:GOVERNS]->(:Table {id: 'table-dp-customer-360'})
  WHERE exists { MATCH (:OutputPort)-[:GOVERNED_BY]->(:DataContract)<-[:EXPOSES]-(:DataProduct {id: 'dp-customer-360'}) }
  RETURN p
  UNION
  MATCH (dc:DataContract)<-[:GOVERNED_BY]-(:OutputPort)<-[:EXPOSES]-(:DataProduct {id: 'dp-customer-360'})
  MATCH p = (dc)-[:CONTAINS_FIELD]->(:ContractField)-[:MAPS_TO_COLUMN]->(:Column)
  RETURN p
  UNION
  MATCH (f:ContractField)<-[:CONTAINS_FIELD]-(:DataContract)<-[:GOVERNED_BY]-(:OutputPort)<-[:EXPOSES]-(:DataProduct {id: 'dp-customer-360'})
  MATCH p = (f)-[:IMPLEMENTS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:Table {id: 'table-dp-customer-360'})-[:CONTAINS_COLUMN]->(:Column)-[:REPRESENTS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:System {id: 'sys-dp-platform'})-[:HAS_DATABASE]->(:Database)
    -[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(:Table {id: 'table-dp-customer-360'})
  RETURN p
  UNION
  MATCH p = (:DataProduct {id: 'dp-customer-360'})-[:CONSUMES]->(:InputPort)-[:READS_FROM]->(:Table)
  RETURN p
  UNION
  MATCH (src:Table)<-[:READS_FROM]-(:InputPort)<-[:CONSUMES]-(:DataProduct {id: 'dp-customer-360'})
  MATCH p = (sys:System {natco: src.natco})-[:HAS_DATABASE]->(:Database)
    -[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(src)
  RETURN p
  UNION
  MATCH (src:Table)<-[:READS_FROM]-(:InputPort)<-[:CONSUMES]-(:DataProduct {id: 'dp-customer-360'})
  MATCH p = (src)-[:CONTAINS_COLUMN]->(:Column)-[:REPRESENTS]->(:Concept)
  RETURN p
  UNION
  MATCH (nat:DataProduct)<-[:FEDERATES_FROM]-(:DataProduct {id: 'dp-customer-360'})
  MATCH p = (nat)-[:EXPOSES]->(:OutputPort)-[:GOVERNED_BY]->(:DataContract)-[:GOVERNS]->(:Table)
  RETURN p
  UNION
  MATCH (nat:DataProduct)<-[:FEDERATES_FROM]-(:DataProduct {id: 'dp-customer-360'})
  MATCH p = (nat)-[:EXPOSES]->(:OutputPort)-[:BACKED_BY]->(:Table)
  RETURN p
  UNION
  MATCH (nat:DataProduct)<-[:FEDERATES_FROM]-(:DataProduct {id: 'dp-customer-360'})
  MATCH (dc:DataContract)<-[:GOVERNED_BY]-(:OutputPort)<-[:EXPOSES]-(nat)
  MATCH p = (dc)-[:CONTAINS_FIELD]->(:ContractField)-[:MAPS_TO_COLUMN]->(:Column)
  RETURN p
  UNION
  MATCH (nat:DataProduct)<-[:FEDERATES_FROM]-(:DataProduct {id: 'dp-customer-360'})
  MATCH p = (nat)-[:IMPLEMENTS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:Namespace {slug: 'global'})-[:CONTAINS_CONCEPT]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:Namespace {kind: 'natco'})-[:ALIGNS_TO]->(:Namespace {slug: 'global'})
  RETURN p
  UNION
  MATCH p = (:Namespace {kind: 'natco'})-[:CONTAINS_CONCEPT]->(:Concept {kind: 'entity'})
    -[:FEDERATES]->(:Concept {conceptId: 'Customer'})
  RETURN p
  UNION
  MATCH p = (:Namespace {kind: 'natco'})-[:CONTAINS_CONCEPT]->(:Concept {kind: 'shared_property'})
    -[:FEDERATES]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataDomain)-[:OWNS_MODEL]->(:DataModel)
    -[:CONTAINS_ENTITY]->(:DataEntity)-[:HAS_ATTRIBUTE]->(:DataAttribute)
  RETURN p
  UNION
  MATCH p = (:DataEntity)-[:MAPS_TO]->(:Concept {conceptId: 'Customer'})
  RETURN p
  UNION
  MATCH p = (:DataAttribute)-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:BusinessTerm)-[:MAPS_TO]->(:Concept {conceptId: 'Customer'})
  RETURN p
  UNION
  MATCH p = (:BusinessTerm)-[:EXPRESSED_AS]->(:Concept {kind: 'entity'})
  RETURN p
}
RETURN p,
       [n IN nodes(p) | coalesce(n.name, n.preferredLabel, n.fullyQualifiedName, n.slug, n.id)] AS assets,
       [r IN relationships(p) | type(r)] AS rels
LIMIT 400;

// ============================================================
// Q2 — NATCO end-to-end · one country ($natco) · complete pack coverage
// ============================================================
CALL {
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH p = (:DataProduct {natco: natco})-[:IMPLEMENTS]->(:Concept)
  RETURN p
  UNION
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH p = (:DataProduct {natco: natco})-[:BELONGS_TO_DOMAIN]->(:DataDomain)
  RETURN p
  UNION
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH p = (:DataProduct {natco: natco})-[:EXPOSES]->(:OutputPort)-[:GOVERNED_BY]->(:DataContract)-[:GOVERNS]->(:Table)
  RETURN p
  UNION
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH p = (:DataProduct {natco: natco})-[:EXPOSES]->(:OutputPort)-[:BACKED_BY]->(:Table)
  RETURN p
  UNION
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH (dc:DataContract {natco: natco})
  MATCH p = (dc)-[:CONTAINS_FIELD]->(:ContractField)-[:MAPS_TO_COLUMN]->(:Column)
  RETURN p
  UNION
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH (f:ContractField {natco: natco})
  MATCH p = (f)-[:IMPLEMENTS]->(:Concept)
  RETURN p
  UNION
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH (tbl:Table {natco: natco})
  MATCH p = (tbl)-[:CONTAINS_COLUMN]->(:Column)-[:REPRESENTS]->(:Concept)
  RETURN p
  UNION
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH p = (:System {natco: natco})-[:HAS_DATABASE]->(:Database)
    -[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(:Table {natco: natco})
  RETURN p
  UNION
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH p = (:Namespace {slug: natco})-[:ALIGNS_TO]->(:Namespace {slug: 'global'})
  RETURN p
  UNION
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH p = (:Namespace {slug: natco})-[:CONTAINS_CONCEPT]->(:Concept)
  RETURN p
  UNION
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH (nEnt:Concept)<-[:CONTAINS_CONCEPT]-(:Namespace {slug: natco})
  WHERE nEnt.kind = 'entity'
  MATCH p = (nEnt)-[:FEDERATES]->(:Concept {conceptId: 'Customer'})
  RETURN p
  UNION
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH (nProp:Concept)<-[:CONTAINS_CONCEPT]-(:Namespace {slug: natco})
  WHERE nProp.kind = 'shared_property'
  MATCH p = (nProp)-[:FEDERATES]->(:Concept)
  RETURN p
  UNION
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH p = (:BusinessTerm {natco: natco})-[:MAPS_TO]->(:Concept {conceptId: 'Customer'})
  RETURN p
  UNION
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH p = (:BusinessTerm {natco: natco})-[:EXPRESSED_AS]->(:Concept)
  RETURN p
  UNION
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH p = (:DataDomain)-[:OWNS_MODEL]->(:DataModel)
    -[:CONTAINS_ENTITY]->(:DataEntity)-[:HAS_ATTRIBUTE]->(:DataAttribute)
  RETURN p
  UNION
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH p = (:DataAttribute)-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH p = (:DataProduct {id: 'dp-customer-360'})-[:FEDERATES_FROM]->(:DataProduct {natco: natco})
  RETURN p
  UNION
  WITH coalesce($natco, 'natco-de') AS natco
  MATCH p = (:Namespace {slug: 'global'})-[:CONTAINS_CONCEPT]->(:Concept {conceptId: 'Customer'})
  RETURN p
}
RETURN p,
       [n IN nodes(p) | coalesce(n.name, n.preferredLabel, n.fullyQualifiedName, n.slug, n.id)] AS assets,
       [r IN relationships(p) | type(r)] AS rels
LIMIT 300;

// ============================================================
// Q3 — Data product lineage from Marketplace ($productId)
// ============================================================
CALL {
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH p = (:DataProduct {id: productId})-[:IMPLEMENTS]->(:Concept)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH p = (:DataProduct {id: productId})-[:BELONGS_TO_DOMAIN]->(:DataDomain)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH (domain:DataDomain)<-[:BELONGS_TO_DOMAIN]-(:DataProduct {id: productId})
  MATCH p = (domain)-[:OWNS_MODEL]->(:DataModel)
    -[:CONTAINS_ENTITY]->(:DataEntity)-[:HAS_ATTRIBUTE]->(:DataAttribute)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH (domain:DataDomain)<-[:BELONGS_TO_DOMAIN]-(:DataProduct {id: productId})
  MATCH (entity:DataEntity)<-[:CONTAINS_ENTITY]-(:DataModel)<-[:OWNS_MODEL]-(domain)
  MATCH p = (entity)-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH (domain:DataDomain)<-[:BELONGS_TO_DOMAIN]-(:DataProduct {id: productId})
  MATCH (attr:DataAttribute)<-[:HAS_ATTRIBUTE]-(:DataEntity)<-[:CONTAINS_ENTITY]-(:DataModel)<-[:OWNS_MODEL]-(domain)
  MATCH p = (attr)-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH (tbl:Table)<-[:BACKED_BY]-(:OutputPort)<-[:EXPOSES]-(:DataProduct {id: productId})
  MATCH p = (:DataEntity)-[:IMPLEMENTED_IN]->(tbl)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH (col:Column)<-[:CONTAINS_COLUMN]-(:Table)<-[:BACKED_BY]-(:OutputPort)<-[:EXPOSES]-(:DataProduct {id: productId})
  MATCH p = (:DataAttribute)-[:IMPLEMENTED_IN]->(col)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH (c:Concept)<-[:IMPLEMENTS]-(:DataProduct {id: productId})
  MATCH p = (:BusinessTerm)-[:MAPS_TO]->(c)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH p = (:DataProduct {id: productId})-[:EXPOSES]->(:OutputPort)-[:GOVERNED_BY]->(:DataContract)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH p = (:DataProduct {id: productId})-[:EXPOSES]->(:OutputPort)-[:BACKED_BY]->(:Table)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH (dc:DataContract)<-[:GOVERNED_BY]-(:OutputPort)<-[:EXPOSES]-(:DataProduct {id: productId})
  MATCH p = (dc)-[:GOVERNS]->(:Table)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH (dc:DataContract)<-[:GOVERNED_BY]-(:OutputPort)<-[:EXPOSES]-(:DataProduct {id: productId})
  MATCH p = (dc)-[:CONTAINS_FIELD]->(:ContractField)-[:MAPS_TO_COLUMN]->(:Column)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH (f:ContractField)<-[:CONTAINS_FIELD]-(:DataContract)<-[:GOVERNED_BY]-(:OutputPort)<-[:EXPOSES]-(:DataProduct {id: productId})
  MATCH p = (f)-[:IMPLEMENTS]->(:Concept)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH (tbl:Table)<-[:BACKED_BY]-(:OutputPort)<-[:EXPOSES]-(:DataProduct {id: productId})
  MATCH p = (tbl)-[:CONTAINS_COLUMN]->(:Column)-[:REPRESENTS]->(:Concept)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH (tbl:Table)<-[:BACKED_BY]-(:OutputPort)<-[:EXPOSES]-(:DataProduct {id: productId})
  MATCH p = (sys:System)-[:HAS_DATABASE]->(:Database)-[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(tbl)
  WHERE sys.natco = tbl.natco OR (tbl.natco IS NULL AND sys.id = 'sys-dp-platform')
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH p = (:DataProduct {id: productId})-[:CONSUMES]->(:InputPort)-[:READS_FROM]->(:Table)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH (src:Table)<-[:READS_FROM]-(:InputPort)<-[:CONSUMES]-(:DataProduct {id: productId})
  MATCH p = (:System {natco: src.natco})-[:HAS_DATABASE]->(:Database)
    -[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(src)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH (src:Table)<-[:READS_FROM]-(:InputPort)<-[:CONSUMES]-(:DataProduct {id: productId})
  MATCH p = (src)-[:CONTAINS_COLUMN]->(:Column)-[:REPRESENTS]->(:Concept)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH p = (:DataProduct {id: productId})-[:FEDERATES_FROM]->(:DataProduct)
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH p = (:DataProduct)-[:FEDERATES_FROM]->(:DataProduct {id: productId})
  RETURN p
  UNION
  WITH coalesce($productId, 'dp-customer-360') AS productId
  MATCH (c:Concept)<-[:IMPLEMENTS]-(:DataProduct {id: productId})
  MATCH p = (:Namespace)-[:CONTAINS_CONCEPT]->(c)
  RETURN p
}
RETURN p,
       [n IN nodes(p) | coalesce(n.name, n.preferredLabel, n.fullyQualifiedName, n.slug, n.id)] AS assets,
       [r IN relationships(p) | type(r)] AS rels
LIMIT 400;

// ============================================================
// Q4 — Technical catalog lineage · every System → Column → Concept
// ============================================================
MATCH path = (sys:System)-[:HAS_DATABASE]->(db:Database)-[:HAS_SCHEMA]->(sch:Schema)
  -[:CONTAINS_TABLE]->(tbl:Table)-[:CONTAINS_COLUMN]->(col:Column)
OPTIONAL MATCH pRep = (col)-[:REPRESENTS]->(c:Concept)
OPTIONAL MATCH pTbl = (tbl)-[:REPRESENTS]->(ent:Concept)
OPTIONAL MATCH pProd = (:DataProduct)-[:EXPOSES]->(:OutputPort)-[:BACKED_BY]->(tbl)
RETURN path, pRep, pTbl, pProd,
       coalesce(sys.natco, 'platform') AS scope, sys.name AS system, db.name AS database,
       sch.name AS schema, tbl.fullyQualifiedName AS table, col.name AS column,
       c.preferredLabel AS concept
ORDER BY scope, table, column, concept
LIMIT 300;

// ============================================================
// Q5 — Business catalog lineage · Domain → Attribute → Concept + implementations
// ============================================================
CALL {
  MATCH p = (:DataDomain)-[:OWNS_MODEL]->(:DataModel)
    -[:CONTAINS_ENTITY]->(:DataEntity)-[:HAS_ATTRIBUTE]->(:DataAttribute)
  RETURN p
  UNION
  MATCH p = (:DataDomain)-[:CLASSIFIES]->(:DataEntity)
  RETURN p
  UNION
  MATCH p = (:DataEntity)-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataAttribute)-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:BusinessTerm)-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:BusinessTerm)-[:RELATES_TO]->(:DataEntity)
  RETURN p
  UNION
  MATCH p = (:BusinessTerm)-[:EXPRESSED_AS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataEntity)-[:IMPLEMENTED_IN]->(:Table)
  RETURN p
  UNION
  MATCH p = (:DataAttribute)-[:IMPLEMENTED_BY]->(:Column)
  RETURN p
  UNION
  MATCH p = (:DataProduct)-[:BELONGS_TO_DOMAIN]->(:DataDomain)
  RETURN p
  UNION
  MATCH p = (:DataProduct)-[:IMPLEMENTS]->(:Concept {conceptId: 'Customer'})
  RETURN p
}
RETURN p,
       [n IN nodes(p) | coalesce(n.name, n.preferredLabel, n.fullyQualifiedName, n.id)] AS assets,
       [r IN relationships(p) | type(r)] AS rels
LIMIT 250;

// ============================================================
// Q6 — Data product pack lineage · all marketplace products
// ============================================================
CALL {
  MATCH p = (:DataProduct)-[:IMPLEMENTS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataProduct)-[:BELONGS_TO_DOMAIN]->(:DataDomain)
  RETURN p
  UNION
  MATCH p = (:DataProduct)-[:EXPOSES]->(:OutputPort)-[:GOVERNED_BY]->(:DataContract)
  RETURN p
  UNION
  MATCH p = (:DataProduct)-[:EXPOSES]->(:OutputPort)-[:BACKED_BY]->(:Table)
  RETURN p
  UNION
  MATCH p = (:DataContract)-[:GOVERNS]->(:Table)
  WHERE exists { MATCH (:DataProduct)-[:EXPOSES]->(:OutputPort)-[:GOVERNED_BY]->(:DataContract) }
  RETURN p
  UNION
  MATCH p = (:DataContract)-[:CONTAINS_FIELD]->(:ContractField)-[:MAPS_TO_COLUMN]->(:Column)
  RETURN p
  UNION
  MATCH p = (:ContractField)-[:IMPLEMENTS]->(:Concept)
  RETURN p
  UNION
  MATCH (tbl:Table)<-[:BACKED_BY]-(:OutputPort)<-[:EXPOSES]-(:DataProduct)
  MATCH p = (tbl)-[:CONTAINS_COLUMN]->(:Column)-[:REPRESENTS]->(:Concept)
  RETURN p
  UNION
  MATCH (tbl:Table)<-[:BACKED_BY]-(:OutputPort)<-[:EXPOSES]-(:DataProduct)
  MATCH p = (sys:System)-[:HAS_DATABASE]->(:Database)-[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(tbl)
  WHERE sys.natco = tbl.natco OR (tbl.natco IS NULL AND sys.id = 'sys-dp-platform')
  RETURN p
  UNION
  MATCH p = (:DataProduct)-[:CONSUMES]->(:InputPort)-[:READS_FROM]->(:Table)
  RETURN p
  UNION
  MATCH p = (:DataProduct)-[:FEDERATES_FROM]->(:DataProduct)
  RETURN p
}
RETURN p,
       [n IN nodes(p) | coalesce(n.name, n.preferredLabel, n.fullyQualifiedName, n.id)] AS assets,
       [r IN relationships(p) | type(r)] AS rels
LIMIT 400;

// ============================================================
// Q7 — Semantic lineage · ALL namespaces · federation · representations
// ============================================================
CALL {
  MATCH p = (:Namespace {slug: 'global'})-[:CONTAINS_CONCEPT]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:Namespace {kind: 'natco'})-[:ALIGNS_TO]->(:Namespace {slug: 'global'})
  RETURN p
  UNION
  MATCH p = (:Namespace {kind: 'natco'})-[:CONTAINS_CONCEPT]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:Concept)-[:FEDERATES]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:BusinessTerm)-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:BusinessTerm)-[:EXPRESSED_AS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:Table)-[:REPRESENTS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:Column)-[:REPRESENTS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataProduct)-[:IMPLEMENTS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataEntity)-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataAttribute)-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:ContractField)-[:IMPLEMENTS]->(:Concept)
  RETURN p
}
RETURN p,
       [n IN nodes(p) | coalesce(n.name, n.preferredLabel, n.fullyQualifiedName, n.slug, n.id)] AS assets,
       [r IN relationships(p) | type(r)] AS rels
LIMIT 400;

// ============================================================
// N1 — Germany end-to-end (natco-de)
// ============================================================
CALL {
  MATCH p = (:DataProduct {natco: 'natco-de'})-[:IMPLEMENTS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataProduct {natco: 'natco-de'})-[:EXPOSES]->(:OutputPort)-[:GOVERNED_BY]->(:DataContract)-[:GOVERNS]->(:Table)
  RETURN p
  UNION
  MATCH p = (:DataProduct {natco: 'natco-de'})-[:EXPOSES]->(:OutputPort)-[:BACKED_BY]->(:Table)
  RETURN p
  UNION
  MATCH p = (:DataContract {natco: 'natco-de'})-[:CONTAINS_FIELD]->(:ContractField)-[:MAPS_TO_COLUMN]->(:Column)
  RETURN p
  UNION
  MATCH p = (:Table {natco: 'natco-de'})-[:CONTAINS_COLUMN]->(:Column)-[:REPRESENTS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:System {natco: 'natco-de'})-[:HAS_DATABASE]->(:Database)
    -[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(:Table {natco: 'natco-de'})
  RETURN p
  UNION
  MATCH p = (:Namespace {slug: 'natco-de'})-[:ALIGNS_TO]->(:Namespace {slug: 'global'})
  RETURN p
  UNION
  MATCH p = (:Namespace {slug: 'natco-de'})-[:CONTAINS_CONCEPT]->(:Concept)-[:FEDERATES]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:Namespace {slug: 'global'})-[:CONTAINS_CONCEPT]->(:Concept {conceptId: 'Customer'})
  RETURN p
  UNION
  MATCH p = (:BusinessTerm {natco: 'natco-de'})-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:BusinessTerm {natco: 'natco-de'})-[:EXPRESSED_AS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataDomain)-[:OWNS_MODEL]->(:DataModel)-[:CONTAINS_ENTITY]->(:DataEntity)-[:HAS_ATTRIBUTE]->(:DataAttribute)
  RETURN p
  UNION
  MATCH p = (:DataAttribute)-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataProduct {id: 'dp-customer-360'})-[:FEDERATES_FROM]->(:DataProduct {natco: 'natco-de'})
  RETURN p
}
RETURN p LIMIT 200;

// ============================================================
// N2 — Austria end-to-end (natco-at)
// ============================================================
CALL {
  MATCH p = (:DataProduct {natco: 'natco-at'})-[:IMPLEMENTS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataProduct {natco: 'natco-at'})-[:EXPOSES]->(:OutputPort)-[:GOVERNED_BY]->(:DataContract)-[:GOVERNS]->(:Table)
  RETURN p
  UNION
  MATCH p = (:DataProduct {natco: 'natco-at'})-[:EXPOSES]->(:OutputPort)-[:BACKED_BY]->(:Table)
  RETURN p
  UNION
  MATCH p = (:DataContract {natco: 'natco-at'})-[:CONTAINS_FIELD]->(:ContractField)-[:MAPS_TO_COLUMN]->(:Column)
  RETURN p
  UNION
  MATCH p = (:Table {natco: 'natco-at'})-[:CONTAINS_COLUMN]->(:Column)-[:REPRESENTS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:System {natco: 'natco-at'})-[:HAS_DATABASE]->(:Database)
    -[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(:Table {natco: 'natco-at'})
  RETURN p
  UNION
  MATCH p = (:Namespace {slug: 'natco-at'})-[:ALIGNS_TO]->(:Namespace {slug: 'global'})
  RETURN p
  UNION
  MATCH p = (:Namespace {slug: 'natco-at'})-[:CONTAINS_CONCEPT]->(:Concept)-[:FEDERATES]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:Namespace {slug: 'global'})-[:CONTAINS_CONCEPT]->(:Concept {conceptId: 'Customer'})
  RETURN p
  UNION
  MATCH p = (:BusinessTerm {natco: 'natco-at'})-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:BusinessTerm {natco: 'natco-at'})-[:EXPRESSED_AS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataDomain)-[:OWNS_MODEL]->(:DataModel)-[:CONTAINS_ENTITY]->(:DataEntity)-[:HAS_ATTRIBUTE]->(:DataAttribute)
  RETURN p
  UNION
  MATCH p = (:DataAttribute)-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataProduct {id: 'dp-customer-360'})-[:FEDERATES_FROM]->(:DataProduct {natco: 'natco-at'})
  RETURN p
}
RETURN p LIMIT 200;

// ============================================================
// N3 — Croatia end-to-end (natco-hr)
// ============================================================
CALL {
  MATCH p = (:DataProduct {natco: 'natco-hr'})-[:IMPLEMENTS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataProduct {natco: 'natco-hr'})-[:EXPOSES]->(:OutputPort)-[:GOVERNED_BY]->(:DataContract)-[:GOVERNS]->(:Table)
  RETURN p
  UNION
  MATCH p = (:DataProduct {natco: 'natco-hr'})-[:EXPOSES]->(:OutputPort)-[:BACKED_BY]->(:Table)
  RETURN p
  UNION
  MATCH p = (:DataContract {natco: 'natco-hr'})-[:CONTAINS_FIELD]->(:ContractField)-[:MAPS_TO_COLUMN]->(:Column)
  RETURN p
  UNION
  MATCH p = (:Table {natco: 'natco-hr'})-[:CONTAINS_COLUMN]->(:Column)-[:REPRESENTS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:System {natco: 'natco-hr'})-[:HAS_DATABASE]->(:Database)
    -[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(:Table {natco: 'natco-hr'})
  RETURN p
  UNION
  MATCH p = (:Namespace {slug: 'natco-hr'})-[:ALIGNS_TO]->(:Namespace {slug: 'global'})
  RETURN p
  UNION
  MATCH p = (:Namespace {slug: 'natco-hr'})-[:CONTAINS_CONCEPT]->(:Concept)-[:FEDERATES]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:Namespace {slug: 'global'})-[:CONTAINS_CONCEPT]->(:Concept {conceptId: 'Customer'})
  RETURN p
  UNION
  MATCH p = (:BusinessTerm {natco: 'natco-hr'})-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:BusinessTerm {natco: 'natco-hr'})-[:EXPRESSED_AS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataDomain)-[:OWNS_MODEL]->(:DataModel)-[:CONTAINS_ENTITY]->(:DataEntity)-[:HAS_ATTRIBUTE]->(:DataAttribute)
  RETURN p
  UNION
  MATCH p = (:DataAttribute)-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataProduct {id: 'dp-customer-360'})-[:FEDERATES_FROM]->(:DataProduct {natco: 'natco-hr'})
  RETURN p
}
RETURN p LIMIT 200;

// ============================================================
// N4 — Hungary end-to-end (natco-hu)
// ============================================================
CALL {
  MATCH p = (:DataProduct {natco: 'natco-hu'})-[:IMPLEMENTS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataProduct {natco: 'natco-hu'})-[:EXPOSES]->(:OutputPort)-[:GOVERNED_BY]->(:DataContract)-[:GOVERNS]->(:Table)
  RETURN p
  UNION
  MATCH p = (:DataProduct {natco: 'natco-hu'})-[:EXPOSES]->(:OutputPort)-[:BACKED_BY]->(:Table)
  RETURN p
  UNION
  MATCH p = (:DataContract {natco: 'natco-hu'})-[:CONTAINS_FIELD]->(:ContractField)-[:MAPS_TO_COLUMN]->(:Column)
  RETURN p
  UNION
  MATCH p = (:Table {natco: 'natco-hu'})-[:CONTAINS_COLUMN]->(:Column)-[:REPRESENTS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:System {natco: 'natco-hu'})-[:HAS_DATABASE]->(:Database)
    -[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(:Table {natco: 'natco-hu'})
  RETURN p
  UNION
  MATCH p = (:Namespace {slug: 'natco-hu'})-[:ALIGNS_TO]->(:Namespace {slug: 'global'})
  RETURN p
  UNION
  MATCH p = (:Namespace {slug: 'natco-hu'})-[:CONTAINS_CONCEPT]->(:Concept)-[:FEDERATES]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:Namespace {slug: 'global'})-[:CONTAINS_CONCEPT]->(:Concept {conceptId: 'Customer'})
  RETURN p
  UNION
  MATCH p = (:BusinessTerm {natco: 'natco-hu'})-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:BusinessTerm {natco: 'natco-hu'})-[:EXPRESSED_AS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataDomain)-[:OWNS_MODEL]->(:DataModel)-[:CONTAINS_ENTITY]->(:DataEntity)-[:HAS_ATTRIBUTE]->(:DataAttribute)
  RETURN p
  UNION
  MATCH p = (:DataAttribute)-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataProduct {id: 'dp-customer-360'})-[:FEDERATES_FROM]->(:DataProduct {natco: 'natco-hu'})
  RETURN p
}
RETURN p LIMIT 200;

// ============================================================
// N5 — Poland end-to-end (natco-pl)
// ============================================================
CALL {
  MATCH p = (:DataProduct {natco: 'natco-pl'})-[:IMPLEMENTS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataProduct {natco: 'natco-pl'})-[:EXPOSES]->(:OutputPort)-[:GOVERNED_BY]->(:DataContract)-[:GOVERNS]->(:Table)
  RETURN p
  UNION
  MATCH p = (:DataProduct {natco: 'natco-pl'})-[:EXPOSES]->(:OutputPort)-[:BACKED_BY]->(:Table)
  RETURN p
  UNION
  MATCH p = (:DataContract {natco: 'natco-pl'})-[:CONTAINS_FIELD]->(:ContractField)-[:MAPS_TO_COLUMN]->(:Column)
  RETURN p
  UNION
  MATCH p = (:Table {natco: 'natco-pl'})-[:CONTAINS_COLUMN]->(:Column)-[:REPRESENTS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:System {natco: 'natco-pl'})-[:HAS_DATABASE]->(:Database)
    -[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(:Table {natco: 'natco-pl'})
  RETURN p
  UNION
  MATCH p = (:Namespace {slug: 'natco-pl'})-[:ALIGNS_TO]->(:Namespace {slug: 'global'})
  RETURN p
  UNION
  MATCH p = (:Namespace {slug: 'natco-pl'})-[:CONTAINS_CONCEPT]->(:Concept)-[:FEDERATES]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:Namespace {slug: 'global'})-[:CONTAINS_CONCEPT]->(:Concept {conceptId: 'Customer'})
  RETURN p
  UNION
  MATCH p = (:BusinessTerm {natco: 'natco-pl'})-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:BusinessTerm {natco: 'natco-pl'})-[:EXPRESSED_AS]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataDomain)-[:OWNS_MODEL]->(:DataModel)-[:CONTAINS_ENTITY]->(:DataEntity)-[:HAS_ATTRIBUTE]->(:DataAttribute)
  RETURN p
  UNION
  MATCH p = (:DataAttribute)-[:MAPS_TO]->(:Concept)
  RETURN p
  UNION
  MATCH p = (:DataProduct {id: 'dp-customer-360'})-[:FEDERATES_FROM]->(:DataProduct {natco: 'natco-pl'})
  RETURN p
}
RETURN p LIMIT 200;

// ============================================================
// O1 — Option A · Single Germany namespace · BUs co-steward (B2B/B2C/Network)
// ============================================================
CALL {
  MATCH p = (n:Namespace {optionId: 'A'})-[:CONTAINS_CONCEPT]->(:Concept {optionId: 'A'})
  RETURN p
  UNION
  MATCH p = (:Namespace {optionId: 'A', role: 'business_unit'})-[:SCOPED_TO|STEWARDS]->()
  RETURN p
  UNION
  MATCH p = (:ToolSemantic {optionId: 'A'})-[:BINDS_TO]->(:Concept {optionId: 'A'})
  RETURN p
  UNION
  MATCH p = (:Concept {optionId: 'A'})-[:FEDERATES]->(:Concept {optionId: 'A'})
  RETURN p
}
RETURN p,
       [n IN nodes(p) | coalesce(n.name, n.preferredLabel, n.slug, n.id)] AS assets,
       [r IN relationships(p) | type(r)] AS rels
LIMIT 100;

// ============================================================
// O3 — Option C · BU federated canonical (O2 retired — duplicate of C in graph shape)
// ============================================================
CALL {
  MATCH p = (:Namespace {optionId: 'C'})-[:CONTAINS_CONCEPT]->(:Concept {optionId: 'C'})
  RETURN p
  UNION
  MATCH p = (:Namespace {optionId: 'C', role: 'business_unit'})-[:SCOPED_TO]->(:Namespace {optionId: 'C'})
  RETURN p
  UNION
  MATCH p = (:Concept {optionId: 'C'})-[:FEDERATES]->(:Concept {optionId: 'C'})
  RETURN p
  UNION
  MATCH p = (:Concept {optionId: 'C'})-[:MAPS_TO]->(:Concept {optionId: 'C'})
  RETURN p
  UNION
  MATCH p = (:ToolSemantic {optionId: 'C'})-[:USES_NAMESPACE]->(:Namespace {optionId: 'C'})
  RETURN p
}
RETURN p,
       [n IN nodes(p) | coalesce(n.name, n.preferredLabel, n.slug, n.id)] AS assets,
       [r IN relationships(p) | type(r)] AS rels
LIMIT 200;
