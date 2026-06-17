import { resolve } from "node:path";
import type { FreshnessReport, FreshnessCheck, TaskState } from "@latchet/spec";
import { getGitSnapshot } from "./git.js";
import { fileExists } from "./utils.js";

function buildCheck(kind: FreshnessCheck["kind"], ok: boolean, message: string): FreshnessCheck {
  return { kind, ok, message };
}

export function verifyTaskFreshness(cwd: string, state: TaskState): FreshnessReport {
  const checks: FreshnessCheck[] = [];
  const currentGit = getGitSnapshot(cwd);
  const expectedGit = state.task.git;

  if (!expectedGit) {
    checks.push(buildCheck("workspace_git", true, "Task was created outside a git repository."));
  } else if (!currentGit) {
    checks.push(buildCheck("workspace_git", false, "Task expects a git repository but none is available now."));
  } else {
    checks.push(
      buildCheck(
        "git_branch",
        currentGit.branch === expectedGit.branch,
        `Expected branch ${expectedGit.branch ?? "unknown"}, current branch is ${currentGit.branch ?? "unknown"}.`
      )
    );
    checks.push(
      buildCheck(
        "git_commit",
        currentGit.commit === expectedGit.commit,
        `Expected commit ${expectedGit.commit ?? "unknown"}, current commit is ${currentGit.commit ?? "unknown"}.`
      )
    );
  }

  const workspaceRoot = state.task.workspace_root ?? cwd;
  checks.push(
    buildCheck(
      "workspace_root",
      fileExists(workspaceRoot),
      `Workspace root ${workspaceRoot} ${fileExists(workspaceRoot) ? "is available" : "is missing"}.`
    )
  );

  for (const artifact of state.artifact_refs) {
    const path = resolve(workspaceRoot, artifact.payload.path);
    checks.push(
      buildCheck(
        "artifact_exists",
        fileExists(path),
        `Artifact ${artifact.payload.path} ${fileExists(path) ? "exists" : "is missing"}.`
      )
    );
  }

  return {
    ok: checks.every((check) => check.ok),
    checks
  };
}
