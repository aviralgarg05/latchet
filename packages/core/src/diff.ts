import type { TaskState } from "@latchet/spec";

export interface StateDiff {
  decisions_added: string[];
  decisions_removed: string[];
  failures_added: string[];
  env_quirks_added: string[];
  env_quirks_removed: string[];
  next_action_changed: {
    before: string | null;
    after: string | null;
  };
}

function values(items: string[]): Set<string> {
  return new Set(items);
}

function delta(before: string[], after: string[]): { added: string[]; removed: string[] } {
  const beforeSet = values(before);
  const afterSet = values(after);
  return {
    added: after.filter((item) => !beforeSet.has(item)),
    removed: before.filter((item) => !afterSet.has(item))
  };
}

export function diffStates(before: TaskState, after: TaskState): StateDiff {
  const decisions = delta(
    before.active_decisions.map((event) => event.payload.summary),
    after.active_decisions.map((event) => event.payload.summary)
  );
  const quirks = delta(
    before.active_env_quirks.map((event) => event.payload.summary),
    after.active_env_quirks.map((event) => event.payload.summary)
  );
  const failuresBefore = values(before.recent_failures.map((event) => event.payload.summary));
  return {
    decisions_added: decisions.added,
    decisions_removed: decisions.removed,
    failures_added: after.recent_failures
      .map((event) => event.payload.summary)
      .filter((summary) => !failuresBefore.has(summary)),
    env_quirks_added: quirks.added,
    env_quirks_removed: quirks.removed,
    next_action_changed: {
      before: before.next_action?.payload.summary ?? null,
      after: after.next_action?.payload.summary ?? null
    }
  };
}
