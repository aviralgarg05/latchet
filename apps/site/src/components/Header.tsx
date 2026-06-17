import { BrandMark } from "./BrandMark";
import { ArrowUpRightIcon } from "./Icons";

export function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top">
        <BrandMark />
        <span className="brand__wordmark">Latchet</span>
      </a>

      <nav className="site-nav" aria-label="Primary">
        <a href="#why">Why</a>
        <a href="#features">Features</a>
        <a href="#workflow">Workflow</a>
        <a href="#tooling">CLI + MCP</a>
        <a href="#open-source">Open Source</a>
      </nav>

      <a className="button button--ghost button--compact" href="https://github.com/aviralgarg05/latchet" target="_blank" rel="noreferrer">
        GitHub
        <ArrowUpRightIcon width={14} height={14} />
      </a>
    </header>
  );
}
