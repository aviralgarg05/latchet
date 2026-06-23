import { useState } from "react";
import { statePreview, eventsPreview, jsonPreview, heroEvents } from "../content";

export function Hero() {
  const [activeTab, setActiveTab] = useState("state.md");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm install && npm run build && node packages/cli/dist/index.js init");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <section className="hero reveal" id="top">
      <div className="hero__copy">
        <p className="eyebrow">Local-first task ledger</p>
        <h1>
          Same task state across <span className="accent-word">every</span> coding agent.
        </h1>
        <p className="hero__lede">
          Latchet stores decisions, failed attempts, environment quirks, and the next action in <code>.taskledger/</code> — so Codex, Claude Code, and Cursor resume from durable state, not chat residue.
        </p>
        
        <div className="event-cards">
          {heroEvents.slice(0, 3).map((event) => (
            <div className={`event-card event-card--${event.accent}`} key={event.id}>
              <span className="event-card__label">{event.label}</span>
              <div>
                <h3 className="event-card__title">{event.title}</h3>
                <p className="event-card__summary">{event.summary}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="hero__actions">
          <a className="button button--primary" href="https://github.com/aviralgarg05/latchet" target="_blank" rel="noreferrer">
            Get started
          </a>
          <a className="button button--secondary" href="#workflow">
            How it works
          </a>
        </div>
        <div className="install-block" onClick={handleCopy} style={{ cursor: 'pointer' }} title="Click to copy command">
          <div className="install-block__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="install-block__label" style={{ margin: 0 }}>Quickstart</span>
            <span className="install-block__copy-text" style={{ fontSize: '0.7rem', color: copied ? 'var(--accent)' : 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {copied ? "Copied!" : "Click to copy"}
            </span>
          </div>
          <code>npm install && npm run build && node packages/cli/dist/index.js init</code>
        </div>
      </div>

      <aside className="preview-panel" aria-label="Task state preview">
        <div className="preview-panel__chrome">
          <div className="preview-panel__dots">
            <div className="preview-panel__dot" style={{ background: 'var(--red)' }}></div>
            <div className="preview-panel__dot" style={{ background: 'var(--amber)' }}></div>
            <div className="preview-panel__dot" style={{ background: 'var(--accent)' }}></div>
          </div>
          <div className="preview-panel__path">
            <span className="preview-panel__path-segment">.taskledger</span>
            <span className="preview-panel__path-segment">tasks</span>
            <span className="preview-panel__path-segment preview-panel__path-segment--active">tenant-auth</span>
          </div>
        </div>

        <div className="preview-panel__tab-bar">
          {["state.md", "events.jsonl", "state.json"].map(tab => (
            <button 
              key={tab}
              className={`preview-panel__tab ${activeTab === tab ? "preview-panel__tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <pre className="preview-panel__content">
          {activeTab === "state.md" && statePreview}
          {activeTab === "events.jsonl" && eventsPreview}
          {activeTab === "state.json" && jsonPreview}
        </pre>
        <div className="preview-panel__status">
          <span className="status-ok">● branch main</span>
          <span className="preview-warn">1 open failure blocked</span>
          <span>freshness: 2 checks</span>
        </div>
      </aside>
    </section>
  );
}