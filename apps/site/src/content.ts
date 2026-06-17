export const heroEvents = [
  {
    id: "decision",
    label: "Decision",
    title: "Lock tenant isolation to PostgreSQL RLS",
    summary: "Architecture calls stay visible, accepted, and inspectable instead of evaporating into whichever model said them first.",
    detail: "accepted · supersedes API-only guardrails",
    command: "latchet log decision --summary \"Use PostgreSQL RLS\"",
    accent: "green"
  },
  {
    id: "failure",
    label: "Failure",
    title: "Fixture users missing organization_id",
    summary: "Dead ends stay in the task state so the next session doesn't spend another hour rediscovering the same breakage.",
    detail: "reproducible · integration tests blocked",
    command: "latchet log failure --summary \"Fixture users missing organization_id\"",
    accent: "rust"
  },
  {
    id: "quirk",
    label: "Env quirk",
    title: "FEATURE_TENANT_RBAC=1 is required locally",
    summary: "Local setup weirdness gets recorded next to the task instead of surviving only in one person's shell history.",
    detail: "machine-specific · verified yesterday",
    command: "latchet log env_quirk --summary \"Enable FEATURE_TENANT_RBAC=1\"",
    accent: "gold"
  },
  {
    id: "action",
    label: "Next action",
    title: "Patch auth fixtures, rerun tenant tests, verify freshness",
    summary: "Every session can end with one sharp next move instead of a vague handoff paragraph or a blank restart tomorrow.",
    detail: "single-valued · resume-safe",
    command: "latchet log next_action --summary \"Patch fixtures and rerun tenant tests\"",
    accent: "ink"
  }
];

export const painPoints = [
  {
    index: "01",
    title: "Chat residue is not task state",
    description: "Good decisions get stranded in transcripts, then a fresh model confidently walks back into the same argument."
  },
  {
    index: "02",
    title: "Failed attempts keep getting promoted to new work",
    description: "A dead branch, flaky fixture, or rejected approach returns because nothing durable recorded why it died."
  },
  {
    index: "03",
    title: "The one useful local quirk never survives the handoff",
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
    description: "Record the weird shell flags, fixture landmines, and machine-specific rules code alone won't explain.",
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
  "ChatGPT",
  "Codex",
  "Claude Code",
  "Cursor"
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
