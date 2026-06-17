import { mcpTools, toolingCommands } from "../content";

export function ToolingSection() {
  return (
    <section className="section tooling" id="tooling">
      <div className="tooling__copy reveal reveal--one">
        <p className="section-kicker">Built for actual agent workflows.</p>
        <h2>CLI-first, MCP-native, and local by default.</h2>
        <p>
          Capture durable facts manually, append from tooling, export compact handoffs, and expose the same state to coding agents over MCP without inventing another hosted memory silo.
        </p>
      </div>

      <div className="tooling__panels">
        <article className="terminal-panel reveal reveal--two">
          <div className="panel-head">
            <span />
            <span />
            <span />
            <p>CLI</p>
          </div>
          <pre>
            {toolingCommands.map((line) => (
              <code key={line}>{line}\n</code>
            ))}
          </pre>
        </article>

        <article className="api-panel reveal reveal--three">
          <div className="panel-head">
            <span />
            <span />
            <span />
            <p>MCP</p>
          </div>
          <ul>
            {mcpTools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
