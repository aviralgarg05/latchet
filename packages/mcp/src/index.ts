import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod/v4";
import {
  appendEvent,
  exportTask,
  getCurrentTaskId,
  getCurrentTaskState,
  importTaskData,
  readTaskState,
  verifyTaskFreshness
} from "@latchet/core";
import { readImportFile } from "@latchet/core";
import { getAdapter, importCommandOutput } from "@latchet/adapters";
import type { EventPayload, LedgerEvent } from "@latchet/spec";

function textResult(value: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: typeof value === "string" ? value : JSON.stringify(value, null, 2)
      }
    ]
  };
}

function buildMinimalPayload(type: LedgerEvent["type"], summary: string): EventPayload {
  switch (type) {
    case "decision":
      return { summary, status: "accepted" };
    case "attempt":
      return { summary, result: "partial" };
    case "failure":
      return { summary, status: "open" };
    case "env_quirk":
      return { summary };
    case "constraint":
      return { summary };
    case "artifact_ref":
      return { path: summary };
    case "open_question":
      return { question: summary };
    case "next_action":
      return { summary, priority: "medium" };
    case "status_change":
      return { to: "in_progress", reason: summary };
    case "note":
      return { summary };
    case "evidence":
      return { summary, kind: "log" };
  }
}

const server = new McpServer({
  name: "latchet",
  version: "0.1.0"
});

server.registerTool(
  "get_current_task",
  {
    description: "Return the derived state for the current task."
  },
  async () => textResult(getCurrentTaskState(process.cwd()))
);

server.registerTool(
  "get_task_state",
  {
    description: "Return the derived state for a specific task or the current task.",
    inputSchema: {
      taskId: z.string().optional()
    }
  },
  async ({ taskId }) => textResult(taskId ? readTaskState(process.cwd(), taskId) : getCurrentTaskState(process.cwd()))
);

server.registerTool(
  "append_event",
  {
    description: "Append a structured ledger event to the current or specified task.",
    inputSchema: {
      taskId: z.string().optional(),
      type: z.enum([
        "decision",
        "attempt",
        "failure",
        "env_quirk",
        "constraint",
        "artifact_ref",
        "open_question",
        "next_action",
        "status_change",
        "note",
        "evidence"
      ]),
      summary: z.string().optional(),
      payloadJson: z.string().optional(),
      supersedes: z.array(z.string()).optional(),
      verificationStatus: z
        .enum(["verified", "user_asserted", "model_inferred", "speculative", "rejected"])
        .optional()
    }
  },
  async ({ taskId, type, summary, payloadJson, supersedes, verificationStatus }) => {
    const payload = payloadJson ? (JSON.parse(payloadJson) as EventPayload) : buildMinimalPayload(type, summary ?? "");
    const state = appendEvent(process.cwd(), {
      task_id: taskId,
      type,
      payload,
      supersedes,
      actor: { kind: "assistant", name: "mcp-client" },
      source: { kind: "mcp", provider: "latchet" },
      verification: { status: verificationStatus ?? "model_inferred" }
    });
    return textResult(state);
  }
);

server.registerTool(
  "list_open_questions",
  {
    description: "List unresolved open questions for the current or specified task.",
    inputSchema: {
      taskId: z.string().optional()
    }
  },
  async ({ taskId }) => {
    const state = taskId ? readTaskState(process.cwd(), taskId) : getCurrentTaskState(process.cwd());
    return textResult(state.open_questions);
  }
);

server.registerTool(
  "get_next_action",
  {
    description: "Return the current best next action.",
    inputSchema: {
      taskId: z.string().optional()
    }
  },
  async ({ taskId }) => {
    const state = taskId ? readTaskState(process.cwd(), taskId) : getCurrentTaskState(process.cwd());
    return textResult(state.next_action ?? "No next action recorded.");
  }
);

server.registerTool(
  "verify_artifacts",
  {
    description: "Run freshness and artifact existence checks for the current or specified task.",
    inputSchema: {
      taskId: z.string().optional()
    }
  },
  async ({ taskId }) => {
    const state = taskId ? readTaskState(process.cwd(), taskId) : getCurrentTaskState(process.cwd());
    return textResult(verifyTaskFreshness(process.cwd(), state));
  }
);

server.registerTool(
  "export_handoff",
  {
    description: "Export a handoff pack or adapter-specific prompt for a task.",
    inputSchema: {
      taskId: z.string().optional(),
      includeEvents: z.boolean().optional(),
      adapter: z.string().optional()
    }
  },
  async ({ taskId, includeEvents, adapter }) => {
    const resolvedTaskId = taskId ?? getCurrentTaskId(process.cwd());
    if (adapter) {
      const resolvedAdapter = getAdapter(adapter);
      if (!resolvedAdapter) {
        throw new Error(`Unknown adapter: ${adapter}`);
      }
      return textResult(resolvedAdapter.exportPrompt(readTaskState(process.cwd(), resolvedTaskId)));
    }
    return textResult(exportTask(process.cwd(), resolvedTaskId, includeEvents ?? true));
  }
);

server.registerTool(
  "import_handoff",
  {
    description: "Import handoff or state JSON from a local path into a task.",
    inputSchema: {
      taskId: z.string(),
      path: z.string()
    }
  },
  async ({ taskId, path }) => {
    const data = readImportFile(path);
    const state = importTaskData(process.cwd(), taskId, data);
    return textResult(state);
  }
);

server.registerTool(
  "import_command",
  {
    description: "Import command output into ledger events (evidence plus optional failure).",
    inputSchema: {
      taskId: z.string().optional(),
      command: z.string(),
      path: z.string()
    }
  },
  async ({ taskId, command, path }) => {
    const resolvedTaskId = taskId ?? getCurrentTaskId(process.cwd());
    const content = readFileSync(path, "utf8");
    const events = importCommandOutput(resolvedTaskId, command, content);
    const state = importTaskData(process.cwd(), resolvedTaskId, events);

    return textResult({
      task_id: resolvedTaskId,
      imported_events: events.length,
      state
    });
  }
);

server.registerTool(
  "import_session",
  {
    description: "Import a structured session summary file into canonical ledger events.",
    inputSchema: {
      taskId: z.string().optional(),
      adapter: z.string(),
      path: z.string()
    }
  },
  async ({ taskId, adapter, path }) => {
    const resolvedAdapter = getAdapter(adapter);
    if (!resolvedAdapter?.importSession) {
      throw new Error(`Adapter does not support session import: ${adapter}`);
    }

    const resolvedTaskId = taskId ?? getCurrentTaskId(process.cwd());
    const content = readFileSync(path, "utf8");
    const events = resolvedAdapter.importSession(resolvedTaskId, content);
    const state = importTaskData(process.cwd(), resolvedTaskId, events);

    return textResult({
      task_id: resolvedTaskId,
      imported_events: events.length,
      state
    });
  }
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
