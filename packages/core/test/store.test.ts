import { mkdtempSync, rmSync, writeFileSync, appendFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
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

    const handoff = exportTask(dir, "share", true, {
      removePaths: true,
      removeRevisions: true,
      maskSecrets: true
    });

    assert.equal(handoff.state.artifact_refs[0]?.payload.path, "[REDACTED_PATH]");
    assert.equal(handoff.state.artifact_refs[0]?.payload.revision, undefined);
    assert.ok(handoff.state.notes[0]?.payload.summary.includes("[REDACTED_TOKEN]"));

    assert.ok(handoff.events);
    const artEvent = handoff.events.find(e => e.type === "artifact_ref");
    const noteEvent = handoff.events.find(e => e.type === "note");

    const artPayload = artEvent?.payload as any;
    const notePayload = noteEvent?.payload as any;

    assert.equal(artPayload?.path, "[REDACTED_PATH]");
    assert.equal(artPayload?.revision, undefined);
    assert.ok(notePayload?.summary.includes("[REDACTED_TOKEN]"));
  });
});

test("duplicate import / dedupe correctly drops identical events", () => {
  withTempDir((dir) => {
    createTask(dir, {
      id: "dedupe-task",
      title: "Dedupe test",
      goal: "Check deduplication"
    });

    const events = [
      {
        id: "event_1",
        task_id: "dedupe-task",
        type: "decision" as const,
        payload: { summary: "Pick React", status: "accepted" as const },
        timestamp: "2026-01-01T00:00:00Z",
        actor: { kind: "assistant" as const, name: "bot" },
        source: { kind: "session" as const, provider: "test" },
        verification: { status: "model_inferred" as const }
      },
      {
        id: "event_2",
        task_id: "dedupe-task",
        type: "failure" as const,
        payload: { summary: "Failed to build", status: "open" as const },
        timestamp: "2026-01-01T00:01:00Z",
        actor: { kind: "assistant" as const, name: "bot" },
        source: { kind: "session" as const, provider: "test" },
        verification: { status: "model_inferred" as const }
      }
    ];

    // Import first time
    importTaskData(dir, "dedupe-task", events);
    const afterFirst = readTaskEvents(dir, "dedupe-task");
    assert.equal(afterFirst.length, 2);

    // Import EXACT SAME events again
    importTaskData(dir, "dedupe-task", events);
    const afterSecond = readTaskEvents(dir, "dedupe-task");
    
    // Length should still be 2, no duplicates created
    assert.equal(afterSecond.length, 2);
    
    // Now import an event with a different ID but IDENTICAL payload
    const duplicatePayloadEvent = {
      ...events[0],
      id: "event_3"
    };
    
    importTaskData(dir, "dedupe-task", [duplicatePayloadEvent]);
    const afterThird = readTaskEvents(dir, "dedupe-task");
    
    // Length should STILL be 2, because payload matches event_1
    assert.equal(afterThird.length, 2);
    
    // Import an event with same type but different payload
    const differentPayloadEvent = {
      ...events[0],
      id: "event_4",
      payload: { summary: "Pick Vue", status: "accepted" as const }
    };
    
    importTaskData(dir, "dedupe-task", [differentPayloadEvent]);
    const afterFourth = readTaskEvents(dir, "dedupe-task");
    
    // Length should be 3, because it's genuinely new
    assert.equal(afterFourth.length, 3);
  });
});

test("invalid payloads are rejected by AJV schema", () => {
  withTempDir((dir) => {
    createTask(dir, {
      id: "val-task",
      title: "Validation test",
      goal: "Check payload validations"
    });

    // decision missing summary
    assert.throws(() => {
      appendEvent(dir, {
        task_id: "val-task",
        type: "decision",
        payload: { status: "accepted" } as any
      });
    }, /must have required property 'summary'/);

    // next_action with invalid priority
    assert.throws(() => {
      appendEvent(dir, {
        task_id: "val-task",
        type: "next_action",
        payload: { summary: "Do something", priority: "super-high" } as any
      });
    }, /must be equal to one of the allowed values/);
  });
});

test("cache mismatch triggers self-healing re-derivation", () => {
  withTempDir((dir) => {
    createTask(dir, {
      id: "self-heal-task",
      title: "Self-healing test",
      goal: "Check integrity self-healing"
    });

    appendEvent(dir, {
      task_id: "self-heal-task",
      type: "decision",
      payload: { summary: "Original decision", status: "accepted" }
    });

    // Read state before tampering
    const beforeState = readTaskState(dir, "self-heal-task");
    assert.equal(beforeState.active_decisions.length, 1);
    assert.ok(beforeState.integrity?.event_log_hash);

    // Append an event directly to the file to bypass normal write path and trigger mismatch
    const tamperedEvent = {
      id: "evt-tampered",
      task_id: "self-heal-task",
      timestamp: "2026-06-23T20:00:00.000Z",
      actor: { kind: "user" as const, name: "tamperer" },
      source: { kind: "manual" as const },
      type: "note" as const,
      payload: { summary: "Tampered note" },
      verification: { status: "user_asserted" as const }
    };
    
    const eventsFile = join(dir, ".taskledger", "tasks", "self-heal-task", "events.jsonl");
    appendFileSync(eventsFile, JSON.stringify(tamperedEvent) + "\n", "utf8");

    // Read state, it should self-heal and include the tampered note
    const afterState = readTaskState(dir, "self-heal-task");
    assert.equal(afterState.notes.length, 1);
    assert.equal(afterState.notes[0]?.payload.summary, "Tampered note");

    // Check that the new integrity hash matches the current file hash
    const expectedHash = createHash("sha256").update(tamperedEvent ? readFileSync(eventsFile) : "").digest("hex");
    assert.equal(afterState.integrity?.event_log_hash, expectedHash);
  });
});


