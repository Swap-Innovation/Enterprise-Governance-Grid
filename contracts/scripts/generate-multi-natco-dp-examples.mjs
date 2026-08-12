#!/usr/bin/env node
/**
 * Generate enriched per-type contract examples for all marketplace data products
 * across global + DE/AT/HR/HU/PL — IDs aligned with e2e Neo4j seeds so enrich
 * MERGEs metadata onto live KG nodes.
 *
 *   node contracts/scripts/generate-multi-natco-dp-examples.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const NATCOS = [
  { code: 'de', slug: 'natco-de', label: 'Germany', iso: 'DE' },
  { code: 'at', slug: 'natco-at', label: 'Austria', iso: 'AT' },
  { code: 'hr', slug: 'natco-hr', label: 'Croatia', iso: 'HR' },
  { code: 'hu', slug: 'natco-hu', label: 'Hungary', iso: 'HU' },
  { code: 'pl', slug: 'natco-pl', label: 'Poland', iso: 'PL' },
]

/** Align with e2e-customer-360 + e2e-marketplace-families */
const FAMILIES = [
  {
    familyId: 'customer-360',
    globalId: 'dp-customer-360',
    globalName: 'Customer 360',
    owner: 'Customer 360 Product Team',
    domainId: 'domain-customer',
    domainName: 'Customer',
    conceptId: 'concept-global-Customer',
    conceptCid: 'Customer',
    conceptLabel: 'Customer',
    conceptUri: 'https://semantics.example/ns/global/Customer',
    tblId: 'table-dp-customer-360',
    tblName: 'customer_360',
    tblFqn: 'dp.curated.customer_360',
    contractId: 'contract-customer-360-v1',
    portId: 'port-out-customer-360',
    cols: [
      { id: 'col-dp-c360-customer-id', name: 'customer_id', pk: true },
      { id: 'col-dp-c360-name', name: 'customer_name', pk: false },
      { id: 'col-dp-c360-email', name: 'email', pk: false },
      { id: 'col-dp-c360-status', name: 'status', pk: false },
    ],
    natcos: [
      { code: 'de', local: 'Kunde', localCid: 'kunde', term: 'Kunde', tbl: 'kunde', sys: 'CRM-DE', fqn: 'crm_de.public.kunde', col: 'kundennummer', conceptId: 'concept-natco-de-kunde', tblId: 'table-crm-de-kunde', sysId: 'sys-crm-de', dbId: 'db-crm-de', schId: 'schema-crm-de', portIn: 'port-in-crm-de', colId: 'col-crm-de-kundennummer' },
      { code: 'at', local: 'Kunde', localCid: 'kunde', term: 'Kunde', tbl: 'Kunde', sys: 'CRM-AT', fqn: 'crm_at.dbo.Kunde', col: 'kunden_id', conceptId: 'concept-natco-at-kunde', tblId: 'table-crm-at-kunde', sysId: 'sys-crm-at', dbId: 'db-crm-at', schId: 'schema-crm-at', portIn: 'port-in-crm-at', colId: 'col-crm-at-kunden-id' },
      { code: 'hr', local: 'Kupac', localCid: 'kupac', term: 'Kupac', tbl: 'kupac', sys: 'CRM-HR', fqn: 'crm_hr.public.kupac', col: 'kupac_id', conceptId: 'concept-natco-hr-kupac', tblId: 'table-crm-hr-kupac', sysId: 'sys-crm-hr', dbId: 'db-crm-hr', schId: 'schema-crm-hr', portIn: 'port-in-crm-hr', colId: 'col-crm-hr-kupac-id' },
      { code: 'hu', local: 'Ügyfél', localCid: 'ugyfel', term: 'Ügyfél', tbl: 'Ugyfel', sys: 'CRM-HU', fqn: 'crm_hu.dbo.Ugyfel', col: 'ugyfel_azonosito', conceptId: 'concept-natco-hu-ugyfel', tblId: 'table-crm-hu-ugyfel', sysId: 'sys-crm-hu', dbId: 'db-crm-hu', schId: 'schema-crm-hu', portIn: 'port-in-crm-hu', colId: 'col-crm-hu-ugyfel-azonosito' },
      { code: 'pl', local: 'Klient', localCid: 'klient', term: 'Klient', tbl: 'klient', sys: 'CRM-PL', fqn: 'crm_pl.public.klient', col: 'id_klienta', conceptId: 'concept-natco-pl-klient', tblId: 'table-crm-pl-klient', sysId: 'sys-crm-pl', dbId: 'db-crm-pl', schId: 'schema-crm-pl', portIn: 'port-in-crm-pl', colId: 'col-crm-pl-id-klienta' },
    ],
  },
  {
    familyId: 'customer-interactions',
    globalId: 'dp-customer-interactions',
    globalName: 'Customer Interactions',
    owner: 'CX Analytics Team',
    domainId: 'domain-customer',
    domainName: 'Customer',
    conceptId: 'concept-global-CustomerInteraction',
    conceptCid: 'CustomerInteraction',
    conceptLabel: 'Customer Interaction',
    conceptUri: 'https://semantics.example/ns/global/CustomerInteraction',
    tblId: 'table-dp-customer-interactions',
    tblName: 'customer_interaction',
    tblFqn: 'dp.curated.customer_interaction',
    contractId: 'contract-customer-interactions-v1',
    portId: 'port-out-customer-interactions',
    cols: [
      { id: 'col-dp-interaction-id', name: 'interaction_id', pk: true },
      { id: 'col-dp-interaction-customer-id', name: 'customer_id', pk: false },
      { id: 'col-dp-interaction-channel', name: 'channel', pk: false },
      { id: 'col-dp-interaction-at', name: 'occurred_at', pk: false },
    ],
    natcos: NATCOS.map((n) => ({
      ...n,
      local: { de: 'Kundeninteraktion', at: 'Kundeninteraktion', hr: 'Interakcija kupca', hu: 'Ügyfél interakció', pl: 'Interakcja klienta' }[n.code],
      localCid: { de: 'kundeninteraktion', at: 'kundeninteraktion', hr: 'interakcija-kupca', hu: 'ugyfel-interakcio', pl: 'interakcja-klienta' }[n.code],
    })).map((n) => ({
      code: n.code,
      local: n.local,
      localCid: n.localCid,
      term: n.local,
      tbl: n.localCid,
      sys: `${n.code.toUpperCase()}-customer-interactions`,
      fqn: `${n.familyId || 'customer_interactions'}_${n.code}.public.${n.localCid}`,
      col: `${n.localCid}_id`,
      conceptId: `concept-customer-interactions-${n.code}`,
      tblId: `table-customer-interactions-${n.code}`,
      sysId: `sys-customer-interactions-${n.code}`,
      dbId: `db-customer-interactions-${n.code}`,
      schId: `schema-customer-interactions-${n.code}`,
      portIn: `port-in-customer-interactions-${n.code}`,
      colId: `col-customer-interactions-${n.code}-id`,
    })),
  },
  {
    familyId: 'product-orders',
    globalId: 'dp-product-orders',
    globalName: 'Product Orders',
    owner: 'Order Management COE',
    domainId: 'domain-commerce',
    domainName: 'Commerce',
    conceptId: 'concept-global-ProductOrder',
    conceptCid: 'ProductOrder',
    conceptLabel: 'Product Order',
    conceptUri: 'https://semantics.example/ns/global/ProductOrder',
    tblId: 'table-dp-product-orders',
    tblName: 'product_order',
    tblFqn: 'dp.curated.product_order',
    contractId: 'contract-product-orders-v1',
    portId: 'port-out-product-orders',
    cols: [
      { id: 'col-dp-order-id', name: 'order_id', pk: true },
      { id: 'col-dp-order-customer-id', name: 'customer_id', pk: false },
      { id: 'col-dp-order-status', name: 'status', pk: false },
      { id: 'col-dp-order-total', name: 'total_amount', pk: false },
    ],
    natcos: [
      { de: ['Produktauftrag', 'produktauftrag'], at: ['Produktauftrag', 'produktauftrag'], hr: ['Narudžba proizvoda', 'narudzba-proizvoda'], hu: ['Termékrendelés', 'termekrendeles'], pl: ['Zamówienie produktu', 'zamowienie-produktu'] },
    ].flatMap((map) =>
      NATCOS.map((n) => {
        const [local, localCid] = map[n.code]
        return {
          code: n.code,
          local,
          localCid,
          term: local,
          tbl: localCid,
          sys: `${n.code.toUpperCase()}-product-orders`,
          fqn: `product_orders_${n.code}.public.${localCid}`,
          col: `${localCid}_id`,
          conceptId: `concept-product-orders-${n.code}`,
          tblId: `table-product-orders-${n.code}`,
          sysId: `sys-product-orders-${n.code}`,
          dbId: `db-product-orders-${n.code}`,
          schId: `schema-product-orders-${n.code}`,
          portIn: `port-in-product-orders-${n.code}`,
          colId: `col-product-orders-${n.code}-id`,
        }
      }),
    ),
  },
  {
    familyId: 'billing-accounts',
    globalId: 'dp-billing-accounts',
    globalName: 'Billing Accounts',
    owner: 'Revenue Assurance',
    domainId: 'domain-billing',
    domainName: 'Billing',
    conceptId: 'concept-global-BillingAccount',
    conceptCid: 'BillingAccount',
    conceptLabel: 'Billing Account',
    conceptUri: 'https://semantics.example/ns/global/BillingAccount',
    tblId: 'table-dp-billing-accounts',
    tblName: 'billing_account',
    tblFqn: 'dp.curated.billing_account',
    contractId: 'contract-billing-accounts-v1',
    portId: 'port-out-billing-accounts',
    cols: [
      { id: 'col-dp-ba-id', name: 'billing_account_id', pk: true },
      { id: 'col-dp-ba-customer-id', name: 'customer_id', pk: false },
      { id: 'col-dp-ba-currency', name: 'currency', pk: false },
      { id: 'col-dp-ba-balance', name: 'balance', pk: false },
    ],
    natcos: [
      { de: ['Rechnungskonto', 'rechnungskonto'], at: ['Rechnungskonto', 'rechnungskonto'], hr: ['Račun za naplatu', 'racun-za-naplatu'], hu: ['Számlázási számla', 'szamlazasi-szamla'], pl: ['Konto rozliczeniowe', 'konto-rozliczeniowe'] },
    ].flatMap((map) =>
      NATCOS.map((n) => {
        const [local, localCid] = map[n.code]
        return {
          code: n.code,
          local,
          localCid,
          term: local,
          tbl: localCid,
          sys: `${n.code.toUpperCase()}-billing-accounts`,
          fqn: `billing_accounts_${n.code}.public.${localCid}`,
          col: `${localCid}_id`,
          conceptId: `concept-billing-accounts-${n.code}`,
          tblId: `table-billing-accounts-${n.code}`,
          sysId: `sys-billing-accounts-${n.code}`,
          dbId: `db-billing-accounts-${n.code}`,
          schId: `schema-billing-accounts-${n.code}`,
          portIn: `port-in-billing-accounts-${n.code}`,
          colId: `col-billing-accounts-${n.code}-id`,
        }
      }),
    ),
  },
  {
    familyId: 'service-subscriptions',
    globalId: 'dp-service-subscriptions',
    globalName: 'Service Subscriptions',
    owner: 'Service Inventory Team',
    domainId: 'domain-service',
    domainName: 'Service',
    conceptId: 'concept-global-ServiceSubscription',
    conceptCid: 'ServiceSubscription',
    conceptLabel: 'Service Subscription',
    conceptUri: 'https://semantics.example/ns/global/ServiceSubscription',
    tblId: 'table-dp-service-subscriptions',
    tblName: 'service_subscription',
    tblFqn: 'dp.curated.service_subscription',
    contractId: 'contract-service-subscriptions-v1',
    portId: 'port-out-service-subscriptions',
    cols: [
      { id: 'col-dp-sub-id', name: 'subscription_id', pk: true },
      { id: 'col-dp-sub-customer-id', name: 'customer_id', pk: false },
      { id: 'col-dp-sub-service', name: 'service_code', pk: false },
      { id: 'col-dp-sub-status', name: 'status', pk: false },
    ],
    natcos: [
      { de: ['Serviceabonnement', 'serviceabonnement'], at: ['Serviceabonnement', 'serviceabonnement'], hr: ['Pretplata na uslugu', 'pretplata-na-uslugu'], hu: ['Szolgáltatás-előfizetés', 'szolgaltatas-elofizetes'], pl: ['Subskrypcja usługi', 'subskrypcja-uslugi'] },
    ].flatMap((map) =>
      NATCOS.map((n) => {
        const [local, localCid] = map[n.code]
        return {
          code: n.code,
          local,
          localCid,
          term: local,
          tbl: localCid,
          sys: `${n.code.toUpperCase()}-service-subscriptions`,
          fqn: `service_subscriptions_${n.code}.public.${localCid}`,
          col: `${localCid}_id`,
          conceptId: `concept-service-subscriptions-${n.code}`,
          tblId: `table-service-subscriptions-${n.code}`,
          sysId: `sys-service-subscriptions-${n.code}`,
          dbId: `db-service-subscriptions-${n.code}`,
          schId: `schema-service-subscriptions-${n.code}`,
          portIn: `port-in-service-subscriptions-${n.code}`,
          colId: `col-service-subscriptions-${n.code}-id`,
        }
      }),
    ),
  },
]

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n')
}

function writeTypeExample(pack, typeFolder, filename, asset, { primary = false } = {}) {
  const dir = path.join(ROOT, pack, typeFolder)
  if (primary) writeJson(path.join(dir, 'example.json'), asset)
  else writeJson(path.join(dir, 'examples', filename), asset)
}

const written = []

for (const fam of FAMILIES) {
  // —— Global product stack ——
  writeTypeExample(
    'Data Products',
    'Data Product',
    `${fam.globalId}.json`,
    {
      id: fam.globalId,
      contract_id: `ctr-inst-${fam.globalId}`,
      type_contract_id: 'ctr-dp-type-data-product',
      kind: 'data_product',
      asset_type: 'Data Product',
      display_name: fam.globalName,
      name: fam.globalName,
      qualified_name: `products.${fam.globalId}`,
      source_system: 'entropy_marketplace',
      natco: 'global',
      layer: 'product',
      familyId: fam.familyId,
      scope: 'global',
      characteristics: {
        Description: `Global ${fam.globalName} federating DE/AT/HR/HU/PL`,
        Status: 'Published',
        Owner: fam.owner,
      },
      links: {
        domain: fam.domainId,
        output_ports: [fam.portId],
        contracts: [fam.contractId],
        table: fam.tblId,
      },
      implements_concept_ids: [fam.conceptId],
      implements: [fam.conceptUri],
      metadata: {
        owner: fam.owner,
        familyId: fam.familyId,
        pack: 'data-products',
        da: 'DA-10',
      },
    },
    { primary: fam.familyId === 'customer-360' },
  )
  written.push(fam.globalId)

  writeTypeExample('Data Products', 'Data Product Output Port', `${fam.portId}.json`, {
    id: fam.portId,
    contract_id: `ctr-inst-${fam.portId}`,
    type_contract_id: 'ctr-dp-type-output-port',
    kind: 'data_product_output_port',
    asset_type: 'Data Product Output Port',
    display_name: `${fam.tblName}_table`,
    name: `${fam.tblName}_table`,
    qualified_name: `products.${fam.globalId}.ports.out`,
    source_system: 'entropy_marketplace',
    natco: 'global',
    layer: 'product',
    familyId: fam.familyId,
    characteristics: {
      Description: `Output port for ${fam.globalName}`,
      Status: 'Active',
      PortType: 'table',
    },
    links: { data_product: fam.globalId, data_contract: fam.contractId, table: fam.tblId },
    metadata: { portType: 'table', pack: 'data-products' },
  }, { primary: fam.familyId === 'customer-360' })

  writeTypeExample('Data Products', 'Data Contract', `${fam.contractId}.json`, {
    id: fam.contractId,
    contract_id: `ctr-inst-${fam.contractId}`,
    type_contract_id: 'ctr-dp-type-data-contract',
    kind: 'data_contract',
    asset_type: 'Data Contract',
    display_name: `${fam.globalName} Contract`,
    name: `${fam.globalName} Contract`,
    qualified_name: `contracts.${fam.contractId}`,
    source_system: 'entropy_marketplace',
    natco: 'global',
    layer: 'product',
    familyId: fam.familyId,
    characteristics: {
      Description: `ODCS commitments for ${fam.globalName}`,
      Status: 'Active',
      Version: '1.0.0',
      SLA: 'RPO 1h',
    },
    links: {
      data_product: fam.globalId,
      output_port: fam.portId,
      fields: fam.cols.map((c) => `field-${c.id}`),
      table: fam.tblId,
    },
    metadata: { version: '1.0.0', pack: 'data-products', standard: 'ODCS' },
  }, { primary: fam.familyId === 'customer-360' })

  for (const col of fam.cols) {
    const fid = `field-${col.id}`
    writeTypeExample('Data Products', 'Contract Field', `${fid}.json`, {
      id: fid,
      contract_id: `ctr-inst-${fid}`,
      type_contract_id: 'ctr-dp-type-contract-field',
      kind: 'contract_field',
      asset_type: 'Contract Field',
      display_name: col.name,
      name: col.name,
      qualified_name: `contracts.${fam.contractId}.fields.${col.name}`,
      source_system: 'entropy_marketplace',
      natco: 'global',
      layer: 'product',
      familyId: fam.familyId,
      characteristics: {
        Description: `Contract field ${col.name} for ${fam.globalName}`,
        TechnicalDataType: 'STRING',
        IsNullable: !col.pk,
        IsPrimaryKey: col.pk,
        Status: 'Active',
      },
      links: { data_contract: fam.contractId, columns: [col.id] },
      implements_concept_ids: [fam.conceptId],
      metadata: { required: col.pk, dataType: 'string', pack: 'data-products' },
    }, { primary: fam.familyId === 'customer-360' && col.pk })
  }

  writeTypeExample('Semantic Control Plane', 'Concept', `${fam.conceptId}.json`, {
    id: fam.conceptId,
    contract_id: `ctr-inst-${fam.conceptId}`,
    type_contract_id: 'ctr-scp-type-concept',
    kind: 'concept',
    asset_type: 'Concept',
    display_name: fam.conceptLabel,
    name: fam.conceptCid,
    qualified_name: `global/${fam.conceptCid}`,
    source_system: 'semantic_control_plane',
    natco: 'global',
    layer: 'registry',
    familyId: fam.familyId,
    characteristics: {
      ConceptId: fam.conceptCid,
      Uri: fam.conceptUri,
      ConceptKind: 'entity',
      PreferredLabel: fam.conceptLabel,
      Description: `Global ${fam.conceptLabel} (marketplace family ${fam.familyId})`,
      Status: 'approved',
      Version: 1,
      Owner: 'Global Semantic COE',
      Scope: 'global',
    },
    links: { namespace: 'ns-global' },
    metadata: { uri: fam.conceptUri, kind: 'entity', pack: 'semantic-control-plane', da: 'DA-04' },
  }, { primary: fam.familyId === 'customer-360' })

  writeTypeExample('Business Catalog', 'Business Term', `term-global-${fam.conceptCid}.json`, {
    id: `term-global-${fam.conceptCid}`,
    contract_id: `ctr-inst-term-global-${fam.conceptCid}`,
    type_contract_id: 'ctr-biz-type-business-term',
    kind: 'business_term',
    asset_type: 'Business Term',
    display_name: fam.conceptLabel,
    name: fam.conceptLabel,
    qualified_name: `glossary.${fam.conceptCid}`,
    source_system: 'collibra',
    natco: 'global',
    layer: 'glossary',
    familyId: fam.familyId,
    characteristics: {
      Description: `Business term for ${fam.conceptLabel}`,
      Status: 'Approved',
      Owner: fam.owner,
    },
    links: { data_domain: fam.domainId },
    maps_to: [fam.conceptId],
    metadata: { pack: 'business-catalog', da: 'DA-08' },
  }, { primary: fam.familyId === 'customer-360' })

  writeTypeExample('Business Catalog', 'Data Domain', `${fam.domainId}.json`, {
    id: fam.domainId,
    contract_id: `ctr-inst-${fam.domainId}`,
    type_contract_id: 'ctr-biz-type-data-domain',
    kind: 'data_domain',
    asset_type: 'Data Domain',
    display_name: fam.domainName,
    name: fam.domainName,
    qualified_name: `domain.${fam.domainName}`,
    source_system: 'collibra',
    natco: 'global',
    layer: 'conceptual',
    characteristics: {
      Description: `${fam.domainName} subject area`,
      Status: 'Active',
    },
    metadata: { pack: 'business-catalog' },
  }, { primary: fam.domainId === 'domain-customer' })

  writeTypeExample('Technical Catalog', 'Table', `${fam.tblId}.json`, {
    id: fam.tblId,
    contract_id: `ctr-inst-${fam.tblId}`,
    type_contract_id: 'ctr-tech-type-table',
    kind: 'table',
    asset_type: 'Table',
    display_name: fam.tblName,
    name: fam.tblName,
    qualified_name: fam.tblFqn,
    source_system: 'dataplex',
    natco: 'global',
    layer: 'physical',
    familyId: fam.familyId,
    characteristics: {
      Description: `Curated table for ${fam.globalName}`,
      DescriptionFromSourceSystem: fam.tblName,
      TableType: 'TABLE',
      Status: 'Active',
    },
    links: {
      columns: fam.cols.map((c) => c.id),
      represents: [fam.conceptId],
    },
    metadata: {
      fullyQualifiedName: fam.tblFqn,
      pack: 'technical-catalog',
      da: 'DA-09',
      familyId: fam.familyId,
    },
  }, { primary: fam.familyId === 'customer-360' })

  for (const col of fam.cols) {
    writeTypeExample('Technical Catalog', 'Column', `${col.id}.json`, {
      id: col.id,
      contract_id: `ctr-inst-${col.id}`,
      type_contract_id: 'ctr-tech-type-column',
      kind: 'column',
      asset_type: 'Column',
      display_name: col.name,
      name: col.name,
      qualified_name: `${fam.tblFqn}.${col.name}`,
      source_system: 'dataplex',
      natco: 'global',
      layer: 'physical',
      familyId: fam.familyId,
      characteristics: {
        Description: `Column ${col.name} on ${fam.tblName}`,
        TechnicalDataType: 'STRING',
        IsNullable: !col.pk,
        IsPrimaryKey: col.pk,
        Status: 'Active',
      },
      links: { table: fam.tblId, represents: [fam.conceptId] },
      metadata: { dataType: 'varchar', isPrimaryKey: col.pk, pack: 'technical-catalog', da: 'DA-09' },
    }, { primary: fam.familyId === 'customer-360' && col.pk })
  }

  writeTypeExample('Semantic Control Plane', 'Mapping Record', `map-dp-${fam.familyId}-implements.json`, {
    id: `map-dp-${fam.familyId}-implements`,
    contract_id: `ctr-inst-map-dp-${fam.familyId}`,
    type_contract_id: 'ctr-scp-type-mapping-record',
    kind: 'mapping_record',
    asset_type: 'Mapping Record',
    display_name: `${fam.globalName} implements ${fam.conceptLabel}`,
    name: `${fam.globalId}→${fam.conceptId}`,
    qualified_name: `maps.DA-10.${fam.globalId}`,
    source_system: 'semantic_control_plane',
    natco: 'global',
    layer: 'mapping',
    familyId: fam.familyId,
    characteristics: {
      Predicate: 'implements',
      DA: 'DA-10',
      Status: 'approved',
      Confidence: 1,
      Description: `Marketplace product ${fam.globalName} implements ${fam.conceptLabel}`,
    },
    links: { source: fam.globalId, target: fam.conceptId },
    metadata: { kind: 'product_to_concept', da: 'DA-10', pack: 'semantic-control-plane' },
  }, { primary: fam.familyId === 'customer-360' })

  // —— Per-NATCO ——
  for (const n of fam.natcos) {
    const slug = `natco-${n.code}`
    const natProdId = `${fam.globalId}-${n.code}`
    const natPortOut = `port-out-${fam.familyId}-${n.code}`
    const natContract = `contract-${fam.familyId}-${n.code}-v1`
    const natField = `field-${fam.familyId}-${n.code}-id`
    const fedId = `fed-${fam.familyId}-${n.code}`

    writeTypeExample('Data Products', 'Data Product', `${natProdId}.json`, {
      id: natProdId,
      contract_id: `ctr-inst-${natProdId}`,
      type_contract_id: 'ctr-dp-type-data-product',
      kind: 'data_product',
      asset_type: 'Data Product',
      display_name: `${NATCOS.find((x) => x.code === n.code).label} · ${n.local}`,
      name: `${NATCOS.find((x) => x.code === n.code).label} · ${n.local}`,
      qualified_name: `products.${natProdId}`,
      source_system: 'entropy_marketplace',
      natco: slug,
      layer: 'product',
      familyId: fam.familyId,
      scope: 'natco',
      characteristics: {
        Description: `NATCO ${NATCOS.find((x) => x.code === n.code).label} equivalent of ${fam.globalName}`,
        Status: 'Published',
        Owner: `${slug}-data-office`,
      },
      links: {
        domain: fam.domainId,
        output_ports: [natPortOut],
        contracts: [natContract],
        table: n.tblId,
        global_product: fam.globalId,
      },
      implements_concept_ids: [n.conceptId, fam.conceptId],
      metadata: {
        owner: `${slug}-data-office`,
        familyId: fam.familyId,
        scope: 'natco',
        natco: slug,
        pack: 'data-products',
        da: 'DA-10',
      },
    })

    writeTypeExample('Data Products', 'Data Product Output Port', `${natPortOut}.json`, {
      id: natPortOut,
      contract_id: `ctr-inst-${natPortOut}`,
      type_contract_id: 'ctr-dp-type-output-port',
      kind: 'data_product_output_port',
      asset_type: 'Data Product Output Port',
      display_name: `${n.localCid}_out`,
      name: `${n.localCid}_out`,
      qualified_name: `products.${natProdId}.ports.out`,
      source_system: 'entropy_marketplace',
      natco: slug,
      layer: 'product',
      familyId: fam.familyId,
      characteristics: { Description: `NATCO output port`, Status: 'Active', PortType: 'table' },
      links: { data_product: natProdId, data_contract: natContract, table: n.tblId },
      metadata: { portType: 'table', natco: slug, pack: 'data-products' },
    })

    writeTypeExample('Data Products', 'Data Product Input Port', `${n.portIn}.json`, {
      id: n.portIn,
      contract_id: `ctr-inst-${n.portIn}`,
      type_contract_id: 'ctr-dp-type-input-port',
      kind: 'data_product_input_port',
      asset_type: 'Data Product Input Port',
      display_name: `${n.localCid}_in`,
      name: `${n.localCid}_in`,
      qualified_name: `products.${fam.globalId}.ports.in.${n.code}`,
      source_system: 'entropy_marketplace',
      natco: slug,
      layer: 'product',
      familyId: fam.familyId,
      characteristics: { Description: `Global product reads NATCO ${n.local}`, Status: 'Active', PortType: 'table' },
      links: { data_product: fam.globalId, table: n.tblId },
      metadata: { portType: 'table', natco: slug, pack: 'data-products' },
    }, { primary: fam.familyId === 'customer-360' && n.code === 'de' })

    writeTypeExample('Data Products', 'Data Contract', `${natContract}.json`, {
      id: natContract,
      contract_id: `ctr-inst-${natContract}`,
      type_contract_id: 'ctr-dp-type-data-contract',
      kind: 'data_contract',
      asset_type: 'Data Contract',
      display_name: `${NATCOS.find((x) => x.code === n.code).label} · ${n.local} Contract`,
      name: `${NATCOS.find((x) => x.code === n.code).label} · ${n.local} Contract`,
      qualified_name: `contracts.${natContract}`,
      source_system: 'entropy_marketplace',
      natco: slug,
      layer: 'product',
      familyId: fam.familyId,
      characteristics: {
        Description: `NATCO ODCS for ${n.local}`,
        Status: 'Active',
        Version: '1.0.0',
      },
      links: { data_product: natProdId, fields: [natField], table: n.tblId },
      metadata: { version: '1.0.0', natco: slug, pack: 'data-products' },
    })

    writeTypeExample('Data Products', 'Contract Field', `${natField}.json`, {
      id: natField,
      contract_id: `ctr-inst-${natField}`,
      type_contract_id: 'ctr-dp-type-contract-field',
      kind: 'contract_field',
      asset_type: 'Contract Field',
      display_name: n.col,
      name: n.col,
      qualified_name: `contracts.${natContract}.fields.${n.col}`,
      source_system: 'entropy_marketplace',
      natco: slug,
      layer: 'product',
      familyId: fam.familyId,
      characteristics: {
        Description: `NATCO identity field ${n.col}`,
        TechnicalDataType: 'STRING',
        IsPrimaryKey: true,
        Status: 'Active',
      },
      links: { data_contract: natContract, columns: [n.colId] },
      implements_concept_ids: [n.conceptId, fam.conceptId],
      metadata: { required: true, natco: slug, pack: 'data-products' },
    })

    writeTypeExample('Semantic Control Plane', 'Concept', `${n.conceptId}.json`, {
      id: n.conceptId,
      contract_id: `ctr-inst-${n.conceptId}`,
      type_contract_id: 'ctr-scp-type-concept',
      kind: 'concept',
      asset_type: 'Concept',
      display_name: n.local,
      name: n.localCid,
      qualified_name: `${slug}/${n.localCid}`,
      source_system: 'semantic_control_plane',
      natco: slug,
      layer: 'registry',
      familyId: fam.familyId,
      characteristics: {
        ConceptId: n.localCid,
        Uri: `https://semantics.example/ns/${slug}/${n.localCid}`,
        ConceptKind: 'entity',
        PreferredLabel: n.local,
        Description: `${NATCOS.find((x) => x.code === n.code).label} local concept for ${fam.conceptLabel}`,
        Status: 'approved',
        Scope: 'natco',
        Owner: `${slug}-data-office`,
      },
      links: { namespace: `ns-${slug}`, federation: [fedId] },
      metadata: { kind: 'entity', scope: 'natco', pack: 'semantic-control-plane', da: 'DA-04' },
    }, { primary: false })

    writeTypeExample('Semantic Control Plane', 'Federation Edge', `${fedId}.json`, {
      id: fedId,
      contract_id: `ctr-inst-${fedId}`,
      type_contract_id: 'ctr-scp-type-federation-edge',
      kind: 'federation_edge',
      asset_type: 'Federation Edge',
      display_name: `${n.local} sameAs ${fam.conceptLabel}`,
      name: `${n.conceptId}→${fam.conceptId}`,
      qualified_name: `fed.DA-11.${n.conceptId}`,
      source_system: 'semantic_control_plane',
      natco: slug,
      layer: 'federation',
      familyId: fam.familyId,
      characteristics: {
        Predicate: 'sameAs',
        DA: 'DA-11',
        Status: 'approved',
        Description: `Federate ${n.local} to global ${fam.conceptLabel}`,
      },
      links: { from: n.conceptId, to: fam.conceptId },
      metadata: { predicate: 'sameAs', da: 'DA-11', pack: 'semantic-control-plane' },
    }, { primary: fam.familyId === 'customer-360' && n.code === 'de' })

    writeTypeExample('Business Catalog', 'Business Term', `term-${fam.familyId}-${n.code}.json`, {
      id: fam.familyId === 'customer-360' ? `term-${slug}-customer` : `term-${fam.familyId}-${n.code}`,
      contract_id: `ctr-inst-term-${fam.familyId}-${n.code}`,
      type_contract_id: 'ctr-biz-type-business-term',
      kind: 'business_term',
      asset_type: 'Business Term',
      display_name: n.term,
      name: n.term,
      qualified_name: `glossary.${slug}.${n.localCid}`,
      source_system: 'collibra',
      natco: slug,
      layer: 'glossary',
      familyId: fam.familyId,
      characteristics: {
        Description: `${NATCOS.find((x) => x.code === n.code).label} term for ${fam.conceptLabel}`,
        Status: 'Approved',
        Owner: `${slug}-data-office`,
      },
      links: { data_domain: fam.domainId },
      maps_to: [fam.conceptId],
      metadata: { natco: slug, pack: 'business-catalog', da: 'DA-08', familyId: fam.familyId },
    })

    writeTypeExample('Technical Catalog', 'System', `${n.sysId}.json`, {
      id: n.sysId,
      contract_id: `ctr-inst-${n.sysId}`,
      type_contract_id: 'ctr-tech-type-system',
      kind: 'system',
      asset_type: 'System',
      display_name: n.sys,
      name: n.sys,
      qualified_name: `systems.${n.sysId}`,
      source_system: 'collibra',
      natco: slug,
      layer: 'physical',
      familyId: fam.familyId,
      characteristics: { Description: `${n.sys} for ${fam.globalName}`, Status: 'Active' },
      links: { databases: [n.dbId] },
      metadata: { natco: slug, pack: 'technical-catalog', familyId: fam.familyId },
    }, { primary: fam.familyId === 'customer-360' && n.code === 'de' })

    writeTypeExample('Technical Catalog', 'Database', `${n.dbId}.json`, {
      id: n.dbId,
      contract_id: `ctr-inst-${n.dbId}`,
      type_contract_id: 'ctr-tech-type-database',
      kind: 'database',
      asset_type: 'Database',
      display_name: n.dbId.replace(/^db-/, ''),
      name: n.dbId.replace(/^db-/, ''),
      qualified_name: `db.${n.dbId}`,
      source_system: 'collibra',
      natco: slug,
      layer: 'physical',
      familyId: fam.familyId,
      characteristics: { Description: `Database for ${n.local}`, Status: 'Active' },
      links: { system: n.sysId, schemas: [n.schId] },
      metadata: { natco: slug, pack: 'technical-catalog' },
    }, { primary: fam.familyId === 'customer-360' && n.code === 'de' })

    writeTypeExample('Technical Catalog', 'Schema', `${n.schId}.json`, {
      id: n.schId,
      contract_id: `ctr-inst-${n.schId}`,
      type_contract_id: 'ctr-tech-type-schema',
      kind: 'schema',
      asset_type: 'Schema',
      display_name: 'public',
      name: 'public',
      qualified_name: `${n.dbId}.public`,
      source_system: 'collibra',
      natco: slug,
      layer: 'physical',
      familyId: fam.familyId,
      characteristics: { Description: 'Default schema', Status: 'Active' },
      links: { database: n.dbId, tables: [n.tblId] },
      metadata: { natco: slug, pack: 'technical-catalog' },
    }, { primary: fam.familyId === 'customer-360' && n.code === 'de' })

    writeTypeExample('Technical Catalog', 'Table', `${n.tblId}.json`, {
      id: n.tblId,
      contract_id: `ctr-inst-${n.tblId}`,
      type_contract_id: 'ctr-tech-type-table',
      kind: 'table',
      asset_type: 'Table',
      display_name: n.tbl,
      name: n.tbl,
      qualified_name: n.fqn,
      source_system: 'collibra',
      natco: slug,
      layer: 'physical',
      familyId: fam.familyId,
      characteristics: {
        Description: `NATCO table ${n.tbl} (${fam.globalName})`,
        DescriptionFromSourceSystem: n.tbl,
        TableType: 'TABLE',
        Status: 'Active',
      },
      links: {
        schema: n.schId,
        columns: [n.colId],
        represents: [n.conceptId, fam.conceptId],
        input_port: n.portIn,
      },
      metadata: {
        fullyQualifiedName: n.fqn,
        natco: slug,
        pack: 'technical-catalog',
        da: 'DA-09',
        familyId: fam.familyId,
        termName: n.term,
        sysName: n.sys,
      },
    })

    writeTypeExample('Technical Catalog', 'Column', `${n.colId}.json`, {
      id: n.colId,
      contract_id: `ctr-inst-${n.colId}`,
      type_contract_id: 'ctr-tech-type-column',
      kind: 'column',
      asset_type: 'Column',
      display_name: n.col,
      name: n.col,
      qualified_name: `${n.fqn}.${n.col}`,
      source_system: 'collibra',
      natco: slug,
      layer: 'physical',
      familyId: fam.familyId,
      characteristics: {
        Description: `Identity column ${n.col}`,
        TechnicalDataType: 'STRING',
        IsPrimaryKey: true,
        Status: 'Active',
      },
      links: { table: n.tblId, represents: [n.conceptId, fam.conceptId] },
      metadata: { dataType: 'varchar', isPrimaryKey: true, natco: slug, pack: 'technical-catalog', da: 'DA-09' },
    })

    writeTypeExample('Semantic Control Plane', 'Mapping Record', `map-term-${fam.familyId}-${n.code}.json`, {
      id: `map-term-${fam.familyId}-${n.code}`,
      contract_id: `ctr-inst-map-term-${fam.familyId}-${n.code}`,
      type_contract_id: 'ctr-scp-type-mapping-record',
      kind: 'mapping_record',
      asset_type: 'Mapping Record',
      display_name: `${n.term} mapsTo ${fam.conceptLabel}`,
      name: `term→${fam.conceptId}`,
      qualified_name: `maps.DA-08.${fam.familyId}.${n.code}`,
      source_system: 'semantic_control_plane',
      natco: slug,
      layer: 'mapping',
      familyId: fam.familyId,
      characteristics: {
        Predicate: 'mapsTo',
        DA: 'DA-08',
        Status: 'approved',
        Confidence: 1,
        Description: `NATCO term maps to global concept`,
      },
      links: {
        source: fam.familyId === 'customer-360' ? `term-${slug}-customer` : `term-${fam.familyId}-${n.code}`,
        target: fam.conceptId,
      },
      metadata: { kind: 'business_to_concept', da: 'DA-08', natco: slug, pack: 'semantic-control-plane' },
    })

    written.push(natProdId)
  }
}

// Rebuild pack indexes (refs)
function rebuildIndex(pack) {
  const packRoot = path.join(ROOT, pack)
  const assets = []
  function walk(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name)
      if (ent.isDirectory()) {
        if (ent.name === 'shared' || ent.name === 'scripts') continue
        walk(full)
      } else if (
        ent.name === 'example.json' ||
        ((path.basename(dir) === 'examples' || dir.includes(`${path.sep}examples${path.sep}`)) &&
          ent.name.endsWith('.json'))
      ) {
        const rel = path.relative(packRoot, full).split(path.sep).join('/')
        if (rel.startsWith('examples/')) continue
        if (['namespaces.json', 'multi-natco-customer.json', 'index.json'].includes(ent.name)) continue
        const d = JSON.parse(fs.readFileSync(full, 'utf8'))
        if (!d.id || !(d.kind || d.asset_type)) continue
        assets.push({
          id: d.id,
          asset_type: d.asset_type,
          kind: d.kind,
          natco: d.natco ?? null,
          familyId: d.familyId ?? d.metadata?.familyId ?? null,
          ref: rel,
        })
      }
    }
  }
  walk(packRoot)
  writeJson(path.join(packRoot, 'examples', 'index.json'), {
    meta: {
      title: `${pack} — example instance index`,
      note: 'SoR is per-type example.json (+ Type/examples/*.json). Generated multi-NATCO / multi-DP enrich.',
      generated: new Date().toISOString().slice(0, 10),
      version: '2.1.0',
      asset_count: assets.length,
    },
    assets,
  })
  return assets.length
}

const counts = {}
for (const pack of ['Data Products', 'Business Catalog', 'Technical Catalog', 'Semantic Control Plane']) {
  counts[pack] = rebuildIndex(pack)
}

console.log(JSON.stringify({ products_written: written.length, index_counts: counts }, null, 2))
