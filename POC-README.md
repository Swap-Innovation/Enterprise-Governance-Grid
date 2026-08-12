# Enterprise Governance Grid — POC runbook

Prefer the root [`README.md`](README.md) for **Setup A (live)** and **Setup B (mock / Pages)**.

## Setup A — Live

```bash
./scripts/dev-local.sh
# or:
cd backend/neo4j && docker compose up -d && ./scripts/load.sh
cd ../../frontend && npm install && npm run dev
```

## Setup B — Mock

```bash
./scripts/dev-mock.sh
# or: cd frontend && npm run dev:mock
```

Public: https://swapkodgire.github.io/Enterprise_governance_grid/

## Demo routes

| URL | Role |
| --- | --- |
| `/` | Marketing landing |
| `/demo/customer360/marketplace` | Demo tenant · Marketplace (SQ7) |
| `/demo/customer360/contracts` | Global & NATCO contract folders (SQ3) |
| `/demo/customer360/semantics` | Live Neo4j KG or mock snapshots (Q1–Q7, N1–N5) |
| `/demo/customer360/studio` | Architecture & concepts |
| `/demo/customer360/governance` | Ownership · policies · outcomes (SQ4) |
| `/demo/customer360/questions` | Strategic Qs SQ1–SQ12 (interactive board) |
| `/demo/customer360/guided` | Guided tour |

## Strategic questions

[docs/strategy/16. Strategic Questions.md](docs/strategy/16.%20Strategic%20Questions.md)
