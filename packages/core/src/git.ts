import { execFileSync } from "node:child_process";
import type { GitSnapshot } from "@latchet/spec";

function git(args: string[], cwd: string): string | undefined {
  try {
    return execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return undefined;
  }
}

export function getGitSnapshot(cwd: string): GitSnapshot | undefined {
  const root = git(["rev-parse", "--show-toplevel"], cwd);
  if (!root) {
    return undefined;
  }
  const branch = git(["branch", "--show-current"], cwd) ?? undefined;
  const commit = git(["rev-parse", "HEAD"], cwd) ?? undefined;
  const dirty = Boolean(git(["status", "--porcelain"], cwd));
  return {
    root,
    branch,
    commit,
    dirty
  };
}
