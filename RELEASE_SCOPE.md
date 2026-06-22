# Latchet v0.1 Release Scope

**Snapshot date**: June 22, 2026  
**Status**: Locked for public beta

## One-Line Positioning

> Latchet keeps decisions, failed attempts, env quirks, and the next action in one place for AI coding agents.

**Anti-positioning**: Do NOT market as "AI memory," "second brain," "infinite context," or "transcript manager."

---

## What Ships in v0.1

### Core Product
- ✅ **Append-only task ledger** with JSON schema validation
- ✅ **Local-first store** (`.taskledger/` directory with `events.jsonl`, `state.json`, `state.md`)
- ✅ **CLI** with these commands:
  - `init` — initialize a project ledger
  - `task create` — create a new task
  - `log <type>` — append decisions, failures, env quirks, constraints, next actions, open questions, notes, artifacts
  - `import-session` — import from Codex or Claude Code session notes
  - `show` — render markdown state
  - `next` — display the current next action
  - `verify` — check branch, commit, artifact freshness
  - `export` — handoff pack or adapter-specific prompt
  - `import` — load handoff or state JSON
  - `redact` — export with paths, revisions, reasons, or secrets masked
  - `diff` — compare two state snapshots
  - `derive` — force re-derive state from events
- ✅ **MCP server** with tools:
  - `get_current_task`, `get_task_state`, `append_event`, `list_open_questions`, `get_next_action`, `verify_artifacts`, `export_handoff`
- ✅ **Adapter layer** with:
  - Codex session importer (structured notes)
  - Claude Code session importer (structured notes)
  - Prompt exporters for Codex, Claude Code, Cursor, Gemini CLI, and generic markdown
- ✅ **Landing site** (latchet.vercel.app)
  - Clear product positioning
  - Interactive hero with event examples
  - Feature breakdown
  - CLI/MCP/open-source details
  - Link to GitHub repo and docs
- ✅ **Test coverage**:
  - Core ledger projection stability
  - Event supersession behavior
  - Handoff export/import preservation
  - Adapter fixture tests (Codex + Claude Code)
  - CLI smoke tests
  - MCP smoke tests

### What's Intentionally NOT Shipped

- ❌ Deep vendor integrations (no live Codex/Claude Code hook scraping yet)
- ❌ Hosted sync or cloud backend
- ❌ Web UI or dashboard
- ❌ Vector DB or semantic search
- ❌ Automated event capture from terminal output (only manual session import)
- ❌ Cursor or Gemini CLI importers (exporters only)
- ❌ CI/CD pipeline integrations
- ❌ Team or multi-user workflows

---

## Success Criteria for v0.1

A launch is successful if:

1. ✅ **Messaging is clear**
   - README headline + opening section uses the one-line positioning
   - Marketing playbook is followed for the launch wave
   - No ambiguity about what Latchet does vs. what it doesn't

2. ✅ **The core workflow works**
   - A user can init, create a task, log events, and export a handoff without friction
   - Freshness checks actually surface stale state
   - Failed attempts survive the session and can be queried next day

3. ✅ **Tests pass and are meaningful**
   - `npm test` runs 14+ tests and passes
   - Tests cover core behavior, not just boilerplate
   - At least one fixture proves "same failure not repeated" flow

4. ✅ **The site is production-ready**
   - Black-only aesthetic, no AI-generated feeling
   - Founder visible (name, GitHub link)
   - Loads fast, responsive on mobile, no console errors
   - CTA is clear: "GitHub" or "Try it"

5. ✅ **Demo exists**
   - One 30-60 second screencast or GIF
   - Shows: log failure → pause session → resume next day → verify failure still there
   - Live at latchet.vercel.app or in release notes

6. ✅ **Launch assets exist**
   - GitHub release with notes, demo, and one example repo
   - README with install, quickstart, and one sharp use case
   - Private feedback from 5-10 real coding-agent users before broad launch

---

## Out of Scope (Deliberately Deferred)

### Phase 2 Work (Post-Launch)
- Live hook-based event capture from Codex/Claude Code/Cursor
- Cursor and Gemini CLI importers
- Session auto-append workflows
- OpenTelemetry evidence ingestion
- Contradiction detection across events

### Phase 3+ Work
- Web dashboard or UI
- Shared workspaces and review workflows
- Fine-grained diff views
- Full transcript portability
- Browser/chat adapters

---

## User Expectations to Set

When someone lands on latchet.vercel.app or reads the README, they should expect:

- ✅ A **local-first task ledger** for coding agents, not a general "AI memory"
- ✅ **Manual event logging**, not magic auto-capture
- ✅ **Repo-local files**, not a hosted service
- ✅ **Designed for handoff between Codex/Claude Code/Cursor**, not a universal context layer
- ✅ **Focused on decisions, failures, and next actions**, not broad chat history

They should NOT expect:

- ❌ Automatic context injection
- ❌ Conversation backup or transcript storage
- ❌ Semantic search or vector embeddings
- ❌ Team collaboration or shared memory
- ❌ Cloud sync without explicit setup

---

## Launch Sequence

Do not deviate from this order:

1. **Week 1**: Finalize README, record demo, build release package
2. **Week 2**: Get private feedback from 5-10 real users
3. **Week 3**: Public launch
   - GitHub release
   - Show HN
   - Reddit posts (r/ChatGPTCoding, r/ClaudeAI, r/cursor, r/opensource)
   - X thread (casual, build-in-public tone)
   - DEV and Indie Hackers posts

---

## Known Limitations (Be Explicit)

State these upfront so users are not surprised:

- Session import is conservative — only structured notes, not full transcript parsing
- Freshness checks work for branch/commit/files, not tool versions or dependencies yet
- No npm package yet — use from source with `node packages/cli/dist/index.js`
- MCP server requires manual stdio setup, not yet integrated into Codex/Claude Code/Cursor by default
- Export formats are designed for resume, not for permanent archival or legal compliance

---

## Success Metrics After Launch

Track these to decide on Phase 2 investment:

- **Adoption**: > 50 GitHub stars in first month, > 10 real users doing actual work
- **Retention**: Users still using after 7 days, at least one reported "failure was avoided" story
- **Engagement**: At least 3 issues or PRs from users (not just bugs, but feature requests)
- **Reach**: > 500 impressions on Show HN, > 100 upvotes, > 50 on first HN thread
- **Confidence**: Launched on all planned channels without major embarrassment or backlash

---

## Final Gate Before Launch

Do NOT launch until all of these are true:

- [ ] README clearly states the one-line positioning in first 3 lines
- [ ] One demo exists (video, GIF, or interactive site example)
- [ ] All tests pass (`npm test` = 14+ passing)
- [ ] Site is live at latchet.vercel.app and loads without errors
- [ ] Release notes are written and include known limitations
- [ ] Founder name visible on site (header, hero, footer)
- [ ] At least one person outside the team has tried it and given feedback
- [ ] Marketing playbook has been reviewed and launch sequence is scheduled
