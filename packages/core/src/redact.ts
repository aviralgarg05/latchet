import type { HandoffPack, LedgerEvent, TaskState } from "@latchet/spec";

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

function redactEvent(event: LedgerEvent, options: RedactionOptions): LedgerEvent {
  const type = event.type;
  const payload = { ...event.payload };
  
  if (type === "decision") {
    if ("summary" in payload && typeof payload.summary === "string") {
      payload.summary = redactText(payload.summary, options);
    }
    if ("reason" in payload && typeof payload.reason === "string") {
      payload.reason = options.removeReasons ? undefined : redactText(payload.reason, options);
    }
  } else if (type === "attempt") {
    if ("summary" in payload && typeof payload.summary === "string") {
      payload.summary = redactText(payload.summary, options);
    }
  } else if (type === "failure") {
    if ("summary" in payload && typeof payload.summary === "string") {
      payload.summary = redactText(payload.summary, options);
    }
    if ("error" in payload && typeof payload.error === "string") {
      payload.error = redactText(payload.error, options);
    }
    if ("suspected_cause" in payload && typeof payload.suspected_cause === "string") {
      payload.suspected_cause = redactText(payload.suspected_cause, options);
    }
  } else if (type === "env_quirk") {
    if ("summary" in payload && typeof payload.summary === "string") {
      payload.summary = redactText(payload.summary, options);
    }
    if ("impact" in payload && typeof payload.impact === "string") {
      payload.impact = redactText(payload.impact, options);
    }
    if ("workaround" in payload && typeof payload.workaround === "string") {
      payload.workaround = redactText(payload.workaround, options);
    }
  } else if (type === "constraint") {
    if ("summary" in payload && typeof payload.summary === "string") {
      payload.summary = redactText(payload.summary, options);
    }
  } else if (type === "artifact_ref") {
    if ("path" in payload && typeof payload.path === "string") {
      payload.path = options.removePaths ? "[REDACTED_PATH]" : payload.path;
    }
    if ("revision" in payload && typeof payload.revision === "string") {
      payload.revision = options.removeRevisions ? undefined : payload.revision;
    }
  } else if (type === "open_question") {
    if ("question" in payload && typeof payload.question === "string") {
      payload.question = redactText(payload.question, options);
    }
  } else if (type === "next_action") {
    if ("summary" in payload && typeof payload.summary === "string") {
      payload.summary = redactText(payload.summary, options);
    }
  } else if (type === "note") {
    if ("summary" in payload && typeof payload.summary === "string") {
      payload.summary = redactText(payload.summary, options);
    }
  } else if (type === "evidence") {
    if ("summary" in payload && typeof payload.summary === "string") {
      payload.summary = redactText(payload.summary, options);
    }
    if ("details" in payload && typeof payload.details === "string") {
      payload.details = redactText(payload.details, options);
    }
  } else if (type === "status_change") {
    if ("reason" in payload && typeof payload.reason === "string") {
      payload.reason = options.removeReasons ? undefined : redactText(payload.reason, options);
    }
  }
  
  // Clean undefined fields so they match original expectations
  const payloadObj = payload as Record<string, unknown>;
  for (const key of Object.keys(payloadObj)) {
    if (payloadObj[key] === undefined) {
      delete payloadObj[key];
    }
  }
  
  return {
    ...event,
    payload
  };
}

export function redactHandoff(pack: HandoffPack, options: RedactionOptions): HandoffPack {
  return {
    ...pack,
    state: redactState(pack.state, options),
    events: pack.events?.map((event) => redactEvent(event, options))
  };
}
