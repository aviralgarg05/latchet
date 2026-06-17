export const featureCards = [
  {
    title: "Decision trail",
    description: "Keep accepted choices, tradeoffs, and superseded calls in a structured log instead of a fading chat transcript."
  },
  {
    title: "Failed-attempt memory",
    description: "Record dead ends so the next model does not burn another half hour rediscovering them."
  },
  {
    title: "Env quirks",
    description: "Capture the local setup weirdness, hidden flags, and flaky commands that code alone never explains."
  },
  {
    title: "Next action",
    description: "End every session with one best step so you can resume work without a fresh planning spiral."
  },
  {
    title: "Portable handoffs",
    description: "Export current task state for Codex, Claude Code, Cursor, Gemini CLI, or a plain Markdown restart."
  },
  {
    title: "Freshness checks",
    description: "Tie the ledger back to branch, commit, files, and missing artifacts so stale state is obvious."
  }
];

export const painPoints = [
  {
    title: "Decisions disappear",
    description: "Architecture calls, rejected approaches, and caveats get trapped in whatever model happened to say them first."
  },
  {
    title: "Dead ends repeat",
    description: "Every new session reruns the same failed commands, restarts the same broken branch, and reopens the same confusion."
  },
  {
    title: "Local quirks stay tribal",
    description: "The one env flag, flaky fixture, or branch mismatch that actually mattered never makes it into the next session."
  }
];

export const toolingCommands = [
  "$ latchet init",
  "$ latchet task create rbac --title \"Org RBAC\" --goal \"Ship org-aware auth\"",
  "$ latchet log failure --summary \"Fixture users missing organization_id\"",
  "$ latchet log next_action --summary \"Patch fixtures and rerun tenant tests\"",
  "$ latchet export --format adapter --adapter codex"
];

export const mcpTools = [
  "get_current_task",
  "append_event",
  "get_next_action",
  "verify_artifacts",
  "export_handoff"
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
