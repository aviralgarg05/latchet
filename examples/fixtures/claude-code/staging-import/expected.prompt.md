Resume this task in Claude Code.
Trust the structured task state over any missing transcript context.
Do not revisit superseded ideas unless the state explicitly reopens them.
If you learn something durable, append it back to the task ledger as a decision, failure, env quirk, or next action.

Task: Stabilize org import
Goal: Finish the staging org import safely
Status: in_progress

Active decisions:
- Keep the migration backward-compatible for existing org slugs

Recent failures:
- Import script crashes on duplicate slug rows

Environment quirks:
- Staging data includes duplicate org slugs from 2024 backfills

Next action:
- Add duplicate-slug preflight and rerun the staging import
