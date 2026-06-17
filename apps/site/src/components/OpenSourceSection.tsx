import { repoTree } from "../content";

export function OpenSourceSection() {
  return (
    <section className="section open-source" id="open-source">
      <div className="open-source__copy reveal reveal--one">
        <p className="section-kicker">Local-first by design.</p>
        <h2>Plain files, inspectable state, and no required control plane.</h2>
        <ul className="open-source__list">
          <li>Human-editable JSONL event ledger</li>
          <li>Derived Markdown state for restart and review</li>
          <li>Freshness checks against branch, commit, and files</li>
          <li>Adapters and prompt exports instead of transcript scraping</li>
        </ul>
      </div>

      <article className="repo-panel reveal reveal--two" aria-label="Repository structure">
        <div className="repo-panel__head">
          <p>repo / latchet</p>
          <a href="https://github.com/aviralgarg05/latchet" target="_blank" rel="noreferrer">
            open →
          </a>
        </div>

        <div className="repo-panel__tree">
          {repoTree.map((item) => (
            <div className="repo-panel__row" key={item}>
              <span className="repo-panel__bullet" />
              <code>{item}</code>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
