import { BrandMark } from "./BrandMark";

export function FooterCta() {
  return (
    <footer className="site-footer reveal">
      <div className="site-footer__container">
        <div className="site-footer__brand-col">
          <div className="site-footer__brand">
            <BrandMark />
            <span className="site-footer__brand-name">Latchet</span>
          </div>
          <p className="site-footer__tagline">
            Durable, structured task state for AI-assisted workflows. Local-first, append-only, zero-cloud dependency.
          </p>
        </div>

        <div className="site-footer__links-col">
          <h4 className="site-footer__section-title">Resources</h4>
          <ul className="site-footer__links">
            <li><a href="#docs">Documentation</a></li>
            <li><a href="https://github.com/aviralgarg05/latchet" target="_blank" rel="noreferrer">GitHub Repository</a></li>
            <li><a href="https://github.com/aviralgarg05/latchet/issues" target="_blank" rel="noreferrer">Issue Tracker</a></li>
          </ul>
        </div>

        <div className="site-footer__links-col">
          <h4 className="site-footer__section-title">Ledger Spec</h4>
          <ul className="site-footer__links">
            <li><a href="#features">Active Decisions</a></li>
            <li><a href="#features">Recent Failures</a></li>
            <li><a href="#features">Environment Quirks</a></li>
            <li><a href="#features">Next Actions</a></li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p className="site-footer__credit">
          Crafted by <strong>Aviral Garg</strong>. Licensed under MIT.
        </p>
        <p className="site-footer__legal">
          100% Local · No Cookies · No Trackers
        </p>
      </div>
    </footer>
  );
}