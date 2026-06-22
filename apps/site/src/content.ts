export const heroEvents = [
  {
    id: "decision",
    label: "Decision",
    title: "PostgreSQL RLS stays locked in",
    summary: "Accepted architecture calls stay visible instead of vanishing into whichever model happened to say them first.",
    detail: "accepted · supersedes API-only guardrails",
    command: "latchet log decision --summary \"Use PostgreSQL RLS\"",
    accent: "cyan"
  },
  {
    id: "failure",
    label: "Failure",
    title: "Fixture users missing organization_id",
    summary: "Known-bad paths survive the session so the next model does not burn another hour rediscovering the same breakage.",
    detail: "reproducible · integration tests blocked",
    command: "latchet log failure --summary \"Fixture users missing organization_id\"",
    accent: "amber"
  },
  {
    id: "quirk",
    label: "Env quirk",
    title: "FEATURE_TENANT_RBAC=1 is required locally",
    summary: "Machine-specific weirdness gets recorded next to the task instead of living only in one shell history.",
    detail: "machine-specific · verified yesterday",
    command: "latchet log env_quirk --summary \"Enable FEATURE_TENANT_RBAC=1\"",
    accent: "slate"
  },
  {
    id: "action",
    label: "Next action",
    title: "Patch auth fixtures, rerun tenant tests, verify freshness",
    summary: "Every session can end with one sharp next move instead of a vague handoff paragraph and a cold restart tomorrow.",
    detail: "single-valued · resume-safe",
    command: "latchet log next_action --summary \"Patch fixtures and rerun tenant tests\"",
    accent: "cyan"
  }
];

export const painPoints = [
  {
    index: "01",
    title: "Transcript residue is not task state",
    description: "Good decisions get stranded in long chats, then a fresh model confidently walks back into the same argument."
  },
  {
    index: "02",
    title: "Failed attempts keep coming back",
    description: "A dead branch, flaky fixture, or rejected approach returns because nothing durable recorded why it died."
  },
  {
    index: "03",
    title: "The one useful local quirk never survives",
    description: "The branch mismatch, feature flag, or missing file that mattered most disappears right before the next session starts."
  }
];

export const featureCards = [
  {
    title: "Decision trail",
    description: "Accepted calls, tradeoffs, and superseded reasoning in one inspectable chain.",
    meta: "source of truth"
  },
  {
    title: "Failed-attempt memory",
    description: "Known-bad approaches survive the session instead of being retried with new wording.",
    meta: "do not repeat"
  },
  {
    title: "Env quirks",
    description: "Record shell flags, fixture landmines, and machine-specific rules code alone will not explain.",
    meta: "local reality"
  },
  {
    title: "Next action",
    description: "A single best next move that lets a session restart with momentum instead of recap.",
    meta: "restart fast"
  },
  {
    title: "Portable handoffs",
    description: "Export compact state for Codex, Claude Code, Cursor, Gemini CLI, or plain Markdown.",
    meta: "tool-agnostic"
  },
  {
    title: "Freshness checks",
    description: "Branch, commit, files, and artifacts get checked so stale state is obvious before you trust it.",
    meta: "state with proof"
  }
];

export const toolingCommands = [
  "$ latchet init",
  "$ latchet task create org-rbac --goal \"Ship org-aware auth\"",
  "$ latchet log failure --summary \"Fixture users missing organization_id\"",
  "$ latchet log decision --summary \"Use PostgreSQL RLS\"",
  "$ latchet log next_action --summary \"Patch fixtures and rerun tests\"",
  "$ latchet import-session notes/codex-session.txt --adapter codex",
  "$ latchet export --format adapter --adapter codex"
];

export const mcpTools = [
  "get_current_task",
  "append_event",
  "get_task_state",
  "list_open_questions",
  "verify_artifacts",
  "export_handoff"
];

export const workflowSources = [
  "Codex",
  "Claude Code",
  "Cursor",
  "Gemini CLI"
];

export const repoTree = [
  ".taskledger/project.json",
  ".taskledger/tasks/<task-id>/events.jsonl",
  ".taskledger/tasks/<task-id>/state.json",
  ".taskledger/tasks/<task-id>/state.md",
  "packages/spec",
  "packages/core",
  "packages/cli",
  "packages/mcp",
  "packages/adapters"
];
