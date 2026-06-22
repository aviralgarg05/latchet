import { mcpTools, toolingCommands } from "../content";

export function ToolingSection() {
  return (
    <section className="section tooling" id="tooling">
      <div className="section-intro">
        <h2>CLI and MCP.</h2>
        <p>Capture state from the terminal. Expose the same ledger to agents over stdio.</p>
      </div>

      <div className="tooling-split">
        <div className="code-panel">
          <div className="code-panel__head">
            <span>terminal</span>
          </div>
          <pre>
            {toolingCommands.map((line) => (
              <code key={line}>{line}{"\n"}</code>
            ))}
          </pre>
        </div>

        <div className="code-panel">
          <div className="code-panel__head">
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