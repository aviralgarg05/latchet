import { execSync } from "node:child_process";
import { join } from "node:path";
import { rmSync, mkdirSync, writeFileSync } from "node:fs";

const REPO_DIR = join(process.cwd(), "output", "test-repo");

// Clean and recreate test-repo
rmSync(REPO_DIR, { recursive: true, force: true });
mkdirSync(REPO_DIR, { recursive: true });

// Helper to run CLI in the repo dir
function runCli(args) {
  const cliPath = join(process.cwd(), "packages", "cli", "dist", "index.js");
  const cmd = `node "${cliPath}" ${args}`;
  console.log(`> ${cmd}`);
  execSync(cmd, { cwd: REPO_DIR, stdio: "inherit" });
}

console.log("--- Starting Real-World Simulation ---\n");

console.log("1. Initialize ledger in test repo");
runCli('init --name "Sample Project"');

console.log("\n2. Create a task");
runCli('task create debug-memleak --title "Debug memory leak in worker" --goal "Find and fix OOM error in image processor"');

console.log("\n3. Log some decisions and failures (Session 1)");
runCli('log decision --task debug-memleak --summary "Use heapdump for analysis" --reason "Standard tools failing"');
runCli('log failure --task debug-memleak --summary "Heapdump failed in production" --error "OOM happens before snapshot completes"');
runCli('log env_quirk --task debug-memleak --summary "Must use NODE_OPTIONS=--max-old-space-size=4096 locally"');
runCli('log next_action --task debug-memleak --summary "Reproduce with smaller payloads locally" --priority high');

console.log("\n4. Simulate crash / Next day resume (Session 2)");
runCli('show --task debug-memleak');

console.log("\n5. Simulate Codex agent doing work, logging a new failure");
writeFileSync(join(REPO_DIR, "codex-notes.txt"), `
Decision: Switched to worker_threads instead of clustering
Failed attempt: worker_threads still leak memory on canvas processing
Next action: Try replacing node-canvas with sharp
`);
runCli('import-session codex-notes.txt --adapter codex --task debug-memleak');

console.log("\n6. Export handoff for Claude Code (Cross-agent handoff)");
runCli('export --task debug-memleak --format adapter --adapter claude-code');

console.log("\n7. Show current derived state");
runCli('show --task debug-memleak');

console.log("\n--- Simulation Complete ---");
