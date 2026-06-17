# Latchet

Latchet is a local-first operational ledger for AI-assisted work. It keeps the durable parts of a task in one place: decisions, failed attempts, env quirks, artifact refs, open questions, and the next action.

The ledger is append-only. Handoff is a derived feature, not the primary artifact.

## What ships in this repo

- Canonical event schema in [packages/spec](/Users/aviralgarg/Everything/Context Manager/packages/spec)
- Projection engine, local store, markdown renderer, freshness checks, redaction, import/export, and diffing in [packages/core](/Users/aviralgarg/Everything/Context Manager/packages/core)
- CLI in [packages/cli](/Users/aviralgarg/Everything/Context Manager/packages/cli)
- MCP server in [packages/mcp](/Users/aviralgarg/Everything/Context Manager/packages/mcp)
- Adapter contracts and handoff prompt templates in [packages/adapters](/Users/aviralgarg/Everything/Context Manager/packages/adapters)
- Landing site in [apps/site](/Users/aviralgarg/Everything/Context Manager/apps/site)
- Example fixtures in [examples/fixtures](/Users/aviralgarg/Everything/Context Manager/examples/fixtures)

## Local layout

```text
.taskledger/
├── project.json
└── tasks/
    └── <task-id>/
        ├── attachments/
        ├── events.jsonl
        ├── state.json
        └── state.md
```

## Core commands

```bash
npm install
npm run build

node packages/cli/dist/index.js init --name "My Project"
node packages/cli/dist/index.js task create rbac --title "RBAC migration" --goal "Ship org-aware auth"
node packages/cli/dist/index.js log decision --task rbac --summary "Use PostgreSQL RLS" --reason "Enforce tenant isolation outside the API"
node packages/cli/dist/index.js log failure --task rbac --summary "Fixture users missing organization_id" --error "Expected tenant claim in JWT fixtures"
node packages/cli/dist/index.js log next_action --task rbac --summary "Patch test fixtures and rerun integration suite" --priority high
node packages/cli/dist/index.js derive --task rbac
node packages/cli/dist/index.js show --task rbac
```

## Landing site

```bash
npm run dev:site
npm run build:site
npm run preview:site
```

## MCP server

The MCP server exposes:

- `get_current_task`
- `get_task_state`
- `append_event`
- `list_open_questions`
- `get_next_action`
- `verify_artifacts`
- `export_handoff`
- `import_handoff`

Run it with:

```bash
npm run build
node packages/mcp/dist/index.js
```

## Product shape

- Local-first and human-readable
- No vector DB requirement
- No hidden context injection
- Structured event ledger as the source of truth
- Markdown and handoff packs as derived artifacts

## Docs

- [Roadmap](/Users/aviralgarg/Everything/Context Manager/docs/roadmap.md)
- [Marketing Strategy](/Users/aviralgarg/Everything/Context Manager/docs/marketing-strategy.md)
