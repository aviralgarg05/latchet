export function WorkflowSection() {
  return (
    <section className="section workflow">
      <div className="section-heading reveal reveal--one">
        <p className="section-kicker">One ledger, many assistants.</p>
        <h2>Let the tools change. Keep the task state intact.</h2>
      </div>

      <div className="workflow__board reveal reveal--two">
        <div className="workflow__sources">
          <div>ChatGPT</div>
          <div>Codex</div>
          <div>Claude Code</div>
          <div>Cursor</div>
        </div>

        <div className="workflow__hub">
          <div className="workflow__hub-card">
            <p>Latchet</p>
            <h3>Decisions · Failures · Quirks · Next Action</h3>
            <span>append-only task ledger</span>
          </div>
        </div>

        <div className="workflow__outputs">
          <div>state.md</div>
          <div>events.jsonl</div>
          <div>MCP tools</div>
        </div>
      </div>
    </section>
  );
}
