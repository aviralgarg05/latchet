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

export const statePreview = `# Fix tenant auth tests

Goal: Stop repeated fixture failures
Status: in_progress

## Active Decisions
- Use PostgreSQL RLS for tenant isolation

## Recent Failures
- Fixture users missing organization_id

## Environment Quirks
- FEATURE_TENANT_RBAC=1 required locally

## Next Action
- Patch auth fixtures and rerun tenant integration tests`;

export const eventsPreview = `{"id": "e_01", "type": "decision", "summary": "Use PostgreSQL RLS for tenant isolation", "timestamp": "2026-06-23T12:00:00.000Z"}
{"id": "e_02", "type": "failure", "summary": "Fixture users missing organization_id", "timestamp": "2026-06-23T12:05:00.000Z"}
{"id": "e_03", "type": "env_quirk", "summary": "FEATURE_TENANT_RBAC=1 required locally", "timestamp": "2026-06-23T12:10:00.000Z"}
{"id": "e_04", "type": "next_action", "summary": "Patch auth fixtures and rerun tenant integration tests", "timestamp": "2026-06-23T12:15:00.000Z"}`;

export const jsonPreview = `{
  "goal": "Stop repeated fixture failures",
  "status": "in_progress",
  "decisions": [
    {
      "summary": "Use PostgreSQL RLS for tenant isolation",
      "timestamp": "2026-06-23T12:00:00.000Z"
    }
  ],
  "failures": [
    {
      "summary": "Fixture users missing organization_id",
      "timestamp": "2026-06-23T12:05:00.000Z"
    }
  ],
  "env_quirks": [
    {
      "summary": "FEATURE_TENANT_RBAC=1 required locally",
      "timestamp": "2026-06-23T12:10:00.000Z"
    }
  ],
  "next_action": "Patch auth fixtures and rerun tenant integration tests"
}`;

export const mcpTools = [
  "get_current_task",
  "get_task_state",
  "append_event",
  "get_next_action",
  "list_open_questions",
  "verify_artifacts",
  "export_handoff",
  "import_handoff",
  "import_command",
  "import_session"
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

export interface DocsArticle {
  id: string;
  title: string;
  subtitle: string;
  content: string;
}

export const docsArticles: DocsArticle[] = [
  {
    id: "quickstart",
    title: "Quickstart Guide",
    subtitle: "Install, initialize, and run Latchet CLI in less than 2 minutes.",
    content: `### 1. Installation
Install the project dependencies and build the TypeScript modules:
\`\`\`bash
# Install root workspace and package dependencies
npm install

# Build CLI, MCP server, core, and adapters
npm run build
\`\`\`

### 2. Initialize a Project
Run the ledger initializer from your repository root to create the \`.taskledger/\` metadata folder:
\`\`\`bash
node packages/cli/dist/index.js init --name "My SaaS App"
\`\`\`

### 3. Create a Task Ledger
Start tracking a task by spawning its dedicated sub-ledger:
\`\`\`bash
node packages/cli/dist/index.js task create billing-fix --goal "Fix stripe webhook timeouts"
\`\`\`
This creates \`.taskledger/tasks/billing-fix/\` containing:
- \`events.jsonl\`: The append-only source of truth.
- \`state.json\`: Computed projection cache.
- \`state.md\`: A clean markdown overview for humans and AI contexts.`
  },
  {
    id: "logging",
    title: "Durable Fact Logging",
    subtitle: "How to log decisions, test failures, and local environment quirks.",
    content: `### Why Log Manually?
AI agents easily forget why they abandoned a route. By logging durable facts, you anchor their context so they never make the same mistake twice.

### Command Reference

#### 1. Log a Decision
\`\`\`bash
node packages/cli/dist/index.js log decision \\
  --task billing-fix \\
  --summary "Use Stripe v3 SDK" \\
  --reason "v2 SDK lacks idempotent webhooks"
\`\`\`

#### 2. Log a Test Failure
Instead of copy-pasting terminal output, pipe command outputs directly:
\`\`\`bash
# Run tests and save to a temporary file
npm test 2>&1 | tee /tmp/test-output.txt

# Import the output file to auto-parse and record the failure
node packages/cli/dist/index.js import-command /tmp/test-output.txt \\
  --command "npm test" \\
  --task billing-fix
\`\`\`

#### 3. Log a Local Quirk
\`\`\`bash
node packages/cli/dist/index.js log env_quirk \\
  --task billing-fix \\
  --summary "STRIPE_SIGNING_SECRET required even in dev"
\`\`\`

#### 4. Define the Next Action
\`\`\`bash
node packages/cli/dist/index.js log next_action \\
  --task billing-fix \\
  --summary "Update local .env and restart dev server"
\`\`\``
  },
  {
    id: "mcp",
    title: "MCP Server Setup",
    subtitle: "Integrate Latchet directly into Claude Code, Cursor, or Claude Desktop.",
    content: `### What is MCP?
The Model Context Protocol (MCP) lets AI agents read and write to your local Latchet task ledgers autonomously.

### Configuration

#### Claude Desktop
Add this to your \`claude_desktop_config.json\` (usually located in \`~/Library/Application Support/Claude/claude_desktop_config.json\`):
\`\`\`json
{
  "mcpServers": {
    "latchet": {
      "command": "node",
      "args": ["/absolute/path/to/latchet/packages/mcp/dist/index.js"],
      "env": {
        "LATCHET_PROJECT_ROOT": "/absolute/path/to/your/project"
      }
    }
  }
}
\`\`\`

#### Cursor IDE
1. Open Cursor Settings > **Beta Features** > **MCP**.
2. Click **+ Add New MCP Server**.
3. Set Name to \`latchet\`, Type to \`command\`.
4. Set Command to: \`node /absolute/path/to/latchet/packages/mcp/dist/index.js\`.

Now, your AI agent can query and log task state using functions like \`get_task_state\` and \`append_event\`!`
  },
  {
    id: "adapters",
    title: "Adapters & Handoffs",
    subtitle: "Export clean, prompt-ready context packages for different models.",
    content: `### Cross-Agent Continuity
When switching between Cursor, Claude Code, or a custom LLM script, you can package Latchet's state into the exact format that specific model prefers.

### Supported Formats
- **Codex**: Formatted for semantic code searches.
- **Claude Code**: Tailored for the system instructions of Claude's CLI.
- **Cursor**: Designed to be loaded into system prompts or \`.cursorrules\`.
- **Generic Markdown**: Beautiful, raw Markdown summary of task state.

### Exporting Context
To output a clean handoff prompt:
\`\`\`bash
node packages/cli/dist/index.js export \\
  --task billing-fix \\
  --format adapter \\
  --adapter claude-code
\`\`\`

To import a text transcript from a previous session and parse it into events:
\`\`\`bash
node packages/cli/dist/index.js import-session notes/raw-chat.txt \\
  --adapter claude-code \\
  --task billing-fix
\`\`\``
  }
];

