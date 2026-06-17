import type { HandoffPack, TaskState } from "@latchet/spec";

export interface RedactionOptions {
  removePaths?: boolean;
  removeRevisions?: boolean;
  removeReasons?: boolean;
  maskSecrets?: boolean;
}

function redactText(value: string, options: RedactionOptions): string {
  let result = value;
  if (options.maskSecrets) {
    result = result
      .replace(/\b(sk|pk|ghp|github_pat)_[A-Za-z0-9_]+\b/g, "[REDACTED_TOKEN]")
      .replace(/\b[A-Z0-9]{20,}\b/g, "[REDACTED_SECRET]");
  }
  return result;
}

export function redactState(state: TaskState, options: RedactionOptions): TaskState {
  return {
    ...state,
    active_decisions: state.active_decisions.map((event) => ({
      ...event,
      payload: {
        ...event.payload,
        summary: redactText(event.payload.summary, options),
        reason: options.removeReasons ? undefined : redactText(event.payload.reason ?? "", options) || undefined
      }
    })),
    recent_failures: state.recent_failures.map((event) => ({
      ...event,
      payload: {
        ...event.payload,
        summary: redactText(event.payload.summary, options),
        error: redactText(event.payload.error ?? "", options) || undefined,
        suspected_cause: redactText(event.payload.suspected_cause ?? "", options) || undefined
      }
    })),
    active_env_quirks: state.active_env_quirks.map((event) => ({
      ...event,
      payload: {
        ...event.payload,
        summary: redactText(event.payload.summary, options),
        impact: redactText(event.payload.impact ?? "", options) || undefined,
        workaround: redactText(event.payload.workaround ?? "", options) || undefined
      }
    })),
    open_questions: state.open_questions.map((event) => ({
      ...event,
      payload: {
        ...event.payload,
        question: redactText(event.payload.question, options)
      }
    })),
    next_action: state.next_action
      ? {
          ...state.next_action,
          payload: {
            ...state.next_action.payload,
            summary: redactText(state.next_action.payload.summary, options)
          }
        }
      : null,
    artifact_refs: state.artifact_refs.map((event) => ({
      ...event,
      payload: {
        ...event.payload,
        path: options.removePaths ? "[REDACTED_PATH]" : event.payload.path,
        revision: options.removeRevisions ? undefined : event.payload.revision
      }
    })),
    notes: state.notes.map((event) => ({
      ...event,
      payload: {
        summary: redactText(event.payload.summary, options)
      }
    }))
  };
}

export function redactHandoff(pack: HandoffPack, options: RedactionOptions): HandoffPack {
  return {
    ...pack,
    state: redactState(pack.state, options),
    events: pack.events?.map((event) => ({
      ...event,
      payload: JSON.parse(JSON.stringify(event.payload))
    }))
  };
}
