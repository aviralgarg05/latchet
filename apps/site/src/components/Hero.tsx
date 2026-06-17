import { useState } from "react";
import { heroEvents } from "../content";
import { ActionIcon, ArrowUpRightIcon, FailureIcon, FreshnessIcon, OrbitIcon, QuirkIcon, TrailIcon } from "./Icons";

const eventIcons = {
  decision: TrailIcon,
  failure: FailureIcon,
  quirk: QuirkIcon,
  action: ActionIcon
} as const;

export function Hero() {
  const [activeId, setActiveId] = useState(heroEvents[0].id);
  const activeEvent = heroEvents.find((event) => event.id === activeId) ?? heroEvents[0];
  const ActiveIcon = eventIcons[activeEvent.id as keyof typeof eventIcons];

  return (
    <section className="hero section section--top" id="top">
      <div className="hero__copy reveal reveal--one">
        <h1>
          Stop every model from
          <br />
          relearning the same mess.
        </h1>
        <p className="hero__lede">
          Latchet keeps decisions, failed attempts, environment quirks, and the next action in one local ledger so each coding agent starts from real task state instead of chat residue.
        </p>
        <div className="hero__actions">
          <a className="button button--primary" href="#workflow">
            See the workflow
            <ArrowUpRightIcon width={16} height={16} />
          </a>
          <a className="button button--ghost" href="https://github.com/aviralgarg05/latchet" target="_blank" rel="noreferrer">
            View on GitHub
          </a>
        </div>

        <div className="hero__terminal">
          <span className="hero__prompt">$ latchet init</span>
          <span className="hero__caption">
            Create a durable source of truth in <code>.taskledger/</code>.
          </span>
        </div>
      </div>

      <div className="ledger-stage reveal reveal--two" aria-label="Interactive Latchet ledger preview">
        <div className="ledger-stage__halo" />

        <div className="ledger-stage__events">
          {heroEvents.map((event) => {
            const Icon = eventIcons[event.id as keyof typeof eventIcons];
            const isActive = event.id === activeEvent.id;

            return (
              <button
                type="button"
                className={`event-chip event-chip--${event.accent}${isActive ? " is-active" : ""}`}
                key={event.id}
                onMouseEnter={() => setActiveId(event.id)}
                onFocus={() => setActiveId(event.id)}
                onClick={() => setActiveId(event.id)}
              >
                <Icon width={18} height={18} />
                <span>{event.label}</span>
              </button>
            );
          })}
        </div>

        <div className="ledger-shell">
          <div className="ledger-shell__bar">
            <span />
            <span />
            <span />
            <p>task / org-rbac / active state</p>
          </div>

          <div className="ledger-shell__body">
            <div className="ledger-shell__orbit">
              <div className="orbit-node orbit-node--one">
                <TrailIcon width={18} height={18} />
              </div>
              <div className="orbit-node orbit-node--two">
                <FailureIcon width={18} height={18} />
              </div>
              <div className="orbit-node orbit-node--three">
                <QuirkIcon width={18} height={18} />
              </div>
              <div className={`orbit-core orbit-core--${activeEvent.accent}`}>
                <ActiveIcon width={26} height={26} />
              </div>
            </div>

            <article className={`ledger-focus ledger-focus--${activeEvent.accent}`}>
              <div className="ledger-focus__topline">
                <span>{activeEvent.label}</span>
                <span>{activeEvent.detail}</span>
              </div>
              <h3>{activeEvent.title}</h3>
              <p>{activeEvent.summary}</p>
              <code>{activeEvent.command}</code>
            </article>

            <div className="ledger-rail">
              <div className="ledger-mini">
                <OrbitIcon width={18} height={18} />
                <div>
                  <strong>Task state</strong>
                  <p>append-only ledger, derived current-state view</p>
                </div>
              </div>
              <div className="ledger-mini">
                <FreshnessIcon width={18} height={18} />
                <div>
                  <strong>Freshness</strong>
                  <p>branch main · commit 89f2e77 · 2 warnings flagged</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
