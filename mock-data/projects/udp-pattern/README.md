# UDP-Pattern

Governance grid for [Pattern](https://www.pattern.com/#what-we-do). Canonical meaning is [UCP shopping](https://ucp.dev/2026-04-08/specification/reference/).

```text
scopes/{global|amazon|tiktok|tmall}/
  semantics/                 ucp.shopping · pattern-global · marketplace namespaces
  business-catalogue/
  technical-catalogue/
    entity/apache-ossie/     Ossie JSON (global ucp_shopping package)
  data-products/             SDP listings · ADP Brand Catalog · CDP checkout
derived/                     Compiled catalog + KG + coverage
```

Regenerate contracts from the Pattern operating model, then compile:

```bash
node scripts/generate-pattern-project.mjs
```

Demo URL: `/demo/udp-pattern/`
