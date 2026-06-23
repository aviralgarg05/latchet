import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { Ajv2020 } from "ajv/dist/2020.js";
import {
  TASK_LEDGER_VERSION,
  taskLedgerSchema,
  type EventPayload,
  type LedgerEvent,
  type ProjectConfig,
  type TaskMetadata,
  type TaskState
} from "@latchet/spec";
import { LedgerError } from "./errors.js";
import { createHandoffPack } from "./exporters.js";
import { getGitSnapshot } from "./git.js";
import { stateToSyntheticEvents } from "./importers.js";
import { renderStateMarkdown } from "./markdown.js";
import { deriveTaskState } from "./projector.js";
import { redactState, redactHandoff, type RedactionOptions } from "./redact.js";
import { verifyTaskFreshness } from "./verify.js";
import {
  appendJsonLine,
  computeFileHash,
  createId,
  ensureDir,
  fileExists,
  listDirectories,
  nowIso,
  readJson,
  readJsonLines,
  writeJson
} from "./utils.js";

const LEDGER_DIR = ".taskledger";
const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
  validateFormats: false
});
const validateEvent = ajv.compile(taskLedgerSchema);

export interface LedgerPaths {
  workspaceRoot: string;
  ledgerRoot: string;
  tasksRoot: string;
  projectFile: string;
}

export interface CreateTaskInput {
  id: string;
  title: string;
  goal: string;
  status?: TaskMetadata["status"];
}

export interface AppendEventInput<TPayload extends EventPayload = EventPayload> {
  task_id?: string;
  type: LedgerEvent["type"];
  payload: TPayload;
  actor?: LedgerEvent["actor"];
  source?: LedgerEvent["source"];
  supersedes?: string[];
  refs?: LedgerEvent["refs"];
  verification?: LedgerEvent["verification"];
  redaction?: LedgerEvent["redaction"];
  id?: string;
  timestamp?: string;
}

function taskDir(paths: LedgerPaths, taskId: string): string {
  return join(paths.tasksRoot, taskId);
}

function taskEventsFile(paths: LedgerPaths, taskId: string): string {
  return join(taskDir(paths, taskId), "events.jsonl");
}

function taskStateJsonFile(paths: LedgerPaths, taskId: string): string {
  return join(taskDir(paths, taskId), "state.json");
}

function taskStateMarkdownFile(paths: LedgerPaths, taskId: string): string {
  return join(taskDir(paths, taskId), "state.md");
}

function taskAttachmentsDir(paths: LedgerPaths, taskId: string): string {
  return join(taskDir(paths, taskId), "attachments");
}

export function getLedgerPaths(workspaceRoot = process.cwd()): LedgerPaths {
  const resolvedRoot = resolve(workspaceRoot);
  const ledgerRoot = join(resolvedRoot, LEDGER_DIR);
  return {
    workspaceRoot: resolvedRoot,
    ledgerRoot,
    tasksRoot: join(ledgerRoot, "tasks"),
    projectFile: join(ledgerRoot, "project.json")
  };
}

export function ensureProject(workspaceRoot = process.cwd(), projectName?: string): ProjectConfig {
  const paths = getLedgerPaths(workspaceRoot);
  ensureDir(paths.tasksRoot);
  if (!fileExists(paths.projectFile)) {
    const project: ProjectConfig = {
      version: TASK_LEDGER_VERSION,
      created_at: nowIso(),
      project_name: projectName
    };
    writeJson(paths.projectFile, project);
    return project;
  }
  return readJson<ProjectConfig>(paths.projectFile);
}

export function readProject(workspaceRoot = process.cwd()): ProjectConfig {
  const paths = getLedgerPaths(workspaceRoot);
  if (!fileExists(paths.projectFile)) {
    throw new LedgerError("No task ledger found. Run `ledger init` first.");
  }
  return readJson<ProjectConfig>(paths.projectFile);
}

function writeProject(workspaceRoot: string, project: ProjectConfig): void {
  const paths = getLedgerPaths(workspaceRoot);
  writeJson(paths.projectFile, project);
}

export function listTasks(workspaceRoot = process.cwd()): string[] {
  const paths = getLedgerPaths(workspaceRoot);
  return listDirectories(paths.tasksRoot);
}

export function createTask(workspaceRoot: string, input: CreateTaskInput): TaskState {
  const project = ensureProject(workspaceRoot);
  const paths = getLedgerPaths(workspaceRoot);
  const dir = taskDir(paths, input.id);
  if (existsSync(dir)) {
    throw new LedgerError(`Task already exists: ${input.id}`);
  }
  mkdirSync(dir, { recursive: true });
  mkdirSync(taskAttachmentsDir(paths, input.id), { recursive: true });
  const eventsFile = taskEventsFile(paths, input.id);
  const initialTask: TaskMetadata = {
    id: input.id,
    title: input.title,
    goal: input.goal,
    status: input.status ?? "in_progress",
    created_at: nowIso(),
    updated_at: nowIso(),
    workspace_root: resolve(workspaceRoot),
    git: getGitSnapshot(workspaceRoot)
  };
  const state = deriveTaskState(initialTask, []);
  const verified = {
    ...state,
    freshness: verifyTaskFreshness(workspaceRoot, state)
  };
  writeFileSync(eventsFile, "", "utf8");
  const finalState = writeTaskState(workspaceRoot, input.id, verified);
  writeProject(workspaceRoot, {
    ...project,
    current_task_id: input.id
  });
  return finalState;
}

export function readTaskState(
  workspaceRoot: string,
  taskId: string,
  bypassIntegrity = false
): TaskState {
  const paths = getLedgerPaths(workspaceRoot);
  const statePath = taskStateJsonFile(paths, taskId);
  if (!fileExists(statePath)) {
    throw new LedgerError(`Task state not found for ${taskId}`);
  }
  const state = readJson<TaskState>(statePath);
  if (!bypassIntegrity) {
    const eventsPath = taskEventsFile(paths, taskId);
    const currentHash = computeFileHash(eventsPath);
    const storedHash = state.integrity?.event_log_hash;
    if (currentHash !== storedHash) {
      return deriveAndPersist(workspaceRoot, taskId);
    }
  }
  return state;
}

export function readTaskEvents(workspaceRoot: string, taskId: string): LedgerEvent[] {
  return readJsonLines<LedgerEvent>(taskEventsFile(getLedgerPaths(workspaceRoot), taskId));
}

function writeTaskState(workspaceRoot: string, taskId: string, state: TaskState): TaskState {
  const paths = getLedgerPaths(workspaceRoot);
  const eventsFile = taskEventsFile(paths, taskId);
  const hash = computeFileHash(eventsFile);
  const stateWithHash: TaskState = {
    ...state,
    integrity: {
      event_log_hash: hash
    }
  };
  writeJson(taskStateJsonFile(paths, taskId), stateWithHash);
  writeFileSync(taskStateMarkdownFile(paths, taskId), `${renderStateMarkdown(stateWithHash)}\n`, "utf8");
  return stateWithHash;
}

function assertValidEvent(event: LedgerEvent): void {
  if (!validateEvent(event)) {
    const message = ajv.errorsText(validateEvent.errors);
    throw new LedgerError(`Invalid event: ${message}`);
  }
}

function currentTaskId(workspaceRoot: string): string {
  const project = readProject(workspaceRoot);
  if (!project.current_task_id) {
    throw new LedgerError("No current task is selected.");
  }
  return project.current_task_id;
}

export function getCurrentTaskId(workspaceRoot = process.cwd()): string {
  return currentTaskId(workspaceRoot);
}

export function selectTask(workspaceRoot: string, taskId: string): void {
  const state = readTaskState(workspaceRoot, taskId);
  const project = readProject(workspaceRoot);
  writeProject(workspaceRoot, {
    ...project,
    current_task_id: state.task.id
  });
}

export function appendEvent(workspaceRoot: string, input: AppendEventInput): TaskState {
  const paths = getLedgerPaths(workspaceRoot);
  const taskId = input.task_id || currentTaskId(workspaceRoot);
  const event: LedgerEvent = {
    id: input.id ?? createId(),
    task_id: taskId,
    timestamp: input.timestamp ?? nowIso(),
    actor: input.actor ?? { kind: "user", name: "local-user" },
    source: input.source ?? { kind: "cli", provider: "latchet" },
    type: input.type,
    payload: input.payload,
    supersedes: input.supersedes,
    refs: input.refs,
    verification: input.verification ?? { status: "user_asserted" },
    redaction: input.redaction
  };
  assertValidEvent(event);
  appendJsonLine(taskEventsFile(paths, taskId), event);
  return deriveAndPersist(workspaceRoot, taskId);
}

export function deriveAndPersist(workspaceRoot: string, taskId: string): TaskState {
  const current = readTaskState(workspaceRoot, taskId, true);
  const state = deriveTaskState(
    current.task,
    readTaskEvents(workspaceRoot, taskId)
  );
  const verified = {
    ...state,
    freshness: verifyTaskFreshness(workspaceRoot, state)
  };
  return writeTaskState(workspaceRoot, taskId, verified);
}

export function getCurrentTaskState(workspaceRoot = process.cwd()): TaskState {
  return readTaskState(workspaceRoot, currentTaskId(workspaceRoot));
}

export function exportTask(
  workspaceRoot: string,
  taskId: string,
  includeEvents = true,
  redactionOptions?: RedactionOptions
): ReturnType<typeof createHandoffPack> {
  const state = readTaskState(workspaceRoot, taskId);
  const derivedState = redactionOptions ? redactState(state, redactionOptions) : state;
  const pack = createHandoffPack(derivedState, includeEvents ? readTaskEvents(workspaceRoot, taskId) : undefined);
  return redactionOptions ? redactHandoff(pack, redactionOptions) : pack;
}

export function importTaskData(workspaceRoot: string, taskId: string, data: unknown): TaskState {
  const project = ensureProject(workspaceRoot);
  const paths = getLedgerPaths(workspaceRoot);
  if (!fileExists(taskStateJsonFile(paths, taskId))) {
    const importedTask: TaskMetadata = {
      id: taskId,
      title: `Imported ${taskId}`,
      goal: "Imported from external task state.",
      status: "in_progress",
      created_at: nowIso(),
      updated_at: nowIso(),
      workspace_root: resolve(workspaceRoot),
      git: getGitSnapshot(workspaceRoot)
    };
    ensureDir(taskDir(paths, taskId));
    ensureDir(taskAttachmentsDir(paths, taskId));
    writeTaskState(workspaceRoot, taskId, deriveTaskState(importedTask, []));
    writeProject(workspaceRoot, {
      ...project,
      current_task_id: taskId
    });
  }

  let events: LedgerEvent[] = [];
  if (Array.isArray(data)) {
    events = data as LedgerEvent[];
  } else if (typeof data === "object" && data && "format" in (data as Record<string, unknown>)) {
    const pack = data as ReturnType<typeof createHandoffPack>;
    events = pack.events ?? stateToSyntheticEvents(taskId, pack.state);
  } else if (typeof data === "object" && data && "task" in (data as Record<string, unknown>)) {
    events = stateToSyntheticEvents(taskId, data as TaskState);
  } else {
    throw new LedgerError("Unsupported import format.");
  }

  const existingEvents = readTaskEvents(workspaceRoot, taskId);
  const existingIds = new Set(existingEvents.map((event) => event.id));
  
  // Use a stable stringification for payload comparison
  const existingSignatures = new Set(
    existingEvents.map((event) => JSON.stringify({ type: event.type, payload: event.payload }))
  );

  for (const event of events) {
    const signature = JSON.stringify({ type: event.type, payload: event.payload });
    if (existingIds.has(event.id) || existingSignatures.has(signature)) {
      continue; // Skip duplicate events
    }

    const importedEvent = {
      ...event,
      task_id: taskId,
      id: event.id // ID is guaranteed new at this point
    };
    
    // Add to existing tracking sets to prevent duplicates within the same import payload
    existingIds.add(importedEvent.id);
    existingSignatures.add(signature);

    assertValidEvent(importedEvent);
    appendJsonLine(taskEventsFile(paths, taskId), importedEvent);
  }
  return deriveAndPersist(workspaceRoot, taskId);
}

export function redactTaskState(workspaceRoot: string, taskId: string, options: RedactionOptions): TaskState {
  const state = readTaskState(workspaceRoot, taskId);
  return redactState(state, options);
}
