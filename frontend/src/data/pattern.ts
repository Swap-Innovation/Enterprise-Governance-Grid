import type { DemoStep } from '../pitch/PitchContext'
import type { MarketplaceProduct } from './demo'

export const PATTERN_MARKETPLACES = [
  { code: 'amazon', slug: 'amazon', label: 'Amazon', localHint: 'AMZ', listing: 'ASIN' },
  { code: 'tiktok', slug: 'tiktok', label: 'TikTok Shop', localHint: 'TTS', listing: 'Product ID' },
  { code: 'tmall', slug: 'tmall', label: 'Tmall Global', localHint: 'TM', listing: 'Item ID' },
] as const

export const patternMarketplaceFamilies = [
  {
    id: 'brand-catalog-360',
    domain: 'Catalog',
    global: {
      id: 'dp-brand-catalog-360',
      name: 'Brand Catalog 360',
      owner: 'PXM / Catalog Ops',
      description:
        'PXM hub that materializes UCP Product + Variant GIDs so SPANX, Zyliss, Pura, and NaturVet share one catalog identity across Amazon, TikTok Shop, Tmall, and Google AI surfaces.',
      implements: 'ucp.shopping/Product',
      inputs: 4,
      contract: 'contract-brand-catalog-360-v1',
    },
  },
  {
    id: 'marketplace-performance',
    domain: 'Commerce',
    global: {
      id: 'dp-marketplace-performance',
      name: 'Marketplace Performance',
      owner: 'Pattern Intelligence',
      description:
        'GMV, wholesale, and category-share derived from UCP Order totals — the board Pattern shows partners (e.g. $54.8m GMV).',
      implements: 'ucp.shopping/Order',
      inputs: 3,
      contract: 'contract-marketplace-performance-v1',
    },
  },
  {
    id: 'fulfillment-ops',
    domain: 'Fulfillment',
    global: {
      id: 'dp-fulfillment-ops',
      name: 'Fulfillment Operations',
      owner: 'Pattern Warehouses',
      description: 'Prep, middle-mile, and DTC shipments implementing UCP Fulfillment (8m+ units / month, 99.8% on-time).',
      implements: 'ucp.shopping/Fulfillment',
      inputs: 3,
      contract: 'contract-fulfillment-ops-v1',
    },
  },
  {
    id: 'catalog-advertising',
    domain: 'Advertising',
    global: {
      id: 'dp-catalog-advertising',
      name: 'Catalog Advertising',
      owner: 'Catalog Advertising',
      description: 'Product-level ad spend and ROAS bound to the same UCP Product GID as PXM ($1.8b ad spend model).',
      implements: 'ucp.shopping/Attribution',
      inputs: 3,
      contract: 'contract-catalog-advertising-v1',
    },
  },
  {
    id: 'social-commerce',
    domain: 'Social',
    global: {
      id: 'dp-social-commerce',
      name: 'Social Commerce',
      owner: 'TikTok Shop Partnership',
      description: 'Creator and TikTok Shop sales events keyed to the same UCP Product GID as Brand Catalog 360.',
      implements: 'ucp.shopping/Product',
      inputs: 3,
      contract: 'contract-social-commerce-v1',
    },
  },
  {
    id: 'pattern-intelligence',
    domain: 'Operations',
    global: {
      id: 'dp-pattern-intelligence',
      name: 'Pattern Intelligence',
      owner: 'Pi Sensor Platform',
      description: '90+ live sensors over UCP Product, Checkout, Order, and MerchantProfile — 160+ diagnostics on 91T+ data points.',
      implements: 'ucp.shopping/MerchantProfile',
      inputs: 3,
      contract: 'contract-pattern-intelligence-v1',
    },
  },
] as const

function buildPatternProducts(): MarketplaceProduct[] {
  const out: MarketplaceProduct[] = []
  for (const family of patternMarketplaceFamilies) {
    out.push({
      id: family.global.id,
      name: family.global.name,
      owner: family.global.owner,
      domain: family.domain,
      status: 'Published',
      scope: 'global',
      natco: null,
      familyId: family.id,
      description: family.global.description,
      implements: family.global.implements,
      inputs: family.global.inputs,
      contract: family.global.contract,
      queryCode: 'P3',
      productClass: 'ADP',
    })
    for (const m of PATTERN_MARKETPLACES) {
      out.push({
        id: `${family.global.id}-${m.code}`,
        name: `${m.label} · ${family.global.name}`,
        owner: `${m.label} ops`,
        domain: family.domain,
        status: 'Published',
        scope: 'natco',
        natco: m.slug,
        familyId: family.id,
        description: `${m.label} SDP equivalent of ${family.global.name} — local “${m.listing}” federates to ${family.global.implements}.`,
        implements: `${m.slug}/${m.listing.replace(/\s+/g, '-')} → ${family.global.implements}`,
        inputs: 0,
        contract: `contract-${family.id}-${m.code}-v1`,
        queryCode: 'P3',
        localName: m.listing,
        productClass: 'SDP',
      })
    }
  }
  out.push({
    id: 'dp-cdp-google-checkout',
    name: 'Google UCP Checkout',
    owner: 'Pattern Intelligence / Google UCP',
    domain: 'Commerce',
    status: 'Published',
    scope: 'global',
    natco: null,
    familyId: 'google-ucp-checkout',
    description:
      'CDP — native checkout sessions for Search / Gemini. Line item item.id is UCP Variant GID (Ossie dataset checkout_session).',
    implements: 'ucp.shopping/Checkout',
    inputs: 1,
    contract: 'contract-cdp-google-checkout-v1',
    queryCode: 'P3',
    productClass: 'CDP',
  })
  return out
}

export const patternMarketplaceProducts = buildPatternProducts()

export const PATTERN_DEMO_STEPS: DemoStep[] = [
  {
    id: 'marketplace',
    title: 'Marketplace · Pattern products',
    narration: 'Discover Brand Catalog 360, Order/GMV, Fulfillment, Ads, Social Commerce, and Pattern Intelligence — each bound to UCP.',
    route: 'marketplace',
  },
  {
    id: 'problem',
    title: 'The fracture',
    narration: 'The same sellable item is an ASIN on Amazon, a Product ID on TikTok Shop, an Item ID on Tmall, and an offer_id in Merchant Center.',
    route: 'governance',
    hash: 'problem',
  },
  {
    id: 'idea',
    title: 'UCP is the backbone',
    narration: 'ucp.shopping owns Product and Variant GIDs. Pattern-global overlays Brand. Marketplaces federate — they never fork meaning.',
    route: 'studio',
    hash: 'idea',
  },
  {
    id: 'contracts-global',
    title: 'Contracts · UCP global',
    narration: 'Open the UCP namespace — Product, Variant, Checkout, Order — then Brand Catalog 360 implementing Product GID.',
    route: 'contracts',
    scope: 'global',
    pack: 'semantics',
    contractId: 'concept-product',
    graphNodeId: 'concept-product',
  },
  {
    id: 'contracts-amazon',
    title: 'Contracts · Amazon',
    narration: 'Open the Amazon folder — ASIN sameAs ucp.shopping/Variant, seller API, listing table.',
    route: 'contracts',
    scope: 'amazon',
    pack: 'semantics',
    contractId: 'concept-amazon-listing',
    graphNodeId: 'concept-amazon-listing',
  },
  {
    id: 'graph-align',
    title: 'KG · UCP federation',
    narration: 'Traverse ASIN → Variant, TikTok/Tmall IDs → Product, Merchant Center offer_id → Variant, feeding ucp.product_360.',
    route: 'semantics',
    graphNodeId: 'concept-product',
    contractId: 'ctr-sem-ucp-product',
  },
  {
    id: 'graph-product',
    title: 'KG · Brand Catalog 360',
    narration: 'The PXM product implements ucp.shopping/Product and consumes Amazon, TikTok, Tmall, and Merchant Center tables.',
    route: 'semantics',
    graphNodeId: 'dp-brand-catalog-360',
    contractId: 'ctr-prod-brand-catalog-360',
  },
  {
    id: 'outcomes',
    title: 'The ask',
    narration: 'Stand up ucp.shopping + Pattern overlay + Amazon end-to-end — then federate TikTok Shop, Tmall, and Google checkout.',
    route: 'governance',
    hash: 'outcomes',
  },
]
