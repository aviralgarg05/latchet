import { featureCards } from "../content";
import { ActionIcon, FailureIcon, FreshnessIcon, PortableIcon, QuirkIcon, TrailIcon } from "./Icons";

const icons = [TrailIcon, FailureIcon, QuirkIcon, ActionIcon, PortableIcon, FreshnessIcon];

export function FeatureGrid() {
  return (
    <section className="section feature-strip" id="features">
      <div className="section-heading reveal reveal--one">
        <p className="section-kicker">The parts that should survive context windows.</p>
        <h2>Not memory theater. Durable task primitives.</h2>
      </div>

      <div className="feature-strip__rail">
        {featureCards.map((feature, index) => {
          const Icon = icons[index];

          return (
            <article className={`feature-band reveal reveal--${(index % 3) + 1}`} key={feature.title}>
              <div className="feature-band__icon">
                <Icon width={24} height={24} />
              </div>
              <div className="feature-band__copy">
                <p>{feature.meta}</p>
                <h3>{feature.title}</h3>
                <span>{feature.description}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
