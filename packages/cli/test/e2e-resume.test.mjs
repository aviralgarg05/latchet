import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const cliPath = resolve(repoRoot, "packages/cli/dist/index.js");

function run(args, cwd) {
  return execFileSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8"
  }).trim();
}

test("failure survives session pause and appears in exported handoff", () => {
  const dir = mkdtempSync(resolve(tmpdir(), "latchet-e2e-resume-"));
  const failureSummary = "Fixture users missing organization_id";

  try {
    run(["init", "--name", "Resume Test"], dir);
    run(["task", "create", "auth-fix", "--title", "Fix auth", "--goal", "Stop repeated failures"], dir);
    run(["log", "failure", "--task", "auth-fix", "--summary", failureSummary], dir);
    run(["log", "next_action", "--task", "auth-fix", "--summary", "Patch fixtures and rerun tests"], dir);

    const sessionOne = JSON.parse(run(["show", "--task", "auth-fix", "--json"], dir));
    assert.equal(sessionOne.counts.open_failures, 1);

    run(["derive", "--task", "auth-fix"], dir);

    const sessionTwo = JSON.parse(run(["show", "--task", "auth-fix", "--json"], dir));
    assert.equal(sessionTwo.counts.open_failures, 1);
    assert.equal(sessionTwo.recent_failures[0].payload.summary, failureSummary);

    const handoff = run(["export", "--task", "auth-fix", "--format", "adapter", "--adapter", "codex"], dir);
    assert.match(handoff, /Fixture users missing organization_id/);
    assert.match(handoff, /Patch fixtures and rerun tests/);

    const stateMd = readFileSync(resolve(dir, ".taskledger/tasks/auth-fix/state.md"), "utf8");
    assert.match(stateMd, /Fixture users missing organization_id/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});