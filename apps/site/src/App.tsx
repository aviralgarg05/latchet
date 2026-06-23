import { useEffect } from "react";
import { FeatureGrid } from "./components/FeatureGrid";
import { FooterCta } from "./components/FooterCta";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { OpenSourceSection } from "./components/OpenSourceSection";
import { StorySection } from "./components/StorySection";
import { ToolingSection } from "./components/ToolingSection";
import { WorkflowSection } from "./components/WorkflowSection";

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Optional: stop observing once it's visible so it doesn't animate out
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
  }, []);

  return (
    <div className="page-shell">
      <Header />
      <main className="page">
        <Hero />
        <StorySection />
        <FeatureGrid />
        <WorkflowSection />
        <ToolingSection />
        <OpenSourceSection />
        <FooterCta />
      </main>
    </div>
  );
}

export default App;