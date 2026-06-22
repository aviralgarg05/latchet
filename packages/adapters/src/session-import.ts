import type { LedgerEvent } from "@latchet/spec";

interface SessionImportRule {
  pattern: RegExp;
  build(taskId: string, provider: string, value: string, index: number): LedgerEvent | null;
}

function buildBase(taskId: string, provider: string, index: number): Omit<LedgerEvent, "type" | "payload"> {
  return {
    id: `${provider.replace(/[^a-z0-9]+/gi, "_")}_import_${index}`,
    task_id: taskId,
    timestamp: new Date(Date.UTC(2026, 0, 1, 0, 0, index)).toISOString(),
    actor: { kind: "assistant", name: `${provider}-importer` },
    source: { kind: "session", provider, reference: "structured-session-summary" },
    verification: { status: "model_inferred" }
  };
}

function buildArtifactPayload(value: string): { path: string; revision?: string } {
  const [path, revision] = value.split("|").map((part) => part.trim());
  return revision ? { path, revision } : { path };
}

const rules: SessionImportRule[] = [
  {
    pattern: /^(?:[-*]\s*)?decision:\s*(.+)$/i,
    build: (taskId, provider, value, index) => ({
      ...buildBase(taskId, provider, index),
      type: "decision",
      payload: { summary: value, status: "accepted" }
    })
  },
  {
    pattern: /^(?:[-*]\s*)?failed attempt:\s*(.+)$/i,
    build: (taskId, provider, value, index) => ({
      ...buildBase(taskId, provider, index),
      type: "attempt",
      payload: {
        summary: value,
        result: "failure"
      }
    })
  },
  {
    pattern: /^(?:[-*]\s*)?attempt:\s*(.+)$/i,
    build: (taskId, provider, value, index) => ({
      ...buildBase(taskId, provider, index),
      type: "attempt",
      payload: {
        summary: value,
        result: "partial"
      }
    })
  },
  {
    pattern: /^(?:[-*]\s*)?failure:\s*(.+)$/i,
    build: (taskId, provider, value, index) => ({
      ...buildBase(taskId, provider, index),
      type: "failure",
      payload: { summary: value, status: "open" }
    })
  },
  {
    pattern: /^(?:[-*]\s*)?(?:env quirk|environment quirk):\s*(.+)$/i,
    build: (taskId, provider, value, index) => ({
      ...buildBase(taskId, provider, index),
      type: "env_quirk",
      payload: { summary: value }
    })
  },
  {
    pattern: /^(?:[-*]\s*)?constraint:\s*(.+)$/i,
    build: (taskId, provider, value, index) => ({
      ...buildBase(taskId, provider, index),
      type: "constraint",
      payload: { summary: value }
    })
  },
  {
    pattern: /^(?:[-*]\s*)?artifact:\s*(.+)$/i,
    build: (taskId, provider, value, index) => ({
      ...buildBase(taskId, provider, index),
      type: "artifact_ref",
      payload: buildArtifactPayload(value)
    })
  },
  {
    pattern: /^(?:[-*]\s*)?open question:\s*(.+)$/i,
    build: (taskId, provider, value, index) => ({
      ...buildBase(taskId, provider, index),
      type: "open_question",
      payload: { question: value }
    })
  },
  {
    pattern: /^(?:[-*]\s*)?next action:\s*(.+)$/i,
    build: (taskId, provider, value, index) => ({
      ...buildBase(taskId, provider, index),
      type: "next_action",
      payload: { summary: value, priority: "medium" }
    })
  },
  {
    pattern: /^(?:[-*]\s*)?note:\s*(.+)$/i,
    build: (taskId, provider, value, index) => ({
      ...buildBase(taskId, provider, index),
      type: "note",
      payload: { summary: value }
    })
  }
];

export function importStructuredSession(taskId: string, provider: string, content: string): LedgerEvent[] {
  const events: LedgerEvent[] = [];

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    for (const rule of rules) {
      const match = trimmed.match(rule.pattern);
      if (!match) {
        continue;
      }

      const value = match[1]?.trim();
      if (!value) {
        break;
      }

      const event = rule.build(taskId, provider, value, events.length + 1);
      if (event) {
        events.push(event);
      }
      break;
    }
  }

  return events;
}
