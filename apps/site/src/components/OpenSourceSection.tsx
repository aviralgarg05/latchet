import { repoTree } from "../content";

export function OpenSourceSection() {
  return (
    <section className="section opensource" id="open-source">
      <div className="opensource-grid">
        <div className="section-intro section-intro--flush">
          <h2>Open source. Local by default.</h2>
          <p>Plain files you can inspect, edit, and version-control. No hosted memory silo required.</p>
          <ul className="bullet-list">
            <li>Human-readable JSONL event log</li>
            <li>Derived Markdown state for resume</li>
            <li>Git branch, commit, and artifact freshness checks</li>
          </ul>
          <a className="text-link" href="https://github.com/aviralgarg05/latchet" target="_blank" rel="noreferrer">
            github.com/aviralgarg05/latchet →
          </a>
        </div>

        <div className="code-panel">
          <div className="code-panel__head">
            <span>repository</span>
          </div>
          <ul className="tree-list">
            {repoTree.map((item) => (
              <li key={item}>
                <code>{item}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}