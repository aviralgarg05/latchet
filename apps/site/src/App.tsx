import { FeatureGrid } from "./components/FeatureGrid";
import { FooterCta } from "./components/FooterCta";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { OpenSourceSection } from "./components/OpenSourceSection";
import { StorySection } from "./components/StorySection";
import { ToolingSection } from "./components/ToolingSection";
import { WorkflowSection } from "./components/WorkflowSection";

function App() {
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