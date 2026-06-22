import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { appendEvent, createTask } from "../../core/dist/src/index.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const mcpPath = resolve(repoRoot, "packages/mcp/dist/index.js");

test("mcp server exposes tools and can read and append task state", async () => {
  const dir = mkdtempSync(resolve(tmpdir(), "latchet-mcp-"));
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [mcpPath],
    cwd: dir,
    stderr: "pipe"
  });
  const client = new Client({
    name: "latchet-mcp-test",
    version: "0.1.0"
  });

  try {
    createTask(dir, {
      id: "debug-ci",
      title: "Debug tenant RBAC suite",
      goal: "Stop the failing tenant auth tests"
    });
    appendEvent(dir, {
      task_id: "debug-ci",
      type: "next_action",
      payload: {
        summary: "Patch auth fixtures and rerun tenant tests",
        priority: "high"
      }
    });

    await client.connect(transport);

    const tools = await client.listTools();
    const toolNames = tools.tools.map((tool) => tool.name);

    assert.ok(toolNames.includes("get_task_state"));
    assert.ok(toolNames.includes("append_event"));
    assert.ok(toolNames.includes("get_next_action"));

    const nextAction = await client.callTool({
      name: "get_next_action",
      arguments: { taskId: "debug-ci" }
    });

    assert.match(nextAction.content[0]?.text ?? "", /Patch auth fixtures and rerun tenant tests/);

    await client.callTool({
      name: "append_event",
      arguments: {
        taskId: "debug-ci",
        type: "failure",
        summary: "Fixture users missing organization_id"
      }
    });

    const state = await client.callTool({
      name: "get_task_state",
      arguments: { taskId: "debug-ci" }
    });

    assert.match(state.content[0]?.text ?? "", /Fixture users missing organization_id/);
    assert.match(state.content[0]?.text ?? "", /Patch auth fixtures and rerun tenant tests/);
  } finally {
    await transport.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
