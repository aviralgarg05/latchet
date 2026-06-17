import type {
  ArtifactRefPayload,
  DecisionPayload,
  EnvQuirkPayload,
  FailurePayload,
  HandoffPack,
  LedgerEvent,
  NextActionPayload,
  OpenQuestionPayload,
  TaskState
} from "@latchet/spec";
import { fileExists, readJson, readJsonLines } from "./utils.js";

export function readImportFile(path: string): HandoffPack | TaskState | LedgerEvent[] {
  if (!fileExists(path)) {
    throw new Error(`Import file not found: ${path}`);
  }
  if (path.endsWith(".jsonl")) {
    return readJsonLines<LedgerEvent>(path);
  }
  return readJson<HandoffPack | TaskState>(path);
}

export function stateToSyntheticEvents(taskId: string, state: TaskState): LedgerEvent[] {
  const events: LedgerEvent[] = [];
  const stamp = state.generated_at;

  function push<TPayload>(type: LedgerEvent["type"], payload: TPayload): void {
    events.push({
      id: `imp_${events.length + 1}`,
      task_id: taskId,
      timestamp: stamp,
      actor: { kind: "system", name: "import" },
      source: { kind: "import", provider: "latchet" },
      type,
      payload
    } as LedgerEvent);
  }

  state.active_decisions.forEach((event) => push<DecisionPayload>("decision", event.payload));
  state.recent_failures.forEach((event) => push<FailurePayload>("failure", event.payload));
  state.active_env_quirks.forEach((event) => push<EnvQuirkPayload>("env_quirk", event.payload));
  state.open_questions.forEach((event) => push<OpenQuestionPayload>("open_question", event.payload));
  state.artifact_refs.forEach((event) => push<ArtifactRefPayload>("artifact_ref", event.payload));
  if (state.next_action) {
    push<NextActionPayload>("next_action", state.next_action.payload);
  }
  return events;
}
