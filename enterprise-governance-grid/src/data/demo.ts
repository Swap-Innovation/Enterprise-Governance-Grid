export const DEMO_ID = 'customer360'
export const DEMO_BASE = `/demo/${DEMO_ID}`

export const demoNav = [
  { to: 'marketplace', label: 'Marketplace', hint: 'Discover data products' },
  { to: 'contracts', label: 'Contracts', hint: 'Global & NATCO folders' },
  { to: 'semantics', label: 'Semantics', hint: 'Ontology · knowledge graph' },
  { to: 'studio', label: 'Studio', hint: 'Architecture & control plane' },
  { to: 'governance', label: 'Governance', hint: 'Policies & outcomes' },
  { to: 'questions', label: 'Strategic Qs', hint: 'SQ1–SQ12 decisions' },
  { to: 'guided', label: 'Guided tour', hint: 'Step-by-step walkthrough' },
] as const

export const NATCOS = [
  { code: 'de', slug: 'natco-de', label: 'Germany', localHint: 'DE' },
  { code: 'at', slug: 'natco-at', label: 'Austria', localHint: 'AT' },
  { code: 'hr', slug: 'natco-hr', label: 'Croatia', localHint: 'HR' },
  { code: 'hu', slug: 'natco-hu', label: 'Hungary', localHint: 'HU' },
  { code: 'pl', slug: 'natco-pl', label: 'Poland', localHint: 'PL' },
] as const

type NatcoCode = (typeof NATCOS)[number]['code']

export type MarketplaceProduct = {
  id: string
  name: string
  owner: string
  domain: string
  status: string
  scope: 'global' | 'natco'
  natco: string | null
  familyId: string
  description: string
  implements: string
  inputs: number
  contract: string
  queryCode: string
  localName?: string
}

/** Five global data products — each has NATCO federated equivalents */
export const marketplaceFamilies = [
  {
    id: 'customer-360',
    domain: 'Customer',
    global: {
      id: 'dp-customer-360',
      name: 'Customer 360',
      owner: 'Customer 360 Product Team',
      description:
        'Enterprise customer master under TM Forum SID Customer. Federates NATCO CRM sources (Kunde, Kupac, Ügyfél, Klient).',
      implements: 'global/Customer',
      inputs: 5,
      contract: 'contract-customer-360-v1',
    },
    natcoLocalName: {
      de: 'Kunde',
      at: 'Kunde',
      hr: 'Kupac',
      hu: 'Ügyfél',
      pl: 'Klient',
    } satisfies Record<NatcoCode, string>,
  },
  {
    id: 'customer-interactions',
    domain: 'Customer',
    global: {
      id: 'dp-customer-interactions',
      name: 'Customer Interactions',
      owner: 'CX Analytics Team',
      description:
        'Omnichannel interaction history (call, chat, retail, app) grounded on SID CustomerInteraction.',
      implements: 'global/CustomerInteraction',
      inputs: 5,
      contract: 'contract-customer-interactions-v1',
    },
    natcoLocalName: {
      de: 'Kundeninteraktion',
      at: 'Kundeninteraktion',
      hr: 'Interakcija kupca',
      hu: 'Ügyfél interakció',
      pl: 'Interakcja klienta',
    } satisfies Record<NatcoCode, string>,
  },
  {
    id: 'product-orders',
    domain: 'Commerce',
    global: {
      id: 'dp-product-orders',
      name: 'Product Orders',
      owner: 'Order Management COE',
      description:
        'Cross-NATCO product order lifecycle for mobile, fixed, and TV — SID ProductOrder.',
      implements: 'global/ProductOrder',
      inputs: 5,
      contract: 'contract-product-orders-v1',
    },
    natcoLocalName: {
      de: 'Produktauftrag',
      at: 'Produktauftrag',
      hr: 'Narudžba proizvoda',
      hu: 'Termékrendelés',
      pl: 'Zamówienie produktu',
    } satisfies Record<NatcoCode, string>,
  },
  {
    id: 'billing-accounts',
    domain: 'Billing',
    global: {
      id: 'dp-billing-accounts',
      name: 'Billing Accounts',
      owner: 'Revenue Assurance',
      description:
        'Unified billing account and balance view federating NATCO BSS ledgers — SID BillingAccount.',
      implements: 'global/BillingAccount',
      inputs: 5,
      contract: 'contract-billing-accounts-v1',
    },
    natcoLocalName: {
      de: 'Rechnungskonto',
      at: 'Rechnungskonto',
      hr: 'Račun za naplatu',
      hu: 'Számlázási számla',
      pl: 'Konto rozliczeniowe',
    } satisfies Record<NatcoCode, string>,
  },
  {
    id: 'service-subscriptions',
    domain: 'Service',
    global: {
      id: 'dp-service-subscriptions',
      name: 'Service Subscriptions',
      owner: 'Service Inventory Team',
      description:
        'Active subscriptions and service inventory across NATCOs — SID ServiceSubscription.',
      implements: 'global/ServiceSubscription',
      inputs: 5,
      contract: 'contract-service-subscriptions-v1',
    },
    natcoLocalName: {
      de: 'Serviceabonnement',
      at: 'Serviceabonnement',
      hr: 'Pretplata na uslugu',
      hu: 'Szolgáltatás-előfizetés',
      pl: 'Subskrypcja usługi',
    } satisfies Record<NatcoCode, string>,
  },
] as const

function buildMarketplaceProducts(): MarketplaceProduct[] {
  const out: MarketplaceProduct[] = []
  for (const family of marketplaceFamilies) {
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
      queryCode: 'Q3',
    })
    for (const n of NATCOS) {
      const local = family.natcoLocalName[n.code]
      out.push({
        id: `${family.global.id}-${n.code}`,
        name: `${n.label} · ${local}`,
        owner: `${n.slug}-data-office`,
        domain: family.domain,
        status: 'Published',
        scope: 'natco',
        natco: n.slug,
        familyId: family.id,
        description: `NATCO ${n.label} equivalent of ${family.global.name} — local “${local}” federates to ${family.global.implements}.`,
        implements: `${n.slug}/${local.toLowerCase().replace(/\s+/g, '-')} → ${family.global.implements}`,
        inputs: 0,
        contract: `contract-${family.id}-${n.code}-v1`,
        queryCode: 'Q3',
        localName: local,
      })
    }
  }
  return out
}

export const marketplaceProducts = buildMarketplaceProducts()

export function marketplaceFamilyGroups() {
  return marketplaceFamilies.map((family) => {
    const global = marketplaceProducts.find((p) => p.id === family.global.id)!
    const natcos = marketplaceProducts.filter((p) => p.familyId === family.id && p.scope === 'natco')
    return { family, global, natcos }
  })
}

export type MarketplaceProductFlat = MarketplaceProduct

export function semanticsHref(demoId: string, productId: string) {
  const q = new URLSearchParams({ product: productId, query: 'Q3' })
  return `/demo/${demoId}/semantics?${q.toString()}`
}
