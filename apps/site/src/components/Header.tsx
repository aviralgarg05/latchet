import { BrandMark } from "./BrandMark";

const nav = [
  { href: "#why", label: "Problem" },
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "Workflow" },
  { href: "#tooling", label: "CLI" }
];

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#top">
          <BrandMark />
          <span className="brand__wordmark">Latchet</span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <span className="site-header__meta">Aviral Garg</span>
          <a className="button button--primary button--sm" href="https://github.com/aviralgarg05/latchet" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}