import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { deriveTaskState } from "../../core/dist/src/projector.js";
import { getAdapter } from "../dist/templates.js";

const repoRoot = resolve(fileURLToPath(new URL("../../../", import.meta.url)));

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function normalizeEvents(events) {
  return events.map((event) => ({
    type: event.type,
    payload: event.payload
  }));
}

function summarizeState(state) {
  return {
    task: {
      id: state.task.id,
      title: state.task.title,
      goal: state.task.goal,
      status: state.task.status
    },
    counts: {
      active_decisions: state.counts.active_decisions,
      open_failures: state.counts.open_failures,
      env_quirks: state.counts.env_quirks,
      open_questions: state.counts.open_questions
    },
    active_constraints: state.active_constraints.map((event) => event.payload.summary),
    active_decisions: state.active_decisions.map((event) => event.payload.summary),
    recent_failures: state.recent_failures.map((event) => event.payload.summary),
    active_env_quirks: state.active_env_quirks.map((event) => event.payload.summary),
    open_questions: state.open_questions.map((event) => event.payload.question),
    next_action: state.next_action?.payload.summary ?? null,
    artifact_refs: state.artifact_refs.map((event) => event.payload.path)
  };
}

for (const fixture of [
  {
    adapterId: "codex",
    dir: "examples/fixtures/codex/debugging-session"
  },
  {
    adapterId: "claude-code",
    dir: "examples/fixtures/claude-code/staging-import"
  },
  {
    adapterId: "cursor",
    dir: "examples/fixtures/cursor/debugging-session"
  },
  {
    adapterId: "gemini-cli",
    dir: "examples/fixtures/gemini-cli/debugging-session"
  }
]) {
  test(`${fixture.adapterId} fixture import and prompt export stay stable`, () => {
    const adapter = getAdapter(fixture.adapterId);
    assert.ok(adapter?.importSession, `Expected importSession for ${fixture.adapterId}`);

    const baseDir = resolve(repoRoot, fixture.dir);
    const task = readJson(resolve(baseDir, "task.json"));
    const session = readFileSync(resolve(baseDir, "session.txt"), "utf8");
    const expectedEvents = readJson(resolve(baseDir, "expected.events.json"));
    const expectedState = readJson(resolve(baseDir, "expected.state.json"));
    const expectedPrompt = readFileSync(resolve(baseDir, "expected.prompt.md"), "utf8").trim();

    const events = adapter.importSession(task.id, session);
    const state = deriveTaskState(task, events);
    const prompt = adapter.exportPrompt(state).trim();

    assert.deepEqual(normalizeEvents(events), expectedEvents);
    assert.deepEqual(summarizeState(state), expectedState);
    assert.equal(prompt, expectedPrompt);
  });
}
