#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cliPath = resolve(repoRoot, "packages/cli/dist/index.js");

function run(args, cwd) {
  return execFileSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8"
  }).trim();
}

function section(title) {
  process.stdout.write(`\n── ${title} ──\n`);
}

const demoDir = mkdtempSync(resolve(tmpdir(), "latchet-demo-"));

section("1. Initialize ledger");
run(["init", "--name", "Auth Debug Demo"], demoDir);
process.stdout.write(`Created .taskledger/ in ${demoDir}\n`);

section("2. Create task");
run(
  ["task", "create", "tenant-auth", "--title", "Fix tenant auth tests", "--goal", "Stop repeated fixture failures"],
  demoDir
);
process.stdout.write("Task: tenant-auth\n");

section("3. Log a failed attempt (session 1)");
run(
  [
    "log",
    "failure",
    "--task",
    "tenant-auth",
    "--summary",
    "Fixture users missing organization_id",
    "--error",
    "JWT fixtures omit tenant claim"
  ],
  demoDir
);
run(
  [
    "log",
    "decision",
    "--task",
    "tenant-auth",
    "--summary",
    "Use PostgreSQL RLS for tenant isolation",
    "--reason",
    "Enforce outside the API layer"
  ],
  demoDir
);
run(
  [
    "log",
    "next_action",
    "--task",
    "tenant-auth",
    "--summary",
    "Patch auth fixtures and rerun tenant integration tests",
    "--priority",
    "high"
  ],
  demoDir
);
process.stdout.write("Logged: 1 failure, 1 decision, 1 next action\n");

section("4. Show derived state (resume next day)");
process.stdout.write(`${run(["show", "--task", "tenant-auth"], demoDir)}\n`);

section("5. Verify failure is still the next constraint");
const next = run(["next", "--task", "tenant-auth"], demoDir);
process.stdout.write(`Next action: ${next}\n`);

section("6. Export handoff for Codex (switch agent)");
const handoff = run(["export", "--task", "tenant-auth", "--format", "adapter", "--adapter", "codex"], demoDir);
process.stdout.write(`${handoff}\n`);

section("7. Ledger files on disk");
const statePath = resolve(demoDir, ".taskledger/tasks/tenant-auth/state.md");
process.stdout.write(`${readFileSync(statePath, "utf8")}\n`);

section("Demo complete");
process.stdout.write(`Demo workspace: ${demoDir}\n`);
process.stdout.write("Record this flow for the launch demo: failure logged → pause → resume → handoff exported.\n");