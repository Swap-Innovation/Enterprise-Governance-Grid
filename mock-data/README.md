# Mock data

Canonical **project** instance store is [`projects/`](projects/README.md).

| Path | Role |
| --- | --- |
| `projects/{id}/scopes/` | Authored contracts + Ossie JSON |
| `projects/{id}/derived/` | Compiled catalog, KG, coverage |
| `projects/{id}/kg-snapshots/` | Neo4j KG scenario snapshots |
| `projects/{id}/scenarios/` | Options A/B/C, end-to-end flow, multi-natco |
| `projects/udp-dt/tmforum.json` | TM Forum SID reference taxonomy (UDP-DT Studio) |
| `projects/udp-dt/pitch-concepts.json` | Concept library (UDP-DT Studio) |
| `projects/udp-dt/strategic-questions.json` | SQ1–SQ12 strategic decisions (UDP-DT demo) |

Rebuild catalogs and graphs from the project tree:

```bash
node scripts/compile-project-mock.mjs
```
