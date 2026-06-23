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

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

function App() {
  const [route, setRoute] = useState(window.location.hash || "#/");
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

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

  // Track cursor position for the spotlight mask & custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Custom pointer trail ring interpolation loop
  useEffect(() => {
    let animationFrameId: number;
    const updateTrail = () => {
      setTrailPos((prev) => {
        const dx = cursorPos.x - prev.x;
        const dy = cursorPos.y - prev.y;
        return {
          x: prev.x + dx * 0.12,
          y: prev.y + dy * 0.12
        };
      });
      animationFrameId = requestAnimationFrame(updateTrail);
    };
    updateTrail();
    return () => cancelAnimationFrame(animationFrameId);
  }, [cursorPos]);

  // Track hover status over clickable components
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], .install-block, .preview-panel__tab, .event-card")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener("mouseover", handleMouseOver);
    return () => window.removeEventListener("mouseover", handleMouseOver);
  }, []);

  // Scroll tracking to trigger CSS orb parallax
  useEffect(() => {
    const handleScroll = () => {
      document.documentElement.style.setProperty("--scroll-y", `${window.scrollY}px`);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Run once initially
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Generate background/foreground floating dust particles
  useEffect(() => {
    const generated = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1.2,
      delay: Math.random() * 6,
      duration: Math.random() * 12 + 10
    }));
    setParticles(generated);
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
      {/* Custom Pointer nodes */}
      <div 
        className={`custom-cursor-dot ${isHovering ? "custom-cursor-dot--hover" : ""}`}
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
      />
      <div 
        className={`custom-cursor-ring ${isHovering ? "custom-cursor-ring--hover" : ""}`}
        style={{ left: `${trailPos.x}px`, top: `${trailPos.y}px` }}
      />

      {/* Floating particles container */}
      <div className="particles-container">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`
            }}
          />
        ))}
      </div>

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