import { mcpTools, toolingCommands } from "../content";
import { ArrowUpRightIcon, LedgerStackIcon, TerminalIcon } from "./Icons";

export function ToolingSection() {
  return (
    <section className="section tooling" id="tooling">
      <div className="tooling__copy reveal reveal--one">
        <p className="section-kicker">Built for actual coding-agent workflows.</p>
        <h2>CLI-first, MCP-native, and local by default.</h2>
        <p>
          Capture durable facts manually, append them from tooling, export compact handoffs, and expose the same state to coding agents over MCP without inventing another hosted memory silo.
        </p>
      </div>

      <div className="tooling-grid">
        <article className="terminal-panel reveal reveal--two">
          <div className="panel-head">
            <TerminalIcon width={18} height={18} />
            <p>CLI</p>
          </div>
          <pre>
            {toolingCommands.map((line) => (
              <code key={line}>{line}{"\n"}</code>
            ))}
          </pre>
        </article>

        <article className="api-panel reveal reveal--three">
          <div className="panel-head">
            <LedgerStackIcon width={18} height={18} />
            <p>MCP surface</p>
          </div>
          <ul>
            {mcpTools.map((tool) => (
              <li key={tool}>
                <span>{tool}</span>
                <ArrowUpRightIcon width={14} height={14} />
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
