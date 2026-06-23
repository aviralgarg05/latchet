import { useState } from "react";
import { docsArticles } from "../content";

export function DocsSection() {
  const [activeArticleId, setActiveArticleId] = useState("quickstart");
  const activeArticle = docsArticles.find((a) => a.id === activeArticleId) || docsArticles[0];

  return (
    <section className="section docs reveal" id="docs">
      <div className="section-intro">
        <h2>Documentation</h2>
        <p>Clear, direct, and copy-pasteable instructions for setting up and running Latchet.</p>
      </div>

      <div className="docs-layout">
        <aside className="docs-sidebar" aria-label="Documentation sections">
          {docsArticles.map((article) => (
            <button
              key={article.id}
              className={`docs-sidebar-item ${article.id === activeArticleId ? "docs-sidebar-item--active" : ""}`}
              onClick={() => setActiveArticleId(article.id)}
            >
              {article.title}
            </button>
          ))}
        </aside>

        <article className="docs-content" aria-live="polite">
          <header className="docs-content-header">
            <h3 className="docs-article-title">{activeArticle.title}</h3>
            <p className="docs-article-subtitle">{activeArticle.subtitle}</p>
          </header>
          <div className="docs-article-body">
            {renderMarkdown(activeArticle.content)}
          </div>
        </article>
      </div>
    </section>
  );
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="docs-codeblock">
      <div className="docs-codeblock-header">
        <span className="docs-codeblock-lang">{lang || "shell"}</span>
        <button className="docs-codeblock-copy" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function renderMarkdown(text: string) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, index) => {
    if (part.startsWith("```")) {
      const match = part.match(/```([a-z-]*)\n([\s\S]*?)\n```/);
      const lang = match ? match[1] : "";
      const code = match ? match[2] : part.slice(3, -3);
      return <CodeBlock key={index} code={code} lang={lang} />;
    }
    
    const lines = part.split("\n");
    return lines.map((line, lineIndex) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("### ")) {
        return <h4 key={`${index}-${lineIndex}`} className="docs-h4">{trimmed.slice(4)}</h4>;
      }
      if (trimmed.startsWith("#### ")) {
        return <h5 key={`${index}-${lineIndex}`} className="docs-h5">{trimmed.slice(5)}</h5>;
      }
      if (trimmed.startsWith("- ")) {
        return (
          <ul key={`${index}-${lineIndex}`} className="docs-list">
            <li>{parseInlineFormatting(trimmed.slice(2))}</li>
          </ul>
        );
      }
      if (trimmed === "") {
        return <div key={`${index}-${lineIndex}`} className="docs-spacing" />;
      }
      return <p key={`${index}-${lineIndex}`} className="docs-p">{parseInlineFormatting(line)}</p>;
    });
  });
}

function parseInlineFormatting(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index} className="docs-inline-code">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
