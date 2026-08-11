# Enterprise Governance Grid — POC runbook

Original POC README (from Architecture_space). Prefer the root `README.md` in this repository for layout including `connected-data/`.

## Run

```bash
cd neo4j-contracts-kg && docker compose up -d && ./scripts/load.sh
cd ../enterprise-governance-grid && npm install && npm run dev
```

| URL | Role |
| --- | --- |
| `/` | Marketing landing |
| `/demo/customer360/marketplace` | Demo tenant · Marketplace |
| `/demo/customer360/contracts` | Global & NATCO contract folders |
| `/demo/customer360/semantics` | Live Neo4j KG + fallback JSON |
| `/demo/customer360/studio` | Architecture & concepts |
| `/demo/customer360/governance` | Ownership · policies · outcomes |
| `/demo/customer360/guided` | Guided tour |
