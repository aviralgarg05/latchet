import { workflowSources } from "../content";

export function WorkflowSection() {
  return (
    <section className="section workflow" id="workflow">
      <div className="section-heading reveal reveal--one">
        <p className="section-kicker">One ledger, many assistants.</p>
        <h2>Let the tools change. Keep the task intact.</h2>
      </div>

      <div className="workflow-belt reveal reveal--two">
        <div className="workflow-belt__track">
          {workflowSources.map((source) => (
            <div className="workflow-pill" key={source}>
              <span>{source}</span>
            </div>
          ))}
        </div>

        <div className="workflow-hub">
          <div className="workflow-hub__line" />
          <div className="workflow-hub__card">
            <p>Latchet</p>
            <h3>Decisions · Failures · Quirks · Next Action</h3>
            <span>append-only ledger with derived current state</span>
          </div>
          <div className="workflow-hub__outputs">
            <div>state.md</div>
            <div>events.jsonl</div>
            <div>MCP tools</div>
            <div>share-safe export</div>
          </div>
        </div>
      </div>
    </section>
  );
}
