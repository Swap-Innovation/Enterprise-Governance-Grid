export const PATTERN_PITCH_CONCEPTS = [
  {
    id: 'ucp',
    name: 'Universal Commerce Protocol',
    what: 'Open shopping data model — Product, Variant, Cart, Checkout, Order, Fulfillment, Buyer.',
    why: 'One GID for a sellable item, whether it is bought on Amazon, TikTok Shop, Tmall, or Google Search / Gemini.',
    example: 'ucp.shopping/Product · GID · variants[].id used as checkout item.id',
    exampleLabel: 'UCP example',
  },
  {
    id: 'product-gid',
    name: 'Product GID',
    what: 'Stable global identifier for a Product. Handle is SEO-only; GID is the API key.',
    why: 'PXM, ads, social, and Pi sensors must join on one key — not three marketplace IDs.',
    example: 'product_gid on ucp.product_360 represents ucp.shopping/Product',
    exampleLabel: 'UCP example',
  },
  {
    id: 'variant-gid',
    name: 'Variant GID',
    what: 'Purchasable SKU of a Product. Used as item.id on Cart and Checkout line items.',
    why: 'Amazon ASIN and Merchant Center offer_id are local aliases of the same Variant.',
    example: 'amazon/ASIN sameAs ucp.shopping/Variant · gmc.offer_id sameAs Variant',
    exampleLabel: 'UCP example',
  },
  {
    id: 'checkout',
    name: 'Native checkout',
    what: 'Three REST endpoints: create, update, complete a checkout session on Google AI surfaces.',
    why: 'Pattern remains merchant-of-record for brands; Google negotiates capabilities via the UCP profile.',
    example: 'dev.ucp.shopping.checkout · status incomplete → completed',
    exampleLabel: 'Google UCP',
  },
  {
    id: 'profile',
    name: 'UCP merchant profile',
    what: 'JSON at /.well-known/ucp listing services, capabilities, and payment handlers.',
    why: 'Agents discover whether a brand supports checkout, fulfillment, discounts, and Google Pay.',
    example: 'capabilities: checkout, fulfillment, discount, order · payment_handlers: com.google.pay',
    exampleLabel: 'Google UCP',
  },
  {
    id: 'ossie',
    name: 'Apache Ossie interchange',
    what: 'YAML semantic_model with datasets, relationships, and metrics any BI/AI tool can read.',
    why: 'Ossie is the export format — not a second repository. SDP, ADP, and CDP share one portable model.',
    example: 'ucp_shopping.datasets.product source: ucp.product_360 · metrics.listing_count',
    exampleLabel: 'Ossie 0.2.0.dev0',
  },
  {
    id: 'sdp-adp-cdp',
    name: 'SDP · ADP · CDP',
    what: 'Source-aligned, aggregated/integrated, and consumer-aligned data products on the same UCP GID.',
    why: 'Amazon listings stay SDP; Brand Catalog 360 is ADP; Google checkout is CDP — one Variant GID throughout.',
    example: 'amazon_listing (SDP) → product (ADP) → checkout_session (CDP)',
    exampleLabel: 'Product class',
  },
] as const

export const PATTERN_STUDIO = {
  lead: 'How UCP meaning, Pattern overlay, and marketplace federation come together — from concept library to the architecture spine.',
  idea: {
    title: 'Enterprise Governance Grid',
    lead: 'Centrally governed UCP meaning, federated marketplace ownership, Marketplace enrichment — without asking Amazon or TikTok to give up their IDs.',
    pillars: [
      {
        title: 'One meaning backbone',
        body: 'The Semantic Control Plane is the system of record for shopping meaning — seeded from Universal Commerce Protocol (UCP).',
      },
      {
        title: 'Catalogs keep their job',
        body: 'PXM, Seller APIs, and Merchant Center remain SoR for channel inventory. We map into UCP Product / Variant — we do not replace them.',
      },
      {
        title: 'Marketplace stays the product UI',
        body: 'The Grid certifies that Brand Catalog 360 implements ucp.shopping/Product, not a Pattern-only listing type.',
      },
    ],
    footer:
      'Think of it as a governance grid for commerce meaning: Pattern and each marketplace still own their metadata; the Grid owns the certified crosswalk so agents — including Google Gemini — speak the same Product GID.',
  },
}

export const PATTERN_GOVERNANCE = {
  lead: 'Why a sellable item means one UCP Product across Amazon, TikTok Shop, Tmall, and Google AI surfaces.',
  problem: {
    title: 'Meaning is fragmented across channels',
    lead: 'Marketplace IDs, Merchant Center offers, PXM tables, and data products each tell a different story — so ads, fulfillment, and agentic checkout cannot share one truth.',
    pains: [
      {
        title: 'Same item, four identifiers',
        body: 'ASIN, TikTok Product ID, Tmall Item ID, and Merchant Center offer_id look related — but catalogs, ads, and checkout disagree on the definition.',
      },
      {
        title: 'Products without certified meaning',
        body: 'Marketplace publishes Brand Catalog 360, yet nothing guarantees the product implements ucp.shopping/Product.',
      },
      {
        title: 'Agents without trusted context',
        body: 'Google Search / Gemini checkout needs a UCP profile and Product GID — not a Pattern-only listing type.',
      },
    ],
  },
  ownership: {
    lead: 'Who owns UCP meaning, channel catalogs, Pattern products, and Google interchange.',
    boxes: [
      {
        role: 'SoR · Meaning',
        owner: 'Semantic Control Plane',
        body: 'UCP Product, Variant, Checkout, Order, Fulfillment — plus Pattern Brand overlay.',
        accent: 'teal' as const,
      },
      {
        role: 'SoR · Channel catalogs',
        owner: 'Seller APIs · Merchant Center',
        body: 'Amazon, TikTok, Tmall, and Google feed inventory — still owned by the channel.',
        accent: 'brass' as const,
      },
      {
        role: 'SoR · Products & UI',
        owner: 'Pattern Marketplace',
        body: 'Brand Catalog 360, GMV, Fulfillment, Ads, Social, Pi — bound to UCP GIDs.',
        accent: 'brass' as const,
      },
      {
        role: 'Exchange · Agentic commerce',
        owner: 'UCP profile · Google Pay',
        body: 'Publish capabilities to Search / Gemini. Pattern brands remain merchant of record.',
        accent: 'signal' as const,
      },
    ],
  },
  policy: {
    title: 'Lifecycle that protects UCP meaning',
    lead: 'ucp.shopping Product (and Variant) moves draft → review → approved → deprecated. Only approved GIDs feed maps, Google profile, and hard product gates.',
    concept: 'ucp.shopping/Product',
    standard: 'UCP 2026-04-08 · shopping',
    steps: [
      { state: 'draft', actor: 'PXM / Data Architecture', action: 'Import UCP Product + Variant into ucp.shopping; stub Pattern Brand overlay' },
      { state: 'review', actor: 'Catalog steward', action: 'Submit for COE approval with GID + Google feed annotations' },
      { state: 'approved', actor: 'Global Semantic Council', action: 'Approve — valid target for marketplace maps and UCP profile' },
      { state: 'deprecated', actor: 'COE', action: 'Only with replaced_by + marketplace + Merchant Center notification SLA' },
    ],
    policies: [
      'Do not fork Product GID per marketplace — ASIN / Product ID / Item ID sameAs UCP.',
      'Merchant Center offer_id maps to Variant, not a fourth product identity.',
      'Brand Catalog 360 must implement ucp.shopping/Product to publish.',
      'Checkout sessions bind line_items.item.id to Variant GID.',
    ],
  },
  outcomes: {
    lead: 'A clear pilot — not a 70-marketplace boil-the-ocean program.',
    items: [
      'One shopping semantic backbone — UCP-aligned',
      'Federated marketplace ownership with central Product GID',
      'Marketplace products bound to certified UCP concepts',
      'Google AI surfaces ready via Merchant Center + UCP profile',
    ],
    askTitle: 'One domain · one marketplace',
    ask: [
      'Stand up ucp.shopping + pattern-global overlay',
      'Import UCP Product / Variant / Checkout / Order slice; approve core concepts',
      'Map Amazon ASIN + Merchant Center offer_id; bind Brand Catalog 360',
      'Publish UCP profile capabilities for native checkout (pilot)',
    ],
  },
}

export type PatternPitchConcept = (typeof PATTERN_PITCH_CONCEPTS)[number]
