import { statePreview } from "../content";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__copy">
        <p className="eyebrow">Local-first task ledger</p>
        <h1>Same task state across every coding agent.</h1>
        <p className="hero__lede">
          Latchet stores decisions, failed attempts, environment quirks, and the next action in <code>.taskledger/</code> — so Codex, Claude Code, and Cursor resume from durable state, not chat residue.
        </p>
        <div className="hero__actions">
          <a className="button button--primary" href="https://github.com/aviralgarg05/latchet" target="_blank" rel="noreferrer">
            Get started
          </a>
          <a className="button button--secondary" href="#workflow">
            How it works
          </a>
        </div>
        <div className="install-block">
          <span className="install-block__label">Quickstart</span>
          <code>npm install && npm run build && node packages/cli/dist/index.js init</code>
        </div>
      </div>

      <aside className="preview-panel" aria-label="Task state preview">
        <div className="preview-panel__chrome">
          <div className="preview-panel__path">
            <span className="preview-panel__path-segment">.taskledger</span>
            <span className="preview-panel__path-segment">tasks</span>
            <span className="preview-panel__path-segment preview-panel__path-segment--active">tenant-auth</span>
          </div>
          <div className="preview-panel__tabs">
            <span className="preview-panel__tab preview-panel__tab--active">state.md</span>
            <span className="preview-panel__tab">events.jsonl</span>
            <span className="preview-panel__tab">state.json</span>
          </div>
        </div>
        <pre className="preview-panel__content">{statePreview}</pre>
        <div className="preview-panel__status">
          <span>branch main</span>
          <span>3 open failures blocked</span>
          <span>freshness: 2 checks</span>
        </div>
      </aside>
    </section>
  );
}