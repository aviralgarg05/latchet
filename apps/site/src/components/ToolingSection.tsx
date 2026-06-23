import { mcpTools, toolingCommands } from "../content";
import { TerminalIcon, LedgerStackIcon } from "./Icons";

export function ToolingSection() {
  return (
    <section className="section tooling reveal" id="tooling">
      <div className="section-intro">
        <h2>CLI and MCP.</h2>
        <p>Capture state from the terminal. Expose the same ledger to agents over stdio.</p>
      </div>

      <div className="tooling-split">
        <div className="code-panel">
          <div className="code-panel__head">
            <TerminalIcon width={14} height={14} />
            <span>terminal</span>
          </div>
          <pre>
            {toolingCommands.map((line) => (
              <code key={line}>
                <span className="cmd-prompt">$</span> {line.replace("$ ", "")}
                {"\n"}
              </code>
            ))}
          </pre>
        </div>

        <div className="code-panel">
          <div className="code-panel__head">
            <LedgerStackIcon width={14} height={14} />
            <span>mcp tools</span>
          </div>
          <ul className="tool-list">
            {mcpTools.map((tool) => (
              <li key={tool}>
                <code>{tool}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}