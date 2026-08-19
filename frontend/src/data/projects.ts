import type { DemoStep } from '../pitch/PitchContext'
import { DEMO_STEPS } from '../pitch/PitchContext'
import { marketplaceProducts as dtProducts, type MarketplaceProduct } from './demo'
import { PATTERN_DEMO_STEPS, patternMarketplaceProducts } from './pattern'

export type ProjectId = 'udp-dt' | 'udp-pattern'

export type ProjectScope = {
  id: string
  label: string
  short: string
}

export type ProjectDef = {
  id: ProjectId
  /** URL segment under /demo/:demoId */
  slug: string
  aliases: string[]
  code: string
  name: string
  workspace: string
  tagline: string
  description: string
  footer: string
  marketplaceLead: string
  scopeNoun: string
  scopeNounPlural: string
  scopes: ProjectScope[]
  productQueryCode: string
  scopeQueryCode: string
  defaultProductId: string
  defaultScopeId: string
  nav: { to: string; label: string; hint: string }[]
  products: MarketplaceProduct[]
  tourSteps: DemoStep[]
  pageSubtitles: Record<string, { title: string; subtitle: string }>
}

const sharedNav = [
  { to: 'marketplace', label: 'Marketplace', hint: 'Discover data products' },
  { to: 'contracts', label: 'Contracts', hint: 'Governed folders' },
  { to: 'semantics', label: 'Semantics', hint: 'Ontology · knowledge graph' },
  { to: 'studio', label: 'Studio', hint: 'Architecture & control plane' },
  { to: 'governance', label: 'Governance', hint: 'Policies & outcomes' },
  { to: 'guided', label: 'Guided tour', hint: 'Step-by-step walkthrough' },
] as const

export const PROJECTS: Record<ProjectId, ProjectDef> = {
  'udp-dt': {
    id: 'udp-dt',
    slug: 'udp-dt',
    aliases: ['customer360', 'udp-dt'],
    code: 'UDP-DT',
    name: 'UDP-DT',
    workspace: 'Customer 360 · NATCO federation',
    tagline: 'Telecom Customer 360 across Global + DE · AT · HR · HU · PL',
    description:
      'Existing Enterprise Governance Grid proof: TM Forum SID Customer meaning with NATCO CRM sources federated into Customer 360.',
    footer: 'Proof-of-concept · SID-aligned federation across DE · AT · HR · HU · PL',
    marketplaceLead:
      'SDP NATCO sources, ADP Customer 360, and a CDP copilot slice — SID meaning exported as Apache Ossie customer_360.',
    scopeNoun: 'NATCO',
    scopeNounPlural: 'NATCO equivalents',
    scopes: [
      { id: 'global', label: 'Global', short: 'GL' },
      { id: 'natco-de', label: 'Germany', short: 'DE' },
      { id: 'natco-at', label: 'Austria', short: 'AT' },
      { id: 'natco-hr', label: 'Croatia', short: 'HR' },
      { id: 'natco-hu', label: 'Hungary', short: 'HU' },
      { id: 'natco-pl', label: 'Poland', short: 'PL' },
    ],
    productQueryCode: 'Q3',
    scopeQueryCode: 'Q2',
    defaultProductId: 'dp-customer-360',
    defaultScopeId: 'natco-de',
    nav: [
      ...sharedNav.slice(0, 3),
      { to: 'options', label: 'Options A vs C', hint: 'Centralized vs BU federated' },
      ...sharedNav.slice(3, 5),
      { to: 'questions', label: 'Strategic Qs', hint: 'SQ1–SQ12 decisions' },
      sharedNav[5],
    ],
    products: dtProducts,
    tourSteps: DEMO_STEPS,
    pageSubtitles: {
      marketplace: { title: 'Marketplace', subtitle: 'Trusted data products across Global and NATCO' },
      contracts: { title: 'Contracts', subtitle: 'Governed definitions by scope and pack' },
      semantics: { title: 'Semantics', subtitle: 'Lineage workbench · NATCO federation to SID Customer' },
      options: { title: 'Semantic options', subtitle: 'A · C · Germany BUs · Power BI · Palantir' },
      studio: { title: 'Studio', subtitle: 'Architecture and control plane design' },
      governance: { title: 'Governance', subtitle: 'Ownership, policy, and outcomes' },
      questions: { title: 'Strategic questions', subtitle: 'SQ1–SQ12 · POC recommendations for W6' },
      guided: { title: 'Guided tour', subtitle: 'Walk the Customer 360 story end to end' },
    },
  },
  'udp-pattern': {
    id: 'udp-pattern',
    slug: 'udp-pattern',
    aliases: ['udp-pattern', 'pattern'],
    code: 'UDP-Pattern',
    name: 'UDP-Pattern',
    workspace: 'Multi-brand · UCP shopping',
    tagline: 'Pattern ecommerce accelerator — UCP Product GID across Amazon · TikTok Shop · Tmall · Google',
    description:
      'Governance grid for Pattern: Universal Commerce Protocol (UCP) as the canonical shopping model. Brand Catalog 360, GMV, fulfillment, ads, social, and Pi bind to Product / Variant GIDs; marketplaces and Merchant Center federate.',
    footer: 'UDP-Pattern · ucp.shopping · Amazon · TikTok Shop · Tmall · Google UCP',
    marketplaceLead:
      'SDP marketplace listings, ADP products implementing UCP, and a CDP for Google checkout — exported as Apache Ossie ucp_shopping.',
    scopeNoun: 'Marketplace',
    scopeNounPlural: 'Marketplace equivalents',
    scopes: [
      { id: 'global', label: 'Pattern global', short: 'GL' },
      { id: 'amazon', label: 'Amazon', short: 'AMZ' },
      { id: 'tiktok', label: 'TikTok Shop', short: 'TTS' },
      { id: 'tmall', label: 'Tmall Global', short: 'TM' },
    ],
    productQueryCode: 'P3',
    scopeQueryCode: 'P2',
    defaultProductId: 'dp-brand-catalog-360',
    defaultScopeId: 'amazon',
    nav: [...sharedNav],
    products: patternMarketplaceProducts,
    tourSteps: PATTERN_DEMO_STEPS,
    pageSubtitles: {
      marketplace: { title: 'Marketplace', subtitle: 'Pattern data products across brands and channels' },
      contracts: { title: 'Contracts', subtitle: 'Global Pattern + Amazon · TikTok · Tmall packs' },
      semantics: { title: 'Semantics', subtitle: 'UCP Product / Variant federated across marketplaces' },
      studio: { title: 'Studio', subtitle: 'Control plane seeded from Universal Commerce Protocol' },
      governance: { title: 'Governance', subtitle: 'Brand overlay · GID ownership · Google profile' },
      guided: { title: 'Guided tour', subtitle: 'Walk UCP Product GID from catalog to checkout' },
    },
  },
}

export const PROJECT_LIST = Object.values(PROJECTS)

export function resolveProjectId(demoId?: string | null): ProjectId {
  const raw = (demoId ?? '').toLowerCase()
  if (raw === 'udp-pattern' || raw === 'pattern') return 'udp-pattern'
  return 'udp-dt'
}

export function getProject(demoId?: string | null): ProjectDef {
  return PROJECTS[resolveProjectId(demoId)]
}

export function isLegacyCustomer360(demoId?: string | null): boolean {
  return (demoId ?? '').toLowerCase() === 'customer360'
}

export function marketplaceFamilyGroupsFor(products: MarketplaceProduct[]) {
  const families = new Map<string, { global: MarketplaceProduct; natcos: MarketplaceProduct[] }>()
  for (const p of products) {
    const entry = families.get(p.familyId) ?? { global: p, natcos: [] }
    if (p.scope === 'global') entry.global = p
    else entry.natcos.push(p)
    families.set(p.familyId, entry)
  }
  return [...families.entries()].map(([familyId, { global, natcos }]) => ({
    family: { id: familyId, domain: global.domain },
    global,
    natcos,
  }))
}
