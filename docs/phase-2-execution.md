# Phase 2 Execution

Phase 2 is where Latchet stops being only a clean local ledger and starts becoming a practical companion for real coding-agent workflows.

The goal is not to capture everything. The goal is to reliably capture the few durable facts that prevent repeated mistakes:

- accepted decisions
- failed attempts
- environment quirks
- artifact references
- the single best next action

## What phase 2 means right now

Build the adapter layer and verification harness before building deep automation.

That means:

1. Define how each agent integration maps vendor-specific signals into canonical ledger events.
2. Build fixture-driven import tests so event mapping is deterministic.
3. Add end-to-end smoke tests for the CLI and handoff flow.
4. Ship only the integrations that are useful without brittle scraping.

## Integration order

Start with the agents that match the current product wedge: terminal-heavy coding agents used by solo power users.

1. Codex
2. Claude Code
3. Cursor
4. Gemini CLI

Why this order:

- Codex and Claude Code are the best fit for explicit handoff and local artifact flows.
- Cursor is important for adoption, but file-based support is safer than trying to couple to private internals.
- Gemini CLI matters, but it should come after the importer and prompt-export contract is stable.

## Build streams

### Stream A: adapter contracts

For each integration, define:

- ingestion inputs
- export target
- trust level
- failure modes

Minimum contract per adapter:

- `exportPrompt(state)`
- optional `importSession(taskId, content)`
- mapping rules from raw input to canonical events
- provenance rules for `actor`, `source`, and `verification`

Minimum useful ingestion per adapter:

- Codex: command output importer plus handoff export
- Claude Code: session/log importer plus handoff export
- Cursor: markdown/rules export plus file-drop import
- Gemini CLI: session text import plus handoff export

## Stream B: fixture corpus

Create a fixture set for each integration before trying to automate live capture.

Each fixture should include:

- raw source input
- expected emitted events
- expected derived `state.json`
- expected exported handoff prompt

Recommended fixture folders:

```text
examples/fixtures/
  codex/
  claude-code/
  cursor/
  gemini-cli/
```

Each fixture scenario should cover one concrete job:

- debugging a failing test
- finishing a feature across two sessions
- resuming after a crash
- switching from one agent to another

## Stream C: testing matrix

Testing should move from unit tests to workflow tests, not just more helper tests.

### Unit tests

Required now:

- importer emits evidence for every command capture
- importer emits failure events on clear failure signals
- adapter prompt exports contain the expected durable task state
- generic markdown export stays adapter-neutral

### Golden tests

Add next:

- replay fixture inputs into canonical events
- derive `state.json` deterministically
- render `state.md` deterministically
- verify supersession and contradiction handling

### End-to-end tests

Add after the fixture harness:

- initialize a project
- create a task
- append events
- derive state
- export a handoff
- import a handoff into another task

### Manual acceptance tests

These should be run before every public release:

1. Pause a task with a known failed path.
2. Resume the next day from only repo state plus `.taskledger/`.
3. Switch to another agent using exported handoff.
4. Confirm the new agent does not retry the known-bad approach.

## Release gates for phase 2

Do not call phase 2 complete until all of these are true:

1. At least two integrations can auto-append useful durable facts.
2. A user can restart from `.taskledger/` without maintaining a manual `HANDOFF.md`.
3. `npm test` covers core, adapters, and CLI smoke flows.
4. One public demo shows a repeated-failure avoided because the ledger preserved it.

## Suggested build order

### Milestone 1: stabilize the verification base

- add adapter unit tests
- add CLI smoke tests
- define fixture directory structure
- add golden test harness skeleton

### Milestone 2: ship the first real integrations

- codex importer/exporter
- claude-code importer/exporter
- fixture corpus for both
- contradiction and supersession edge-case tests

### Milestone 3: cross-tool continuity

- cursor and gemini-cli exporters/importers
- import/export dedupe checks
- state diffing around a session boundary

## Immediate next actions

This is the concrete order to follow from the current repo state:

1. Expand tests around adapters, CLI, and fixture replay.
2. Create agent-specific fixture directories and commit at least one fixture for Codex and Claude Code.
3. Define the adapter mapping spec in code comments or docs so raw logs are never treated as first-class truth.
4. Add a small demo repo or demo script that shows resume speed and repeated-failure avoidance.
5. Only then start live hook-based ingestion.
