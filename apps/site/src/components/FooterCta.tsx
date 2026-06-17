import { BrandMark } from "./BrandMark";

export function FooterCta() {
  return (
    <section className="section footer-cta">
      <div className="footer-cta__panel reveal reveal--one">
        <div className="footer-cta__brand">
          <BrandMark />
          <span>Latchet</span>
        </div>
        <div className="footer-cta__copy">
          <h2>Make the next session start where the last one ended.</h2>
          <p>Open source, local-first, and built for the parts of AI-assisted work that should not evaporate when you change tools.</p>
        </div>
        <div className="footer-cta__actions">
          <a className="button button--primary button--light" href="https://github.com/aviralgarg05/latchet" target="_blank" rel="noreferrer">
            Explore the repo
          </a>
          <a className="button button--ghost button--light" href="#tooling">
            Read the workflow
          </a>
        </div>
      </div>

      <footer className="site-footer">
        <p>Latchet</p>
        <p>Structured task state for AI-assisted work.</p>
      </footer>
    </section>
  );
}
