import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const script = process.argv[2];

if (!script) {
  console.error("Expected a site script name: dev, build, or preview.");
  process.exit(1);
}

const rootDir = dirname(fileURLToPath(import.meta.url));
const siteDir = resolve(rootDir, "..", "apps", "site");
const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";
const extraArgs = process.argv.slice(3);

const child = spawn(npmBin, ["run", script, "--", ...extraArgs], {
  cwd: siteDir,
  stdio: "inherit"
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

