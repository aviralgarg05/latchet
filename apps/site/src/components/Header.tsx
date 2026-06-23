import { useState } from "react";
import { BrandMark } from "./BrandMark";

const nav = [
  { href: "#why", label: "Problem" },
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "Workflow" },
  { href: "#tooling", label: "CLI" },
  { href: "#docs", label: "Docs" }
];

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#top">
          <BrandMark />
          <span className="brand__wordmark">Latchet</span>
        </a>

        <nav className="site-nav" aria-label="Primary" style={mobileNavOpen ? { display: 'flex', flexDirection: 'column', position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-elevated)', padding: '24px', borderBottom: '1px solid var(--border)' } : undefined}>
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMobileNavOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <span className="site-header__meta">Aviral Garg</span>
          <button className="mobile-menu-toggle" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileNavOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 12h16M4 6h16M4 18h16" />
              )}
            </svg>
          </button>
          <a className="button button--primary button--sm" href="https://github.com/aviralgarg05/latchet" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}