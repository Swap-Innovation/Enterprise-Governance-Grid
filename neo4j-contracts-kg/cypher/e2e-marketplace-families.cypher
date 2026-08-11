// e2e-marketplace-families.cypher
// Additional global data products + NATCO federated equivalents
// Families: customer-interactions · product-orders · billing-accounts · service-subscriptions
// (Customer 360 family is created in e2e-customer-360.cypher)

MERGE (ns:Namespace {id: 'ns-global'})
WITH ns

UNWIND [
  {
    familyId: 'customer-interactions',
    domainId: 'domain-customer', domainName: 'Customer',
    globalId: 'dp-customer-interactions', globalName: 'Customer Interactions',
    owner: 'CX Analytics Team',
    conceptId: 'concept-global-CustomerInteraction', conceptCid: 'CustomerInteraction',
    conceptLabel: 'Customer Interaction',
    conceptUri: 'https://semantics.example/ns/global/CustomerInteraction',
    tblId: 'table-dp-customer-interactions', tblName: 'customer_interaction',
    tblFqn: 'dp.curated.customer_interaction',
    contractId: 'contract-customer-interactions-v1',
    portId: 'port-out-customer-interactions',
    cols: [
      { id: 'col-dp-interaction-id', name: 'interaction_id', pk: true },
      { id: 'col-dp-interaction-customer-id', name: 'customer_id', pk: false },
      { id: 'col-dp-interaction-channel', name: 'channel', pk: false },
      { id: 'col-dp-interaction-at', name: 'occurred_at', pk: false }
    ],
    natcos: [
      { code: 'de', slug: 'natco-de', label: 'Germany', local: 'Kundeninteraktion', localCid: 'kundeninteraktion' },
      { code: 'at', slug: 'natco-at', label: 'Austria', local: 'Kundeninteraktion', localCid: 'kundeninteraktion' },
      { code: 'hr', slug: 'natco-hr', label: 'Croatia', local: 'Interakcija kupca', localCid: 'interakcija-kupca' },
      { code: 'hu', slug: 'natco-hu', label: 'Hungary', local: 'Ügyfél interakció', localCid: 'ugyfel-interakcio' },
      { code: 'pl', slug: 'natco-pl', label: 'Poland', local: 'Interakcja klienta', localCid: 'interakcja-klienta' }
    ]
  },
  {
    familyId: 'product-orders',
    domainId: 'domain-commerce', domainName: 'Commerce',
    globalId: 'dp-product-orders', globalName: 'Product Orders',
    owner: 'Order Management COE',
    conceptId: 'concept-global-ProductOrder', conceptCid: 'ProductOrder',
    conceptLabel: 'Product Order',
    conceptUri: 'https://semantics.example/ns/global/ProductOrder',
    tblId: 'table-dp-product-orders', tblName: 'product_order',
    tblFqn: 'dp.curated.product_order',
    contractId: 'contract-product-orders-v1',
    portId: 'port-out-product-orders',
    cols: [
      { id: 'col-dp-order-id', name: 'order_id', pk: true },
      { id: 'col-dp-order-customer-id', name: 'customer_id', pk: false },
      { id: 'col-dp-order-status', name: 'status', pk: false },
      { id: 'col-dp-order-total', name: 'total_amount', pk: false }
    ],
    natcos: [
      { code: 'de', slug: 'natco-de', label: 'Germany', local: 'Produktauftrag', localCid: 'produktauftrag' },
      { code: 'at', slug: 'natco-at', label: 'Austria', local: 'Produktauftrag', localCid: 'produktauftrag' },
      { code: 'hr', slug: 'natco-hr', label: 'Croatia', local: 'Narudžba proizvoda', localCid: 'narudzba-proizvoda' },
      { code: 'hu', slug: 'natco-hu', label: 'Hungary', local: 'Termékrendelés', localCid: 'termekrendeles' },
      { code: 'pl', slug: 'natco-pl', label: 'Poland', local: 'Zamówienie produktu', localCid: 'zamowienie-produktu' }
    ]
  },
  {
    familyId: 'billing-accounts',
    domainId: 'domain-billing', domainName: 'Billing',
    globalId: 'dp-billing-accounts', globalName: 'Billing Accounts',
    owner: 'Revenue Assurance',
    conceptId: 'concept-global-BillingAccount', conceptCid: 'BillingAccount',
    conceptLabel: 'Billing Account',
    conceptUri: 'https://semantics.example/ns/global/BillingAccount',
    tblId: 'table-dp-billing-accounts', tblName: 'billing_account',
    tblFqn: 'dp.curated.billing_account',
    contractId: 'contract-billing-accounts-v1',
    portId: 'port-out-billing-accounts',
    cols: [
      { id: 'col-dp-ba-id', name: 'billing_account_id', pk: true },
      { id: 'col-dp-ba-customer-id', name: 'customer_id', pk: false },
      { id: 'col-dp-ba-currency', name: 'currency', pk: false },
      { id: 'col-dp-ba-balance', name: 'balance', pk: false }
    ],
    natcos: [
      { code: 'de', slug: 'natco-de', label: 'Germany', local: 'Rechnungskonto', localCid: 'rechnungskonto' },
      { code: 'at', slug: 'natco-at', label: 'Austria', local: 'Rechnungskonto', localCid: 'rechnungskonto' },
      { code: 'hr', slug: 'natco-hr', label: 'Croatia', local: 'Račun za naplatu', localCid: 'racun-za-naplatu' },
      { code: 'hu', slug: 'natco-hu', label: 'Hungary', local: 'Számlázási számla', localCid: 'szamlazasi-szamla' },
      { code: 'pl', slug: 'natco-pl', label: 'Poland', local: 'Konto rozliczeniowe', localCid: 'konto-rozliczeniowe' }
    ]
  },
  {
    familyId: 'service-subscriptions',
    domainId: 'domain-service', domainName: 'Service',
    globalId: 'dp-service-subscriptions', globalName: 'Service Subscriptions',
    owner: 'Service Inventory Team',
    conceptId: 'concept-global-ServiceSubscription', conceptCid: 'ServiceSubscription',
    conceptLabel: 'Service Subscription',
    conceptUri: 'https://semantics.example/ns/global/ServiceSubscription',
    tblId: 'table-dp-service-subscriptions', tblName: 'service_subscription',
    tblFqn: 'dp.curated.service_subscription',
    contractId: 'contract-service-subscriptions-v1',
    portId: 'port-out-service-subscriptions',
    cols: [
      { id: 'col-dp-sub-id', name: 'subscription_id', pk: true },
      { id: 'col-dp-sub-customer-id', name: 'customer_id', pk: false },
      { id: 'col-dp-sub-service', name: 'service_code', pk: false },
      { id: 'col-dp-sub-status', name: 'status', pk: false }
    ],
    natcos: [
      { code: 'de', slug: 'natco-de', label: 'Germany', local: 'Serviceabonnement', localCid: 'serviceabonnement' },
      { code: 'at', slug: 'natco-at', label: 'Austria', local: 'Serviceabonnement', localCid: 'serviceabonnement' },
      { code: 'hr', slug: 'natco-hr', label: 'Croatia', local: 'Pretplata na uslugu', localCid: 'pretplata-na-uslugu' },
      { code: 'hu', slug: 'natco-hu', label: 'Hungary', local: 'Szolgáltatás-előfizetés', localCid: 'szolgaltatas-elofizetes' },
      { code: 'pl', slug: 'natco-pl', label: 'Poland', local: 'Subskrypcja usługi', localCid: 'subskrypcja-uslugi' }
    ]
  }
] AS fam

MERGE (domain:DataDomain {id: fam.domainId})
SET domain.name = fam.domainName, domain.status = 'Active', domain.pack = 'business-catalog'

MERGE (c:Concept {id: fam.conceptId})
SET c.conceptId = fam.conceptCid, c.uri = fam.conceptUri, c.kind = 'entity',
    c.preferredLabel = fam.conceptLabel, c.status = 'approved',
    c.pack = 'semantic-control-plane'
MERGE (ns)-[:CONTAINS_CONCEPT]->(c)

MERGE (term:BusinessTerm {id: 'term-global-' + fam.conceptCid})
SET term.name = fam.conceptLabel, term.status = 'Approved', term.pack = 'business-catalog'
MERGE (term)-[:MAPS_TO]->(c)

MERGE (sysDp:System {id: 'sys-dp-platform'})
MERGE (dbDp:Database {id: 'db-dp'})
MERGE (schDp:Schema {id: 'schema-dp-curated'})

MERGE (tbl:Table {id: fam.tblId})
SET tbl.name = fam.tblName, tbl.fullyQualifiedName = fam.tblFqn,
    tbl.status = 'Active', tbl.pack = 'technical-catalog', tbl.familyId = fam.familyId
MERGE (schDp)-[:CONTAINS_TABLE]->(tbl)
MERGE (tbl)-[:REPRESENTS]->(c)

WITH ns, fam, domain, c, tbl
UNWIND fam.cols AS colDef
MERGE (col:Column {id: colDef.id})
SET col.name = colDef.name, col.dataType = 'varchar', col.isPrimaryKey = colDef.pk,
    col.status = 'Active', col.pack = 'technical-catalog', col.familyId = fam.familyId
MERGE (tbl)-[:CONTAINS_COLUMN]->(col)
MERGE (col)-[:REPRESENTS]->(c)

WITH DISTINCT ns, fam, domain, c, tbl
MERGE (prod:DataProduct {id: fam.globalId})
SET prod.name = fam.globalName,
    prod.description = 'Global ' + fam.globalName + ' federating DE/AT/HR/HU/PL',
    prod.status = 'Published', prod.pack = 'data-products',
    prod.scope = 'global', prod.owner = fam.owner, prod.familyId = fam.familyId

MERGE (out:OutputPort {id: fam.portId})
SET out.name = fam.tblName + '_table', out.portType = 'table',
    out.status = 'Active', out.pack = 'data-products'

MERGE (contract:DataContract {id: fam.contractId})
SET contract.name = fam.globalName + ' Contract', contract.version = '1.0.0',
    contract.status = 'Active', contract.pack = 'data-products', contract.familyId = fam.familyId

MERGE (prod)-[:EXPOSES]->(out)
MERGE (out)-[:GOVERNED_BY]->(contract)
MERGE (out)-[:BACKED_BY]->(tbl)
MERGE (contract)-[:GOVERNS]->(tbl)
MERGE (prod)-[:IMPLEMENTS]->(c)
MERGE (prod)-[:BELONGS_TO_DOMAIN]->(domain)

WITH ns, fam, domain, c, tbl, prod, contract
UNWIND fam.cols AS colDef
MATCH (col:Column {id: colDef.id})
MERGE (field:ContractField {id: 'field-' + colDef.id})
SET field.name = colDef.name, field.dataType = 'string', field.required = colDef.pk,
    field.status = 'Active', field.pack = 'data-products'
MERGE (contract)-[:CONTAINS_FIELD]->(field)
MERGE (field)-[:MAPS_TO_COLUMN]->(col)
MERGE (field)-[:IMPLEMENTS]->(c)

WITH DISTINCT ns, fam, domain, c, prod
UNWIND fam.natcos AS n
MERGE (nNs:Namespace {id: 'ns-' + n.slug})
MERGE (nConcept:Concept {id: 'concept-' + fam.familyId + '-' + n.code})
SET nConcept.conceptId = n.localCid, nConcept.kind = 'entity',
    nConcept.preferredLabel = n.local,
    nConcept.uri = 'https://semantics.example/ns/' + n.slug + '/' + n.localCid,
    nConcept.status = 'approved', nConcept.scope = 'natco',
    nConcept.pack = 'semantic-control-plane', nConcept.familyId = fam.familyId
MERGE (nNs)-[:CONTAINS_CONCEPT]->(nConcept)
MERGE (nConcept)-[:FEDERATES {predicate: 'sameAs', da: 'DA-11'}]->(c)

MERGE (nTerm:BusinessTerm {id: 'term-' + fam.familyId + '-' + n.code})
SET nTerm.name = n.local, nTerm.natco = n.slug, nTerm.status = 'Approved',
    nTerm.pack = 'business-catalog', nTerm.familyId = fam.familyId
MERGE (nTerm)-[:MAPS_TO]->(c)
MERGE (nTerm)-[:EXPRESSED_AS]->(nConcept)

MERGE (sys:System {id: 'sys-' + fam.familyId + '-' + n.code})
SET sys.name = toUpper(n.code) + '-' + fam.familyId, sys.natco = n.slug,
    sys.status = 'Active', sys.pack = 'technical-catalog', sys.familyId = fam.familyId
MERGE (db:Database {id: 'db-' + fam.familyId + '-' + n.code})
SET db.name = replace(fam.familyId, '-', '_') + '_' + n.code, db.natco = n.slug,
    db.status = 'Active', db.pack = 'technical-catalog'
MERGE (sch:Schema {id: 'schema-' + fam.familyId + '-' + n.code})
SET sch.name = 'public', sch.natco = n.slug, sch.status = 'Active', sch.pack = 'technical-catalog'
MERGE (nTbl:Table {id: 'table-' + fam.familyId + '-' + n.code})
SET nTbl.name = n.localCid, nTbl.fullyQualifiedName = db.name + '.public.' + n.localCid,
    nTbl.natco = n.slug, nTbl.status = 'Active', nTbl.pack = 'technical-catalog',
    nTbl.familyId = fam.familyId
MERGE (sys)-[:HAS_DATABASE]->(db)
MERGE (db)-[:HAS_SCHEMA]->(sch)
MERGE (sch)-[:CONTAINS_TABLE]->(nTbl)
MERGE (nTbl)-[:REPRESENTS]->(nConcept)
MERGE (nTbl)-[:REPRESENTS]->(c)

MERGE (nCol:Column {id: 'col-' + fam.familyId + '-' + n.code + '-id'})
SET nCol.name = n.localCid + '_id', nCol.natco = n.slug, nCol.dataType = 'varchar',
    nCol.isPrimaryKey = true, nCol.status = 'Active', nCol.pack = 'technical-catalog'
MERGE (nTbl)-[:CONTAINS_COLUMN]->(nCol)
MERGE (nCol)-[:REPRESENTS]->(nConcept)
MERGE (nCol)-[:REPRESENTS]->(c)

MERGE (natProd:DataProduct {id: fam.globalId + '-' + n.code})
SET natProd.name = n.label + ' · ' + n.local,
    natProd.description = 'NATCO ' + n.label + ' equivalent of ' + fam.globalName,
    natProd.status = 'Published', natProd.pack = 'data-products',
    natProd.scope = 'natco', natProd.natco = n.slug,
    natProd.familyId = fam.familyId, natProd.owner = n.slug + '-data-office'

MERGE (natOut:OutputPort {id: 'port-out-' + fam.familyId + '-' + n.code})
SET natOut.name = n.localCid + '_out', natOut.portType = 'table',
    natOut.status = 'Active', natOut.pack = 'data-products', natOut.natco = n.slug

MERGE (natContract:DataContract {id: 'contract-' + fam.familyId + '-' + n.code + '-v1'})
SET natContract.name = n.label + ' · ' + n.local + ' Contract',
    natContract.version = '1.0.0', natContract.status = 'Active',
    natContract.pack = 'data-products', natContract.natco = n.slug,
    natContract.familyId = fam.familyId

MERGE (natProd)-[:EXPOSES]->(natOut)
MERGE (natOut)-[:GOVERNED_BY]->(natContract)
MERGE (natOut)-[:BACKED_BY]->(nTbl)
MERGE (natContract)-[:GOVERNS]->(nTbl)
MERGE (natProd)-[:IMPLEMENTS]->(nConcept)
MERGE (natProd)-[:IMPLEMENTS]->(c)
MERGE (natProd)-[:BELONGS_TO_DOMAIN]->(domain)
MERGE (prod)-[:FEDERATES_FROM]->(natProd)

MERGE (natIn:InputPort {id: 'port-in-' + fam.familyId + '-' + n.code})
SET natIn.name = n.localCid + '_in', natIn.portType = 'table',
    natIn.status = 'Active', natIn.pack = 'data-products'
MERGE (prod)-[:CONSUMES]->(natIn)
MERGE (natIn)-[:READS_FROM]->(nTbl)

MERGE (nf:ContractField {id: 'field-' + fam.familyId + '-' + n.code + '-id'})
SET nf.name = nCol.name, nf.dataType = 'string', nf.required = true,
    nf.status = 'Active', nf.pack = 'data-products', nf.natco = n.slug
MERGE (natContract)-[:CONTAINS_FIELD]->(nf)
MERGE (nf)-[:MAPS_TO_COLUMN]->(nCol)
MERGE (nf)-[:IMPLEMENTS]->(c)

WITH count(*) AS links
MATCH (dp:DataProduct) WHERE dp.pack = 'data-products'
RETURN 'Marketplace families loaded' AS status, count(DISTINCT dp) AS productCount, links AS seedRows;
