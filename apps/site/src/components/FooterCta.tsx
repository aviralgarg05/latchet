import { BrandMark } from "./BrandMark";

export function FooterCta() {
  return (
    <footer className="site-footer reveal">
      <div className="site-footer__main">
        <div className="site-footer__brand">
          <BrandMark />
          <span>Latchet</span>
        </div>
        <p className="site-footer__tagline">
          Built by Aviral Garg. Structured task state for AI-assisted work.
        </p>
        <a className="button button--secondary button--sm" href="https://github.com/aviralgarg05/latchet" target="_blank" rel="noreferrer">
          View on GitHub
        </a>
      </div>
      <p className="site-footer__legal">Local-first · append-only · no cloud required</p>
    </footer>
  );
}