import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import type { LedgerEvent, TaskMetadata, TaskState } from "@latchet/spec";
import {
  appendEvent,
  createTask,
  deriveTaskState,
  diffStates,
  exportTask,
  importTaskData,
  readTaskEvents,
  readTaskState,
  redactTaskState,
  verifyTaskFreshness
} from "../src/index.js";

function withTempDir(fn: (dir: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), "latchet-"));
  try {
    fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function normalize(state: TaskState): Omit<TaskState, "generated_at"> {
  const clone = JSON.parse(JSON.stringify(state)) as TaskState;
  delete (clone as { generated_at?: string }).generated_at;
  return clone;
}

test("deriveTaskState is stable across event reorder", () => {
  const task: TaskMetadata = {
    id: "rbac",
    title: "RBAC migration",
    goal: "Ship org-aware auth",
    status: "in_progress",
    created_at: "2026-06-17T00:00:00.000Z",
    updated_at: "2026-06-17T00:00:00.000Z"
  };
  const events: LedgerEvent[] = [
    {
      id: "evt-2",
      task_id: "rbac",
      timestamp: "2026-06-17T00:02:00.000Z",
      actor: { kind: "user", name: "tester" },
      source: { kind: "manual" },
      type: "failure",
      payload: { summary: "Integration tests failed", error: "fixtures mismatch", status: "open" }
    },
    {
      id: "evt-1",
      task_id: "rbac",
      timestamp: "2026-06-17T00:01:00.000Z",
      actor: { kind: "user", name: "tester" },
      source: { kind: "manual" },
      type: "decision",
      payload: { summary: "Use row-level security", status: "accepted" }
    },
    {
      id: "evt-3",
      task_id: "rbac",
      timestamp: "2026-06-17T00:03:00.000Z",
      actor: { kind: "user", name: "tester" },
      source: { kind: "manual" },
      type: "next_action",
      payload: { summary: "Fix integration fixtures", priority: "high" }
    }
  ];

  const a = normalize(deriveTaskState(task, events));
  const b = normalize(deriveTaskState(task, [...events].reverse()));
  assert.deepEqual(a, b);
});

test("superseded decisions leave active state but remain in history", () => {
  withTempDir((dir) => {
    createTask(dir, {
      id: "rbac",
      title: "RBAC migration",
      goal: "Ship org-aware auth"
    });

    appendEvent(dir, {
      task_id: "rbac",
      id: "evt-old",
      timestamp: "2026-06-17T00:01:00.000Z",
      type: "decision",
      payload: { summary: "Use MongoDB", status: "accepted" }
    });
    const state = appendEvent(dir, {
      task_id: "rbac",
      id: "evt-new",
      timestamp: "2026-06-17T00:02:00.000Z",
      type: "decision",
      payload: { summary: "Use PostgreSQL", status: "accepted" },
      supersedes: ["evt-old"]
    });

    assert.equal(state.active_decisions.length, 1);
    assert.equal(state.active_decisions[0]?.payload.summary, "Use PostgreSQL");
    assert.equal(readTaskEvents(dir, "rbac").length, 2);
  });
});

test("failures, quirks, and artifact freshness checks survive derivation", () => {
  withTempDir((dir) => {
    createTask(dir, {
      id: "debug",
      title: "Debug CI mismatch",
      goal: "Stop the failing suite"
    });
    writeFileSync(join(dir, "present.txt"), "ok\n", "utf8");

    appendEvent(dir, {
      task_id: "debug",
      type: "failure",
      payload: { summary: "Pytest fixture mismatch", error: "expected 200 got 500", status: "open" }
    });
    appendEvent(dir, {
      task_id: "debug",
      type: "env_quirk",
      payload: { summary: "Need NODE_OPTIONS=--openssl-legacy-provider", impact: "tests crash otherwise" }
    });
    appendEvent(dir, {
      task_id: "debug",
      type: "artifact_ref",
      payload: { path: "missing.txt" }
    });
    const state = readTaskState(dir, "debug");
    const freshness = verifyTaskFreshness(dir, state);

    assert.equal(state.counts.open_failures, 1);
    assert.equal(state.active_env_quirks.length, 1);
    assert.equal(freshness.ok, false);
    assert.ok(freshness.checks.some((check) => check.kind === "artifact_exists" && !check.ok));
  });
});

test("handoff export and import preserve failures and next action", () => {
  withTempDir((dir) => {
    createTask(dir, {
      id: "source",
      title: "Source task",
      goal: "Prepare handoff"
    });
    appendEvent(dir, {
      task_id: "source",
      type: "failure",
      payload: { summary: "Migration failed on staging", status: "open" }
    });
    appendEvent(dir, {
      task_id: "source",
      type: "next_action",
      payload: { summary: "Backfill staging data before rerun", priority: "high" }
    });

    const handoff = exportTask(dir, "source", true);
    const before = readTaskState(dir, "source");
    const imported = importTaskData(dir, "dest", handoff);
    const delta = diffStates(deriveTaskState(imported.task, []), imported);

    assert.equal(imported.next_action?.payload.summary, "Backfill staging data before rerun");
    assert.ok(imported.recent_failures.some((event) => event.payload.summary === "Migration failed on staging"));
    assert.ok(before.next_action);
    assert.ok(delta.failures_added.length >= 1);
  });
});

test("redaction strips paths and obvious secrets", () => {
  withTempDir((dir) => {
    createTask(dir, {
      id: "share",
      title: "Share-safe export",
      goal: "Prepare a safe handoff"
    });
    appendEvent(dir, {
      task_id: "share",
      type: "artifact_ref",
      payload: { path: "src/secrets.ts", revision: "abc123" }
    });
    appendEvent(dir, {
      task_id: "share",
      type: "note",
      payload: { summary: "Token sk_1234567890ABCDEFGHIJ should never leave the machine" }
    });

    const redacted = redactTaskState(dir, "share", {
      removePaths: true,
      removeRevisions: true,
      maskSecrets: true
    });

    assert.equal(redacted.artifact_refs[0]?.payload.path, "[REDACTED_PATH]");
    assert.equal(redacted.artifact_refs[0]?.payload.revision, undefined);
    assert.ok(redacted.notes[0]?.payload.summary.includes("[REDACTED_TOKEN]"));
  });
});
