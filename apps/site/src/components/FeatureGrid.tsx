import { featureCards } from "../content";

export function FeatureGrid() {
  return (
    <section className="section features" id="features">
      <div className="section-intro">
        <h2>What survives context windows.</h2>
        <p>Six primitives. Append-only ledger. Derived state for resume.</p>
      </div>

      <dl className="spec-list">
        {featureCards.map((feature) => (
          <div className="spec-list__row" key={feature.title}>
            <dt>
              <span className="spec-list__title">{feature.title}</span>
              <span className="spec-list__meta">{feature.meta}</span>
            </dt>
            <dd>{feature.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}