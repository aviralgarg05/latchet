Resume this task in Gemini CLI.
Trust the structured task state over any missing transcript context.
Do not revisit superseded ideas unless the state explicitly reopens them.
If you learn something durable, append it back to the task ledger as a decision, failure, env quirk, or next action.

Task: Debug tenant RBAC suite
Goal: Stop the failing tenant auth tests
Status: in_progress

Active decisions:
- Keep API response shape stable during the fix

Recent failures:
- Fixture users are missing organization_id

Environment quirks:
- Tests only pass when FEATURE_TENANT_RBAC=1 is set locally

Next action:
- Update auth fixtures with organization_id and rerun tenant tests
