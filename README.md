# Latchet

**Latchet keeps decisions, failed attempts, env quirks, and the next action in one place for AI coding agents.**

Stop re-explaining the same task across Codex, Claude Code, Cursor, and similar tools. Latchet stores durable work state in repo-local files so the next session (or the next tool) doesn't repeat the same dead end.

The ledger is append-only. Handoff is a derived feature, not the primary artifact.

### What's Included in v0.1

✅ Local-first task ledger (`.taskledger/` directory)  
✅ CLI: create tasks, log decisions/failures/quirks, derive state, verify freshness, export handoffs  
✅ MCP server for coding-agent integrations  
✅ Session importers for Codex, Claude Code, Cursor, and Gemini CLI  
✅ Command output importer (`import-command`) for test/build failures  
✅ Prompt exporters for Codex, Claude Code, Cursor, and Gemini CLI  
✅ 18+ tests covering core behavior  

### What's NOT (Yet)

❌ Live vendor integrations or auto-capture  
❌ Hosted sync or cloud backend  
❌ Web UI or dashboard

See [RELEASE_SCOPE.md](RELEASE_SCOPE.md) for full details on what ships, what doesn't, and launch readiness.

## Shipped in this repo

- Canonical event schema in [packages/spec](packages/spec)
- Projection engine, local store, markdown renderer, freshness checks, redaction, import/export, and diffing in [packages/core](packages/core)
- CLI in [packages/cli](packages/cli)
- MCP server in [packages/mcp](packages/mcp)
- Adapter contracts and handoff prompt templates in [packages/adapters](packages/adapters)
- Landing site in [apps/site](apps/site)
- Example fixtures in [examples/fixtures](examples/fixtures)

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
node packages/cli/dist/index.js import-session notes/codex-session.txt --adapter codex --task rbac
npm test 2>&1 | tee /tmp/test-output.txt
node packages/cli/dist/index.js import-command /tmp/test-output.txt --command "npm test" --task rbac
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
- `import_command`
- `import_session`

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

- [Release Scope & Launch Checklist](RELEASE_SCOPE.md) — what ships, what's out of scope, success criteria
- [Roadmap](docs/roadmap.md)
- [Marketing Strategy](docs/marketing-strategy.md)
- [Phase 2 Execution](docs/phase-2-execution.md)
- [Go-To-Market Playbook](docs/go-to-market-playbook.md)
- [Product Operating Checklist](docs/product-operating-checklist.md)
- [Detailed Product Architecture](docs/detailed-product-architecture.md)
