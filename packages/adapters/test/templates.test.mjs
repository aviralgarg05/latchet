import assert from "node:assert/strict";
import test from "node:test";
import { getAdapter } from "../dist/templates.js";

function sampleState() {
  return {
    version: "0.1.0",
    generated_at: "2026-06-18T00:00:00.000Z",
    task: {
      id: "rbac",
      title: "RBAC migration",
      goal: "Ship org-aware auth",
      status: "in_progress",
      created_at: "2026-06-18T00:00:00.000Z",
      updated_at: "2026-06-18T00:00:00.000Z"
    },
    counts: {
      total_events: 4,
      active_decisions: 1,
      open_failures: 1,
      env_quirks: 1,
      open_questions: 0
    },
    active_constraints: [],
    active_decisions: [
      {
        id: "evt-decision",
        task_id: "rbac",
        timestamp: "2026-06-18T00:01:00.000Z",
        actor: { kind: "user", name: "tester" },
        source: { kind: "manual" },
        type: "decision",
        payload: { summary: "Use PostgreSQL RLS", status: "accepted" }
      }
    ],
    recent_failures: [
      {
        id: "evt-failure",
        task_id: "rbac",
        timestamp: "2026-06-18T00:02:00.000Z",
        actor: { kind: "user", name: "tester" },
        source: { kind: "manual" },
        type: "failure",
        payload: { summary: "Fixture users missing organization_id", status: "open" }
      }
    ],
    active_env_quirks: [
      {
        id: "evt-quirk",
        task_id: "rbac",
        timestamp: "2026-06-18T00:03:00.000Z",
        actor: { kind: "user", name: "tester" },
        source: { kind: "manual" },
        type: "env_quirk",
        payload: { summary: "Need seeded org fixtures before auth tests" }
      }
    ],
    open_questions: [],
    next_action: {
      id: "evt-next",
      task_id: "rbac",
      timestamp: "2026-06-18T00:04:00.000Z",
      actor: { kind: "user", name: "tester" },
      source: { kind: "manual" },
      type: "next_action",
      payload: { summary: "Patch auth fixtures and rerun integration tests", priority: "high" }
    },
    blockers: [],
    artifact_refs: [],
    notes: []
  };
}

test("codex adapter exports a structured resume prompt", () => {
  const adapter = getAdapter("codex");
  const prompt = adapter?.exportPrompt(sampleState());

  assert.ok(adapter);
  assert.match(prompt ?? "", /Resume this task in Codex\./);
  assert.match(prompt ?? "", /Task: RBAC migration/);
  assert.match(prompt ?? "", /Use PostgreSQL RLS/);
  assert.match(prompt ?? "", /Fixture users missing organization_id/);
  assert.match(prompt ?? "", /Need seeded org fixtures before auth tests/);
  assert.match(prompt ?? "", /Patch auth fixtures and rerun integration tests/);
});

test("generic-markdown adapter omits the agent-specific wrapper", () => {
  const adapter = getAdapter("generic-markdown");
  const prompt = adapter?.exportPrompt(sampleState());

  assert.ok(adapter);
  assert.doesNotMatch(prompt ?? "", /Resume this task in/);
  assert.match(prompt ?? "", /Active decisions:/);
  assert.match(prompt ?? "", /Recent failures:/);
  assert.match(prompt ?? "", /Next action:/);
});
