// verify-country-flows.cypher
// Expect every checklist column = true for all 5 NATCOs

UNWIND ['natco-de','natco-at','natco-hr','natco-hu','natco-pl'] AS slug
OPTIONAL MATCH (ns:Namespace {slug: slug})-[:ALIGNS_TO]->(:Namespace {slug: 'global'})
OPTIONAL MATCH (ns)-[:CONTAINS_CONCEPT]->(ent:Concept {kind: 'entity'})-[:FEDERATES]->(cCust:Concept {conceptId: 'Customer'})
OPTIONAL MATCH (ns)-[:CONTAINS_CONCEPT]->(idn:Concept {kind: 'shared_property'})-[:FEDERATES]->(cId:Concept {conceptId: 'CustomerIdentification'})
OPTIONAL MATCH (ent)-[:FROM_CONCEPT]->(fedE:FederationEdge)-[:TO_CONCEPT]->(cCust)
OPTIONAL MATCH (idn)-[:FROM_CONCEPT]->(fedI:FederationEdge)-[:TO_CONCEPT]->(cId)
OPTIONAL MATCH (term:BusinessTerm {natco: slug})-[:MAPS_TO]->(cCust)
OPTIONAL MATCH (term)-[:EXPRESSED_AS]->(ent)
OPTIONAL MATCH (mapTerm:MappingRecord {id: 'map-' + slug + '-term-Customer'})
OPTIONAL MATCH (sys:System {natco: slug})-[:HAS_DATABASE]->(:Database)
  -[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(tbl:Table {natco: slug})
  -[:CONTAINS_COLUMN]->(col:Column {natco: slug})
OPTIONAL MATCH (tbl)-[:REPRESENTS]->(ent)
OPTIONAL MATCH (col)-[:REPRESENTS]->(idn)
OPTIONAL MATCH (tbl)-[:REPRESENTS]->(cCust)
OPTIONAL MATCH (col)-[:REPRESENTS]->(cId)
OPTIONAL MATCH (mapTbl:MappingRecord {id: 'map-' + slug + '-table-Customer'})
OPTIONAL MATCH (mapCol:MappingRecord {id: 'map-' + slug + '-column-CustomerIdentification'})
OPTIONAL MATCH (entity:DataEntity {id: 'entity-customer'})-[:IMPLEMENTED_IN]->(tbl)
OPTIONAL MATCH (attr:DataAttribute {id: 'attr-customer-id'})-[:IMPLEMENTED_BY]->(col)
OPTIONAL MATCH (prod:DataProduct {id: 'dp-customer-360'})-[:CONSUMES]->(inp:InputPort)-[:READS_FROM]->(tbl)
OPTIONAL MATCH (prod)-[:EXPOSES]->(out:OutputPort)-[:BACKED_BY]->(tblDp:Table {id: 'table-dp-customer-360'})
OPTIONAL MATCH (out)-[:GOVERNED_BY]->(:DataContract)-[:CONTAINS_FIELD]->(field:ContractField)
RETURN slug AS country,
       ns IS NOT NULL AS alignsToGlobal,
       fedE IS NOT NULL AND fedI IS NOT NULL AS federationEdges,
       term IS NOT NULL AS glossaryTerm,
       mapTerm IS NOT NULL AS mappingTerm,
       sys IS NOT NULL AND tbl IS NOT NULL AND col IS NOT NULL AS technicalHierarchy,
       mapTbl IS NOT NULL AND mapCol IS NOT NULL AS mappingTechnical,
       entity IS NOT NULL AND attr IS NOT NULL AS businessImplementedInLocal,
       inp IS NOT NULL AS productConsumesLocal,
       out IS NOT NULL AND field IS NOT NULL AS productOutputContract,
       (
         ns IS NOT NULL AND fedE IS NOT NULL AND fedI IS NOT NULL AND term IS NOT NULL
         AND mapTerm IS NOT NULL AND sys IS NOT NULL AND tbl IS NOT NULL AND col IS NOT NULL
         AND mapTbl IS NOT NULL AND mapCol IS NOT NULL AND entity IS NOT NULL AND attr IS NOT NULL
         AND inp IS NOT NULL AND out IS NOT NULL AND field IS NOT NULL
       ) AS complete
ORDER BY country;
