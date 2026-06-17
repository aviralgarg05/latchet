import { repoTree } from "../content";

export function OpenSourceSection() {
  return (
    <section className="section open-source" id="open-source">
      <div className="open-source__copy reveal reveal--one">
        <p className="section-kicker">Local-first by design.</p>
        <h2>Plain files, inspectable state, and no required control plane.</h2>

        <div className="open-source__claims">
          <div>
            <strong>Human-editable JSONL ledger</strong>
            <p>Every durable fact stays readable, append-only, and manual-edit friendly.</p>
          </div>
          <div>
            <strong>Derived Markdown state</strong>
            <p>Resume from current state instead of trawling transcript junk or stale notes.</p>
          </div>
          <div>
            <strong>Freshness and provenance</strong>
            <p>Branch, commit, artifacts, and verification status stay attached to the task.</p>
          </div>
        </div>
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
