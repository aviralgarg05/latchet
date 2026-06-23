import { repoTree } from "../content";

export function OpenSourceSection() {
  return (
    <section className="section opensource reveal" id="open-source">
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
            github.com/aviralgarg05/latchet
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7" />
              <path d="M9 7h8v8" />
            </svg>
          </a>
        </div>

        <div className="code-panel">
          <div className="code-panel__head">
            <div className="dot"></div>
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