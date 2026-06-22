# Product Operating Checklist

Research-backed checklist for Latchet.

Snapshot date: June 19, 2026.

Companion reference:

- [Detailed Product Architecture](detailed-product-architecture.md)

Purpose:

- lock the core idea
- define product boundaries
- align architecture and workflow
- set a build methodology
- keep marketing, pricing, technical scope, and testing in one place

## 1. Fixed Core Idea

These are the decisions that should not drift without a deliberate product reset.

- [x] Latchet is a **task ledger for AI coding agents**.
- [x] The primary job is **prevent repeated mistakes across sessions and tools**.
- [x] The source of truth is **repo-local structured state**, not hidden provider memory.
- [x] The canonical store is **append-only events + derived current-state view**.
- [x] The first release targets **solo power users of terminal-first coding agents**.
- [x] Handoff is a **derived feature**, not the primitive.
- [x] v1 is **local-first, inspectable, human-editable, and open-core**.
- [x] v1 does **not** require vector DBs, hosted backends, or cloud sync.

One-line positioning:

> Latchet keeps decisions, failed attempts, env quirks, and the next action in one place for AI coding agents.

Anti-positioning:

- [x] Do not market as "AI memory"
- [x] Do not market as "second brain"
- [x] Do not market as "infinite context"
- [x] Do not market as transcript portability

## 2. User Need Research

What current users appear to need most:

- [x] A way to stop re-explaining tasks across Codex, Claude Code, Cursor, and similar tools.
- [x] A way to preserve **failed attempts**, not only summaries.
- [x] A way to preserve **project-specific instructions and commands** without stale drift.
- [x] A way to restart from repo state tomorrow without reading old chat logs.
- [x] A minimal workflow that fits alongside existing agent habits instead of replacing them.

What current users already do:

- [x] Keep `AGENTS.md`, `CLAUDE.md`, rules files, or repo docs as a lightweight source of truth.
- [x] Store build/test commands in `package.json`, `Makefile`, or `justfile`.
- [x] Use tool-specific rules plus MCP servers as a thin memory layer.
- [x] Avoid the problem by splitting tasks by tool instead of switching context cleanly.

Implications:

- [x] Latchet must complement repo-local instruction files, not replace them.
- [x] Latchet should store **durable task state**, not broad conversational history.
- [x] Latchet must stay lighter than a full project manager or agent framework.
- [x] Drift detection for commands, paths, and stale state matters as much as memory itself.

## 3. Competitive Landscape

Direct competition or close substitutes:

- [x] `ai-memory`: long-term memory + handoff + MCP + hooks + optional web UI
- [x] `AICTX`: repo-local continuity runtime around resume/finalize loops
- [x] `agentmemory`: persistent memory for multiple coding-agent clients
- [x] `handoff`: local-first structured workflow using markdown files

Adjacent projects:

- [x] `basic-memory`: markdown + MCP + structured knowledge graph
- [x] Mem0: memory infrastructure for agents and apps
- [x] Langfuse: traces, evals, cost, and observability for LLM systems

Competitive conclusions:

- [x] The space is now real, not hypothetical.
- [x] Repo-local continuity is emerging as a recognizable pattern.
- [x] Many projects drift toward broad "memory" or knowledge-graph territory.
- [x] Latchet should stay opinionated around **task-state continuity for coding work**.

Where Latchet can still differentiate:

- [x] Event-ledger model centered on decisions, failures, quirks, provenance, and next action.
- [x] Derived state instead of freeform file sprawl.
- [x] Strong freshness and verification semantics.
- [x] Open-core local foundation with paid sync/governance later.
- [ ] Best-in-class UX around inspection, verification, and cross-tool continuity.
- [ ] Strongest testing corpus for real coding-agent resume flows.

## 4. Buildability Assessment

What can realistically be built:

- [x] Local-first ledger under `.taskledger/`
- [x] CLI and MCP server
- [x] Repo-local continuity across multiple agents through exports/imports
- [x] Human-editable state and share-safe exports
- [x] Basic structured importers from session summaries, command outputs, and artifacts

What is feasible with high confidence:

- [x] Codex integration via project config layers and MCP
- [x] Claude Code integration via `CLAUDE.md`, hooks, MCP, plugins
- [x] Cursor integration via rules, hooks, MCP, skills, CLI
- [x] Gemini CLI style integration via MCP, extensions, project context files

What is feasible but should be delayed:

- [ ] Auto-capture from live tool events across all vendors
- [ ] Shared sync and reviewer workflows
- [ ] Browser and chat surfaces
- [ ] Deep analytics and dashboards

What is brittle or high-risk:

- [ ] Browser scraping as a primary architecture
- [ ] Silent context injection with hidden side effects
- [ ] Full transcript portability
- [ ] Anything that depends on one vendor's private UI internals

Important ecosystem risk:

- [x] Gemini CLI is in ecosystem churn. Official Gemini CLI docs noted on June 18, 2026 that unpaid tier and Google One users would be replaced by Antigravity CLI. Keep the adapter abstraction stable and treat this integration as medium priority, not as a foundation.

## 5. Integration Research

### Codex

- [x] Codex CLI is open source and runs locally.
- [x] Codex supports MCP in both CLI and IDE extension.
- [x] Codex supports user and project config layers, including `.codex/config.toml`.

Implication:

- [x] Codex should be a first-class integration.
- [x] Start with MCP + export/import + project-local config guidance.
- [ ] Explore whether a stronger hook-like automation path is worthwhile after MVP proof.

### Claude Code

- [x] Claude Code officially supports `CLAUDE.md`.
- [x] Claude Code officially supports deterministic hooks.
- [x] Claude Code supports MCP and plugins.

Implication:

- [x] Claude Code is the best first automation target.
- [x] Hooks are the most credible path for auto-append and verification triggers.

### Cursor

- [x] Cursor officially supports rules, hooks, MCP, skills, CLI, and cloud agents.
- [x] Cursor pricing and packaging suggest it expects serious agent workflows, not only autocomplete usage.

Implication:

- [x] Cursor should be export-first and rule/MCP-first.
- [ ] Deeper integration through extension APIs can come later.

### Gemini CLI

- [x] Gemini CLI supports MCP, project context, extensions, and skills.
- [x] Gemini CLI officially documents extensions and pricing/quota models.
- [x] Ecosystem churn makes it less stable as a primary launch target.

Implication:

- [x] Keep a Gemini adapter, but avoid over-investing before the surrounding product name and extension path stabilize.

## 6. Architecture Decisions

Canonical architecture:

- [x] `task-ledger.schema.json` is canonical
- [x] `events.jsonl` is canonical history
- [x] `state.json` and `state.md` are derived views
- [x] repo-local files are the system of record
- [x] summaries never overwrite history

Storage:

- [x] v1 store = files on disk
- [x] no database required for canonical data
- [ ] optional read index later is acceptable if files remain the source of truth

Validation:

- [x] use JSON Schema Draft 2020-12
- [x] validate with Ajv
- [x] compile validators once and reuse them

Telemetry:

- [x] evidence ingestion should align with OpenTelemetry concepts
- [ ] use traces/metrics first
- [ ] avoid depending on OTel logging as a critical path in Node.js, because official JS logging support is still maturing

MCP:

- [x] MCP is the standard integration layer
- [x] keep MCP support first-class for both local tools and future UI
- [ ] track MCP spec churn and version compatibility as the protocol evolves

UI:

- [x] UI is a surface on top of the ledger, not the core
- [x] build web-first, then package with Tauri if desktop distribution is needed
- [x] keep plugin capability scoped and permissioned
- [ ] do not let UI reshape the source-of-truth model

What Latchet should not promise even if the UX becomes richer:

- [x] It will not perfectly reconstruct every transcript.
- [x] It will not eliminate the need for repo-local instructions like `AGENTS.md` or `CLAUDE.md`.
- [x] It will not make stale or wrong decisions safe without verification.
- [x] It should reduce repeated mistakes and restart cost, not replace engineering judgment.

## 7. Canonical Workflow

This is the workflow the product should optimize for before adding more surfaces.

1. user creates or selects a task
2. agent or user appends only durable events during work
3. user or hook runs derive to produce the latest `state.json` and `state.md`
4. before resuming or handing off, the verifier checks repo freshness, artifact existence, branch drift, and stale refs
5. next agent reads the current state, not the full transcript, and continues from the single best next action

Workflow rules:

- [x] the ledger should be writable manually
- [x] automation should append evidence and durable state, not dump the full transcript
- [x] every pause point should end with a valid next action if possible
- [x] every resume flow should start from verification, not blind trust
- [x] handoff packs should be exportable from the same canonical state

## 8. Product Surface Checklist

### Solo MVP surface

- [x] init a ledger
- [x] create/select tasks
- [x] append decisions, failures, quirks, next actions
- [x] derive current state
- [x] verify freshness
- [x] export handoff/state
- [x] import state/handoff
- [x] expose state via MCP

### Phase 2 integrations

- [x] command-output importer
- [x] structured session importer for Codex and Claude-style summaries
- [x] adapter prompt exports
- [ ] Cursor fixture corpus
- [ ] Gemini/Antigravity fixture corpus
- [ ] live hook-based capture for Claude Code
- [ ] deeper vendor-specific automation where reliable

### Phase 2.5 local UI

- [ ] task list
- [ ] current-state inspector
- [ ] event timeline
- [ ] decision trail
- [ ] failure memory panel
- [ ] next-action editor
- [ ] freshness/verification view
- [ ] handoff export screen
- [ ] state diff view

### Phase 4 paid surfaces

- [ ] hosted sync
- [ ] cross-device continuity
- [ ] shared review and approvals
- [ ] audit reporting
- [ ] policy controls
- [ ] analytics

## 9. Pricing Research and Recommendation

Pricing anchors from adjacent tools:

- [x] Cursor Individual: $20/mo; Teams: $40/user/mo
- [x] Linear Basic: $10/user/mo; Business: $16/user/mo
- [x] Raycast Pro: $8/mo annually; Teams: $12/user/mo annually
- [x] ChatGPT Business standard seats: $20/user/mo annually or $25 monthly
- [x] Claude Team standard seats: $20/user/mo annually or $25 monthly
- [x] Langfuse Core starts at a $29/mo base plus usage

Pricing conclusions:

- [x] Latchet should price **below the primary coding-agent seat**.
- [x] The OSS core should remain free.
- [x] Do not introduce token-based pricing in the first paid tier.
- [x] Charge for convenience, sync, governance, and collaboration, not for local ledger usage.

Recommended pricing hypothesis:

- [ ] Free OSS Core: local ledger, CLI, MCP, adapters, fixtures
- [ ] Solo Sync: $8-10/mo
- [ ] Power User / Consultant: $15-20/mo
- [ ] Team Sync + Review: $12-15/user/mo
- [ ] Enterprise: custom pricing for governance, controls, audit, and support

Packaging rule:

- [x] paid tier should feel like a secondary workflow seat, not like a primary AI seat

## 10. Marketing and Positioning Checklist

Messaging:

- [x] Lead with "task ledger for AI coding agents"
- [x] Lead with "stop repeating failed approaches"
- [x] Show "decisions, failed attempts, env quirks, next action"
- [x] Emphasize inspectable local state
- [x] Avoid broad "memory" claims

Proof required before broad launch:

- [ ] 30-60 second demo
- [ ] one real resume-after-failure example
- [ ] one real cross-tool continuity example
- [ ] one sample repo or fixture pack
- [ ] clean README + screenshots + release notes

Launch sequence:

- [x] GitHub release first
- [x] Show HN after the product is real and runnable
- [x] Reddit/X/DEV/Indie Hackers as follow-on channels
- [x] Product Hunt later, once onboarding is tight

Launch rule:

- [x] do not launch a landing page without a runnable product

Execution docs in this repo:

- [x] use [Marketing Strategy](marketing-strategy.md) for positioning and message discipline
- [x] use [Go-To-Market Playbook](go-to-market-playbook.md) for week-by-week launch execution
- [x] use [Detailed Product Architecture](detailed-product-architecture.md) for novelty, usability, and system-design decisions

## 11. Testing Strategy Checklist

### Automated tests

- [x] projector determinism
- [x] supersession behavior
- [x] freshness checks
- [x] redaction
- [x] export/import
- [x] adapter unit tests
- [x] CLI smoke tests
- [x] MCP smoke tests
- [x] fixture-based golden tests for first integrations

### Still needed in automated coverage

- [ ] duplicate import / dedupe scenarios
- [ ] corrupt and partial event-file recovery behavior
- [ ] stale branch / changed branch edge cases
- [ ] contradiction detection
- [ ] performance tests on large ledgers
- [ ] UI accessibility and keyboard tests once UI exists

### Manual acceptance scenarios

- [ ] same user resumes the next day from `.taskledger/` only
- [ ] same user switches from Codex to Claude Code without re-explaining
- [ ] same user avoids a previously logged failed path
- [ ] same repo on another machine with sync enabled resumes correctly
- [ ] sanitized export does not leak secrets

### Real-world product validation

- [ ] 1 real repo
- [ ] 1 real bug/debugging task
- [ ] 1 feature task across multiple sessions
- [ ] 1 cross-agent switch
- [ ] 1 crash/restart reconstruction

### Security and privacy checks

- [ ] redaction removes secrets from exports
- [ ] share-safe state excludes sensitive paths/revisions when requested
- [ ] MCP surface does not expose more than necessary
- [ ] future hosted sync has explicit encryption, auth, and retention decisions

## 12. Working Methodology

How the team should operate:

- [x] do not add major surfaces before proving the current one
- [x] every new feature must map back to the core job
- [x] prefer deterministic, inspectable workflows over magical automation
- [x] make thin integrations, not deep vendor dependencies, unless the official surface is stable
- [x] keep the repo-local ledger canonical even when sync/UI are added

Default build loop:

1. prove the user need with a specific scenario
2. add the smallest surface that solves it
3. add fixture coverage
4. add smoke coverage
5. run one manual acceptance flow
6. only then expand the feature

Definition of done for any phase:

- [ ] user-visible problem is clear
- [ ] architecture decision is documented
- [ ] automated coverage exists
- [ ] manual acceptance is run
- [ ] docs and demo stay in sync with the product

## 13. Immediate Next Steps

These are the highest-priority tasks now.

- [ ] Clean and commit current repo state
- [ ] Add `resume-after-crash` fixture
- [ ] Add `cross-agent handoff` fixture
- [ ] Add `duplicate import / dedupe` tests
- [ ] Run one real repo through the Latchet workflow
- [ ] Record the first proof demo
- [ ] Decide whether the next product step is Cursor integration or local UI

Recommended next decision:

- [x] Do **not** jump to hosted sync yet
- [x] Do **not** jump to browser/chat surfaces yet
- [x] Either:
  - finish the integration/testing proof path, or
  - begin a minimal local UI if it directly improves validation and usability

## 14. Sources

Technical and ecosystem:

- Model Context Protocol overview: <https://modelcontextprotocol.io/docs/getting-started/intro>
- MCP specification: <https://modelcontextprotocol.io/specification/2025-11-25>
- Codex CLI: <https://developers.openai.com/codex/cli>
- Codex MCP: <https://developers.openai.com/codex/mcp>
- Codex config basics: <https://developers.openai.com/codex/config-basic>
- Claude Code overview: <https://code.claude.com/docs/en/overview>
- Claude Code hooks: <https://code.claude.com/docs/en/hooks>
- Claude Code hooks guide: <https://code.claude.com/docs/en/hooks-guide>
- Cursor docs: <https://cursor.com/docs>
- Cursor MCP: <https://cursor.com/docs/mcp>
- Cursor Rules: <https://cursor.com/docs/rules>
- Cursor Hooks: <https://cursor.com/docs/hooks>
- Cursor Agent Skills: <https://cursor.com/docs/skills>
- Gemini CLI docs: <https://geminicli.com/docs/>
- Gemini CLI MCP: <https://geminicli.com/docs/tools/mcp-server/>
- Gemini CLI extensions: <https://geminicli.com/docs/extensions/>
- Gemini CLI quotas and pricing: <https://geminicli.com/docs/resources/quota-and-pricing/>
- Tauri overview: <https://v2.tauri.app/>
- Tauri plugin development: <https://v2.tauri.app/develop/plugins/>
- JSON Schema 2020-12: <https://json-schema.org/specification>
- Ajv getting started: <https://ajv.js.org/guide/getting-started.html>
- OpenTelemetry JS / Node.js: <https://opentelemetry.io/docs/languages/js/getting-started/nodejs/>

Market and competition:

- AICTX site: <https://aictx.org/>
- AICTX GitHub: <https://github.com/oldskultxo/aictx>
- ai-memory GitHub: <https://github.com/akitaonrails/ai-memory>
- agentmemory GitHub: <https://github.com/rohitg00/agentmemory>
- handoff article: <https://semiherdogan.medium.com/handoff-a-better-way-to-run-autonomous-development-loops-00e97e62d470>
- basic-memory GitHub: <https://github.com/basicmachines-co/basic-memory>
- basic-memory technical docs: <https://docs.basicmemory.com/reference/technical-information>
- Cursor forum continuity discussion: <https://forum.cursor.com/t/how-are-people-handling-context-across-different-ai-coding-tools/159891>

Pricing and launch:

- Cursor pricing: <https://cursor.com/pricing>
- Raycast pricing: <https://www.raycast.com/pricing>
- Linear pricing: <https://linear.app/pricing>
- Langfuse pricing: <https://langfuse.com/pricing>
- ChatGPT pricing: <https://chatgpt.com/pricing/>
- Codex pricing: <https://developers.openai.com/codex/pricing>
- ChatGPT Business: <https://help.openai.com/en/articles/8792828-what-is-chatgpt-business>
- Claude pricing: <https://claude.com/pricing>
- Claude Team pricing: <https://support.claude.com/en/articles/9266767-what-is-the-team-plan>
- GitHub repository best practices: <https://docs.github.com/en/repositories/creating-and-managing-repositories/best-practices-for-repositories>
- GitHub releases: <https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases>
- Managing releases: <https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository>
- Show HN rules: <https://news.ycombinator.com/showhn.html>
- Launch HN instructions: <https://news.ycombinator.com/yli.html>
- Product Hunt launch prep: <https://www.producthunt.com/launch/preparing-for-launch>
- DEV Community: <https://dev.to/>
