import type { LedgerEvent, TaskState } from "@latchet/spec";

export interface ExportOptions {
  includeHistory?: boolean;
}

export interface AgentAdapter {
  id: string;
  label: string;
  description: string;
  exportPrompt(state: TaskState, options?: ExportOptions): string;
  importSession?(taskId: string, content: string): LedgerEvent[];
}
