#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Command, InvalidArgumentError } from "commander";
import {
  appendEvent,
  deriveAndPersist,
  diffStates,
  ensureProject,
  exportMarkdown,
  exportTask,
  getCurrentTaskId,
  getCurrentTaskState,
  importTaskData,
  listTasks,
  readProject,
  readTaskState,
  redactTaskState,
  renderStateMarkdown,
  selectTask,
  verifyTaskFreshness,
  createTask
} from "@latchet/core";
import { readImportFile } from "@latchet/core";
import { getAdapter, importCommandOutput } from "@latchet/adapters";
import type { AppendEventInput } from "@latchet/core";
import type { EventPayload, LedgerEvent, VerificationStatus } from "@latchet/spec";

interface CommonLogOptions {
  task?: string;
  summary?: string;
  reason?: string;
  status?: string;
  outcome?: string;
  result?: string;
  error?: string;
  cause?: string;
  impact?: string;
  workaround?: string;
  path?: string;
  revision?: string;
  note?: string;
  question?: string;
  owner?: string;
  priority?: string;
  prerequisite?: string[];
  supersede?: string[];
  verification?: VerificationStatus;
  actorKind?: LedgerEvent["actor"]["kind"];
  actorName?: string;
  sourceKind?: LedgerEvent["source"]["kind"];
  sourceProvider?: string;
}

function output(value: unknown, json = false): void {
  if (json) {
    process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
    return;
  }
  if (typeof value === "string") {
    process.stdout.write(`${value}\n`);
    return;
  }
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function parsePriority(value: string): "low" | "medium" | "high" {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }
  throw new InvalidArgumentError("Priority must be low, medium, or high.");
}

function buildPayload(type: LedgerEvent["type"], options: CommonLogOptions): EventPayload {
  switch (type) {
    case "decision":
      return {
        summary: options.summary ?? "",
        reason: options.reason,
        status: (options.status as "accepted" | "proposed" | "rejected" | "superseded" | undefined) ?? "accepted"
      };
    case "attempt":
      return {
        summary: options.summary ?? "",
        outcome: options.outcome,
        result: options.result as "success" | "failure" | "partial" | undefined
      };
    case "failure":
      return {
        summary: options.summary ?? "",
        error: options.error,
        suspected_cause: options.cause,
        status: (options.status as "open" | "resolved" | undefined) ?? "open"
      };
    case "env_quirk":
      return {
        summary: options.summary ?? "",
        impact: options.impact,
        workaround: options.workaround
      };
    case "constraint":
      return {
        summary: options.summary ?? ""
      };
    case "artifact_ref":
      if (!options.path) {
        throw new InvalidArgumentError("artifact_ref requires --path.");
      }
      return {
        path: options.path,
        revision: options.revision,
        note: options.note
      };
    case "open_question":
      return {
        question: options.question ?? options.summary ?? "",
        owner: options.owner
      };
    case "next_action":
      return {
        summary: options.summary ?? "",
        priority: options.priority ? parsePriority(options.priority) : undefined,
        prerequisites: options.prerequisite
      };
    case "status_change":
      if (!options.status) {
        throw new InvalidArgumentError("status_change requires --status.");
      }
      return {
        to: options.status as "todo" | "in_progress" | "blocked" | "done",
        reason: options.reason
      };
    case "note":
      return {
        summary: options.summary ?? options.note ?? ""
      };
    case "evidence":
      return {
        summary: options.summary ?? "",
        kind: "log",
        details: options.note
      };
    default:
      throw new InvalidArgumentError(`Unsupported event type: ${type}`);
  }
}

function buildEventInput(type: LedgerEvent["type"], options: CommonLogOptions): AppendEventInput {
  return {
    task_id: options.task,
    type,
    payload: buildPayload(type, options),
    supersedes: options.supersede,
    actor: {
      kind: options.actorKind ?? "user",
      name: options.actorName ?? "local-user"
    },
    source: {
      kind: options.sourceKind ?? "cli",
      provider: options.sourceProvider ?? "latchet"
    },
    verification: {
      status: options.verification ?? "user_asserted"
    }
  };
}

function writeMaybe(path: string | undefined, content: string): void {
  if (!path) {
    process.stdout.write(`${content}\n`);
    return;
  }
  writeFileSync(resolve(path), `${content}\n`, "utf8");
}

const program = new Command();
program.name("ledger").description("Local-first task ledger for AI-assisted work.");

program
  .command("init")
  .option("--name <name>", "Project name")
  .action((options: { name?: string }) => {
    const project = ensureProject(process.cwd(), options.name);
    output(project, true);
  });

const task = program.command("task").description("Manage tasks.");

task
  .command("create")
  .argument("<id>", "Task id")
  .requiredOption("--title <title>", "Task title")
  .requiredOption("--goal <goal>", "Task goal")
  .option("--status <status>", "Task status", "in_progress")
  .action((id: string, options: { title: string; goal: string; status: "todo" | "in_progress" | "blocked" | "done" }) => {
    const state = createTask(process.cwd(), {
      id,
      title: options.title,
      goal: options.goal,
      status: options.status
    });
    output(state, true);
  });

task.command("list").action(() => {
  output(
    listTasks(process.cwd()).map((id) => ({
      id,
      current: (() => {
        try {
          return getCurrentTaskId(process.cwd()) === id;
        } catch {
          return false;
        }
      })()
    })),
    true
  );
});

task
  .command("select")
  .argument("<id>", "Task id")
  .action((id: string) => {
    selectTask(process.cwd(), id);
    output(`Selected task ${id}`);
  });

program
  .command("log")
  .argument("<type>", "Event type")
  .option("--task <id>", "Task id")
  .option("--summary <text>", "Summary text")
  .option("--reason <text>", "Decision or status reason")
  .option("--status <status>", "Event status")
  .option("--outcome <text>", "Attempt outcome")
  .option("--result <result>", "Attempt result")
  .option("--error <text>", "Error text")
  .option("--cause <text>", "Suspected cause")
  .option("--impact <text>", "Impact text")
  .option("--workaround <text>", "Workaround text")
  .option("--path <path>", "Artifact path")
  .option("--revision <revision>", "Artifact revision")
  .option("--note <text>", "Freeform note")
  .option("--question <text>", "Open question")
  .option("--owner <owner>", "Question owner")
  .option("--priority <priority>", "Next action priority")
  .option("--prerequisite <text...>", "Next action prerequisites")
  .option("--supersede <eventId...>", "Superseded event ids")
  .option("--verification <status>", "Verification state", "user_asserted")
  .option("--actor-kind <kind>", "Actor kind", "user")
  .option("--actor-name <name>", "Actor name", "local-user")
  .option("--source-kind <kind>", "Source kind", "cli")
  .option("--source-provider <provider>", "Source provider", "latchet")
  .action((type: LedgerEvent["type"], options: CommonLogOptions) => {
    const state = appendEvent(process.cwd(), buildEventInput(type, options));
    output(state, true);
  });

program
  .command("derive")
  .option("--task <id>", "Task id")
  .action((options: { task?: string }) => {
    const taskId = options.task ?? getCurrentTaskId(process.cwd());
    const state = deriveAndPersist(process.cwd(), taskId);
    output(state, true);
  });

program
  .command("show")
  .option("--task <id>", "Task id")
  .option("--json", "Output json instead of markdown")
  .action((options: { task?: string; json?: boolean }) => {
    const state = options.task ? readTaskState(process.cwd(), options.task) : getCurrentTaskState(process.cwd());
    output(options.json ? state : renderStateMarkdown(state), Boolean(options.json));
  });

program
  .command("next")
  .option("--task <id>", "Task id")
  .option("--json", "Output json instead of text")
  .action((options: { task?: string; json?: boolean }) => {
    const state = options.task ? readTaskState(process.cwd(), options.task) : getCurrentTaskState(process.cwd());
    output(options.json ? state.next_action : state.next_action?.payload.summary ?? "No next action recorded.", Boolean(options.json));
  });

program
  .command("verify")
  .option("--task <id>", "Task id")
  .option("--json", "Output json instead of text")
  .action((options: { task?: string; json?: boolean }) => {
    const state = options.task ? readTaskState(process.cwd(), options.task) : getCurrentTaskState(process.cwd());
    const report = verifyTaskFreshness(process.cwd(), state);
    output(options.json ? report : report.checks.map((check) => `${check.ok ? "OK" : "WARN"} ${check.message}`).join("\n"), Boolean(options.json));
  });

program
  .command("export")
  .option("--task <id>", "Task id")
  .option("--format <format>", "handoff, state-json, state-md, adapter", "handoff")
  .option("--adapter <adapter>", "Adapter id for format=adapter", "generic-markdown")
  .option("--output <path>", "Output file path")
  .option("--history", "Include event history", false)
  .option("--redact-paths", "Redact paths")
  .option("--redact-revisions", "Redact revisions")
  .option("--redact-reasons", "Redact reasons")
  .option("--mask-secrets", "Mask obvious secrets")
  .action((options: {
    task?: string;
    format: string;
    adapter: string;
    output?: string;
    history?: boolean;
    redactPaths?: boolean;
    redactRevisions?: boolean;
    redactReasons?: boolean;
    maskSecrets?: boolean;
  }) => {
    const taskId = options.task ?? getCurrentTaskId(process.cwd());
    const redaction = {
      removePaths: options.redactPaths,
      removeRevisions: options.redactRevisions,
      removeReasons: options.redactReasons,
      maskSecrets: options.maskSecrets
    };

    if (options.format === "state-md") {
      const state = redactTaskState(process.cwd(), taskId, redaction);
      writeMaybe(options.output, exportMarkdown(state));
      return;
    }

    if (options.format === "state-json") {
      const state = redactTaskState(process.cwd(), taskId, redaction);
      writeMaybe(options.output, JSON.stringify(state, null, 2));
      return;
    }

    if (options.format === "adapter") {
      const adapter = getAdapter(options.adapter);
      if (!adapter) {
        throw new InvalidArgumentError(`Unknown adapter: ${options.adapter}`);
      }
      const state = redactTaskState(process.cwd(), taskId, redaction);
      writeMaybe(options.output, adapter.exportPrompt(state));
      return;
    }

    const handoff = exportTask(process.cwd(), taskId, Boolean(options.history), redaction);
    writeMaybe(options.output, JSON.stringify(handoff, null, 2));
  });

program
  .command("import-command")
  .argument("<output>", "Command output file")
  .requiredOption("--command <command>", "Command that produced the output")
  .option("--task <id>", "Target task id")
  .action((outputPath: string, options: { command: string; task?: string }) => {
    const taskId = options.task ?? getCurrentTaskId(process.cwd());
    const content = readFileSync(resolve(outputPath), "utf8");
    const events = importCommandOutput(taskId, options.command, content);
    const state = importTaskData(process.cwd(), taskId, events);

    output(
      {
        task_id: taskId,
        imported_events: events.length,
        state
      },
      true
    );
  });

program
  .command("import-session")
  .argument("<input>", "Structured session summary file")
  .requiredOption("--adapter <adapter>", "Adapter id")
  .option("--task <id>", "Target task id")
  .action((input: string, options: { adapter: string; task?: string }) => {
    const adapter = getAdapter(options.adapter);
    if (!adapter?.importSession) {
      throw new InvalidArgumentError(`Adapter does not support session import: ${options.adapter}`);
    }

    const taskId = options.task ?? getCurrentTaskId(process.cwd());
    const content = readFileSync(resolve(input), "utf8");
    const events = adapter.importSession(taskId, content);
    const state = importTaskData(process.cwd(), taskId, events);

    output(
      {
        task_id: taskId,
        imported_events: events.length,
        state
      },
      true
    );
  });

program
  .command("import")
  .argument("<input>", "Input JSON, JSONL, or handoff file")
  .requiredOption("--task <id>", "Target task id")
  .action((input: string, options: { task: string }) => {
    const data = readImportFile(resolve(input));
    const state = importTaskData(process.cwd(), options.task, data);
    output(state, true);
  });

program
  .command("redact")
  .option("--task <id>", "Task id")
  .requiredOption("--output <path>", "Redacted markdown output path")
  .option("--redact-paths", "Redact paths")
  .option("--redact-revisions", "Redact revisions")
  .option("--redact-reasons", "Redact reasons")
  .option("--mask-secrets", "Mask obvious secrets")
  .action((options: {
    task?: string;
    output: string;
    redactPaths?: boolean;
    redactRevisions?: boolean;
    redactReasons?: boolean;
    maskSecrets?: boolean;
  }) => {
    const taskId = options.task ?? getCurrentTaskId(process.cwd());
    const state = redactTaskState(process.cwd(), taskId, {
      removePaths: options.redactPaths,
      removeRevisions: options.redactRevisions,
      removeReasons: options.redactReasons,
      maskSecrets: options.maskSecrets
    });
    writeMaybe(options.output, renderStateMarkdown(state));
  });

program
  .command("diff")
  .argument("<before>", "Before state JSON or handoff JSON")
  .argument("<after>", "After state JSON or handoff JSON")
  .action((beforePath: string, afterPath: string) => {
    const beforeData = readImportFile(resolve(beforePath));
    const afterData = readImportFile(resolve(afterPath));
    const beforeState = Array.isArray(beforeData) ? null : "state" in beforeData ? beforeData.state : beforeData;
    const afterState = Array.isArray(afterData) ? null : "state" in afterData ? afterData.state : afterData;
    if (!beforeState || !afterState) {
      throw new InvalidArgumentError("Diff requires state JSON or handoff JSON on both sides.");
    }
    output(diffStates(beforeState, afterState), true);
  });

program
  .command("project")
  .description("Show project configuration.")
  .action(() => {
    output(readProject(process.cwd()), true);
  });

program.parseAsync(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
