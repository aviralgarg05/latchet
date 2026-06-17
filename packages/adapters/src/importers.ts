import type { LedgerEvent } from "@latchet/spec";

export function importCommandOutput(taskId: string, command: string, output: string): LedgerEvent[] {
  const timestamp = new Date().toISOString();
  const base: Omit<LedgerEvent, "id" | "type" | "payload"> = {
    task_id: taskId,
    timestamp,
    actor: { kind: "tool", name: "command-import" },
    source: { kind: "command", provider: "latchet", reference: command },
    verification: { status: "verified" }
  };

  const events: LedgerEvent[] = [
    {
      ...base,
      id: "cmd_evidence_1",
      type: "evidence",
      payload: {
        summary: `Captured output from ${command}`,
        kind: "command",
        details: output.slice(0, 2000)
      }
    }
  ];

  if (/error|failed|exception/i.test(output)) {
    events.push({
      ...base,
      id: "cmd_failure_1",
      type: "failure",
      payload: {
        summary: `Command ${command} reported a failure`,
        error: output.slice(0, 2000),
        status: "open"
      }
    });
  }

  return events;
}
