import type {
  ArtifactRefPayload,
  ConstraintPayload,
  DecisionPayload,
  EnvQuirkPayload,
  EventPayload,
  FailurePayload,
  FreshnessReport,
  LedgerEvent,
  NextActionPayload,
  NotePayload,
  OpenQuestionPayload,
  TaskMetadata,
  TaskState,
  TaskStatus
} from "@latchet/spec";
import { TASK_LEDGER_VERSION } from "@latchet/spec";
import { nowIso, uniqueBy } from "./utils.js";

function sortEvents(events: LedgerEvent[]): LedgerEvent[] {
  return [...events].sort((a, b) => {
    if (a.timestamp === b.timestamp) {
      return a.id.localeCompare(b.id);
    }
    return a.timestamp.localeCompare(b.timestamp);
  });
}

function collectSuperseded(events: LedgerEvent[]): Set<string> {
  const superseded = new Set<string>();
  for (const event of events) {
    for (const target of event.supersedes ?? []) {
      superseded.add(target);
    }
  }
  return superseded;
}

function latestStatus(task: TaskMetadata, events: LedgerEvent[], superseded: Set<string>): TaskStatus {
  const statusEvent = [...events]
    .reverse()
    .find((event) => event.type === "status_change" && !superseded.has(event.id));
  if (!statusEvent) {
    return task.status;
  }
  return (statusEvent.payload as { to: TaskStatus }).to;
}

function filterActive<TPayload extends EventPayload>(
  events: LedgerEvent[],
  type: LedgerEvent["type"],
  superseded: Set<string>
): LedgerEvent<TPayload>[] {
  return events
    .filter((event) => event.type === type && !superseded.has(event.id))
    .map((event) => event as LedgerEvent<TPayload>);
}

function latestActive<TPayload extends EventPayload>(
  events: LedgerEvent[],
  type: LedgerEvent["type"],
  superseded: Set<string>
): LedgerEvent<TPayload> | null {
  const active = filterActive<TPayload>(events, type, superseded);
  return active.length > 0 ? active[active.length - 1] : null;
}

export function deriveTaskState(
  task: TaskMetadata,
  events: LedgerEvent[],
  freshness?: FreshnessReport
): TaskState {
  const ordered = sortEvents(events);
  const superseded = collectSuperseded(ordered);

  const activeConstraints = filterActive<ConstraintPayload>(ordered, "constraint", superseded);
  const activeDecisions = filterActive<DecisionPayload>(ordered, "decision", superseded)
    .filter((event) => {
      const status = event.payload.status ?? "accepted";
      return status === "accepted" || status === "proposed";
    });
  const recentFailures = filterActive<FailurePayload>(ordered, "failure", superseded).slice(-10).reverse();
  const activeEnvQuirks = filterActive<EnvQuirkPayload>(ordered, "env_quirk", superseded);
  const openQuestions = filterActive<OpenQuestionPayload>(ordered, "open_question", superseded);
  const nextAction = latestActive<NextActionPayload>(ordered, "next_action", superseded);
  const artifactRefs = uniqueBy(
    filterActive<ArtifactRefPayload>(ordered, "artifact_ref", superseded).reverse(),
    (event) => event.payload.path
  );
  const notes = filterActive<NotePayload>(ordered, "note", superseded).slice(-10).reverse();

  const openFailures = recentFailures.filter((event) => (event.payload.status ?? "open") !== "resolved");
  const blockers = [
    ...openFailures.map((event) => event.payload.summary),
    ...activeEnvQuirks
      .filter((event) => Boolean(event.payload.impact))
      .map((event) => `${event.payload.summary}${event.payload.impact ? ` (${event.payload.impact})` : ""}`)
  ];

  return {
    version: TASK_LEDGER_VERSION,
    generated_at: nowIso(),
    task: {
      ...task,
      status: latestStatus(task, ordered, superseded),
      updated_at: ordered[ordered.length - 1]?.timestamp ?? task.updated_at
    },
    counts: {
      total_events: ordered.length,
      active_decisions: activeDecisions.length,
      open_failures: openFailures.length,
      env_quirks: activeEnvQuirks.length,
      open_questions: openQuestions.length
    },
    active_constraints: activeConstraints,
    active_decisions: activeDecisions,
    recent_failures: recentFailures,
    active_env_quirks: activeEnvQuirks,
    open_questions: openQuestions,
    next_action: nextAction,
    blockers,
    artifact_refs: artifactRefs,
    notes,
    freshness
  };
}
