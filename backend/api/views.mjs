/**
 * Curated Cypher views for the Semantics showcase.
 * Adapted from backend/neo4j/cypher/show-e2e-customer-360.cypher (path RETURNS).
 */

export const KG_VIEWS = {
  'global-hub': {
    id: 'global-hub',
    title: 'Global hub',
    description: 'TM Forum SID namespace · Customer · product · curated table',
    params: {},
    cypher: `
MATCH pNs = (g:Namespace {slug: 'global'})-[:CONTAINS_CONCEPT]->(cCust:Concept {conceptId: 'Customer'})
MATCH pId = (g)-[:CONTAINS_CONCEPT]->(cId:Concept {conceptId: 'CustomerIdentification'})
OPTIONAL MATCH pTerm = (term:BusinessTerm {id: 'term-global-Customer'})-[:MAPS_TO]->(cCust)
OPTIONAL MATCH pEnt = (entity:DataEntity {id: 'entity-customer'})-[:MAPS_TO]->(cCust)
OPTIONAL MATCH pAttr = (attr:DataAttribute {id: 'attr-customer-id'})-[:MAPS_TO]->(cId)
OPTIONAL MATCH pProd = (prod:DataProduct {id: 'dp-customer-360'})-[:IMPLEMENTS]->(cCust)
OPTIONAL MATCH pOut = (prod)-[:EXPOSES]->(out:OutputPort)-[:BACKED_BY]->(tblDp:Table {id: 'table-dp-customer-360'})
OPTIONAL MATCH pCol = (tblDp)-[:CONTAINS_COLUMN]->(colDp:Column {id: 'col-dp-customer-id'})-[:REPRESENTS]->(cId)
OPTIONAL MATCH pTbl = (tblDp)-[:REPRESENTS]->(cCust)
OPTIONAL MATCH pContract = (out)-[:GOVERNED_BY]->(:DataContract)-[:CONTAINS_FIELD]->(field:ContractField)-[:IMPLEMENTS]->(cId)
RETURN pNs, pId, pTerm, pEnt, pAttr, pProd, pOut, pCol, pTbl, pContract
`,
  },

  alignment: {
    id: 'alignment',
    title: 'Global ↔ all NATCOs',
    description: 'ALIGNS_TO · FEDERATES · MAPS_TO · REPRESENTS across DE/AT/HR/HU/PL',
    params: {},
    cypher: `
MATCH pAlign = (ns:Namespace {kind: 'natco'})-[:ALIGNS_TO]->(g:Namespace {slug: 'global'})
MATCH pFedEnt = (ns)-[:CONTAINS_CONCEPT]->(ent:Concept {kind: 'entity'})-[:FEDERATES]->(cCust:Concept {conceptId: 'Customer'})
MATCH pFedId = (ns)-[:CONTAINS_CONCEPT]->(idn:Concept {kind: 'shared_property'})-[:FEDERATES]->(cId:Concept {conceptId: 'CustomerIdentification'})
MATCH pGlobalEnt = (g)-[:CONTAINS_CONCEPT]->(cCust)
MATCH pGlobalId = (g)-[:CONTAINS_CONCEPT]->(cId)
OPTIONAL MATCH pTerm = (term:BusinessTerm)-[:EXPRESSED_AS]->(ent)
OPTIONAL MATCH pTermG = (term)-[:MAPS_TO]->(cCust)
OPTIONAL MATCH pTbl = (tbl:Table)-[:REPRESENTS]->(ent)
OPTIONAL MATCH pTblG = (tbl)-[:REPRESENTS]->(cCust)
OPTIONAL MATCH pCol = (col:Column)-[:REPRESENTS]->(idn)
OPTIONAL MATCH pColG = (col)-[:REPRESENTS]->(cId)
OPTIONAL MATCH pProd = (prod:DataProduct {id: 'dp-customer-360'})-[:IMPLEMENTS]->(cCust)
OPTIONAL MATCH pConsume = (prod)-[:CONSUMES]->(:InputPort)-[:READS_FROM]->(tbl)
WHERE (tbl IS NULL OR tbl.natco = ns.slug)
  AND (col IS NULL OR col.natco = ns.slug)
RETURN pAlign, pFedEnt, pFedId, pGlobalEnt, pGlobalId, pTerm, pTermG, pTbl, pTblG, pCol, pColG, pProd, pConsume
`,
  },

  'natco-stack': {
    id: 'natco-stack',
    title: 'NATCO stack',
    description: 'One country end-to-end vs Global SID (default Germany)',
    params: { natco: 'natco-de' },
    cypher: `
MATCH pAlign = (ns:Namespace {slug: $natco})-[:ALIGNS_TO]->(g:Namespace {slug: 'global'})
MATCH pFedEnt = (ns)-[:CONTAINS_CONCEPT]->(ent:Concept {kind: 'entity'})-[:FEDERATES]->(cCust:Concept {conceptId: 'Customer'})
MATCH pFedId = (ns)-[:CONTAINS_CONCEPT]->(idn:Concept {kind: 'shared_property'})-[:FEDERATES]->(cId:Concept {conceptId: 'CustomerIdentification'})
MATCH pGlobalEnt = (g)-[:CONTAINS_CONCEPT]->(cCust)
MATCH pGlobalId = (g)-[:CONTAINS_CONCEPT]->(cId)
OPTIONAL MATCH pTermLocal = (term:BusinessTerm)-[:EXPRESSED_AS]->(ent)
OPTIONAL MATCH pTermGlobal = (term)-[:MAPS_TO]->(cCust)
OPTIONAL MATCH pTech = (:System {natco: $natco})-[:HAS_DATABASE]->(:Database)
  -[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(tbl:Table)-[:CONTAINS_COLUMN]->(col:Column)
OPTIONAL MATCH pTblLocal = (tbl)-[:REPRESENTS]->(ent)
OPTIONAL MATCH pTblGlobal = (tbl)-[:REPRESENTS]->(cCust)
OPTIONAL MATCH pColLocal = (col)-[:REPRESENTS]->(idn)
OPTIONAL MATCH pColGlobal = (col)-[:REPRESENTS]->(cId)
OPTIONAL MATCH pBizEnt = (:DataEntity {id: 'entity-customer'})-[:IMPLEMENTED_IN]->(tbl)
OPTIONAL MATCH pBizAttr = (:DataAttribute {id: 'attr-customer-id'})-[:IMPLEMENTED_BY]->(col)
OPTIONAL MATCH pProd = (prod:DataProduct {id: 'dp-customer-360'})-[:IMPLEMENTS]->(cCust)
OPTIONAL MATCH pConsume = (prod)-[:CONSUMES]->(:InputPort)-[:READS_FROM]->(tbl)
OPTIONAL MATCH pOut = (prod)-[:EXPOSES]->(:OutputPort)-[:BACKED_BY]->(tblDp:Table {id: 'table-dp-customer-360'})
OPTIONAL MATCH pCurated = (tblDp)-[:REPRESENTS]->(cCust)
RETURN pAlign, pFedEnt, pFedId, pGlobalEnt, pGlobalId,
       pTermLocal, pTermGlobal, pTech, pTblLocal, pTblGlobal, pColLocal, pColGlobal,
       pBizEnt, pBizAttr, pProd, pConsume, pOut, pCurated
`,
  },

  'product-path': {
    id: 'product-path',
    title: 'Product path',
    description: 'Customer 360 implements SID and consumes NATCO sources',
    params: {},
    cypher: `
MATCH pImpl = (prod:DataProduct {id: 'dp-customer-360'})-[:IMPLEMENTS]->(cCust:Concept {conceptId: 'Customer'})
MATCH pOut = (prod)-[:EXPOSES]->(out:OutputPort)-[:BACKED_BY]->(tblDp:Table {id: 'table-dp-customer-360'})
OPTIONAL MATCH pGov = (out)-[:GOVERNED_BY]->(dc:DataContract)-[:CONTAINS_FIELD]->(field:ContractField)-[:IMPLEMENTS]->(cId:Concept {conceptId: 'CustomerIdentification'})
OPTIONAL MATCH pCol = (tblDp)-[:CONTAINS_COLUMN]->(colDp:Column)-[:REPRESENTS]->(cId)
OPTIONAL MATCH pTbl = (tblDp)-[:REPRESENTS]->(cCust)
OPTIONAL MATCH pIn = (prod)-[:CONSUMES]->(inp:InputPort)-[:READS_FROM]->(tbl:Table)
OPTIONAL MATCH pRep = (tbl)-[:REPRESENTS]->(cCust)
OPTIONAL MATCH pNs = (:Namespace {slug: 'global'})-[:CONTAINS_CONCEPT]->(cCust)
RETURN pImpl, pOut, pGov, pCol, pTbl, pIn, pRep, pNs
`,
  },
}

export const VIEW_CATALOG = Object.values(KG_VIEWS).map(({ id, title, description, params }) => ({
  id,
  title,
  description,
  params: Object.keys(params),
}))
