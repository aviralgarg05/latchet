import { workflowSources } from "../content";

const outputs = ["state.md", "events.jsonl", "MCP tools", "handoff export"];

export function WorkflowSection() {
  return (
    <section className="section workflow" id="workflow">
      <div className="section-intro">
        <h2>One ledger. Many agents.</h2>
        <p>Log durable facts once. Export compact state for whichever tool you open next.</p>
      </div>

      <div className="pipeline">
        <div className="pipeline__sources">
          {workflowSources.map((source) => (
            <span className="pipeline__chip" key={source}>
              {source}
            </span>
          ))}
        </div>

        <div className="pipeline__arrow" aria-hidden="true">
          →
        </div>

        <div className="pipeline__core">
          <strong>.taskledger/</strong>
          <span>decisions · failures · quirks · next action</span>
        </div>

        <div className="pipeline__arrow" aria-hidden="true">
          →
        </div>

        <div className="pipeline__outputs">
          {outputs.map((output) => (
            <span className="pipeline__chip pipeline__chip--out" key={output}>
              {output}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}