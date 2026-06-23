export const TASK_LEDGER_VERSION = "0.1.0";
export const HANDOFF_FORMAT = "state-handoff/v1";

export type TaskStatus = "todo" | "in_progress" | "blocked" | "done";
export type EventType =
  | "decision"
  | "attempt"
  | "failure"
  | "env_quirk"
  | "constraint"
  | "artifact_ref"
  | "open_question"
  | "next_action"
  | "status_change"
  | "note"
  | "evidence";

export type VerificationStatus =
  | "verified"
  | "user_asserted"
  | "model_inferred"
  | "speculative"
  | "rejected";

export type FailureStatus = "open" | "resolved";
export type DecisionStatus = "proposed" | "accepted" | "rejected" | "superseded";
export type AttemptResult = "success" | "failure" | "partial";
export type Priority = "low" | "medium" | "high";

export interface GitSnapshot {
  root?: string;
  branch?: string;
  commit?: string;
  dirty?: boolean;
}

export interface TaskMetadata {
  id: string;
  title: string;
  goal: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  workspace_root?: string;
  git?: GitSnapshot;
}

export interface ProjectConfig {
  version: string;
  created_at: string;
  project_name?: string;
  current_task_id?: string;
}

export interface EventActor {
  kind: "user" | "assistant" | "tool" | "system";
  name?: string;
  id?: string;
  provider?: string;
}

export interface EventSource {
  kind: "manual" | "cli" | "mcp" | "session" | "conversation" | "file" | "command" | "telemetry" | "import";
  provider?: string;
  reference?: string;
  uri?: string;
}

export interface EventReference {
  kind: "event" | "file" | "command" | "conversation" | "url" | "commit" | "issue" | "pull_request";
  value: string;
  label?: string;
}

export interface VerificationState {
  status: VerificationStatus;
  note?: string;
}

export interface RedactionConfig {
  contains_sensitive?: boolean;
  fields?: string[];
  note?: string;
}

export interface DecisionPayload {
  summary: string;
  reason?: string;
  status?: DecisionStatus;
}

export interface AttemptPayload {
  summary: string;
  outcome?: string;
  result?: AttemptResult;
}

export interface FailurePayload {
  summary: string;
  error?: string;
  suspected_cause?: string;
  status?: FailureStatus;
}

export interface EnvQuirkPayload {
  summary: string;
  impact?: string;
  workaround?: string;
}

export interface ConstraintPayload {
  summary: string;
}

export interface ArtifactRefPayload {
  path: string;
  revision?: string;
  exists?: boolean;
  note?: string;
}

export interface OpenQuestionPayload {
  question: string;
  owner?: string;
}

export interface NextActionPayload {
  summary: string;
  priority?: Priority;
  prerequisites?: string[];
}

export interface StatusChangePayload {
  from?: TaskStatus;
  to: TaskStatus;
  reason?: string;
}

export interface NotePayload {
  summary: string;
}

export interface EvidencePayload {
  summary: string;
  kind?: "log" | "otel" | "test" | "command" | "session";
  details?: string;
}

export type EventPayload =
  | DecisionPayload
  | AttemptPayload
  | FailurePayload
  | EnvQuirkPayload
  | ConstraintPayload
  | ArtifactRefPayload
  | OpenQuestionPayload
  | NextActionPayload
  | StatusChangePayload
  | NotePayload
  | EvidencePayload;

export interface LedgerEvent<TPayload extends EventPayload = EventPayload> {
  id: string;
  task_id: string;
  timestamp: string;
  actor: EventActor;
  source: EventSource;
  type: EventType;
  payload: TPayload;
  supersedes?: string[];
  refs?: EventReference[];
  verification?: VerificationState;
  redaction?: RedactionConfig;
}

export interface FreshnessCheck {
  kind: "git_branch" | "git_commit" | "artifact_exists" | "workspace_git" | "workspace_root";
  ok: boolean;
  message: string;
}

export interface FreshnessReport {
  ok: boolean;
  checks: FreshnessCheck[];
}

export interface TaskState {
  version: string;
  generated_at: string;
  task: TaskMetadata;
  counts: {
    total_events: number;
    active_decisions: number;
    open_failures: number;
    env_quirks: number;
    open_questions: number;
  };
  active_constraints: LedgerEvent<ConstraintPayload>[];
  active_decisions: LedgerEvent<DecisionPayload>[];
  recent_attempts: LedgerEvent<AttemptPayload>[];
  recent_failures: LedgerEvent<FailurePayload>[];
  active_env_quirks: LedgerEvent<EnvQuirkPayload>[];
  open_questions: LedgerEvent<OpenQuestionPayload>[];
  next_action: LedgerEvent<NextActionPayload> | null;
  blockers: string[];
  artifact_refs: LedgerEvent<ArtifactRefPayload>[];
  notes: LedgerEvent<NotePayload>[];
  freshness?: FreshnessReport;
}

export interface HandoffPack {
  version: string;
  format: string;
  exported_at: string;
  task: TaskMetadata;
  state: TaskState;
  events?: LedgerEvent[];
}
