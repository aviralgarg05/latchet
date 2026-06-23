import type { TaskState } from "@latchet/spec";

function renderList(lines: string[]): string {
  return lines.length > 0 ? lines.map((line) => `- ${line}`).join("\n") : "- None";
}

export function renderStateMarkdown(state: TaskState): string {
  const task = state.task;
  const freshnessLines = state.freshness
    ? state.freshness.checks.map((check) => `${check.ok ? "OK" : "WARN"}: ${check.message}`)
    : [];

  return [
    `# ${task.title}`,
    "",
    `Goal: ${task.goal}`,
    `Status: ${task.status}`,
    `Task ID: ${task.id}`,
    `Generated: ${state.generated_at}`,
    "",
    "## Active Constraints",
    renderList(state.active_constraints.map((event) => event.payload.summary)),
    "",
    "## Active Decisions",
    renderList(
      state.active_decisions.map((event) =>
        event.payload.reason ? `${event.payload.summary} — ${event.payload.reason}` : event.payload.summary
      )
    ),
    "",
    "## Recent Attempts",
    renderList(
      state.recent_attempts?.map((event) => {
        const suffix = event.payload.outcome ? ` — ${event.payload.outcome}` : "";
        const result = event.payload.result ?? "unknown";
        return `[${result}] ${event.payload.summary}${suffix}`;
      }) ?? []
    ),
    "",
    "## Recent Failures",
    renderList(
      state.recent_failures.map((event) => {
        const suffix = event.payload.error ? ` — ${event.payload.error}` : "";
        const status = event.payload.status ?? "open";
        return `[${status}] ${event.payload.summary}${suffix}`;
      })
    ),
    "",
    "## Environment Quirks",
    renderList(
      state.active_env_quirks.map((event) => {
        const parts = [event.payload.summary];
        if (event.payload.workaround) {
          parts.push(`workaround: ${event.payload.workaround}`);
        }
        return parts.join(" — ");
      })
    ),
    "",
    "## Open Questions",
    renderList(state.open_questions.map((event) => event.payload.question)),
    "",
    "## Next Action",
    state.next_action
      ? renderList([
          `${state.next_action.payload.summary}${
            state.next_action.payload.priority ? ` [${state.next_action.payload.priority}]` : ""
          }`
        ])
      : "- None",
    "",
    "## Artifact References",
    renderList(
      state.artifact_refs.map((event) =>
        event.payload.revision ? `${event.payload.path} @ ${event.payload.revision}` : event.payload.path
      )
    ),
    "",
    "## Blockers",
    renderList(state.blockers),
    "",
    "## Freshness",
    renderList(freshnessLines),
    "",
    "## Notes",
    renderList(state.notes.map((event) => event.payload.summary))
  ].join("\n");
}
