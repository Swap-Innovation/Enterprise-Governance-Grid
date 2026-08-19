# Mock data

Canonical **project** instance store is [`projects/`](projects/README.md).

| Path | Role |
| --- | --- |
| `projects/{id}/scopes/` | Authored contracts + Ossie JSON |
| `projects/{id}/derived/` | Compiled catalog, KG, coverage |
| `entities/`, `relationships/` | Compatibility copies of UDP-DT derived files |
| `scenarios/`, `architecture/` | Cross-cutting pitch copies (not per-project SoR) |

Rebuild catalogs and graphs from the project tree:

```bash
node scripts/compile-project-mock.mjs
```
