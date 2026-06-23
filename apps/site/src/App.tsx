import { useEffect, useState } from "react";
import { FeatureGrid } from "./components/FeatureGrid";
import { FooterCta } from "./components/FooterCta";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { OpenSourceSection } from "./components/OpenSourceSection";
import { StorySection } from "./components/StorySection";
import { ToolingSection } from "./components/ToolingSection";
import { WorkflowSection } from "./components/WorkflowSection";
import { DocsSection } from "./components/DocsSection";

function App() {
  const [route, setRoute] = useState(window.location.hash || "#/");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#/";
      setRoute(hash);

      // Handle scrolling to anchor tags when going back to landing sections
      if (!hash.startsWith("#/docs")) {
        const id = hash.replace("#/", "");
        if (id) {
          const el = document.getElementById(id);
          if (el) {
            setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
          }
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        window.scrollTo({ top: 0 });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Run initial check

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Track cursor position for the spotlight mask
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Observe and trigger reveals on navigation changes
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [route]);

  const isDocs = route.startsWith("#/docs");

  return (
    <div className="page-shell">
      {/* Spotlight and Ambient animation overlays */}
      <div className="grid-bg" />
      <div className="glow-orb glow-orb--1" />
      <div className="glow-orb glow-orb--2" />

      <Header />
      
      {isDocs ? (
        <main className="page docs-page">
          <DocsSection />
        </main>
      ) : (
        <main className="page">
          <Hero />
          <StorySection />
          <FeatureGrid />
          <WorkflowSection />
          <ToolingSection />
          <OpenSourceSection />
          <FooterCta />
        </main>
      )}
    </div>
  );
}

export default App;