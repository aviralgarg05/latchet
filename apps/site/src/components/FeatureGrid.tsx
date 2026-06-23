import { featureCards } from "../content";
import { TrailIcon, FailureIcon, QuirkIcon, ActionIcon, PortableIcon, FreshnessIcon } from "./Icons";

const iconMap: Record<string, { component: any, colorClass: string }> = {
  "Decision trail": { component: TrailIcon, colorClass: "accent" },
  "Failed-attempt memory": { component: FailureIcon, colorClass: "amber" },
  "Env quirks": { component: QuirkIcon, colorClass: "blue" },
  "Next action": { component: ActionIcon, colorClass: "accent" },
  "Portable handoffs": { component: PortableIcon, colorClass: "accent" },
  "Freshness checks": { component: FreshnessIcon, colorClass: "amber" }
};

export function FeatureGrid() {
  return (
    <section className="section features reveal" id="features">
      <div className="section-intro">
        <h2>What survives context windows.</h2>
        <p>Six primitives. Append-only ledger. Derived state for resume.</p>
      </div>

      <div className="feature-grid">
        {featureCards.map((feature) => {
          const Icon = iconMap[feature.title]?.component || TrailIcon;
          const colorClass = iconMap[feature.title]?.colorClass || "accent";
          
          return (
            <div className="feature-card" key={feature.title}>
              <div className={`feature-card__icon feature-card__icon--${colorClass}`}>
                <Icon width={20} height={20} />
              </div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__desc">{feature.description}</p>
              <span className="feature-card__meta">{feature.meta}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}