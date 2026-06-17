import { featureCards } from "../content";
import { ActionIcon, FailureIcon, FreshnessIcon, PortableIcon, QuirkIcon, TrailIcon } from "./Icons";

const icons = [TrailIcon, FailureIcon, QuirkIcon, ActionIcon, PortableIcon, FreshnessIcon];

export function FeatureGrid() {
  return (
    <section className="section" id="features">
      <div className="section-heading reveal reveal--one">
        <p className="section-kicker">Track the parts that actually survive context windows.</p>
        <h2>Structured task state for the moments transcripts fail you.</h2>
      </div>

      <div className="feature-grid">
        {featureCards.map((feature, index) => {
          const Icon = icons[index];
          return (
            <article className={`feature-card reveal reveal--${(index % 3) + 1}`} key={feature.title}>
              <div className="feature-card__icon">
                <Icon width={24} height={24} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
