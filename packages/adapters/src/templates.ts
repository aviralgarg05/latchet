import type { TaskState } from "@latchet/spec";
import type { AgentAdapter } from "./contracts.js";

function commonStateBlock(state: TaskState): string {
  const lines = [
    `Task: ${state.task.title}`,
    `Goal: ${state.task.goal}`,
    `Status: ${state.task.status}`,
    "",
    "Active decisions:"
  ];
  for (const decision of state.active_decisions) {
    lines.push(`- ${decision.payload.summary}`);
  }
  lines.push("", "Recent failures:");
  for (const failure of state.recent_failures) {
    lines.push(`- ${failure.payload.summary}`);
  }
  lines.push("", "Environment quirks:");
  for (const quirk of state.active_env_quirks) {
    lines.push(`- ${quirk.payload.summary}`);
  }
  lines.push("", "Next action:");
  lines.push(`- ${state.next_action?.payload.summary ?? "No next action recorded."}`);
  return lines.join("\n");
}

function buildPrompt(adapterName: string, state: TaskState): string {
  return [
    `Resume this task in ${adapterName}.`,
    "Trust the structured task state over any missing transcript context.",
    "Do not revisit superseded ideas unless the state explicitly reopens them.",
    "If you learn something durable, append it back to the task ledger as a decision, failure, env quirk, or next action.",
    "",
    commonStateBlock(state)
  ].join("\n");
}

export const adapters: AgentAdapter[] = [
  {
    id: "codex",
    label: "Codex",
    description: "Compact handoff prompt for Codex CLI/Desktop workflows.",
    exportPrompt: (state) => buildPrompt("Codex", state)
  },
  {
    id: "claude-code",
    label: "Claude Code",
    description: "Compact handoff prompt for Claude Code sessions.",
    exportPrompt: (state) => buildPrompt("Claude Code", state)
  },
  {
    id: "gemini-cli",
    label: "Gemini CLI",
    description: "Compact handoff prompt for Gemini CLI sessions.",
    exportPrompt: (state) => buildPrompt("Gemini CLI", state)
  },
  {
    id: "cursor",
    label: "Cursor",
    description: "Compact handoff prompt for Cursor agent chats and rules.",
    exportPrompt: (state) => buildPrompt("Cursor", state)
  },
  {
    id: "generic-markdown",
    label: "Generic Markdown",
    description: "Plain markdown handoff for any assistant.",
    exportPrompt: (state) => commonStateBlock(state)
  }
];

export function getAdapter(adapterId: string): AgentAdapter | undefined {
  return adapters.find((adapter) => adapter.id === adapterId);
}
