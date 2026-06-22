import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import test from "node:test";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const cliPath = resolve(repoRoot, "packages/cli/dist/index.js");

function run(args, cwd) {
  return execFileSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8"
  }).trim();
}

test("cli can initialize a project, create a task, log durable facts, and surface the next action", () => {
  const dir = mkdtempSync(resolve(tmpdir(), "latchet-cli-"));

  try {
    run(["init", "--name", "Smoke Test"], dir);
    run(["task", "create", "rbac", "--title", "RBAC migration", "--goal", "Ship org-aware auth"], dir);
    run(["log", "failure", "--task", "rbac", "--summary", "Fixture users missing organization_id"], dir);
    run(["log", "next_action", "--task", "rbac", "--summary", "Patch auth fixtures and rerun integration tests", "--priority", "high"], dir);

    const next = run(["next", "--task", "rbac"], dir);
    const state = JSON.parse(run(["show", "--task", "rbac", "--json"], dir));

    assert.equal(next, "Patch auth fixtures and rerun integration tests");
    assert.equal(state.task.id, "rbac");
    assert.equal(state.counts.open_failures, 1);
    assert.equal(state.next_action.payload.priority, "high");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("cli can import a structured codex session into ledger events", () => {
  const dir = mkdtempSync(resolve(tmpdir(), "latchet-cli-import-"));
  const sessionPath = resolve(dir, "codex-session.txt");

  try {
    writeFileSync(
      sessionPath,
      [
        "Decision: Keep API response shape stable during the fix",
        "Failure: Fixture users are missing organization_id",
        "Next action: Update auth fixtures with organization_id and rerun tenant tests"
      ].join("\n"),
      "utf8"
    );

    run(["init", "--name", "Smoke Test"], dir);
    run(["task", "create", "debug-ci", "--title", "Debug tenant RBAC suite", "--goal", "Stop the failing tenant auth tests"], dir);

    const imported = JSON.parse(
      run(["import-session", sessionPath, "--adapter", "codex", "--task", "debug-ci"], dir)
    );
    const state = JSON.parse(run(["show", "--task", "debug-ci", "--json"], dir));

    assert.equal(imported.imported_events, 3);
    assert.equal(state.counts.active_decisions, 1);
    assert.equal(state.counts.open_failures, 1);
    assert.equal(state.next_action.payload.summary, "Update auth fixtures with organization_id and rerun tenant tests");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
