#!/usr/bin/env node
/**
 * Generate UDP-Pattern mock contracts + context graph.
 *
 * Canonical meaning is Google Universal Commerce Protocol (UCP) shopping —
 * same role TM Forum SID plays for UDP-DT.
 *
 * Spec: https://ucp.dev/2026-04-08/specification/reference/
 * Google implementation: https://developers.google.com/merchant/ucp/guides
 * Pattern operating model: https://www.pattern.com/#what-we-do
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { compileProject, mirrorCompiled, seedOssiePackage, writeAuthoredProject } from './lib/project-mock-layout.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const UCP = {
  version: '2026-04-08',
  namespace: 'ucp.shopping',
  spec: 'https://ucp.dev/2026-04-08/specification/reference/',
  googleGuide: 'https://developers.google.com/merchant/ucp/guides',
}

const MARKETPLACES = [
  { id: 'amazon', label: 'Amazon', listing: 'ASIN', table: 'amz.catalog.listing', column: 'asin', ucpTarget: 'concept-variant' },
  { id: 'tiktok', label: 'TikTok Shop', listing: 'Product ID', table: 'tts.catalog.product', column: 'product_id', ucpTarget: 'concept-product' },
  { id: 'tmall', label: 'Tmall Global', listing: 'Item ID', table: 'tmall.item.sku', column: 'item_id', ucpTarget: 'concept-product' },
]

/** UCP capability schemas that seed the global model (SID analog). */
const UCP_CONCEPTS = [
  {
    id: 'concept-product',
    name: 'Product',
    qname: 'ucp.shopping/Product',
    contract_id: 'ctr-sem-ucp-product',
    description:
      'UCP Product — Global ID (GID) uniquely identifying a sellable product (title, description, url, categories, price_range, variants).',
    hub: true,
  },
  {
    id: 'concept-variant',
    name: 'Variant',
    qname: 'ucp.shopping/Variant',
    contract_id: 'ctr-sem-ucp-variant',
    description:
      'UCP Variant — purchasable SKU of a Product. GID is used as item.id in checkout; sku and barcodes correlate across marketplaces.',
    hub: true,
  },
  {
    id: 'concept-line-item',
    name: 'LineItem',
    qname: 'ucp.shopping/LineItem',
    contract_id: 'ctr-sem-ucp-line-item',
    description: 'UCP Line Item — item (Variant GID) + quantity + totals on a Cart or Checkout.',
  },
  {
    id: 'concept-cart',
    name: 'Cart',
    qname: 'ucp.shopping/Cart',
    contract_id: 'ctr-sem-ucp-cart',
    description: 'UCP Cart — pre-checkout basket with line_items, currency, and estimated totals.',
  },
  {
    id: 'concept-checkout',
    name: 'Checkout',
    qname: 'ucp.shopping/Checkout',
    contract_id: 'ctr-sem-ucp-checkout',
    description:
      'UCP Checkout session — native checkout on Google AI surfaces (create / update / complete). Status lifecycle incomplete → completed.',
  },
  {
    id: 'concept-order',
    name: 'Order',
    qname: 'ucp.shopping/Order',
    contract_id: 'ctr-sem-ucp-order',
    description: 'UCP Order — post-purchase record bound to checkout_id, line_items, fulfillment, and totals (GMV source).',
  },
  {
    id: 'concept-fulfillment',
    name: 'Fulfillment',
    qname: 'ucp.shopping/Fulfillment',
    contract_id: 'ctr-sem-ucp-fulfillment',
    description: 'UCP Fulfillment — buyer expectations and what actually shipped (methods, destinations, events).',
  },
  {
    id: 'concept-buyer',
    name: 'Buyer',
    qname: 'ucp.shopping/Buyer',
    contract_id: 'ctr-sem-ucp-buyer',
    description: 'UCP Buyer — first_name, last_name, email, phone. Guest checkout default; identity linking optional.',
  },
  {
    id: 'concept-payment-handler',
    name: 'PaymentHandler',
    qname: 'ucp.shopping/PaymentHandler',
    contract_id: 'ctr-sem-ucp-payment-handler',
    description: 'UCP Payment Handler — processor (e.g. Google Pay) separate from the buyer instrument.',
  },
  {
    id: 'concept-merchant-profile',
    name: 'MerchantProfile',
    qname: 'ucp.shopping/MerchantProfile',
    contract_id: 'ctr-sem-ucp-merchant-profile',
    description:
      'UCP profile published at /.well-known/ucp — services, capabilities (checkout, fulfillment, discount, order), and payment handlers.',
  },
  {
    id: 'concept-attribution',
    name: 'Attribution',
    qname: 'ucp.shopping/Attribution',
    contract_id: 'ctr-sem-ucp-attribution',
    description: 'UCP Attribution — platform-emitted campaign, click, and source/medium context on Cart/Checkout.',
  },
]

const FAMILIES = [
  {
    id: 'brand-catalog-360',
    domain: 'Catalog',
    name: 'Brand Catalog 360',
    owner: 'PXM / Catalog Ops',
    concept: 'Product',
    conceptId: 'concept-product',
    implements: 'ucp.shopping/Product',
    description:
      'PXM hub that materializes UCP Product + Variant GIDs so SPANX, Zyliss, Pura, and NaturVet share one catalog identity across marketplaces and Google AI surfaces.',
  },
  {
    id: 'marketplace-performance',
    domain: 'Commerce',
    name: 'Marketplace Performance',
    owner: 'Pattern Intelligence',
    concept: 'Order',
    conceptId: 'concept-order',
    implements: 'ucp.shopping/Order',
    description: 'GMV, wholesale, and category-share derived from UCP Order totals across Amazon, TikTok Shop, and Tmall.',
  },
  {
    id: 'fulfillment-ops',
    domain: 'Fulfillment',
    name: 'Fulfillment Operations',
    owner: 'Pattern Warehouses',
    concept: 'Fulfillment',
    conceptId: 'concept-fulfillment',
    implements: 'ucp.shopping/Fulfillment',
    description: 'Prep, middle-mile, and DTC shipments implementing UCP Fulfillment (8m+ units / month operating model).',
  },
  {
    id: 'catalog-advertising',
    domain: 'Advertising',
    name: 'Catalog Advertising',
    owner: 'Catalog Advertising',
    concept: 'Attribution',
    conceptId: 'concept-attribution',
    implements: 'ucp.shopping/Attribution',
    description: 'Product-level ad spend and ROAS bound to the same UCP Product GID as PXM ($1.8b ad spend model).',
  },
  {
    id: 'social-commerce',
    domain: 'Social',
    name: 'Social Commerce',
    owner: 'TikTok Shop Partnership',
    concept: 'Product',
    conceptId: 'concept-product',
    implements: 'ucp.shopping/Product',
    description: 'Creator / affiliate events keyed to the same UCP Product GID as Brand Catalog 360.',
  },
  {
    id: 'pattern-intelligence',
    domain: 'Operations',
    name: 'Pattern Intelligence',
    owner: 'Pi Sensor Platform',
    concept: 'MerchantProfile',
    conceptId: 'concept-merchant-profile',
    implements: 'ucp.shopping/MerchantProfile',
    description: '90+ live sensors over UCP Product, Checkout, Order, and Fulfillment — 160+ diagnostics on 91T+ data points.',
  },
]

function contract(partial) {
  return {
    status: 'Approved',
    ...partial,
    name: partial.name ?? partial.display_name,
    display_name: partial.display_name ?? partial.name,
  }
}

const contracts = {}

function add(c) {
  contracts[c.id] = contract(c)
}

add({
  id: 'ns-ucp',
  contract_id: 'ctr-ns-ucp',
  type_contract_id: 'ctr-sem-type-namespace',
  kind: 'namespace',
  asset_type: 'Namespace',
  display_name: UCP.namespace,
  natco: 'global',
  standard: 'UCP',
  standard_version: UCP.version,
  spec_url: UCP.spec,
  description:
    'Canonical shopping namespace — Universal Commerce Protocol (UCP). Pattern global and every marketplace federate here, the way NATCOs federate to TM Forum SID Customer.',
  links: { concepts: [] },
})

add({
  id: 'ns-pattern',
  contract_id: 'ctr-ns-pattern',
  type_contract_id: 'ctr-sem-type-namespace',
  kind: 'namespace',
  asset_type: 'Namespace',
  display_name: 'pattern-global',
  natco: 'global',
  aligns_to: ['ns-ucp'],
  description:
    'Pattern enterprise overlay on UCP — Brand, PXM, Pi sensors. Does not fork Product/Variant meaning.',
  links: { concepts: [] },
})

for (const c of UCP_CONCEPTS) {
  add({
    id: c.id,
    contract_id: c.contract_id,
    type_contract_id: 'ctr-sem-type-concept',
    kind: 'semantic_concept',
    asset_type: 'Concept',
    display_name: c.name,
    qualified_name: c.qname,
    natco: 'global',
    namespace: UCP.namespace,
    standard: 'UCP',
    standard_version: UCP.version,
    spec_url: UCP.spec,
    description: c.description,
    links: { namespace: 'ns-ucp' },
  })
}

add({
  id: 'concept-brand',
  contract_id: 'ctr-sem-brand',
  type_contract_id: 'ctr-sem-type-concept',
  kind: 'semantic_concept',
  asset_type: 'Concept',
  display_name: 'Brand',
  qualified_name: 'pattern-global/Brand',
  natco: 'global',
  maps_to: ['concept-product'],
  namespace: 'pattern-global',
  links: { namespace: 'ns-pattern' },
  description:
    'Pattern overlay: a brand Pattern accelerates (SPANX, Zyliss, Pura, NaturVet). Maps to UCP Product seller / metadata — not a second product identity.',
})

add({
  id: 'concept-gmc-offer',
  contract_id: 'ctr-sem-gmc-offer',
  type_contract_id: 'ctr-sem-type-concept',
  kind: 'semantic_concept',
  asset_type: 'Concept',
  display_name: 'MerchantCenterOffer',
  qualified_name: 'google.merchant/Offer',
  natco: 'global',
  maps_to: ['concept-variant'],
  namespace: UCP.namespace,
  links: { namespace: 'ns-ucp' },
  description:
    'Google Merchant Center offer_id from the shopping feed used for UCP discovery on Search and Gemini. sameAs UCP Variant GID.',
})

for (const fam of FAMILIES) {
  add({
    id: `term-${fam.id}`,
    contract_id: `ctr-biz-${fam.id}`,
    type_contract_id: 'ctr-biz-type-business-term',
    kind: 'business_term',
    asset_type: 'Business Term',
    display_name: fam.name,
    natco: 'global',
    maps_to: [fam.conceptId],
    description: `Business glossary term for ${fam.name} — maps to ${fam.implements}.`,
  })
  add({
    id: `dp-${fam.id}`,
    contract_id: `ctr-prod-${fam.id}`,
    type_contract_id: 'ctr-prod-type-data-product',
    kind: 'data_product',
    asset_type: 'Data Product',
    display_name: fam.name,
    natco: 'global',
    product_class: 'ADP',
    ossie_model: 'ucp_shopping',
    ossie_dataset: fam.conceptId === 'concept-variant' ? 'variant' : fam.conceptId === 'concept-product' ? 'product' : fam.conceptId === 'concept-order' ? 'product' : 'product',
    implements: fam.implements,
    description: fam.description,
    owner: fam.owner,
  })
  add({
    id: `contract-${fam.id}-v1`,
    contract_id: `ctr-gov-${fam.id}`,
    type_contract_id: 'ctr-prod-type-data-contract',
    kind: 'data_contract',
    asset_type: 'Data Contract',
    display_name: `ODCS · ${fam.id}`,
    natco: 'global',
    description: `Governing contract for ${fam.name} bound to ${fam.implements}.`,
  })
  add({
    id: `domain-${fam.domain.toLowerCase()}`,
    contract_id: `ctr-biz-domain-${fam.domain.toLowerCase()}`,
    type_contract_id: 'ctr-biz-type-data-domain',
    kind: 'data_domain',
    asset_type: 'Data Domain',
    display_name: fam.domain,
    natco: 'global',
    description: `${fam.domain} domain in the Pattern control plane.`,
  })
}

add({
  id: 'sys-pattern-platform',
  contract_id: 'ctr-tech-sys-pattern',
  type_contract_id: 'ctr-tech-type-system',
  kind: 'system',
  asset_type: 'System',
  display_name: 'Pattern Intelligence Platform',
  natco: 'global',
  description: 'Pi + Destiny analytics over UCP Product, Order, and Fulfillment.',
})
add({
  id: 'sys-merchant-center',
  contract_id: 'ctr-tech-sys-gmc',
  type_contract_id: 'ctr-tech-type-system',
  kind: 'system',
  asset_type: 'System',
  display_name: 'Google Merchant Center',
  natco: 'global',
  description:
    'Product feed + shipping/returns config that enables UCP discovery on Google AI surfaces (Search, Gemini).',
  spec_url: UCP.googleGuide,
})
add({
  id: 'sys-google-pay',
  contract_id: 'ctr-tech-sys-gpay',
  type_contract_id: 'ctr-tech-type-system',
  kind: 'system',
  asset_type: 'System',
  display_name: 'Google Pay',
  natco: 'global',
  description: 'UCP payment handler — Google Wallet credentials on native checkout.',
})
add({
  id: 'db-pattern',
  contract_id: 'ctr-tech-db-pattern',
  type_contract_id: 'ctr-tech-type-database',
  kind: 'database',
  asset_type: 'Database',
  display_name: 'pattern_lake',
  natco: 'global',
})
add({
  id: 'schema-pattern-curated',
  contract_id: 'ctr-tech-schema-pattern',
  type_contract_id: 'ctr-tech-type-schema',
  kind: 'schema',
  asset_type: 'Schema',
  display_name: 'curated',
  natco: 'global',
})
add({
  id: 'tbl-product-360',
  contract_id: 'ctr-tech-tbl-product',
  type_contract_id: 'ctr-tech-type-table',
  kind: 'table',
  asset_type: 'Table',
  display_name: 'ucp.product_360',
  natco: 'global',
  description: 'Curated hub table for Brand Catalog 360 — one row per UCP Product GID.',
})
add({
  id: 'col-product-gid',
  contract_id: 'ctr-tech-col-product-gid',
  type_contract_id: 'ctr-tech-type-column',
  kind: 'column',
  asset_type: 'Column',
  display_name: 'product_gid',
  natco: 'global',
  description: 'UCP Product.id (GID). Canonical key for catalog, ads, social, and Pi.',
})
add({
  id: 'col-variant-gid',
  contract_id: 'ctr-tech-col-variant-gid',
  type_contract_id: 'ctr-tech-type-column',
  kind: 'column',
  asset_type: 'Column',
  display_name: 'variant_gid',
  natco: 'global',
  description: 'UCP Variant.id (GID). Used as item.id on Cart and Checkout line items.',
})
add({
  id: 'tbl-gmc-offer',
  contract_id: 'ctr-tech-tbl-gmc',
  type_contract_id: 'ctr-tech-type-table',
  kind: 'table',
  asset_type: 'Table',
  display_name: 'gmc.products.offer',
  natco: 'global',
  description: 'Merchant Center product feed used for UCP discovery.',
})
add({
  id: 'col-offer-id',
  contract_id: 'ctr-tech-col-offer',
  type_contract_id: 'ctr-tech-type-column',
  kind: 'column',
  asset_type: 'Column',
  display_name: 'offer_id',
  natco: 'global',
  description: 'Merchant Center offer identifier — federates to UCP Variant GID.',
})

for (const m of MARKETPLACES) {
  add({
    id: `ns-${m.id}`,
    contract_id: `ctr-ns-${m.id}`,
    type_contract_id: 'ctr-sem-type-namespace',
    kind: 'namespace',
    asset_type: 'Namespace',
    display_name: m.label,
    natco: m.id,
    aligns_to: ['ns-ucp'],
    description: `${m.label} marketplace namespace — local “${m.listing}” federates to ${UCP.namespace} without forking meaning.`,
    links: { concepts: [] },
  })
  add({
    id: `concept-${m.id}-listing`,
    contract_id: `ctr-sem-${m.id}-listing`,
    type_contract_id: 'ctr-sem-type-concept',
    kind: 'semantic_concept',
    asset_type: 'Concept',
    display_name: m.listing,
    natco: m.id,
    maps_to: [m.ucpTarget],
    namespace: m.label,
    links: { namespace: `ns-${m.id}` },
    description: `${m.label} local listing identifier (${m.column}) — sameAs ${m.ucpTarget === 'concept-variant' ? 'ucp.shopping/Variant' : 'ucp.shopping/Product'}.`,
  })
  add({
    id: `term-${m.id}-listing`,
    contract_id: `ctr-biz-${m.id}-listing`,
    type_contract_id: 'ctr-biz-type-business-term',
    kind: 'business_term',
    asset_type: 'Business Term',
    display_name: m.listing,
    natco: m.id,
    maps_to: [m.ucpTarget],
  })
  add({
    id: `tbl-${m.id}-listing`,
    contract_id: `ctr-tech-${m.id}-listing`,
    type_contract_id: 'ctr-tech-type-table',
    kind: 'table',
    asset_type: 'Table',
    display_name: m.table,
    natco: m.id,
    description: `${m.label} source listing table.`,
  })
  add({
    id: `col-${m.id}-id`,
    contract_id: `ctr-tech-${m.id}-col`,
    type_contract_id: 'ctr-tech-type-column',
    kind: 'column',
    asset_type: 'Column',
    display_name: m.column,
    natco: m.id,
    description: `${m.label} source listing key.`,
  })
  add({
    id: `sys-${m.id}`,
    contract_id: `ctr-tech-sys-${m.id}`,
    type_contract_id: 'ctr-tech-type-system',
    kind: 'system',
    asset_type: 'System',
    display_name: `${m.label} Seller API`,
    natco: m.id,
  })
  for (const fam of FAMILIES) {
    add({
      id: `dp-${fam.id}-${m.id}`,
      contract_id: `ctr-prod-${fam.id}-${m.id}`,
      type_contract_id: 'ctr-prod-type-data-product',
      kind: 'data_product',
      asset_type: 'Data Product',
      display_name: `${m.label} · ${fam.name}`,
      natco: m.id,
      product_class: 'SDP',
      ossie_model: 'ucp_shopping',
      ossie_dataset: m.id === 'amazon' ? 'amazon_listing' : m.id === 'tiktok' ? 'tiktok_product' : 'tmall_item',
      implements: `${m.id}/${m.listing.replace(/\s+/g, '-')} → ${fam.implements}`,
      description: `${m.label} SDP equivalent of ${fam.name} — local “${m.listing}” federates to ${fam.implements}.`,
    })
    add({
      id: `contract-${fam.id}-${m.id}-v1`,
      contract_id: `ctr-gov-${fam.id}-${m.id}`,
      type_contract_id: 'ctr-prod-type-data-contract',
      kind: 'data_contract',
      asset_type: 'Data Contract',
      display_name: `ODCS · ${fam.id} · ${m.id}`,
      natco: m.id,
    })
  }
}

add({
  id: 'ossie-pattern-ucp-shopping',
  contract_id: 'ctr-ossie-pattern-ucp-shopping',
  type_contract_id: 'ctr-scp-type-ossie-model',
  kind: 'ossie_semantic_model',
  asset_type: 'Ossie Semantic Model',
  display_name: 'ucp_shopping',
  natco: 'global',
  ossie_version: '0.2.0.dev0',
  spec_url: 'https://github.com/apache/ossie/blob/main/core-spec/spec.md',
  package_file: 'mock-data/projects/udp-pattern/scopes/global/technical-catalogue/entity/apache-ossie/semantic-model.json',
  description:
    'Apache Ossie interchange for UDP-Pattern. SDP marketplace listings feed ADP Product/Variant; CDP checkout_session serves Google native checkout.',
})
add({
  id: 'dp-cdp-google-checkout',
  contract_id: 'ctr-prod-cdp-google-checkout',
  type_contract_id: 'ctr-prod-type-data-product',
  kind: 'data_product',
  asset_type: 'Data Product',
  display_name: 'Google UCP Checkout',
  natco: 'global',
  product_class: 'CDP',
  ossie_model: 'ucp_shopping',
  ossie_dataset: 'checkout_session',
  implements: 'ucp.shopping/Checkout',
  owner: 'Pattern Intelligence / Google UCP',
  description:
    'Consumer-aligned checkout sessions for Search / Gemini — line_items.item.id is UCP Variant GID.',
})
add({
  id: 'contract-cdp-google-checkout-v1',
  contract_id: 'ctr-gov-cdp-google-checkout',
  type_contract_id: 'ctr-prod-type-data-contract',
  kind: 'data_contract',
  asset_type: 'Data Contract',
  display_name: 'ODCS · google-ucp-checkout',
  natco: 'global',
  description: 'Governing contract for the Google UCP Checkout CDP.',
})

for (const c of Object.values(contracts)) {
  if (c.kind !== 'semantic_concept') continue
  const nsId = c.links?.namespace
  if (!nsId || !contracts[nsId] || contracts[nsId].kind !== 'namespace') continue
  const list = contracts[nsId].links?.concepts ?? []
  if (!list.includes(c.id)) list.push(c.id)
  contracts[nsId].links = { ...(contracts[nsId].links ?? {}), concepts: list }
}

const graph = {
  meta: {
    title: 'UDP-Pattern · UCP canonical context graph',
    subtitle: 'ucp.shopping Product / Variant with Amazon · TikTok Shop · Tmall federation + Merchant Center feed',
    project: 'udp-pattern',
    canonical: UCP.namespace,
    ucp_version: UCP.version,
    spec: UCP.spec,
    google_guide: UCP.googleGuide,
    source: 'https://www.pattern.com/#what-we-do',
    ossie_model: 'ucp_shopping',
    ossie_package: 'mock-data/projects/udp-pattern/scopes/global/technical-catalogue/entity/apache-ossie/semantic-model.json',
    natcos: ['global', 'amazon', 'tiktok', 'tmall'],
  },
  nodes: [],
  edges: [],
}

function node(n) {
  graph.nodes.push(n)
}
function edge(from, to, predicate) {
  graph.edges.push({ id: `e-${graph.edges.length + 1}`, from, to, predicate })
}

node({
  id: 'ns-ucp',
  type: 'namespace',
  label: 'ucp.shopping',
  subtitle: `UCP ${UCP.version} · canonical`,
  layer: 'semantics',
  natco: 'global',
  contract_ref: 'ctr-ns-ucp',
  position: { x: 980, y: -80 },
  hub: true,
})
node({
  id: 'ns-pattern',
  type: 'namespace',
  label: 'pattern-global',
  subtitle: 'Enterprise overlay on UCP',
  layer: 'semantics',
  natco: 'global',
  contract_ref: 'ctr-ns-pattern',
  position: { x: 980, y: 40 },
  hub: true,
})
node({
  id: 'concept-product',
  type: 'concept',
  label: 'Product',
  subtitle: 'ucp.shopping/Product · GID',
  layer: 'semantics',
  natco: 'global',
  contract_ref: 'ctr-sem-ucp-product',
  position: { x: 1180, y: 160 },
  hub: true,
})
node({
  id: 'concept-variant',
  type: 'concept',
  label: 'Variant',
  subtitle: 'ucp.shopping/Variant · item.id',
  layer: 'semantics',
  natco: 'global',
  contract_ref: 'ctr-sem-ucp-variant',
  position: { x: 1380, y: 160 },
  hub: true,
})
node({
  id: 'concept-checkout',
  type: 'concept',
  label: 'Checkout',
  subtitle: 'UCP native checkout session',
  layer: 'semantics',
  natco: 'global',
  contract_ref: 'ctr-sem-ucp-checkout',
  position: { x: 1180, y: 280 },
})
node({
  id: 'concept-order',
  type: 'concept',
  label: 'Order',
  subtitle: 'UCP post-purchase · GMV',
  layer: 'semantics',
  natco: 'global',
  contract_ref: 'ctr-sem-ucp-order',
  position: { x: 1380, y: 280 },
})
node({
  id: 'concept-fulfillment',
  type: 'concept',
  label: 'Fulfillment',
  subtitle: 'ucp.shopping/Fulfillment',
  layer: 'semantics',
  natco: 'global',
  contract_ref: 'ctr-sem-ucp-fulfillment',
  position: { x: 1180, y: 400 },
})
node({
  id: 'concept-buyer',
  type: 'concept',
  label: 'Buyer',
  subtitle: 'UCP Buyer · guest or linked',
  layer: 'semantics',
  natco: 'global',
  contract_ref: 'ctr-sem-ucp-buyer',
  position: { x: 1380, y: 400 },
})
node({
  id: 'concept-merchant-profile',
  type: 'concept',
  label: 'MerchantProfile',
  subtitle: '/.well-known/ucp',
  layer: 'semantics',
  natco: 'global',
  contract_ref: 'ctr-sem-ucp-merchant-profile',
  position: { x: 980, y: 280 },
})
node({
  id: 'concept-brand',
  type: 'concept',
  label: 'Brand',
  subtitle: 'SPANX · Zyliss · Pura · NaturVet',
  layer: 'semantics',
  natco: 'global',
  contract_ref: 'ctr-sem-brand',
  position: { x: 980, y: 160 },
  hub: true,
})
node({
  id: 'concept-gmc-offer',
  type: 'concept',
  label: 'MerchantCenterOffer',
  subtitle: 'Google feed offer_id',
  layer: 'semantics',
  natco: 'global',
  contract_ref: 'ctr-sem-gmc-offer',
  position: { x: 1580, y: 160 },
})
node({
  id: 'dp-brand-catalog-360',
  type: 'product',
  label: 'Brand Catalog 360',
  subtitle: 'Implements UCP Product',
  layer: 'product',
  natco: 'global',
  contract_ref: 'ctr-prod-brand-catalog-360',
  position: { x: 720, y: 40 },
  hub: true,
})
node({
  id: 'dp-marketplace-performance',
  type: 'product',
  label: 'Marketplace Performance',
  subtitle: 'Implements UCP Order',
  layer: 'product',
  natco: 'global',
  contract_ref: 'ctr-prod-marketplace-performance',
  position: { x: 520, y: 40 },
})
node({
  id: 'dp-fulfillment-ops',
  type: 'product',
  label: 'Fulfillment Operations',
  subtitle: 'Implements UCP Fulfillment',
  layer: 'product',
  natco: 'global',
  contract_ref: 'ctr-prod-fulfillment-ops',
  position: { x: 520, y: 160 },
})
node({
  id: 'dp-catalog-advertising',
  type: 'product',
  label: 'Catalog Advertising',
  subtitle: 'Implements UCP Attribution',
  layer: 'product',
  natco: 'global',
  contract_ref: 'ctr-prod-catalog-advertising',
  position: { x: 520, y: 280 },
})
node({
  id: 'dp-social-commerce',
  type: 'product',
  label: 'Social Commerce',
  subtitle: 'Keyed to UCP Product GID',
  layer: 'product',
  natco: 'global',
  contract_ref: 'ctr-prod-social-commerce',
  position: { x: 520, y: 400 },
})
node({
  id: 'dp-pattern-intelligence',
  type: 'product',
  label: 'Pattern Intelligence',
  subtitle: 'Sensors on UCP profile',
  layer: 'product',
  natco: 'global',
  contract_ref: 'ctr-prod-pattern-intelligence',
  position: { x: 720, y: 160 },
})
node({
  id: 'tbl-product-360',
  type: 'table',
  label: 'ucp.product_360',
  subtitle: 'Curated hub · Product GID',
  layer: 'technical',
  natco: 'global',
  contract_ref: 'ctr-tech-tbl-product',
  position: { x: 720, y: 280 },
  hub: true,
})
node({
  id: 'col-product-gid',
  type: 'column',
  label: 'product_gid',
  subtitle: 'PK · UCP Product.id',
  layer: 'technical',
  natco: 'global',
  contract_ref: 'ctr-tech-col-product-gid',
  position: { x: 720, y: 400 },
})
node({
  id: 'col-variant-gid',
  type: 'column',
  label: 'variant_gid',
  subtitle: 'UCP Variant.id · checkout item.id',
  layer: 'technical',
  natco: 'global',
  contract_ref: 'ctr-tech-col-variant-gid',
  position: { x: 720, y: 520 },
})
node({
  id: 'tbl-gmc-offer',
  type: 'table',
  label: 'gmc.products.offer',
  subtitle: 'Merchant Center feed',
  layer: 'technical',
  natco: 'global',
  contract_ref: 'ctr-tech-tbl-gmc',
  position: { x: 1580, y: 280 },
})
node({
  id: 'col-offer-id',
  type: 'column',
  label: 'offer_id',
  subtitle: 'GMC offer key',
  layer: 'technical',
  natco: 'global',
  contract_ref: 'ctr-tech-col-offer',
  position: { x: 1580, y: 400 },
})
node({
  id: 'contract-catalog',
  type: 'contract',
  label: 'ODCS · brand-catalog-360',
  subtitle: 'Contract v1',
  layer: 'governance',
  natco: 'global',
  contract_ref: 'ctr-gov-brand-catalog-360',
  position: { x: 720, y: 640 },
})
node({
  id: 'gloss-brand',
  type: 'glossary',
  label: 'Brand',
  subtitle: 'Enterprise glossary',
  layer: 'business',
  natco: 'global',
  contract_ref: 'ctr-biz-brand-catalog-360',
  position: { x: 980, y: 400 },
})
node({
  id: 'sys-merchant-center',
  type: 'system',
  label: 'Merchant Center',
  subtitle: 'Google UCP discovery feed',
  layer: 'technical',
  natco: 'global',
  contract_ref: 'ctr-tech-sys-gmc',
  position: { x: 1580, y: 40 },
})

edge('ns-pattern', 'ns-ucp', 'alignsTo')
edge('ns-ucp', 'concept-product', 'contains')
edge('ns-ucp', 'concept-variant', 'contains')
edge('ns-ucp', 'concept-checkout', 'contains')
edge('ns-ucp', 'concept-order', 'contains')
edge('ns-ucp', 'concept-fulfillment', 'contains')
edge('ns-ucp', 'concept-buyer', 'contains')
edge('ns-pattern', 'concept-brand', 'contains')
edge('ns-ucp', 'concept-merchant-profile', 'contains')
edge('concept-variant', 'concept-product', 'partOf')
edge('concept-checkout', 'concept-buyer', 'consumes')
edge('concept-order', 'concept-checkout', 'partOf')
edge('concept-order', 'concept-fulfillment', 'consumes')
edge('gloss-brand', 'concept-brand', 'mapsTo')
edge('concept-brand', 'concept-product', 'mapsTo')
edge('concept-gmc-offer', 'concept-variant', 'sameAs')
edge('dp-brand-catalog-360', 'concept-product', 'implements')
edge('dp-brand-catalog-360', 'concept-variant', 'implements')
edge('dp-brand-catalog-360', 'concept-brand', 'implements')
edge('tbl-product-360', 'dp-brand-catalog-360', 'partOf')
edge('tbl-product-360', 'col-product-gid', 'hasColumn')
edge('tbl-product-360', 'col-variant-gid', 'hasColumn')
edge('tbl-product-360', 'concept-product', 'represents')
edge('col-product-gid', 'concept-product', 'represents')
edge('col-variant-gid', 'concept-variant', 'represents')
edge('contract-catalog', 'tbl-product-360', 'appliesTo')
edge('contract-catalog', 'dp-brand-catalog-360', 'appliesTo')
edge('dp-marketplace-performance', 'concept-order', 'implements')
edge('dp-fulfillment-ops', 'concept-fulfillment', 'implements')
edge('dp-catalog-advertising', 'concept-product', 'implements')
edge('dp-social-commerce', 'concept-product', 'implements')
edge('dp-pattern-intelligence', 'concept-merchant-profile', 'implements')
edge('sys-merchant-center', 'tbl-gmc-offer', 'produces')
edge('tbl-gmc-offer', 'col-offer-id', 'hasColumn')
edge('tbl-gmc-offer', 'concept-gmc-offer', 'represents')
edge('col-offer-id', 'concept-gmc-offer', 'represents')
edge('tbl-gmc-offer', 'tbl-product-360', 'feeds')
edge('col-offer-id', 'col-variant-gid', 'flowsTo')
edge('dp-brand-catalog-360', 'tbl-gmc-offer', 'consumes')

const xs = { amazon: 40, tiktok: 280, tmall: 520 }
for (const m of MARKETPLACES) {
  const x = xs[m.id]
  node({
    id: `ns-${m.id}`,
    type: 'namespace',
    label: m.label,
    subtitle: `${m.id} namespace`,
    layer: 'semantics',
    natco: m.id,
    contract_ref: `ctr-ns-${m.id}`,
    position: { x, y: -40 },
  })
  node({
    id: `concept-${m.id}-listing`,
    type: 'concept',
    label: m.listing,
    subtitle: `${m.id}/${m.column} → ${m.ucpTarget === 'concept-variant' ? 'Variant' : 'Product'}`,
    layer: 'semantics',
    natco: m.id,
    contract_ref: `ctr-sem-${m.id}-listing`,
    position: { x, y: 120 },
  })
  node({
    id: `tbl-${m.id}-listing`,
    type: 'table',
    label: m.table.split('.').pop(),
    subtitle: m.table,
    layer: 'technical',
    natco: m.id,
    contract_ref: `ctr-tech-${m.id}-listing`,
    position: { x, y: 280 },
  })
  node({
    id: `col-${m.id}-id`,
    type: 'column',
    label: m.column,
    subtitle: 'PK · source id',
    layer: 'technical',
    natco: m.id,
    contract_ref: `ctr-tech-${m.id}-col`,
    position: { x, y: 420 },
  })
  edge(`ns-${m.id}`, 'ns-ucp', 'alignsTo')
  edge(`ns-${m.id}`, `concept-${m.id}-listing`, 'contains')
  edge(`concept-${m.id}-listing`, m.ucpTarget, 'sameAs')
  edge(`tbl-${m.id}-listing`, `concept-${m.id}-listing`, 'represents')
  edge(`tbl-${m.id}-listing`, m.ucpTarget, 'represents')
  edge(`col-${m.id}-id`, `concept-${m.id}-listing`, 'represents')
  edge(`tbl-${m.id}-listing`, `col-${m.id}-id`, 'hasColumn')
  edge(`tbl-${m.id}-listing`, 'tbl-product-360', 'feeds')
  edge(`col-${m.id}-id`, m.ucpTarget === 'concept-variant' ? 'col-variant-gid' : 'col-product-gid', 'flowsTo')
  edge('dp-brand-catalog-360', `tbl-${m.id}-listing`, 'consumes')
  node({
    id: `dp-brand-catalog-360-${m.id}`,
    type: 'product',
    label: `${m.label} · Brand Catalog 360`,
    subtitle: `Federated ${m.listing}`,
    layer: 'product',
    natco: m.id,
    contract_ref: `ctr-prod-brand-catalog-360-${m.id}`,
    position: { x, y: 40 },
  })
  edge(`dp-brand-catalog-360-${m.id}`, `concept-${m.id}-listing`, 'implements')
  edge(`dp-brand-catalog-360-${m.id}`, 'dp-brand-catalog-360', 'alignsTo')
}

node({
  id: 'ossie-pattern-ucp-shopping',
  type: 'contract',
  label: 'Ossie · ucp_shopping',
  subtitle: 'Apache Ossie interchange',
  layer: 'semantics',
  natco: 'global',
  contract_ref: 'ctr-ossie-pattern-ucp-shopping',
  position: { x: 1380, y: -80 },
  hub: true,
})
node({
  id: 'ds-product',
  type: 'table',
  label: 'product',
  subtitle: 'Ossie dataset · ADP',
  layer: 'semantics',
  natco: 'global',
  contract_ref: 'ctr-ossie-pattern-ucp-shopping',
  position: { x: 1380, y: 40 },
})
node({
  id: 'ds-amazon-listing',
  type: 'table',
  label: 'amazon_listing',
  subtitle: 'Ossie dataset · SDP',
  layer: 'semantics',
  natco: 'amazon',
  contract_ref: 'ctr-ossie-pattern-ucp-shopping',
  position: { x: 40, y: 520 },
})
node({
  id: 'dp-cdp-google-checkout',
  type: 'product',
  label: 'Google UCP Checkout',
  subtitle: 'CDP · Search / Gemini',
  layer: 'product',
  natco: 'global',
  contract_ref: 'ctr-prod-cdp-google-checkout',
  position: { x: 720, y: -80 },
})
edge('ns-ucp', 'ossie-pattern-ucp-shopping', 'contains')
edge('ossie-pattern-ucp-shopping', 'ds-product', 'contains')
edge('ossie-pattern-ucp-shopping', 'ds-amazon-listing', 'contains')
edge('ds-product', 'concept-product', 'represents')
edge('ds-amazon-listing', 'concept-amazon-listing', 'represents')
edge('ds-amazon-listing', 'ds-product', 'feeds')
edge('dp-brand-catalog-360', 'ds-product', 'implements')
edge('dp-cdp-google-checkout', 'dp-brand-catalog-360', 'consumes')
edge('dp-cdp-google-checkout', 'concept-checkout', 'implements')
edge('dp-cdp-google-checkout', 'concept-variant', 'consumes')

const entities = {
  meta: {
    title: 'UDP-Pattern contracts (generated)',
    project: 'udp-pattern',
    domain: 'ecommerce-acceleration',
    canonical: UCP.namespace,
    ucp_version: UCP.version,
    spec: UCP.spec,
    google_guide: UCP.googleGuide,
    ossie_model: 'ucp_shopping',
    ossie_package: 'mock-data/projects/udp-pattern/scopes/global/technical-catalogue/entity/apache-ossie/semantic-model.json',
    generated_at: new Date().toISOString(),
    natcos: ['global', 'amazon', 'tiktok', 'tmall'],
    source: 'https://www.pattern.com/#what-we-do',
  },
  contracts,
}

const canonicalModel = {
  meta: {
    title: 'UDP-Pattern global model — UCP shopping',
    analog: 'UDP-DT uses TM Forum SID Customer as global meaning; UDP-Pattern uses UCP shopping.',
    spec: UCP.spec,
    google_implementation: UCP.googleGuide,
    version: UCP.version,
  },
  namespace: UCP.namespace,
  concepts: UCP_CONCEPTS.map((c) => ({
    id: c.id,
    name: c.name,
    qualified_name: c.qname,
    description: c.description,
  })),
  overlay: [
    { name: 'Brand', namespace: 'pattern-global', mapsTo: 'ucp.shopping/Product', note: 'seller / metadata — not a second identity' },
  ],
  federation: MARKETPLACES.map((m) => ({
    marketplace: m.label,
    local: m.listing,
    sameAs: m.ucpTarget === 'concept-variant' ? 'ucp.shopping/Variant' : 'ucp.shopping/Product',
  })).concat([{ marketplace: 'Google Merchant Center', local: 'offer_id', sameAs: 'ucp.shopping/Variant' }]),
  google_ucp_path: [
    'Merchant Center feed (discovery)',
    'UCP profile at /.well-known/ucp',
    'Native checkout sessions (create / update / complete)',
    'Google Pay payment handler',
    'Order lifecycle webhooks',
  ],
}

const architecture = {
  meta: {
    title: 'UDP-Pattern architecture mock',
    project: 'udp-pattern',
    canonical: UCP.namespace,
    inspiration: 'https://www.pattern.com/#what-we-do',
    spec: UCP.spec,
  },
  layers: [
    { id: 'canonical', title: 'Canonical (UCP)', items: ['ucp.shopping/Product', 'Variant', 'Checkout', 'Order', 'Fulfillment', 'Buyer'] },
    { id: 'brands', title: 'Brand partners', items: ['SPANX', 'Zyliss', 'Pura', 'NaturVet'] },
    { id: 'marketplaces', title: 'Marketplaces', items: ['Amazon ASIN → Variant', 'TikTok Product ID → Product', 'Tmall Item ID → Product'] },
    { id: 'google', title: 'Google UCP surfaces', items: ['Merchant Center feed', 'Search / Gemini checkout', 'Google Pay handler'] },
    { id: 'capabilities', title: 'Pattern capabilities', items: ['Marketplace Accelerator', 'Fulfillment', 'PXM', 'Catalog Advertising', 'Social Commerce', 'Pattern Intelligence'] },
    { id: 'ossie', title: 'Apache Ossie interchange', items: ['semantic_model ucp_shopping', 'SDP → ADP → CDP datasets', 'metrics listing_count / GMV'] },
    { id: 'control-plane', title: 'Governance grid', items: ['UCP namespace', 'Pattern overlay', 'Marketplace federation', 'ODCS contracts'] },
  ],
}

const scenario = {
  meta: {
    title: 'Multi-brand · multi-marketplace · UCP global',
    project: 'udp-pattern',
    scenario:
      'Approve ucp.shopping Product + Variant, then federate ASIN / TikTok Product ID / Tmall Item ID / Merchant Center offer_id',
  },
  brands: ['SPANX', 'Zyliss', 'Pura', 'NaturVet'],
  marketplaces: MARKETPLACES.map((m) => m.label),
  steps: [
    { step: 1, action: 'Import UCP shopping slice (Product, Variant, Checkout, Order, Fulfillment, Buyer) into ucp.shopping' },
    { step: 2, action: 'Approve Pattern overlay Brand mapsTo Product — do not fork GID meaning' },
    { step: 3, action: 'Federate Amazon ASIN sameAs Variant; TikTok Product ID and Tmall Item ID sameAs Product' },
    { step: 4, action: 'Bind Merchant Center offer_id sameAs Variant for Google AI surface discovery' },
    { step: 6, action: 'Export Apache Ossie ucp_shopping package (SDP listings → ADP Product/Variant → CDP checkout_session)' },
  ],
}

const outDir = path.join(root, 'mock-data/projects/udp-pattern')
fs.mkdirSync(path.join(outDir, 'scenarios'), { recursive: true })
fs.writeFileSync(path.join(outDir, 'architecture.json'), JSON.stringify(architecture, null, 2))
fs.writeFileSync(path.join(outDir, 'ucp-canonical-model.json'), JSON.stringify(canonicalModel, null, 2))
fs.writeFileSync(path.join(outDir, 'scenarios/multi-brand-marketplace.json'), JSON.stringify(scenario, null, 2))

writeAuthoredProject('udp-pattern', {
  meta: entities.meta,
  contracts,
  graph,
  preserveOssie: true,
})
seedOssiePackage('udp-pattern')
const compiled = compileProject('udp-pattern')
mirrorCompiled('udp-pattern', compiled)

console.log('==> UDP-Pattern mock data (UCP canonical)')
console.log('   contracts:', Object.keys(contracts).length)
console.log('   graph nodes:', graph.nodes.length, 'edges:', graph.edges.length)
console.log('   canonical:', UCP.namespace, UCP.version)
console.log('   authored:', 'mock-data/projects/udp-pattern/scopes')
console.log('   derived:', 'mock-data/projects/udp-pattern/derived')
