import type { HandoffPack, LedgerEvent, TaskState } from "@latchet/spec";
import { HANDOFF_FORMAT, TASK_LEDGER_VERSION } from "@latchet/spec";
import { renderStateMarkdown } from "./markdown.js";

export function createHandoffPack(state: TaskState, events?: LedgerEvent[]): HandoffPack {
  return {
    version: TASK_LEDGER_VERSION,
    format: HANDOFF_FORMAT,
    exported_at: new Date().toISOString(),
    task: state.task,
    state,
    events
  };
}

export function exportMarkdown(state: TaskState): string {
  return renderStateMarkdown(state);
}
