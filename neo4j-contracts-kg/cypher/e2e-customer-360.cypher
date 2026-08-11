// e2e-customer-360.cypher
// Multi-NATCO Customer 360 — full pack lineage sample
// Packs: Semantic Control Plane · Business Catalog · Technical Catalog · Data Products
// Lineage:
//   System → Database → Schema → Table → Column → Concept
//   DataProduct → OutputPort → DataContract → ContractField → Column → Concept
//   DataProduct → InputPort → Table (NATCO) → … → System stack
//   Namespace / BusinessTerm / DataEntity / DataAttribute bridges

// ========== 1. Global namespace + TM Forum SID concepts ==========
MERGE (ns:Namespace {id: 'ns-global'})
SET ns.slug = 'global',
    ns.displayName = 'Enterprise Global (TM Forum SID)',
    ns.kind = 'global',
    ns.uriBase = 'https://semantics.example/ns/global/',
    ns.naming = 'tmforum-sid',
    ns.status = 'active',
    ns.owner = 'Global Semantic COE',
    ns.pack = 'semantic-control-plane'

MERGE (cCust:Concept {id: 'concept-global-Customer'})
SET cCust.conceptId = 'Customer', cCust.uri = 'https://semantics.example/ns/global/Customer',
    cCust.kind = 'entity', cCust.preferredLabel = 'Customer',
    cCust.description = 'TM Forum SID Customer', cCust.bootstrapSource = 'tmforum-sid',
    cCust.status = 'approved', cCust.pack = 'semantic-control-plane'

MERGE (cId:Concept {id: 'concept-global-CustomerIdentification'})
SET cId.conceptId = 'CustomerIdentification',
    cId.uri = 'https://semantics.example/ns/global/CustomerIdentification',
    cId.kind = 'shared_property', cId.preferredLabel = 'Customer Identification',
    cId.status = 'approved', cId.pack = 'semantic-control-plane'

MERGE (cName:Concept {id: 'concept-global-CustomerName'})
SET cName.conceptId = 'CustomerName', cName.uri = 'https://semantics.example/ns/global/CustomerName',
    cName.kind = 'shared_property', cName.preferredLabel = 'Customer Name',
    cName.status = 'approved', cName.pack = 'semantic-control-plane'

MERGE (cEmail:Concept {id: 'concept-global-CustomerEmail'})
SET cEmail.conceptId = 'CustomerEmail', cEmail.uri = 'https://semantics.example/ns/global/CustomerEmail',
    cEmail.kind = 'shared_property', cEmail.preferredLabel = 'Customer Email',
    cEmail.status = 'approved', cEmail.pack = 'semantic-control-plane'

MERGE (cStatus:Concept {id: 'concept-global-CustomerStatus'})
SET cStatus.conceptId = 'CustomerStatus', cStatus.uri = 'https://semantics.example/ns/global/CustomerStatus',
    cStatus.kind = 'shared_property', cStatus.preferredLabel = 'Customer Status',
    cStatus.status = 'approved', cStatus.pack = 'semantic-control-plane'

MERGE (ns)-[:CONTAINS_CONCEPT]->(cCust)
MERGE (ns)-[:CONTAINS_CONCEPT]->(cId)
MERGE (ns)-[:CONTAINS_CONCEPT]->(cName)
MERGE (ns)-[:CONTAINS_CONCEPT]->(cEmail)
MERGE (ns)-[:CONTAINS_CONCEPT]->(cStatus)

// ========== 2. Business catalog ==========
MERGE (termG:BusinessTerm {id: 'term-global-Customer'})
SET termG.name = 'Customer', termG.definition = 'TM Forum SID Customer',
    termG.status = 'Approved', termG.pack = 'business-catalog'
MERGE (domain:DataDomain {id: 'domain-customer'})
SET domain.name = 'Customer', domain.status = 'Active', domain.pack = 'business-catalog'
MERGE (model:DataModel {id: 'model-customer-logical'})
SET model.name = 'Customer Logical Model', model.status = 'Approved', model.pack = 'business-catalog'
MERGE (entity:DataEntity {id: 'entity-customer'})
SET entity.name = 'Customer', entity.status = 'Approved', entity.pack = 'business-catalog'

MERGE (attrId:DataAttribute {id: 'attr-customer-id'})
SET attrId.name = 'customerId', attrId.dataType = 'string', attrId.status = 'Approved', attrId.pack = 'business-catalog'
MERGE (attrName:DataAttribute {id: 'attr-customer-name'})
SET attrName.name = 'customerName', attrName.dataType = 'string', attrName.status = 'Approved', attrName.pack = 'business-catalog'
MERGE (attrEmail:DataAttribute {id: 'attr-customer-email'})
SET attrEmail.name = 'email', attrEmail.dataType = 'string', attrEmail.status = 'Approved', attrEmail.pack = 'business-catalog'
MERGE (attrStatus:DataAttribute {id: 'attr-customer-status'})
SET attrStatus.name = 'status', attrStatus.dataType = 'string', attrStatus.status = 'Approved', attrStatus.pack = 'business-catalog'

MERGE (domain)-[:OWNS_MODEL]->(model)
MERGE (model)-[:CONTAINS_ENTITY]->(entity)
MERGE (entity)-[:HAS_ATTRIBUTE]->(attrId)
MERGE (entity)-[:HAS_ATTRIBUTE]->(attrName)
MERGE (entity)-[:HAS_ATTRIBUTE]->(attrEmail)
MERGE (entity)-[:HAS_ATTRIBUTE]->(attrStatus)
MERGE (domain)-[:CLASSIFIES]->(entity)
MERGE (termG)-[:RELATES_TO {role: 'defines'}]->(entity)
MERGE (termG)-[:MAPS_TO]->(cCust)
MERGE (entity)-[:MAPS_TO]->(cCust)
MERGE (attrId)-[:MAPS_TO]->(cId)
MERGE (attrName)-[:MAPS_TO]->(cName)
MERGE (attrEmail)-[:MAPS_TO]->(cEmail)
MERGE (attrStatus)-[:MAPS_TO]->(cStatus)

WITH ns, cCust, cId, cName, cEmail, cStatus, domain, entity, attrId, attrName, attrEmail, attrStatus

// ========== 3. Per-NATCO stacks (multi-column) ==========
UNWIND [
  {
    nsId: 'ns-natco-de', slug: 'natco-de', display: 'Germany', iso: 'DE',
    entId: 'concept-natco-de-kunde', entCid: 'kunde', entLabel: 'Kunde',
    entUri: 'https://semantics.example/ns/natco-de/kunde',
    termName: 'Kunde',
    sysId: 'sys-crm-de', sysName: 'CRM-DE',
    dbId: 'db-crm-de', dbName: 'crm_de',
    schId: 'schema-crm-de', schName: 'public',
    tblId: 'table-crm-de-kunde', tblName: 'kunde', tblFqn: 'crm_de.public.kunde',
    portId: 'port-in-crm-de', portName: 'crm_de_kunde',
    cols: [
      { colId: 'col-crm-de-kundennummer', colName: 'kundennummer', pk: true,
        localId: 'concept-natco-de-kundennummer', localCid: 'kundennummer', localLabel: 'Kundennummer',
        localUri: 'https://semantics.example/ns/natco-de/kundennummer', global: 'id' },
      { colId: 'col-crm-de-name', colName: 'name', pk: false,
        localId: 'concept-natco-de-name', localCid: 'name', localLabel: 'Name',
        localUri: 'https://semantics.example/ns/natco-de/name', global: 'name' },
      { colId: 'col-crm-de-email', colName: 'email', pk: false,
        localId: 'concept-natco-de-email', localCid: 'email', localLabel: 'E-Mail',
        localUri: 'https://semantics.example/ns/natco-de/email', global: 'email' },
      { colId: 'col-crm-de-status', colName: 'status', pk: false,
        localId: 'concept-natco-de-status', localCid: 'status', localLabel: 'Status',
        localUri: 'https://semantics.example/ns/natco-de/status', global: 'status' }
    ]
  },
  {
    nsId: 'ns-natco-at', slug: 'natco-at', display: 'Austria', iso: 'AT',
    entId: 'concept-natco-at-kunde', entCid: 'kunde', entLabel: 'Kunde',
    entUri: 'https://semantics.example/ns/natco-at/kunde',
    termName: 'Kunde',
    sysId: 'sys-crm-at', sysName: 'CRM-AT',
    dbId: 'db-crm-at', dbName: 'crm_at',
    schId: 'schema-crm-at', schName: 'dbo',
    tblId: 'table-crm-at-kunde', tblName: 'Kunde', tblFqn: 'crm_at.dbo.Kunde',
    portId: 'port-in-crm-at', portName: 'crm_at_kunde',
    cols: [
      { colId: 'col-crm-at-kunden-id', colName: 'kunden_id', pk: true,
        localId: 'concept-natco-at-kunden-id', localCid: 'kunden_id', localLabel: 'Kunden-ID',
        localUri: 'https://semantics.example/ns/natco-at/kunden_id', global: 'id' },
      { colId: 'col-crm-at-name', colName: 'name', pk: false,
        localId: 'concept-natco-at-name', localCid: 'name', localLabel: 'Name',
        localUri: 'https://semantics.example/ns/natco-at/name', global: 'name' },
      { colId: 'col-crm-at-email', colName: 'email', pk: false,
        localId: 'concept-natco-at-email', localCid: 'email', localLabel: 'E-Mail',
        localUri: 'https://semantics.example/ns/natco-at/email', global: 'email' },
      { colId: 'col-crm-at-status', colName: 'status', pk: false,
        localId: 'concept-natco-at-status', localCid: 'status', localLabel: 'Status',
        localUri: 'https://semantics.example/ns/natco-at/status', global: 'status' }
    ]
  },
  {
    nsId: 'ns-natco-hr', slug: 'natco-hr', display: 'Croatia', iso: 'HR',
    entId: 'concept-natco-hr-kupac', entCid: 'kupac', entLabel: 'Kupac',
    entUri: 'https://semantics.example/ns/natco-hr/kupac',
    termName: 'Kupac',
    sysId: 'sys-crm-hr', sysName: 'CRM-HR',
    dbId: 'db-crm-hr', dbName: 'crm_hr',
    schId: 'schema-crm-hr', schName: 'public',
    tblId: 'table-crm-hr-kupac', tblName: 'kupac', tblFqn: 'crm_hr.public.kupac',
    portId: 'port-in-crm-hr', portName: 'crm_hr_kupac',
    cols: [
      { colId: 'col-crm-hr-kupac-id', colName: 'kupac_id', pk: true,
        localId: 'concept-natco-hr-kupac-id', localCid: 'kupac_id', localLabel: 'ID kupca',
        localUri: 'https://semantics.example/ns/natco-hr/kupac_id', global: 'id' },
      { colId: 'col-crm-hr-ime', colName: 'ime', pk: false,
        localId: 'concept-natco-hr-ime', localCid: 'ime', localLabel: 'Ime',
        localUri: 'https://semantics.example/ns/natco-hr/ime', global: 'name' },
      { colId: 'col-crm-hr-email', colName: 'email', pk: false,
        localId: 'concept-natco-hr-email', localCid: 'email', localLabel: 'Email',
        localUri: 'https://semantics.example/ns/natco-hr/email', global: 'email' },
      { colId: 'col-crm-hr-status', colName: 'status', pk: false,
        localId: 'concept-natco-hr-status', localCid: 'status', localLabel: 'Status',
        localUri: 'https://semantics.example/ns/natco-hr/status', global: 'status' }
    ]
  },
  {
    nsId: 'ns-natco-hu', slug: 'natco-hu', display: 'Hungary', iso: 'HU',
    entId: 'concept-natco-hu-ugyfel', entCid: 'ugyfel', entLabel: 'Ügyfél',
    entUri: 'https://semantics.example/ns/natco-hu/ugyfel',
    termName: 'Ügyfél',
    sysId: 'sys-crm-hu', sysName: 'CRM-HU',
    dbId: 'db-crm-hu', dbName: 'crm_hu',
    schId: 'schema-crm-hu', schName: 'dbo',
    tblId: 'table-crm-hu-ugyfel', tblName: 'Ugyfel', tblFqn: 'crm_hu.dbo.Ugyfel',
    portId: 'port-in-crm-hu', portName: 'crm_hu_ugyfel',
    cols: [
      { colId: 'col-crm-hu-ugyfel-azonosito', colName: 'ugyfel_azonosito', pk: true,
        localId: 'concept-natco-hu-ugyfel-azonosito', localCid: 'ugyfel_azonosito', localLabel: 'Ügyfél azonosító',
        localUri: 'https://semantics.example/ns/natco-hu/ugyfel_azonosito', global: 'id' },
      { colId: 'col-crm-hu-nev', colName: 'nev', pk: false,
        localId: 'concept-natco-hu-nev', localCid: 'nev', localLabel: 'Név',
        localUri: 'https://semantics.example/ns/natco-hu/nev', global: 'name' },
      { colId: 'col-crm-hu-email', colName: 'email', pk: false,
        localId: 'concept-natco-hu-email', localCid: 'email', localLabel: 'Email',
        localUri: 'https://semantics.example/ns/natco-hu/email', global: 'email' },
      { colId: 'col-crm-hu-status', colName: 'status', pk: false,
        localId: 'concept-natco-hu-status', localCid: 'status', localLabel: 'Státusz',
        localUri: 'https://semantics.example/ns/natco-hu/status', global: 'status' }
    ]
  },
  {
    nsId: 'ns-natco-pl', slug: 'natco-pl', display: 'Poland', iso: 'PL',
    entId: 'concept-natco-pl-klient', entCid: 'klient', entLabel: 'Klient',
    entUri: 'https://semantics.example/ns/natco-pl/klient',
    termName: 'Klient',
    sysId: 'sys-crm-pl', sysName: 'CRM-PL',
    dbId: 'db-crm-pl', dbName: 'crm_pl',
    schId: 'schema-crm-pl', schName: 'public',
    tblId: 'table-crm-pl-klient', tblName: 'klient', tblFqn: 'crm_pl.public.klient',
    portId: 'port-in-crm-pl', portName: 'crm_pl_klient',
    cols: [
      { colId: 'col-crm-pl-id-klienta', colName: 'id_klienta', pk: true,
        localId: 'concept-natco-pl-id-klienta', localCid: 'id_klienta', localLabel: 'ID klienta',
        localUri: 'https://semantics.example/ns/natco-pl/id_klienta', global: 'id' },
      { colId: 'col-crm-pl-nazwa', colName: 'nazwa', pk: false,
        localId: 'concept-natco-pl-nazwa', localCid: 'nazwa', localLabel: 'Nazwa',
        localUri: 'https://semantics.example/ns/natco-pl/nazwa', global: 'name' },
      { colId: 'col-crm-pl-email', colName: 'email', pk: false,
        localId: 'concept-natco-pl-email', localCid: 'email', localLabel: 'Email',
        localUri: 'https://semantics.example/ns/natco-pl/email', global: 'email' },
      { colId: 'col-crm-pl-status', colName: 'status', pk: false,
        localId: 'concept-natco-pl-status', localCid: 'status', localLabel: 'Status',
        localUri: 'https://semantics.example/ns/natco-pl/status', global: 'status' }
    ]
  }
] AS n

MERGE (nNs:Namespace {id: n.nsId})
SET nNs.slug = n.slug, nNs.displayName = n.display, nNs.kind = 'natco',
    nNs.iso3166 = n.iso, nNs.uriBase = 'https://semantics.example/ns/' + n.slug + '/',
    nNs.naming = 'local-' + toLower(n.iso), nNs.status = 'active',
    nNs.owner = n.slug + '-data-office', nNs.pack = 'semantic-control-plane'
MERGE (nNs)-[:ALIGNS_TO {via: 'federation', da: 'DA-11'}]->(ns)

MERGE (nEnt:Concept {id: n.entId})
SET nEnt.conceptId = n.entCid, nEnt.uri = n.entUri, nEnt.kind = 'entity',
    nEnt.preferredLabel = n.entLabel, nEnt.status = 'approved',
    nEnt.scope = 'natco', nEnt.pack = 'semantic-control-plane'
MERGE (nNs)-[:CONTAINS_CONCEPT]->(nEnt)
MERGE (nEnt)-[:FEDERATES {predicate: 'sameAs', da: 'DA-11'}]->(cCust)

MERGE (term:BusinessTerm {id: 'term-' + n.slug + '-customer'})
SET term.name = n.termName, term.natco = n.slug, term.status = 'Approved', term.pack = 'business-catalog'
MERGE (term)-[:MAPS_TO]->(cCust)
MERGE (term)-[:EXPRESSED_AS]->(nEnt)

MERGE (sys:System {id: n.sysId})
SET sys.name = n.sysName, sys.natco = n.slug, sys.status = 'Active', sys.pack = 'technical-catalog'
MERGE (db:Database {id: n.dbId})
SET db.name = n.dbName, db.natco = n.slug, db.status = 'Active', db.pack = 'technical-catalog'
MERGE (sch:Schema {id: n.schId})
SET sch.name = n.schName, sch.natco = n.slug, sch.status = 'Active', sch.pack = 'technical-catalog'
MERGE (tbl:Table {id: n.tblId})
SET tbl.name = n.tblName, tbl.fullyQualifiedName = n.tblFqn, tbl.natco = n.slug,
    tbl.status = 'Active', tbl.pack = 'technical-catalog',
    tbl.inputPortId = n.portId, tbl.inputPortName = n.portName,
    tbl.entId = n.entId, tbl.displayName = n.display, tbl.iso = n.iso,
    tbl.termName = n.termName, tbl.sysName = n.sysName

MERGE (sys)-[:HAS_DATABASE]->(db)
MERGE (db)-[:HAS_SCHEMA]->(sch)
MERGE (sch)-[:CONTAINS_TABLE]->(tbl)
MERGE (tbl)-[:REPRESENTS]->(nEnt)
MERGE (tbl)-[:REPRESENTS]->(cCust)
MERGE (entity)-[:IMPLEMENTED_IN]->(tbl)
MERGE (tbl)-[:IMPLEMENTS_ENTITY]->(entity)

WITH ns, cCust, cId, cName, cEmail, cStatus, domain, entity,
     attrId, attrName, attrEmail, attrStatus, n, nNs, nEnt, tbl
UNWIND n.cols AS colDef
WITH ns, cCust, cId, cName, cEmail, cStatus, domain, entity,
     attrId, attrName, attrEmail, attrStatus, n, nNs, nEnt, tbl, colDef,
     CASE colDef.global
       WHEN 'id' THEN cId WHEN 'name' THEN cName WHEN 'email' THEN cEmail ELSE cStatus END AS gProp,
     CASE colDef.global
       WHEN 'id' THEN attrId WHEN 'name' THEN attrName WHEN 'email' THEN attrEmail ELSE attrStatus END AS gAttr

MERGE (nProp:Concept {id: colDef.localId})
SET nProp.conceptId = colDef.localCid, nProp.uri = colDef.localUri, nProp.kind = 'shared_property',
    nProp.preferredLabel = colDef.localLabel, nProp.status = 'approved',
    nProp.scope = 'natco', nProp.pack = 'semantic-control-plane'
MERGE (nNs)-[:CONTAINS_CONCEPT]->(nProp)
MERGE (nProp)-[:FEDERATES {predicate: 'sameAs', da: 'DA-11'}]->(gProp)

MERGE (col:Column {id: colDef.colId})
SET col.name = colDef.colName, col.natco = n.slug, col.dataType = 'varchar',
    col.isPrimaryKey = colDef.pk, col.status = 'Active', col.pack = 'technical-catalog'
MERGE (tbl)-[:CONTAINS_COLUMN]->(col)
MERGE (col)-[:REPRESENTS]->(nProp)
MERGE (col)-[:REPRESENTS]->(gProp)
MERGE (gAttr)-[:IMPLEMENTED_BY]->(col)
MERGE (col)-[:IMPLEMENTS_ATTRIBUTE]->(gAttr)

WITH ns, cCust, cId, cName, cEmail, cStatus, domain, entity,
     attrId, attrName, attrEmail, attrStatus,
     collect(DISTINCT {
       portId: n.portId, portName: n.portName, tblId: n.tblId,
       slug: n.slug, display: n.display, iso: n.iso,
       entId: n.entId, sysName: n.sysName, termName: n.termName
     }) AS ports

// ========== 4. Curated platform System → DB → Schema → Table → Columns ==========
MERGE (sysDp:System {id: 'sys-dp-platform'})
SET sysDp.name = 'Data Product Platform', sysDp.status = 'Active', sysDp.pack = 'technical-catalog'
MERGE (dbDp:Database {id: 'db-dp'})
SET dbDp.name = 'dp', dbDp.technology = 'PostgreSQL', dbDp.status = 'Active', dbDp.pack = 'technical-catalog'
MERGE (schDp:Schema {id: 'schema-dp-curated'})
SET schDp.name = 'curated', schDp.status = 'Active', schDp.pack = 'technical-catalog'
MERGE (tblDp:Table {id: 'table-dp-customer-360'})
SET tblDp.name = 'customer_360', tblDp.fullyQualifiedName = 'dp.curated.customer_360',
    tblDp.status = 'Active', tblDp.pack = 'technical-catalog'

MERGE (sysDp)-[:HAS_DATABASE]->(dbDp)
MERGE (dbDp)-[:HAS_SCHEMA]->(schDp)
MERGE (schDp)-[:CONTAINS_TABLE]->(tblDp)
MERGE (tblDp)-[:REPRESENTS]->(cCust)
MERGE (entity)-[:IMPLEMENTED_IN]->(tblDp)
MERGE (tblDp)-[:IMPLEMENTS_ENTITY]->(entity)

WITH cCust, cId, cName, cEmail, cStatus, domain, entity, attrId, attrName, attrEmail, attrStatus,
     tblDp, ports
UNWIND [
  { colId: 'col-dp-customer-id', colName: 'customer_id', pk: true, kind: 'id' },
  { colId: 'col-dp-full-name', colName: 'full_name', pk: false, kind: 'name' },
  { colId: 'col-dp-email', colName: 'email', pk: false, kind: 'email' },
  { colId: 'col-dp-status', colName: 'status', pk: false, kind: 'status' },
  { colId: 'col-dp-natco-code', colName: 'natco_code', pk: false, kind: 'none' }
] AS dcol
WITH cCust, cId, cName, cEmail, cStatus, domain, entity, attrId, attrName, attrEmail, attrStatus,
     tblDp, ports, dcol,
     CASE dcol.kind WHEN 'id' THEN cId WHEN 'name' THEN cName WHEN 'email' THEN cEmail WHEN 'status' THEN cStatus ELSE null END AS gConcept,
     CASE dcol.kind WHEN 'id' THEN attrId WHEN 'name' THEN attrName WHEN 'email' THEN attrEmail WHEN 'status' THEN attrStatus ELSE null END AS gAttr

MERGE (colDp:Column {id: dcol.colId})
SET colDp.name = dcol.colName, colDp.dataType = 'varchar', colDp.isPrimaryKey = dcol.pk,
    colDp.status = 'Active', colDp.pack = 'technical-catalog'
MERGE (tblDp)-[:CONTAINS_COLUMN]->(colDp)
FOREACH (_ IN CASE WHEN gConcept IS NULL THEN [] ELSE [1] END |
  MERGE (colDp)-[:REPRESENTS]->(gConcept)
)
FOREACH (_ IN CASE WHEN gAttr IS NULL THEN [] ELSE [1] END |
  MERGE (gAttr)-[:IMPLEMENTED_BY]->(colDp)
  MERGE (colDp)-[:IMPLEMENTS_ATTRIBUTE]->(gAttr)
)

WITH cCust, cId, cName, cEmail, cStatus, domain, tblDp, ports

// ========== 5. Data product · output port · contract · fields ==========
MERGE (prod:DataProduct {id: 'dp-customer-360'})
SET prod.name = 'Customer 360',
    prod.description = 'Enterprise customer master federating DE/AT/HR/HU/PL sources',
    prod.status = 'Published', prod.pack = 'data-products',
    prod.scope = 'global', prod.owner = 'Customer 360 Product Team',
    prod.familyId = 'customer-360'

MERGE (out:OutputPort {id: 'port-out-customer-360'})
SET out.name = 'customer_360_table', out.portType = 'table', out.status = 'Active', out.pack = 'data-products'

MERGE (outApi:OutputPort {id: 'port-out-customer-360-api'})
SET outApi.name = 'customer_360_api', outApi.portType = 'api', outApi.status = 'Active', outApi.pack = 'data-products'

MERGE (contract:DataContract {id: 'contract-customer-360-v1'})
SET contract.name = 'Customer 360 Table Contract', contract.version = '1.0.0',
    contract.status = 'Active', contract.pack = 'data-products'

MERGE (contractApi:DataContract {id: 'contract-customer-360-api-v1'})
SET contractApi.name = 'Customer 360 API Contract', contractApi.version = '1.0.0',
    contractApi.status = 'Active', contractApi.pack = 'data-products'

MERGE (prod)-[:EXPOSES]->(out)
MERGE (prod)-[:EXPOSES]->(outApi)
MERGE (out)-[:GOVERNED_BY]->(contract)
MERGE (outApi)-[:GOVERNED_BY]->(contractApi)
MERGE (out)-[:BACKED_BY]->(tblDp)
MERGE (outApi)-[:BACKED_BY]->(tblDp)
MERGE (contract)-[:GOVERNS]->(tblDp)
MERGE (contractApi)-[:GOVERNS]->(tblDp)
MERGE (prod)-[:IMPLEMENTS]->(cCust)
MERGE (prod)-[:BELONGS_TO_DOMAIN]->(domain)

WITH prod, cCust, cId, cName, cEmail, cStatus, domain, ports, tblDp, contract, contractApi
UNWIND [
  { fieldId: 'field-customer-id', name: 'customer_id', colId: 'col-dp-customer-id', kind: 'id' },
  { fieldId: 'field-full-name', name: 'full_name', colId: 'col-dp-full-name', kind: 'name' },
  { fieldId: 'field-email', name: 'email', colId: 'col-dp-email', kind: 'email' },
  { fieldId: 'field-status', name: 'status', colId: 'col-dp-status', kind: 'status' },
  { fieldId: 'field-natco-code', name: 'natco_code', colId: 'col-dp-natco-code', kind: 'none' }
] AS f
WITH prod, cCust, cId, cName, cEmail, cStatus, domain, ports, tblDp, contract, contractApi, f,
     CASE f.kind WHEN 'id' THEN cId WHEN 'name' THEN cName WHEN 'email' THEN cEmail WHEN 'status' THEN cStatus ELSE null END AS fConcept

MERGE (field:ContractField {id: f.fieldId})
SET field.name = f.name, field.dataType = 'string', field.required = true,
    field.status = 'Active', field.pack = 'data-products'
MERGE (contract)-[:CONTAINS_FIELD]->(field)
MERGE (contractApi)-[:CONTAINS_FIELD]->(field)
WITH prod, cCust, domain, ports, f, field, fConcept
MATCH (col:Column {id: f.colId})
MERGE (field)-[:MAPS_TO_COLUMN]->(col)
FOREACH (_ IN CASE WHEN fConcept IS NULL THEN [] ELSE [1] END |
  MERGE (field)-[:IMPLEMENTS]->(fConcept)
)

WITH DISTINCT prod, cCust, domain
MATCH (srcTbl:Table)
WHERE srcTbl.natco IS NOT NULL AND srcTbl.inputPortId IS NOT NULL
WITH prod, cCust, domain, collect(DISTINCT {
  portId: srcTbl.inputPortId, portName: srcTbl.inputPortName, tblId: srcTbl.id,
  slug: srcTbl.natco, display: srcTbl.displayName, iso: srcTbl.iso,
  entId: srcTbl.entId, sysName: srcTbl.sysName, termName: srcTbl.termName
}) AS ports
UNWIND ports AS p
MERGE (inp:InputPort {id: p.portId})
SET inp.name = p.portName, inp.portType = 'table', inp.status = 'Active', inp.pack = 'data-products'
MERGE (prod)-[:CONSUMES]->(inp)
WITH prod, cCust, domain, inp, p, ports
MATCH (tbl:Table {id: p.tblId})
MERGE (inp)-[:READS_FROM]->(tbl)

// ========== 6. NATCO data products (marketplace sources) ==========
WITH DISTINCT prod, cCust, domain, ports
UNWIND ports AS p
MATCH (tbl:Table {id: p.tblId})
MATCH (localEnt:Concept {id: p.entId})

MERGE (natProd:DataProduct {id: 'dp-customer-360-' + replace(p.slug, 'natco-', '')})
SET natProd.name = p.display + ' · ' + p.termName,
    natProd.description = 'NATCO customer source product for ' + p.display + ' (' + p.iso + ')',
    natProd.status = 'Published', natProd.pack = 'data-products',
    natProd.scope = 'natco', natProd.natco = p.slug,
    natProd.familyId = 'customer-360',
    natProd.owner = p.slug + '-data-office'

MERGE (natOut:OutputPort {id: 'port-out-customer-360-' + replace(p.slug, 'natco-', '')})
SET natOut.name = p.portName + '_out', natOut.portType = 'table',
    natOut.status = 'Active', natOut.pack = 'data-products', natOut.natco = p.slug

MERGE (natContract:DataContract {id: 'contract-customer-360-' + replace(p.slug, 'natco-', '') + '-v1'})
SET natContract.name = p.display + ' · ' + p.termName + ' Contract',
    natContract.version = '1.0.0', natContract.status = 'Active',
    natContract.pack = 'data-products', natContract.natco = p.slug,
    natContract.familyId = 'customer-360'

MERGE (natProd)-[:EXPOSES]->(natOut)
MERGE (natOut)-[:GOVERNED_BY]->(natContract)
MERGE (natOut)-[:BACKED_BY]->(tbl)
MERGE (natContract)-[:GOVERNS]->(tbl)
MERGE (natProd)-[:IMPLEMENTS]->(localEnt)
MERGE (natProd)-[:IMPLEMENTS]->(cCust)
MERGE (natProd)-[:BELONGS_TO_DOMAIN]->(domain)
MERGE (prod)-[:FEDERATES_FROM]->(natProd)

WITH prod, cCust, domain, natProd, natContract, tbl, p
MATCH (tbl)-[:CONTAINS_COLUMN]->(col:Column)
OPTIONAL MATCH (col)-[:REPRESENTS]->(colConcept:Concept)
WITH prod, cCust, domain, natProd, natContract, col, colConcept
MERGE (nf:ContractField {id: 'field-' + col.id})
SET nf.name = col.name, nf.dataType = coalesce(col.dataType, 'string'),
    nf.required = coalesce(col.isPrimaryKey, false),
    nf.status = 'Active', nf.pack = 'data-products', nf.natco = col.natco
MERGE (natContract)-[:CONTAINS_FIELD]->(nf)
MERGE (nf)-[:MAPS_TO_COLUMN]->(col)
FOREACH (_ IN CASE WHEN colConcept IS NULL THEN [] ELSE [1] END |
  MERGE (nf)-[:IMPLEMENTS]->(colConcept)
)

WITH DISTINCT prod, cCust
MATCH (col:Column) WHERE col.pack = 'technical-catalog'
WITH prod, cCust, count(DISTINCT col) AS columns
MATCH (sys:System) WHERE sys.pack = 'technical-catalog'
WITH prod, cCust, columns, count(DISTINCT sys) AS systems
MATCH (dp:DataProduct) WHERE dp.pack = 'data-products'
WITH prod, cCust, columns, systems, count(DISTINCT dp) AS products
RETURN 'Multi-NATCO Customer 360 loaded (global + NATCO products)' AS status,
       cCust.uri AS globalConcept,
       prod.name AS product,
       products AS productCount,
       columns AS columnCount,
       systems AS systemCount;
