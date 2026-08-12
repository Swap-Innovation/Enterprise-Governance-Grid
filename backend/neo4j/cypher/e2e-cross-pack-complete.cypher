// e2e-cross-pack-complete.cypher
// Close completeness gaps so EVERY marketplace family has full cross-pack coverage:
//   Business Catalog: Domain · Model · Entity · Attribute · Term
//   Semantic Control Plane: entity Concept + property Concepts · Federation
//   Technical Catalog: System · Database · Schema · Table · Column (all fields)
//   Data Products: Product · Ports · Contract · ContractFields (all fields)
// Families: customer-interactions · product-orders · billing-accounts · service-subscriptions
// (Customer 360 already rich in e2e-customer-360 — we only tag familyId + wire missing links)

// ========== 0. Tag Customer 360 logical model with familyId ==========
MATCH (e:DataEntity {id: 'entity-customer'})
SET e.familyId = 'customer-360', e.pack = 'business-catalog'
WITH count(*) AS _
MATCH (a:DataAttribute)
WHERE a.id STARTS WITH 'attr-customer-'
SET a.familyId = 'customer-360', a.pack = 'business-catalog'
WITH count(*) AS _
MATCH (m:DataModel {id: 'model-customer-logical'})
SET m.familyId = 'customer-360', m.pack = 'business-catalog'
WITH count(*) AS _
MATCH (d:DataDomain {id: 'domain-customer'})
SET d.familyId = 'customer-360'
WITH count(*) AS _
MATCH (t:BusinessTerm)
WHERE t.id = 'term-global-Customer' OR t.id STARTS WITH 'term-natco-'
SET t.familyId = coalesce(t.familyId, 'customer-360');

// ========== 1. Complete non-C360 marketplace families ==========
UNWIND [
  {
    familyId: 'customer-interactions',
    domainId: 'domain-customer', domainName: 'Customer',
    modelId: 'model-customer-interactions-logical', modelName: 'Customer Interactions Logical Model',
    entityId: 'entity-customer-interaction', entityName: 'CustomerInteraction',
    conceptId: 'concept-global-CustomerInteraction', conceptCid: 'CustomerInteraction',
    conceptLabel: 'Customer Interaction',
    conceptUri: 'https://semantics.example/ns/global/CustomerInteraction',
    termId: 'term-global-CustomerInteraction',
    tblId: 'table-dp-customer-interactions',
    contractId: 'contract-customer-interactions-v1',
    cols: [
      { id: 'interaction_id', pk: true, conceptCid: 'InteractionId', conceptLabel: 'Interaction Id',
        gConceptId: 'concept-global-InteractionId', gAttrId: 'attr-interaction-id',
        gColId: 'col-dp-interaction-id', gFieldId: 'field-col-dp-interaction-id' },
      { id: 'customer_id', pk: false, conceptCid: 'InteractionCustomerId', conceptLabel: 'Interaction Customer Id',
        gConceptId: 'concept-global-InteractionCustomerId', gAttrId: 'attr-interaction-customer-id',
        gColId: 'col-dp-interaction-customer-id', gFieldId: 'field-col-dp-interaction-customer-id' },
      { id: 'channel', pk: false, conceptCid: 'InteractionChannel', conceptLabel: 'Interaction Channel',
        gConceptId: 'concept-global-InteractionChannel', gAttrId: 'attr-interaction-channel',
        gColId: 'col-dp-interaction-channel', gFieldId: 'field-col-dp-interaction-channel' },
      { id: 'occurred_at', pk: false, conceptCid: 'InteractionOccurredAt', conceptLabel: 'Interaction Occurred At',
        gConceptId: 'concept-global-InteractionOccurredAt', gAttrId: 'attr-interaction-occurred-at',
        gColId: 'col-dp-interaction-at', gFieldId: 'field-col-dp-interaction-at' }
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
    modelId: 'model-product-orders-logical', modelName: 'Product Orders Logical Model',
    entityId: 'entity-product-order', entityName: 'ProductOrder',
    conceptId: 'concept-global-ProductOrder', conceptCid: 'ProductOrder',
    conceptLabel: 'Product Order',
    conceptUri: 'https://semantics.example/ns/global/ProductOrder',
    termId: 'term-global-ProductOrder',
    tblId: 'table-dp-product-orders',
    contractId: 'contract-product-orders-v1',
    cols: [
      { id: 'order_id', pk: true, conceptCid: 'OrderId', conceptLabel: 'Order Id',
        gConceptId: 'concept-global-OrderId', gAttrId: 'attr-order-id',
        gColId: 'col-dp-order-id', gFieldId: 'field-col-dp-order-id' },
      { id: 'customer_id', pk: false, conceptCid: 'OrderCustomerId', conceptLabel: 'Order Customer Id',
        gConceptId: 'concept-global-OrderCustomerId', gAttrId: 'attr-order-customer-id',
        gColId: 'col-dp-order-customer-id', gFieldId: 'field-col-dp-order-customer-id' },
      { id: 'status', pk: false, conceptCid: 'OrderStatus', conceptLabel: 'Order Status',
        gConceptId: 'concept-global-OrderStatus', gAttrId: 'attr-order-status',
        gColId: 'col-dp-order-status', gFieldId: 'field-col-dp-order-status' },
      { id: 'total_amount', pk: false, conceptCid: 'OrderTotalAmount', conceptLabel: 'Order Total Amount',
        gConceptId: 'concept-global-OrderTotalAmount', gAttrId: 'attr-order-total',
        gColId: 'col-dp-order-total', gFieldId: 'field-col-dp-order-total' }
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
    modelId: 'model-billing-accounts-logical', modelName: 'Billing Accounts Logical Model',
    entityId: 'entity-billing-account', entityName: 'BillingAccount',
    conceptId: 'concept-global-BillingAccount', conceptCid: 'BillingAccount',
    conceptLabel: 'Billing Account',
    conceptUri: 'https://semantics.example/ns/global/BillingAccount',
    termId: 'term-global-BillingAccount',
    tblId: 'table-dp-billing-accounts',
    contractId: 'contract-billing-accounts-v1',
    cols: [
      { id: 'billing_account_id', pk: true, conceptCid: 'BillingAccountId', conceptLabel: 'Billing Account Id',
        gConceptId: 'concept-global-BillingAccountId', gAttrId: 'attr-ba-id',
        gColId: 'col-dp-ba-id', gFieldId: 'field-col-dp-ba-id' },
      { id: 'customer_id', pk: false, conceptCid: 'BillingCustomerId', conceptLabel: 'Billing Customer Id',
        gConceptId: 'concept-global-BillingCustomerId', gAttrId: 'attr-ba-customer-id',
        gColId: 'col-dp-ba-customer-id', gFieldId: 'field-col-dp-ba-customer-id' },
      { id: 'currency', pk: false, conceptCid: 'BillingCurrency', conceptLabel: 'Billing Currency',
        gConceptId: 'concept-global-BillingCurrency', gAttrId: 'attr-ba-currency',
        gColId: 'col-dp-ba-currency', gFieldId: 'field-col-dp-ba-currency' },
      { id: 'balance', pk: false, conceptCid: 'BillingBalance', conceptLabel: 'Billing Balance',
        gConceptId: 'concept-global-BillingBalance', gAttrId: 'attr-ba-balance',
        gColId: 'col-dp-ba-balance', gFieldId: 'field-col-dp-ba-balance' }
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
    modelId: 'model-service-subscriptions-logical', modelName: 'Service Subscriptions Logical Model',
    entityId: 'entity-service-subscription', entityName: 'ServiceSubscription',
    conceptId: 'concept-global-ServiceSubscription', conceptCid: 'ServiceSubscription',
    conceptLabel: 'Service Subscription',
    conceptUri: 'https://semantics.example/ns/global/ServiceSubscription',
    termId: 'term-global-ServiceSubscription',
    tblId: 'table-dp-service-subscriptions',
    contractId: 'contract-service-subscriptions-v1',
    cols: [
      { id: 'subscription_id', pk: true, conceptCid: 'SubscriptionId', conceptLabel: 'Subscription Id',
        gConceptId: 'concept-global-SubscriptionId', gAttrId: 'attr-sub-id',
        gColId: 'col-dp-sub-id', gFieldId: 'field-col-dp-sub-id' },
      { id: 'customer_id', pk: false, conceptCid: 'SubscriptionCustomerId', conceptLabel: 'Subscription Customer Id',
        gConceptId: 'concept-global-SubscriptionCustomerId', gAttrId: 'attr-sub-customer-id',
        gColId: 'col-dp-sub-customer-id', gFieldId: 'field-col-dp-sub-customer-id' },
      { id: 'service_code', pk: false, conceptCid: 'ServiceCode', conceptLabel: 'Service Code',
        gConceptId: 'concept-global-ServiceCode', gAttrId: 'attr-sub-service',
        gColId: 'col-dp-sub-service', gFieldId: 'field-col-dp-sub-service' },
      { id: 'status', pk: false, conceptCid: 'SubscriptionStatus', conceptLabel: 'Subscription Status',
        gConceptId: 'concept-global-SubscriptionStatus', gAttrId: 'attr-sub-status',
        gColId: 'col-dp-sub-status', gFieldId: 'field-col-dp-sub-status' }
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

MERGE (ns:Namespace {id: 'ns-global'})

MERGE (domain:DataDomain {id: fam.domainId})
SET domain.name = fam.domainName, domain.status = 'Active',
    domain.pack = 'business-catalog', domain.familyId = fam.familyId

MERGE (model:DataModel {id: fam.modelId})
SET model.name = fam.modelName, model.status = 'Approved',
    model.pack = 'business-catalog', model.familyId = fam.familyId

MERGE (entity:DataEntity {id: fam.entityId})
SET entity.name = fam.entityName, entity.status = 'Approved',
    entity.pack = 'business-catalog', entity.familyId = fam.familyId

MERGE (c:Concept {id: fam.conceptId})
SET c.conceptId = fam.conceptCid, c.uri = fam.conceptUri, c.kind = 'entity',
    c.preferredLabel = fam.conceptLabel, c.status = 'approved',
    c.pack = 'semantic-control-plane', c.familyId = fam.familyId

MERGE (term:BusinessTerm {id: fam.termId})
SET term.name = fam.conceptLabel, term.status = 'Approved',
    term.pack = 'business-catalog', term.familyId = fam.familyId, term.natco = 'global'

MERGE (ns)-[:CONTAINS_CONCEPT]->(c)
MERGE (domain)-[:OWNS_MODEL]->(model)
MERGE (model)-[:CONTAINS_ENTITY]->(entity)
MERGE (domain)-[:CLASSIFIES]->(entity)
MERGE (term)-[:RELATES_TO {role: 'defines'}]->(entity)
MERGE (term)-[:MAPS_TO]->(c)
MERGE (entity)-[:MAPS_TO]->(c)

WITH fam, domain, model, entity, c, term, ns
MATCH (tbl:Table {id: fam.tblId})
SET tbl.familyId = fam.familyId
MERGE (entity)-[:IMPLEMENTED_IN]->(tbl)
MERGE (tbl)-[:IMPLEMENTS_ENTITY]->(entity)
MERGE (tbl)-[:REPRESENTS]->(c)

WITH fam, domain, model, entity, c, term, ns, tbl
UNWIND fam.cols AS colDef

MERGE (gConcept:Concept {id: colDef.gConceptId})
SET gConcept.conceptId = colDef.conceptCid,
    gConcept.uri = 'https://semantics.example/ns/global/' + colDef.conceptCid,
    gConcept.kind = 'shared_property',
    gConcept.preferredLabel = colDef.conceptLabel,
    gConcept.status = 'approved',
    gConcept.pack = 'semantic-control-plane',
    gConcept.familyId = fam.familyId
MERGE (ns)-[:CONTAINS_CONCEPT]->(gConcept)

MERGE (attr:DataAttribute {id: colDef.gAttrId})
SET attr.name = colDef.id, attr.dataType = 'string', attr.status = 'Approved',
    attr.pack = 'business-catalog', attr.familyId = fam.familyId, attr.isPrimaryKey = colDef.pk
MERGE (entity)-[:HAS_ATTRIBUTE]->(attr)
MERGE (attr)-[:MAPS_TO]->(gConcept)

MERGE (col:Column {id: colDef.gColId})
SET col.name = colDef.id, col.dataType = 'varchar', col.isPrimaryKey = colDef.pk,
    col.status = 'Active', col.pack = 'technical-catalog', col.familyId = fam.familyId
MERGE (tbl)-[:CONTAINS_COLUMN]->(col)
MERGE (col)-[:REPRESENTS]->(gConcept)
MERGE (attr)-[:IMPLEMENTED_IN]->(col)

MERGE (field:ContractField {id: colDef.gFieldId})
SET field.name = colDef.id, field.dataType = 'string', field.required = colDef.pk,
    field.status = 'Active', field.pack = 'data-products', field.familyId = fam.familyId
WITH fam, domain, entity, c, term, ns, tbl, colDef, gConcept, attr, col, field
MATCH (contract:DataContract {id: fam.contractId})
MERGE (contract)-[:CONTAINS_FIELD]->(field)
MERGE (field)-[:MAPS_TO_COLUMN]->(col)
MERGE (field)-[:IMPLEMENTS]->(gConcept)
MERGE (field)-[:IMPLEMENTS]->(c)

// —— NATCO expansion: full column set + property concepts + contract fields + biz wiring ——
WITH DISTINCT fam, domain, entity, c, term, ns
UNWIND fam.natcos AS n
MATCH (nNs:Namespace {id: 'ns-' + n.slug})
MATCH (nTbl:Table {id: 'table-' + fam.familyId + '-' + n.code})
MATCH (nConcept:Concept {id: 'concept-' + fam.familyId + '-' + n.code})
MATCH (nTerm:BusinessTerm {id: 'term-' + fam.familyId + '-' + n.code})
MATCH (natProd:DataProduct {id: 'dp-' + fam.familyId + '-' + n.code})
MATCH (natContract:DataContract {id: 'contract-' + fam.familyId + '-' + n.code + '-v1'})

SET nConcept.kind = 'entity', nConcept.familyId = fam.familyId
SET nTerm.familyId = fam.familyId
SET nTbl.familyId = fam.familyId

MERGE (nTerm)-[:RELATES_TO {role: 'defines'}]->(entity)
MERGE (nTerm)-[:MAPS_TO]->(c)
MERGE (nTerm)-[:EXPRESSED_AS]->(nConcept)
MERGE (entity)-[:IMPLEMENTED_IN]->(nTbl)
MERGE (nTbl)-[:IMPLEMENTS_ENTITY]->(entity)
MERGE (nTbl)-[:REPRESENTS]->(nConcept)
MERGE (nTbl)-[:REPRESENTS]->(c)
MERGE (natProd)-[:BELONGS_TO_DOMAIN]->(domain)

WITH fam, domain, entity, c, ns, n, nNs, nTbl, nConcept, natContract
UNWIND fam.cols AS colDef

MERGE (gConcept:Concept {id: colDef.gConceptId})

MERGE (nProp:Concept {id: colDef.gConceptId + '-' + n.code})
SET nProp.conceptId = toLower(colDef.conceptCid) + '-' + n.code,
    nProp.uri = 'https://semantics.example/ns/' + n.slug + '/' + toLower(colDef.conceptCid),
    nProp.kind = 'shared_property',
    nProp.preferredLabel = colDef.conceptLabel + ' (' + n.label + ')',
    nProp.status = 'approved', nProp.scope = 'natco',
    nProp.pack = 'semantic-control-plane', nProp.familyId = fam.familyId
MERGE (nNs)-[:CONTAINS_CONCEPT]->(nProp)
MERGE (nProp)-[:FEDERATES {predicate: 'sameAs', da: 'DA-11'}]->(gConcept)

MERGE (nCol:Column {id: 'col-' + fam.familyId + '-' + n.code + '-' + colDef.id})
SET nCol.name = colDef.id, nCol.natco = n.slug, nCol.dataType = 'varchar',
    nCol.isPrimaryKey = colDef.pk, nCol.status = 'Active',
    nCol.pack = 'technical-catalog', nCol.familyId = fam.familyId
MERGE (nTbl)-[:CONTAINS_COLUMN]->(nCol)
MERGE (nCol)-[:REPRESENTS]->(nProp)
MERGE (nCol)-[:REPRESENTS]->(gConcept)

MERGE (nField:ContractField {id: 'field-' + fam.familyId + '-' + n.code + '-' + colDef.id})
SET nField.name = colDef.id, nField.dataType = 'string', nField.required = colDef.pk,
    nField.status = 'Active', nField.pack = 'data-products',
    nField.natco = n.slug, nField.familyId = fam.familyId
MERGE (natContract)-[:CONTAINS_FIELD]->(nField)
MERGE (nField)-[:MAPS_TO_COLUMN]->(nCol)
MERGE (nField)-[:IMPLEMENTS]->(gConcept)
MERGE (nField)-[:IMPLEMENTS]->(c);

// ========== 2. Remove orphan contract-only duplicates that are not wired ==========
OPTIONAL MATCH (orphan:DataProduct {id: 'asset-dp-customer-360'})
DETACH DELETE orphan;

OPTIONAL MATCH (orphanTbl:Table)
WHERE orphanTbl.id STARTS WITH 'asset-tbl-' AND NOT (orphanTbl)-[:REPRESENTS]->()
DETACH DELETE orphanTbl;

OPTIONAL MATCH (orphanCol:Column)
WHERE orphanCol.id STARTS WITH 'asset-col-' AND NOT (orphanCol)-[:REPRESENTS]->()
DETACH DELETE orphanCol;

MATCH (dp:DataProduct) WHERE dp.pack = 'data-products' OR dp.id STARTS WITH 'dp-'
RETURN 'Cross-pack completeness applied' AS status,
       count(DISTINCT dp) AS products;
