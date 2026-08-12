// show-e2e-customer-360.cypher
// Paste ONE view at a time into Neo4j Browser (http://localhost:7474) — use Graph view for path queries
// Tip: Browser only draws edges for returned PATHs / relationships (bare nodes look disconnected).

// ============================================================
// VIEW G1 — GLOBAL hub: concepts · product · dual contracts · platform stack · columns
// ============================================================
MATCH pNs = (g:Namespace {slug: 'global'})-[:CONTAINS_CONCEPT]->(cCust:Concept {conceptId: 'Customer'})
MATCH pProps = (g)-[:CONTAINS_CONCEPT]->(cProp:Concept)
WHERE cProp.kind = 'shared_property'
OPTIONAL MATCH pTerm = (term:BusinessTerm {id: 'term-global-Customer'})-[:MAPS_TO]->(cCust)
OPTIONAL MATCH pEnt = (entity:DataEntity {id: 'entity-customer'})-[:MAPS_TO]->(cCust)
OPTIONAL MATCH pProd = (prod:DataProduct {id: 'dp-customer-360'})-[:IMPLEMENTS]->(cCust)
OPTIONAL MATCH pOut = (prod)-[:EXPOSES]->(out:OutputPort)-[:GOVERNED_BY]->(dc:DataContract)-[:GOVERNS]->(tblDp:Table {id: 'table-dp-customer-360'})
OPTIONAL MATCH pBack = (out)-[:BACKED_BY]->(tblDp)
OPTIONAL MATCH pPlat = (sysDp:System {id: 'sys-dp-platform'})-[:HAS_DATABASE]->(:Database)
  -[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(tblDp)
OPTIONAL MATCH pCols = (tblDp)-[:CONTAINS_COLUMN]->(colDp:Column)-[:REPRESENTS]->(cProp)
OPTIONAL MATCH pField = (dc)-[:CONTAINS_FIELD]->(field:ContractField)-[:MAPS_TO_COLUMN]->(colDp)
RETURN pNs, pProps, pTerm, pEnt, pProd, pOut, pBack, pPlat, pCols, pField;

// ============================================================
// VIEW G2 — ALIGNMENT: Global ↔ all NATCOs (graph)
// Left: each NATCO namespace/concepts  ·  Right: global SID hub
// Edges: ALIGNS_TO · FEDERATES · MAPS_TO · REPRESENTS
// ============================================================
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
RETURN pAlign, pFedEnt, pFedId, pGlobalEnt, pGlobalId, pTerm, pTermG, pTbl, pTblG, pCol, pColG, pProd, pConsume;

// ============================================================
// VIEW G3 — ALIGNMENT matrix + graph (NATCO asset → Global SID)
// ============================================================
MATCH pAlign = (ns:Namespace {kind: 'natco'})-[:ALIGNS_TO]->(g:Namespace {slug: 'global'})
MATCH pFedEnt = (ns)-[:CONTAINS_CONCEPT]->(ent:Concept {kind: 'entity'})-[:FEDERATES]->(cCust:Concept {conceptId: 'Customer'})
MATCH pFedId = (ns)-[:CONTAINS_CONCEPT]->(idn:Concept {kind: 'shared_property'})-[:FEDERATES]->(cId:Concept {conceptId: 'CustomerIdentification'})
OPTIONAL MATCH pTerm = (term:BusinessTerm)-[:EXPRESSED_AS]->(ent)
OPTIONAL MATCH pTermG = (term)-[:MAPS_TO]->(cCust)
OPTIONAL MATCH pTbl = (tbl:Table {natco: ns.slug})-[:REPRESENTS]->(ent)
OPTIONAL MATCH pTblG = (tbl)-[:REPRESENTS]->(cCust)
OPTIONAL MATCH pCol = (col:Column {natco: ns.slug})-[:REPRESENTS]->(idn)
OPTIONAL MATCH pColG = (col)-[:REPRESENTS]->(cId)
OPTIONAL MATCH pConsume = (prod:DataProduct {id: 'dp-customer-360'})-[:CONSUMES]->(inp:InputPort)-[:READS_FROM]->(tbl)
RETURN pAlign, pFedEnt, pFedId, pTerm, pTermG, pTbl, pTblG, pCol, pColG, pConsume,
       ns.displayName AS `NATCO`,
       ns.slug AS `NATCO namespace`,
       g.slug AS `Global namespace`,
       ent.preferredLabel AS `NATCO concept`,
       cCust.preferredLabel AS `Global concept (SID)`,
       idn.preferredLabel AS `NATCO id concept`,
       cId.preferredLabel AS `Global id (SID)`,
       term.name AS `Glossary`,
       tbl.fullyQualifiedName AS `NATCO table`,
       col.name AS `NATCO column`,
       inp.name AS `Product input`,
       prod.name AS `Global product`
ORDER BY `NATCO`;

// ============================================================
// VIEW G4 — Side-by-side: Global meaning vs one NATCO (Germany)
// Change slug for other countries: natco-at | natco-hr | natco-hu | natco-pl
// ============================================================
MATCH pAlign = (ns:Namespace {slug: 'natco-de'})-[:ALIGNS_TO]->(g:Namespace {slug: 'global'})
MATCH pFedEnt = (ns)-[:CONTAINS_CONCEPT]->(ent:Concept {kind: 'entity'})-[:FEDERATES]->(cCust:Concept {conceptId: 'Customer'})
MATCH pFedId = (ns)-[:CONTAINS_CONCEPT]->(idn:Concept {kind: 'shared_property'})-[:FEDERATES]->(cId:Concept {conceptId: 'CustomerIdentification'})
MATCH pGlobalEnt = (g)-[:CONTAINS_CONCEPT]->(cCust)
MATCH pGlobalId = (g)-[:CONTAINS_CONCEPT]->(cId)
OPTIONAL MATCH pTermLocal = (term:BusinessTerm)-[:EXPRESSED_AS]->(ent)
OPTIONAL MATCH pTermGlobal = (term)-[:MAPS_TO]->(cCust)
OPTIONAL MATCH pFedEdgeEnt = (ent)-[:FROM_CONCEPT]->(:FederationEdge)-[:TO_CONCEPT]->(cCust)
OPTIONAL MATCH pFedEdgeId = (idn)-[:FROM_CONCEPT]->(:FederationEdge)-[:TO_CONCEPT]->(cId)
OPTIONAL MATCH pTech = (:System {natco: 'natco-de'})-[:HAS_DATABASE]->(:Database)
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
       pTermLocal, pTermGlobal, pFedEdgeEnt, pFedEdgeId,
       pTech, pTblLocal, pTblGlobal, pColLocal, pColGlobal,
       pBizEnt, pBizAttr, pProd, pConsume, pOut, pCurated;

// ============================================================
// VIEW G5 — Alignment checklist (all NATCOs must be true)
// Graph paths + boolean matrix columns
// ============================================================
MATCH (ns:Namespace {kind: 'natco'})
OPTIONAL MATCH pAlign = (ns)-[:ALIGNS_TO]->(g:Namespace {slug: 'global'})
OPTIONAL MATCH pFedEnt = (ns)-[:CONTAINS_CONCEPT]->(ent:Concept {kind: 'entity'})-[:FEDERATES]->(cCust:Concept {conceptId: 'Customer'})
OPTIONAL MATCH pFedId = (ns)-[:CONTAINS_CONCEPT]->(idn:Concept {kind: 'shared_property'})-[:FEDERATES]->(cId:Concept {conceptId: 'CustomerIdentification'})
OPTIONAL MATCH pTerm = (term:BusinessTerm {id: 'term-' + ns.slug + '-customer'})-[:MAPS_TO]->(cCust)
OPTIONAL MATCH pTbl = (tbl:Table {natco: ns.slug})-[:REPRESENTS]->(cCust)
OPTIONAL MATCH pCol = (col:Column {natco: ns.slug})-[:REPRESENTS]->(cId)
OPTIONAL MATCH pConsume = (prod:DataProduct {id: 'dp-customer-360'})-[:CONSUMES]->(:InputPort)-[:READS_FROM]->(tbl)
RETURN pAlign, pFedEnt, pFedId, pTerm, pTbl, pCol, pConsume,
       ns.displayName AS natco,
       g IS NOT NULL AS alignsToGlobal,
       cCust IS NOT NULL AS conceptFederatesCustomer,
       cId IS NOT NULL AS idFederatesCustomerId,
       term IS NOT NULL AS glossaryMapsToGlobal,
       tbl IS NOT NULL AS tableRepresentsGlobal,
       col IS NOT NULL AS columnRepresentsGlobalId,
       prod IS NOT NULL AS productConsumesSource,
       (
         g IS NOT NULL AND cCust IS NOT NULL AND cId IS NOT NULL
         AND term IS NOT NULL AND tbl IS NOT NULL AND col IS NOT NULL AND prod IS NOT NULL
       ) AS aligned
ORDER BY natco;

// ============================================================
// VIEW E — Full NATCO stack + Global alignment (one country)
// Same as G4 but includes mapping records / contract detail
// Slugs: natco-de | natco-at | natco-hr | natco-hu | natco-pl
// ============================================================

// --- E1 Germany (natco-de) ---
MATCH pAlign = (ns:Namespace {slug: 'natco-de'})-[:ALIGNS_TO]->(g:Namespace {slug: 'global'})
MATCH pFedEnt = (ns)-[:CONTAINS_CONCEPT]->(ent:Concept {kind: 'entity'})-[:FEDERATES]->(cCust:Concept {conceptId: 'Customer'})
MATCH pFedId = (ns)-[:CONTAINS_CONCEPT]->(idn:Concept {kind: 'shared_property'})-[:FEDERATES]->(cId:Concept {conceptId: 'CustomerIdentification'})
MATCH pGlobalEnt = (g)-[:CONTAINS_CONCEPT]->(cCust)
MATCH pGlobalId = (g)-[:CONTAINS_CONCEPT]->(cId)
OPTIONAL MATCH pTermLocal = (term:BusinessTerm)-[:EXPRESSED_AS]->(ent)
OPTIONAL MATCH pTermGlobal = (term)-[:MAPS_TO]->(cCust)
OPTIONAL MATCH pFedEdgeEnt = (ent)-[:FROM_CONCEPT]->(:FederationEdge)-[:TO_CONCEPT]->(cCust)
OPTIONAL MATCH pFedEdgeId = (idn)-[:FROM_CONCEPT]->(:FederationEdge)-[:TO_CONCEPT]->(cId)
OPTIONAL MATCH pTech = (:System {natco: 'natco-de'})-[:HAS_DATABASE]->(:Database)
  -[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(tbl:Table)-[:CONTAINS_COLUMN]->(col:Column)
OPTIONAL MATCH pTblLocal = (tbl)-[:REPRESENTS]->(ent)
OPTIONAL MATCH pTblGlobal = (tbl)-[:REPRESENTS]->(cCust)
OPTIONAL MATCH pColLocal = (col)-[:REPRESENTS]->(idn)
OPTIONAL MATCH pColGlobal = (col)-[:REPRESENTS]->(cId)
OPTIONAL MATCH pConsume = (prod:DataProduct)-[:CONSUMES]->(inp:InputPort)-[:READS_FROM]->(tbl)
OPTIONAL MATCH pExpose = (prod)-[:EXPOSES]->(out:OutputPort)-[:BACKED_BY]->(tblDp:Table {id: 'table-dp-customer-360'})
OPTIONAL MATCH pContract = (out)-[:GOVERNED_BY]->(:DataContract)-[:CONTAINS_FIELD]->(field:ContractField)
OPTIONAL MATCH pProdImpl = (prod)-[:IMPLEMENTS]->(cCust)
OPTIONAL MATCH pFieldImpl = (field)-[:IMPLEMENTS]->(cId)
OPTIONAL MATCH pFieldCol = (field)-[:MAPS_TO_COLUMN]->(:Column {id: 'col-dp-customer-id'})-[:REPRESENTS]->(cId)
OPTIONAL MATCH pEntityTbl = (:DataEntity {id: 'entity-customer'})-[:IMPLEMENTED_IN]->(tbl)
OPTIONAL MATCH pAttrCol = (:DataAttribute {id: 'attr-customer-id'})-[:IMPLEMENTED_BY]->(col)
OPTIONAL MATCH pMapTerm = (mapTerm:MappingRecord)-[:SOURCE]->(term)
OPTIONAL MATCH pMapTermT = (mapTerm)-[:TARGET]->(cCust)
OPTIONAL MATCH pMapTbl = (mapTbl:MappingRecord)-[:SOURCE]->(tbl)
OPTIONAL MATCH pMapTblT = (mapTbl)-[:TARGET]->(cCust)
OPTIONAL MATCH pMapCol = (mapCol:MappingRecord)-[:SOURCE]->(col)
OPTIONAL MATCH pMapColT = (mapCol)-[:TARGET]->(cId)
RETURN pAlign, pFedEnt, pFedId, pGlobalEnt, pGlobalId,
       pTermLocal, pTermGlobal, pFedEdgeEnt, pFedEdgeId,
       pTech, pTblLocal, pTblGlobal, pColLocal, pColGlobal,
       pConsume, pExpose, pContract, pProdImpl, pFieldImpl, pFieldCol,
       pEntityTbl, pAttrCol,
       pMapTerm, pMapTermT, pMapTbl, pMapTblT, pMapCol, pMapColT;

// --- E2 Austria (natco-at) ---
MATCH pAlign = (ns:Namespace {slug: 'natco-at'})-[:ALIGNS_TO]->(g:Namespace {slug: 'global'})
MATCH pFedEnt = (ns)-[:CONTAINS_CONCEPT]->(ent:Concept {kind: 'entity'})-[:FEDERATES]->(cCust:Concept {conceptId: 'Customer'})
MATCH pFedId = (ns)-[:CONTAINS_CONCEPT]->(idn:Concept {kind: 'shared_property'})-[:FEDERATES]->(cId:Concept {conceptId: 'CustomerIdentification'})
MATCH pGlobalEnt = (g)-[:CONTAINS_CONCEPT]->(cCust)
MATCH pGlobalId = (g)-[:CONTAINS_CONCEPT]->(cId)
OPTIONAL MATCH pTermLocal = (term:BusinessTerm)-[:EXPRESSED_AS]->(ent)
OPTIONAL MATCH pTermGlobal = (term)-[:MAPS_TO]->(cCust)
OPTIONAL MATCH pFedEdgeEnt = (ent)-[:FROM_CONCEPT]->(:FederationEdge)-[:TO_CONCEPT]->(cCust)
OPTIONAL MATCH pFedEdgeId = (idn)-[:FROM_CONCEPT]->(:FederationEdge)-[:TO_CONCEPT]->(cId)
OPTIONAL MATCH pTech = (:System {natco: 'natco-at'})-[:HAS_DATABASE]->(:Database)
  -[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(tbl:Table)-[:CONTAINS_COLUMN]->(col:Column)
OPTIONAL MATCH pTblLocal = (tbl)-[:REPRESENTS]->(ent)
OPTIONAL MATCH pTblGlobal = (tbl)-[:REPRESENTS]->(cCust)
OPTIONAL MATCH pColLocal = (col)-[:REPRESENTS]->(idn)
OPTIONAL MATCH pColGlobal = (col)-[:REPRESENTS]->(cId)
OPTIONAL MATCH pConsume = (prod:DataProduct)-[:CONSUMES]->(inp:InputPort)-[:READS_FROM]->(tbl)
OPTIONAL MATCH pExpose = (prod)-[:EXPOSES]->(out:OutputPort)-[:BACKED_BY]->(tblDp:Table {id: 'table-dp-customer-360'})
OPTIONAL MATCH pContract = (out)-[:GOVERNED_BY]->(:DataContract)-[:CONTAINS_FIELD]->(field:ContractField)
OPTIONAL MATCH pProdImpl = (prod)-[:IMPLEMENTS]->(cCust)
OPTIONAL MATCH pFieldImpl = (field)-[:IMPLEMENTS]->(cId)
OPTIONAL MATCH pFieldCol = (field)-[:MAPS_TO_COLUMN]->(:Column {id: 'col-dp-customer-id'})-[:REPRESENTS]->(cId)
OPTIONAL MATCH pEntityTbl = (:DataEntity {id: 'entity-customer'})-[:IMPLEMENTED_IN]->(tbl)
OPTIONAL MATCH pAttrCol = (:DataAttribute {id: 'attr-customer-id'})-[:IMPLEMENTED_BY]->(col)
OPTIONAL MATCH pMapTerm = (mapTerm:MappingRecord)-[:SOURCE]->(term)
OPTIONAL MATCH pMapTermT = (mapTerm)-[:TARGET]->(cCust)
OPTIONAL MATCH pMapTbl = (mapTbl:MappingRecord)-[:SOURCE]->(tbl)
OPTIONAL MATCH pMapTblT = (mapTbl)-[:TARGET]->(cCust)
OPTIONAL MATCH pMapCol = (mapCol:MappingRecord)-[:SOURCE]->(col)
OPTIONAL MATCH pMapColT = (mapCol)-[:TARGET]->(cId)
RETURN pAlign, pFedEnt, pFedId, pGlobalEnt, pGlobalId,
       pTermLocal, pTermGlobal, pFedEdgeEnt, pFedEdgeId,
       pTech, pTblLocal, pTblGlobal, pColLocal, pColGlobal,
       pConsume, pExpose, pContract, pProdImpl, pFieldImpl, pFieldCol,
       pEntityTbl, pAttrCol,
       pMapTerm, pMapTermT, pMapTbl, pMapTblT, pMapCol, pMapColT;

// --- E3 Croatia (natco-hr) ---
MATCH pAlign = (ns:Namespace {slug: 'natco-hr'})-[:ALIGNS_TO]->(g:Namespace {slug: 'global'})
MATCH pFedEnt = (ns)-[:CONTAINS_CONCEPT]->(ent:Concept {kind: 'entity'})-[:FEDERATES]->(cCust:Concept {conceptId: 'Customer'})
MATCH pFedId = (ns)-[:CONTAINS_CONCEPT]->(idn:Concept {kind: 'shared_property'})-[:FEDERATES]->(cId:Concept {conceptId: 'CustomerIdentification'})
MATCH pGlobalEnt = (g)-[:CONTAINS_CONCEPT]->(cCust)
MATCH pGlobalId = (g)-[:CONTAINS_CONCEPT]->(cId)
OPTIONAL MATCH pTermLocal = (term:BusinessTerm)-[:EXPRESSED_AS]->(ent)
OPTIONAL MATCH pTermGlobal = (term)-[:MAPS_TO]->(cCust)
OPTIONAL MATCH pFedEdgeEnt = (ent)-[:FROM_CONCEPT]->(:FederationEdge)-[:TO_CONCEPT]->(cCust)
OPTIONAL MATCH pFedEdgeId = (idn)-[:FROM_CONCEPT]->(:FederationEdge)-[:TO_CONCEPT]->(cId)
OPTIONAL MATCH pTech = (:System {natco: 'natco-hr'})-[:HAS_DATABASE]->(:Database)
  -[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(tbl:Table)-[:CONTAINS_COLUMN]->(col:Column)
OPTIONAL MATCH pTblLocal = (tbl)-[:REPRESENTS]->(ent)
OPTIONAL MATCH pTblGlobal = (tbl)-[:REPRESENTS]->(cCust)
OPTIONAL MATCH pColLocal = (col)-[:REPRESENTS]->(idn)
OPTIONAL MATCH pColGlobal = (col)-[:REPRESENTS]->(cId)
OPTIONAL MATCH pConsume = (prod:DataProduct)-[:CONSUMES]->(inp:InputPort)-[:READS_FROM]->(tbl)
OPTIONAL MATCH pExpose = (prod)-[:EXPOSES]->(out:OutputPort)-[:BACKED_BY]->(tblDp:Table {id: 'table-dp-customer-360'})
OPTIONAL MATCH pContract = (out)-[:GOVERNED_BY]->(:DataContract)-[:CONTAINS_FIELD]->(field:ContractField)
OPTIONAL MATCH pProdImpl = (prod)-[:IMPLEMENTS]->(cCust)
OPTIONAL MATCH pFieldImpl = (field)-[:IMPLEMENTS]->(cId)
OPTIONAL MATCH pFieldCol = (field)-[:MAPS_TO_COLUMN]->(:Column {id: 'col-dp-customer-id'})-[:REPRESENTS]->(cId)
OPTIONAL MATCH pEntityTbl = (:DataEntity {id: 'entity-customer'})-[:IMPLEMENTED_IN]->(tbl)
OPTIONAL MATCH pAttrCol = (:DataAttribute {id: 'attr-customer-id'})-[:IMPLEMENTED_BY]->(col)
OPTIONAL MATCH pMapTerm = (mapTerm:MappingRecord)-[:SOURCE]->(term)
OPTIONAL MATCH pMapTermT = (mapTerm)-[:TARGET]->(cCust)
OPTIONAL MATCH pMapTbl = (mapTbl:MappingRecord)-[:SOURCE]->(tbl)
OPTIONAL MATCH pMapTblT = (mapTbl)-[:TARGET]->(cCust)
OPTIONAL MATCH pMapCol = (mapCol:MappingRecord)-[:SOURCE]->(col)
OPTIONAL MATCH pMapColT = (mapCol)-[:TARGET]->(cId)
RETURN pAlign, pFedEnt, pFedId, pGlobalEnt, pGlobalId,
       pTermLocal, pTermGlobal, pFedEdgeEnt, pFedEdgeId,
       pTech, pTblLocal, pTblGlobal, pColLocal, pColGlobal,
       pConsume, pExpose, pContract, pProdImpl, pFieldImpl, pFieldCol,
       pEntityTbl, pAttrCol,
       pMapTerm, pMapTermT, pMapTbl, pMapTblT, pMapCol, pMapColT;

// --- E4 Hungary (natco-hu) ---
MATCH pAlign = (ns:Namespace {slug: 'natco-hu'})-[:ALIGNS_TO]->(g:Namespace {slug: 'global'})
MATCH pFedEnt = (ns)-[:CONTAINS_CONCEPT]->(ent:Concept {kind: 'entity'})-[:FEDERATES]->(cCust:Concept {conceptId: 'Customer'})
MATCH pFedId = (ns)-[:CONTAINS_CONCEPT]->(idn:Concept {kind: 'shared_property'})-[:FEDERATES]->(cId:Concept {conceptId: 'CustomerIdentification'})
MATCH pGlobalEnt = (g)-[:CONTAINS_CONCEPT]->(cCust)
MATCH pGlobalId = (g)-[:CONTAINS_CONCEPT]->(cId)
OPTIONAL MATCH pTermLocal = (term:BusinessTerm)-[:EXPRESSED_AS]->(ent)
OPTIONAL MATCH pTermGlobal = (term)-[:MAPS_TO]->(cCust)
OPTIONAL MATCH pFedEdgeEnt = (ent)-[:FROM_CONCEPT]->(:FederationEdge)-[:TO_CONCEPT]->(cCust)
OPTIONAL MATCH pFedEdgeId = (idn)-[:FROM_CONCEPT]->(:FederationEdge)-[:TO_CONCEPT]->(cId)
OPTIONAL MATCH pTech = (:System {natco: 'natco-hu'})-[:HAS_DATABASE]->(:Database)
  -[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(tbl:Table)-[:CONTAINS_COLUMN]->(col:Column)
OPTIONAL MATCH pTblLocal = (tbl)-[:REPRESENTS]->(ent)
OPTIONAL MATCH pTblGlobal = (tbl)-[:REPRESENTS]->(cCust)
OPTIONAL MATCH pColLocal = (col)-[:REPRESENTS]->(idn)
OPTIONAL MATCH pColGlobal = (col)-[:REPRESENTS]->(cId)
OPTIONAL MATCH pConsume = (prod:DataProduct)-[:CONSUMES]->(inp:InputPort)-[:READS_FROM]->(tbl)
OPTIONAL MATCH pExpose = (prod)-[:EXPOSES]->(out:OutputPort)-[:BACKED_BY]->(tblDp:Table {id: 'table-dp-customer-360'})
OPTIONAL MATCH pContract = (out)-[:GOVERNED_BY]->(:DataContract)-[:CONTAINS_FIELD]->(field:ContractField)
OPTIONAL MATCH pProdImpl = (prod)-[:IMPLEMENTS]->(cCust)
OPTIONAL MATCH pFieldImpl = (field)-[:IMPLEMENTS]->(cId)
OPTIONAL MATCH pFieldCol = (field)-[:MAPS_TO_COLUMN]->(:Column {id: 'col-dp-customer-id'})-[:REPRESENTS]->(cId)
OPTIONAL MATCH pEntityTbl = (:DataEntity {id: 'entity-customer'})-[:IMPLEMENTED_IN]->(tbl)
OPTIONAL MATCH pAttrCol = (:DataAttribute {id: 'attr-customer-id'})-[:IMPLEMENTED_BY]->(col)
OPTIONAL MATCH pMapTerm = (mapTerm:MappingRecord)-[:SOURCE]->(term)
OPTIONAL MATCH pMapTermT = (mapTerm)-[:TARGET]->(cCust)
OPTIONAL MATCH pMapTbl = (mapTbl:MappingRecord)-[:SOURCE]->(tbl)
OPTIONAL MATCH pMapTblT = (mapTbl)-[:TARGET]->(cCust)
OPTIONAL MATCH pMapCol = (mapCol:MappingRecord)-[:SOURCE]->(col)
OPTIONAL MATCH pMapColT = (mapCol)-[:TARGET]->(cId)
RETURN pAlign, pFedEnt, pFedId, pGlobalEnt, pGlobalId,
       pTermLocal, pTermGlobal, pFedEdgeEnt, pFedEdgeId,
       pTech, pTblLocal, pTblGlobal, pColLocal, pColGlobal,
       pConsume, pExpose, pContract, pProdImpl, pFieldImpl, pFieldCol,
       pEntityTbl, pAttrCol,
       pMapTerm, pMapTermT, pMapTbl, pMapTblT, pMapCol, pMapColT;

// --- E5 Poland (natco-pl) ---
MATCH pAlign = (ns:Namespace {slug: 'natco-pl'})-[:ALIGNS_TO]->(g:Namespace {slug: 'global'})
MATCH pFedEnt = (ns)-[:CONTAINS_CONCEPT]->(ent:Concept {kind: 'entity'})-[:FEDERATES]->(cCust:Concept {conceptId: 'Customer'})
MATCH pFedId = (ns)-[:CONTAINS_CONCEPT]->(idn:Concept {kind: 'shared_property'})-[:FEDERATES]->(cId:Concept {conceptId: 'CustomerIdentification'})
MATCH pGlobalEnt = (g)-[:CONTAINS_CONCEPT]->(cCust)
MATCH pGlobalId = (g)-[:CONTAINS_CONCEPT]->(cId)
OPTIONAL MATCH pTermLocal = (term:BusinessTerm)-[:EXPRESSED_AS]->(ent)
OPTIONAL MATCH pTermGlobal = (term)-[:MAPS_TO]->(cCust)
OPTIONAL MATCH pFedEdgeEnt = (ent)-[:FROM_CONCEPT]->(:FederationEdge)-[:TO_CONCEPT]->(cCust)
OPTIONAL MATCH pFedEdgeId = (idn)-[:FROM_CONCEPT]->(:FederationEdge)-[:TO_CONCEPT]->(cId)
OPTIONAL MATCH pTech = (:System {natco: 'natco-pl'})-[:HAS_DATABASE]->(:Database)
  -[:HAS_SCHEMA]->(:Schema)-[:CONTAINS_TABLE]->(tbl:Table)-[:CONTAINS_COLUMN]->(col:Column)
OPTIONAL MATCH pTblLocal = (tbl)-[:REPRESENTS]->(ent)
OPTIONAL MATCH pTblGlobal = (tbl)-[:REPRESENTS]->(cCust)
OPTIONAL MATCH pColLocal = (col)-[:REPRESENTS]->(idn)
OPTIONAL MATCH pColGlobal = (col)-[:REPRESENTS]->(cId)
OPTIONAL MATCH pConsume = (prod:DataProduct)-[:CONSUMES]->(inp:InputPort)-[:READS_FROM]->(tbl)
OPTIONAL MATCH pExpose = (prod)-[:EXPOSES]->(out:OutputPort)-[:BACKED_BY]->(tblDp:Table {id: 'table-dp-customer-360'})
OPTIONAL MATCH pContract = (out)-[:GOVERNED_BY]->(:DataContract)-[:CONTAINS_FIELD]->(field:ContractField)
OPTIONAL MATCH pProdImpl = (prod)-[:IMPLEMENTS]->(cCust)
OPTIONAL MATCH pFieldImpl = (field)-[:IMPLEMENTS]->(cId)
OPTIONAL MATCH pFieldCol = (field)-[:MAPS_TO_COLUMN]->(:Column {id: 'col-dp-customer-id'})-[:REPRESENTS]->(cId)
OPTIONAL MATCH pEntityTbl = (:DataEntity {id: 'entity-customer'})-[:IMPLEMENTED_IN]->(tbl)
OPTIONAL MATCH pAttrCol = (:DataAttribute {id: 'attr-customer-id'})-[:IMPLEMENTED_BY]->(col)
OPTIONAL MATCH pMapTerm = (mapTerm:MappingRecord)-[:SOURCE]->(term)
OPTIONAL MATCH pMapTermT = (mapTerm)-[:TARGET]->(cCust)
OPTIONAL MATCH pMapTbl = (mapTbl:MappingRecord)-[:SOURCE]->(tbl)
OPTIONAL MATCH pMapTblT = (mapTbl)-[:TARGET]->(cCust)
OPTIONAL MATCH pMapCol = (mapCol:MappingRecord)-[:SOURCE]->(col)
OPTIONAL MATCH pMapColT = (mapCol)-[:TARGET]->(cId)
RETURN pAlign, pFedEnt, pFedId, pGlobalEnt, pGlobalId,
       pTermLocal, pTermGlobal, pFedEdgeEnt, pFedEdgeId,
       pTech, pTblLocal, pTblGlobal, pColLocal, pColGlobal,
       pConsume, pExpose, pContract, pProdImpl, pFieldImpl, pFieldCol,
       pEntityTbl, pAttrCol,
       pMapTerm, pMapTermT, pMapTbl, pMapTblT, pMapCol, pMapColT;
